import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FileText, Plus, Eye, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { cotizacionesService, handleApiError } from '../services/api';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Cargar datos de clientes desde las cotizaciones
  useEffect(() => {
    const cargarClientes = async () => {
      try {
        setIsLoading(true);
        const response = await cotizacionesService.getAll();
        const cotizaciones = response.data || [];
        
        // Agrupar cotizaciones por cliente
        const clientesMap = new Map();
        
        cotizaciones.forEach(cotizacion => {
          const cliente = cotizacion.cliente;
          
          if (!clientesMap.has(cliente)) {
            clientesMap.set(cliente, {
              nombre: cliente,
              cotizaciones: [],
              totalFacturado: 0,
              cotizacionesCount: 0,
              ultimaCotizacion: null,
              primeraCotizacion: null
            });
          }
          
          const clienteData = clientesMap.get(cliente);
          clienteData.cotizaciones.push(cotizacion);
          clienteData.totalFacturado += cotizacion.total;
          clienteData.cotizacionesCount += 1;
          
          const fecha = new Date(cotizacion.createdAt);
          if (!clienteData.ultimaCotizacion || fecha > new Date(clienteData.ultimaCotizacion.createdAt)) {
            clienteData.ultimaCotizacion = cotizacion;
          }
          if (!clienteData.primeraCotizacion || fecha < new Date(clienteData.primeraCotizacion.createdAt)) {
            clienteData.primeraCotizacion = cotizacion;
          }
        });
        
        // Convertir a array y ordenar por total facturado
        const clientesArray = Array.from(clientesMap.values())
          .sort((a, b) => b.totalFacturado - a.totalFacturado);
        
        setClientes(clientesArray);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
        alert(handleApiError(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    cargarClientes();
  }, []);

  const handleViewDetails = (cliente) => {
    setSelectedCliente(cliente);
    setShowModal(true);
  };

  const handleCreateQuote = (cliente) => {
    // Navegar a la página de cotizaciones con el cliente pre-llenado
    navigate('/cotizaciones', { 
      state: { 
        clientePredefinido: cliente.nombre 
      } 
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'aprobada':
        return 'bg-green-100 text-green-800';
      case 'enviada':
        return 'bg-yellow-100 text-yellow-800';
      case 'borrador':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p className="text-gray-600">Administra tus clientes y sus cotizaciones</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clientes.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cotizaciones</p>
              <p className="text-2xl font-bold text-gray-900">
                {clientes.reduce((sum, cliente) => sum + cliente.cotizacionesCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Facturado</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(clientes.reduce((sum, cliente) => sum + cliente.totalFacturado, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-orange-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Promedio por Cliente</p>
              <p className="text-2xl font-bold text-gray-900">
                {clientes.length > 0 
                  ? formatCurrency(clientes.reduce((sum, cliente) => sum + cliente.totalFacturado, 0) / clientes.length)
                  : '$0.00'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Clientes Registrados</h2>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando clientes...</p>
          </div>
        ) : clientes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cotizaciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Facturado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Cotización
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cliente, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {cliente.nombre}
                          </div>
                          <div className="text-sm text-gray-500">
                            Cliente desde {formatDate(cliente.primeraCotizacion?.createdAt)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.cotizacionesCount} cotizaciones
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(cliente.totalFacturado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.ultimaCotizacion 
                        ? formatDate(cliente.ultimaCotizacion.createdAt)
                        : 'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(cliente)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleCreateQuote(cliente)}
                          className="text-green-600 hover:text-green-900"
                          title="Nueva cotización"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay clientes registrados</p>
            <p className="text-sm text-gray-400 mt-1">
              Los clientes aparecerán automáticamente cuando crees cotizaciones
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalles del Cliente */}
      {showModal && selectedCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Detalles del Cliente: {selectedCliente.nombre}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Información General */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="card">
                    <h3 className="font-medium text-gray-900 mb-2">Resumen</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Cotizaciones:</span>
                        <span className="font-medium">{selectedCliente.cotizacionesCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Facturado:</span>
                        <span className="font-medium">{formatCurrency(selectedCliente.totalFacturado)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Promedio por Cotización:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedCliente.totalFacturado / selectedCliente.cotizacionesCount)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="font-medium text-gray-900 mb-2">Primera Cotización</h3>
                    <div className="text-sm">
                      <p className="text-gray-600">
                        {selectedCliente.primeraCotizacion 
                          ? formatDate(selectedCliente.primeraCotizacion.createdAt)
                          : 'N/A'
                        }
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCliente.primeraCotizacion?.proyecto || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="card">
                    <h3 className="font-medium text-gray-900 mb-2">Última Cotización</h3>
                    <div className="text-sm">
                      <p className="text-gray-600">
                        {selectedCliente.ultimaCotizacion 
                          ? formatDate(selectedCliente.ultimaCotizacion.createdAt)
                          : 'N/A'
                        }
                      </p>
                      <p className="text-gray-900 font-medium mt-1">
                        {selectedCliente.ultimaCotizacion?.proyecto || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Historial de Cotizaciones */}
                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Historial de Cotizaciones</h3>
                    <button
                      onClick={() => handleCreateQuote(selectedCliente)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nueva Cotización</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {selectedCliente.cotizaciones
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((cotizacion, index) => (
                        <div key={cotizacion._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm font-medium text-gray-900">
                                {cotizacion.numero}
                              </span>
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cotizacion.estado)}`}>
                                {cotizacion.estado?.charAt(0).toUpperCase() + cotizacion.estado?.slice(1) || 'Borrador'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{cotizacion.proyecto}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(cotizacion.createdAt)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(cotizacion.total)}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes; 