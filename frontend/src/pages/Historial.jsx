import { useState, useEffect } from 'react';
import { Eye, Trash2, Calendar, User, DollarSign, FileText, Printer } from 'lucide-react';
import { cotizacionesService, handleApiError } from '../services/api';
import PrintCotizacion from '../components/PrintCotizacion';

const Historial = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    // Cargar cotizaciones desde la API
    const cargarCotizaciones = async () => {
      try {
        const response = await cotizacionesService.getAll();
        setCotizaciones(response.data || []);
      } catch (error) {
        console.error('Error al cargar cotizaciones:', error);
        alert(handleApiError(error));
      }
    };
    
    cargarCotizaciones();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cotización?')) {
      try {
        await cotizacionesService.delete(id);
        setCotizaciones(cotizaciones.filter(cot => cot._id !== id));
        alert('Cotización eliminada exitosamente');
      } catch (error) {
        console.error('Error al eliminar cotización:', error);
        alert(handleApiError(error));
      }
    }
  };

  const handleViewDetails = (cotizacion) => {
    setSelectedCotizacion(cotizacion);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Historial de Cotizaciones</h1>
        <p className="text-gray-600">Consulta todas las cotizaciones creadas</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-500 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cotizaciones</p>
              <p className="text-2xl font-bold text-gray-900">{cotizaciones.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Facturado</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(cotizaciones.reduce((sum, cot) => sum + cot.total, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-500 p-3 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clientes Únicos</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(cotizaciones.map(cot => cot.cliente)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-orange-500 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Este Mes</p>
              <p className="text-2xl font-bold text-gray-900">
                {cotizaciones.filter(cot => {
                  const cotDate = new Date(cot.createdAt);
                  const now = new Date();
                  return cotDate.getMonth() === now.getMonth() && 
                         cotDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Cotizaciones */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cotizaciones Recientes</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proyecto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cotizaciones.map((cotizacion) => (
                <tr key={cotizacion._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(cotizacion.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">
                        {cotizacion.cliente}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {cotizacion.proyecto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(cotizacion.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(cotizacion)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cotizacion._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {cotizaciones.length === 0 && (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay cotizaciones en el historial</p>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedCotizacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Detalles de Cotización #{selectedCotizacion.numero}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Información General */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Cliente</label>
                    <p className="text-sm text-gray-900">{selectedCotizacion.cliente}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha</label>
                    <p className="text-sm text-gray-900">{formatDate(selectedCotizacion.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedCotizacion.estado === 'aprobada' ? 'bg-green-100 text-green-800' :
                      selectedCotizacion.estado === 'enviada' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedCotizacion.estado?.charAt(0).toUpperCase() + selectedCotizacion.estado?.slice(1) || 'Borrador'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Número</label>
                    <p className="text-sm text-gray-900">{selectedCotizacion.numero}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Proyecto</label>
                    <p className="text-sm text-gray-900">{selectedCotizacion.proyecto}</p>
                  </div>
                </div>

                {/* Materiales */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Materiales</h3>
                  <div className="space-y-2">
                    {selectedCotizacion.items && selectedCotizacion.items.length > 0 ? (
                      selectedCotizacion.items.map((item, index) => {
                        // Los items de la API tienen una estructura diferente
                        const materialNombre = item.material?.nombre || `Material ${item.material}`;
                        const materialUnidad = item.material?.unidad || 'unidad';
                        const subtotal = item.subtotal || (item.precioUnitario * item.cantidad);
                        
                        return (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{materialNombre} ({item.cantidad} {materialUnidad})</span>
                            <span>{formatCurrency(subtotal)}</span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500">No hay materiales en esta cotización</p>
                    )}
                  </div>
                </div>

                {/* Servicios */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Servicios</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mano de obra ({selectedCotizacion.manoObra?.horas || 0} horas)</span>
                      <span>{formatCurrency(selectedCotizacion.manoObra?.total || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pintura ({selectedCotizacion.pintura?.metrosCuadrados || 0} m²)</span>
                      <span>{formatCurrency(selectedCotizacion.pintura?.total || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Notas */}
                {selectedCotizacion.notas && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Notas</h3>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                      {selectedCotizacion.notas}
                    </p>
                  </div>
                )}

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL</span>
                    <span>{formatCurrency(selectedCotizacion.total)}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setShowPrintModal(true);
                    }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Impresión */}
      {showPrintModal && selectedCotizacion && (
        <PrintCotizacion
          cotizacion={selectedCotizacion}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
};

export default Historial; 