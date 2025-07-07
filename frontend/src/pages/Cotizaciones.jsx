import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLocation } from 'react-router-dom';
import { Plus, Trash2, Calculator, Save, Eye, Printer } from 'lucide-react';
import { cotizacionesService, materialesService, handleApiError } from '../services/api';
import PrintCotizacion from '../components/PrintCotizacion';

const schema = yup.object({
  cliente: yup.string().required('El nombre del cliente es requerido'),
  proyecto: yup.string().required('La descripción del proyecto es requerida'),
  manoObra: yup.number().min(0, 'La mano de obra no puede ser negativa').required('La mano de obra es requerida'),
  precioPorHora: yup.number().min(0, 'El precio por hora no puede ser negativo').required('El precio por hora es requerido'),
  pintura: yup.number().min(0, 'La pintura no puede ser negativa').required('La pintura es requerida'),
  precioPorMetro: yup.number().min(0, 'El precio por metro cuadrado no puede ser negativo').required('El precio por metro cuadrado es requerido'),
}).required();

const Cotizaciones = () => {
  const location = useLocation();
  const clientePredefinido = location.state?.clientePredefinido;
  
  const [materiales, setMateriales] = useState([]);
  const [cotizacionItems, setCotizacionItems] = useState([]);
  const [showResumen, setShowResumen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [cotizacionCreada, setCotizacionCreada] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cliente: clientePredefinido || '',
      proyecto: '',
      manoObra: 0,
      precioPorHora: 25,
      pintura: 0,
      precioPorMetro: 15,
    },
  });

  const manoObra = watch('manoObra') || 0;
  const precioPorHora = watch('precioPorHora') || 25;
  const pintura = watch('pintura') || 0;
  const precioPorMetro = watch('precioPorMetro') || 15;

  // Cargar materiales desde la API
  useEffect(() => {
    const cargarMateriales = async () => {
      try {
        const response = await materialesService.getAll();
        setMateriales(response.data || []);
      } catch (error) {
        console.error('Error al cargar materiales:', error);
        alert(handleApiError(error));
      }
    };
    
    cargarMateriales();
  }, []);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      materialId: '',
      cantidad: 1,
      precioUnitario: 0,
      precioPersonalizado: null,
    };
    setCotizacionItems([...cotizacionItems, newItem]);
  };

  const removeItem = (id) => {
    setCotizacionItems(cotizacionItems.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setCotizacionItems(cotizacionItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Si se selecciona un material, actualizar el precio unitario
        if (field === 'materialId') {
          const material = materiales.find(m => m._id === value);
          updatedItem.precioUnitario = material ? material.precio : 0;
          updatedItem.precioPersonalizado = null;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const updatePrecioPersonalizado = (id, precio) => {
    setCotizacionItems(cotizacionItems.map(item => {
      if (item.id === id) {
        return { ...item, precioPersonalizado: precio };
      }
      return item;
    }));
  };

  const calcularSubtotalMateriales = () => {
    return cotizacionItems.reduce((total, item) => {
      const precio = item.precioPersonalizado !== null ? item.precioPersonalizado : item.precioUnitario;
      return total + (precio * item.cantidad);
    }, 0);
  };

  const calcularTotal = () => {
    const subtotalMateriales = calcularSubtotalMateriales();
    const totalManoObra = manoObra * precioPorHora;
    const totalPintura = pintura * precioPorMetro;
    return subtotalMateriales + totalManoObra + totalPintura;
  };

  const onSubmit = async (data) => {
    if (cotizacionItems.length === 0) {
      alert('Debes agregar al menos un material a la cotización');
      return;
    }

    setIsLoading(true);
    try {
      // Preparar los items para la API
      const items = cotizacionItems.map(item => {
        const material = materiales.find(m => m._id === item.materialId);
        return {
          material: item.materialId,
          cantidad: item.cantidad,
          precioUnitario: item.precioPersonalizado !== null ? item.precioPersonalizado : item.precioUnitario,
          subtotal: (item.precioPersonalizado !== null ? item.precioPersonalizado : item.precioUnitario) * item.cantidad
        };
      });

      const cotizacion = {
        cliente: data.cliente,
        proyecto: data.proyecto,
        items: items,
        manoObra: {
          horas: manoObra,
          precioPorHora: precioPorHora,
          total: manoObra * precioPorHora
        },
        pintura: {
          metrosCuadrados: pintura,
          precioPorMetro: precioPorMetro,
          total: pintura * precioPorMetro
        },
        subtotalMateriales: calcularSubtotalMateriales(),
        total: calcularTotal(),
        estado: 'borrador',
        notas: ''
      };

      const response = await cotizacionesService.create(cotizacion);
      console.log('Cotización creada:', response.data);

      setCotizacionCreada(response.data);
      setShowPrintModal(true);
      
      reset();
      setCotizacionItems([]);
      setShowResumen(false);
    } catch (error) {
      console.error('Error al crear cotización:', error);
      alert(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crear Cotización</h1>
          <p className="text-gray-600">Genera cotizaciones detalladas para tus clientes</p>
        </div>
        <button
          onClick={() => setShowResumen(!showResumen)}
          className="btn-secondary flex items-center space-x-2"
        >
          <Eye className="w-4 h-4" />
          <span>{showResumen ? 'Ocultar' : 'Ver'} Resumen</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Cliente */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    {...register('cliente')}
                    className="input-field"
                    placeholder="Ej: Juan Pérez"
                  />
                  {errors.cliente && (
                    <p className="text-red-600 text-sm mt-1">{errors.cliente.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción del Proyecto
                  </label>
                  <input
                    type="text"
                    {...register('proyecto')}
                    className="input-field"
                    placeholder="Ej: Construcción de muro"
                  />
                  {errors.proyecto && (
                    <p className="text-red-600 text-sm mt-1">{errors.proyecto.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Horas de Mano de Obra
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    {...register('manoObra')}
                    className="input-field"
                    placeholder="0"
                  />
                  {errors.manoObra && (
                    <p className="text-red-600 text-sm mt-1">{errors.manoObra.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por Hora ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('precioPorHora')}
                    className="input-field"
                    placeholder="25.00"
                  />
                  {errors.precioPorHora && (
                    <p className="text-red-600 text-sm mt-1">{errors.precioPorHora.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Metros Cuadrados de Pintura
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('pintura')}
                    className="input-field"
                    placeholder="0"
                  />
                  {errors.pintura && (
                    <p className="text-red-600 text-sm mt-1">{errors.pintura.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio por m² ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('precioPorMetro')}
                    className="input-field"
                    placeholder="15.00"
                  />
                  {errors.precioPorMetro && (
                    <p className="text-red-600 text-sm mt-1">{errors.precioPorMetro.message}</p>
                  )}
                </div>
              </div>

              {/* Información de Servicios */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Resumen de Servicios</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Mano de obra:</span>
                    <span className="ml-2 font-medium">
                      {manoObra} horas × ${precioPorHora} = ${(manoObra * precioPorHora).toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Pintura:</span>
                    <span className="ml-2 font-medium">
                      {pintura} m² × ${precioPorMetro} = ${(pintura * precioPorMetro).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Materiales */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Materiales</h2>
              <button
                onClick={addItem}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Material</span>
              </button>
            </div>

            <div className="space-y-4">
              {cotizacionItems.map((item) => {
                const material = materiales.find(m => m._id === item.materialId);
                const precioActual = item.precioPersonalizado !== null ? item.precioPersonalizado : item.precioUnitario;
                const subtotal = precioActual * item.cantidad;

                return (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Material
                        </label>
                        <select
                          value={item.materialId}
                          onChange={(e) => updateItem(item.id, 'materialId', e.target.value)}
                          className="input-field"
                        >
                          <option value="">Seleccionar material</option>
                          {materiales.map((material) => (
                            <option key={material._id} value={material._id}>
                              {material.nombre} - ${material.precio}/{material.unidad}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cantidad
                        </label>
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.cantidad}
                          onChange={(e) => updateItem(item.id, 'cantidad', parseFloat(e.target.value) || 0)}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Precio Unitario
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={precioActual}
                          onChange={(e) => updatePrecioPersonalizado(item.id, parseFloat(e.target.value) || 0)}
                          className="input-field"
                          placeholder={item.precioUnitario}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subtotal
                        </label>
                        <div className="text-lg font-semibold text-gray-900">
                          ${subtotal.toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="btn-danger w-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {cotizacionItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay materiales agregados. Haz clic en "Agregar Material" para comenzar.
                </div>
              )}
            </div>
          </div>

          {/* Botón de Guardar */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading || cotizacionItems.length === 0}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Guardando...' : 'Guardar Cotización'}</span>
            </button>
          </div>
        </div>

        {/* Resumen */}
        {showResumen && (
          <div className="card h-fit">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Cotización</h2>
            
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Materiales</h3>
                {cotizacionItems.map((item) => {
                  const material = materiales.find(m => m._id === item.materialId);
                  const precio = item.precioPersonalizado !== null ? item.precioPersonalizado : item.precioUnitario;
                  const subtotal = precio * item.cantidad;
                  
                  return material ? (
                    <div key={item.id} className="flex justify-between text-sm mb-1">
                      <span>{material.nombre} ({item.cantidad} {material.unidad})</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                  ) : null;
                })}
                <div className="flex justify-between font-medium mt-2">
                  <span>Subtotal Materiales:</span>
                  <span>${calcularSubtotalMateriales().toFixed(2)}</span>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-medium text-gray-900 mb-2">Servicios</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mano de obra ({manoObra} horas × ${precioPorHora}/hora)</span>
                  <span>${(manoObra * precioPorHora).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Pintura ({pintura} m² × ${precioPorMetro}/m²)</span>
                  <span>${(pintura * precioPorMetro).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-lg font-bold text-gray-900">
                <div className="flex justify-between">
                  <span>TOTAL:</span>
                  <span>${calcularTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Impresión */}
      {showPrintModal && cotizacionCreada && (
        <PrintCotizacion
          cotizacion={cotizacionCreada}
          onClose={() => {
            setShowPrintModal(false);
            setCotizacionCreada(null);
          }}
        />
      )}
    </div>
  );
};

export default Cotizaciones; 