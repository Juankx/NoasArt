import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { materialesService, handleApiError } from '../services/api';

const schema = yup.object({
  nombre: yup.string().required('El nombre es requerido'),
  unidad: yup.string().required('La unidad es requerida'),
  precio: yup.number().positive('El precio debe ser positivo').required('El precio es requerido'),
}).required();

const Materiales = () => {
  const [materiales, setMateriales] = useState([]);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      if (editingMaterial) {
        // Actualizar material existente
        const response = await materialesService.update(editingMaterial._id, data);
        setMateriales(materiales.map(material =>
          material._id === editingMaterial._id
            ? response.data
            : material
        ));
        setEditingMaterial(null);
        alert('Material actualizado exitosamente');
      } else {
        // Agregar nuevo material
        const response = await materialesService.create(data);
        setMateriales([...materiales, response.data]);
        alert('Material creado exitosamente');
      }
      reset();
    } catch (error) {
      console.error('Error al guardar material:', error);
      alert(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    reset({
      nombre: material.nombre,
      unidad: material.unidad,
      precio: material.precio,
      descripcion: material.descripcion || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este material?')) {
      try {
        await materialesService.delete(id);
        setMateriales(materiales.filter(material => material._id !== id));
        alert('Material eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar material:', error);
        alert(handleApiError(error));
      }
    }
  };

  const handleCancel = () => {
    setEditingMaterial(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Materiales</h1>
          <p className="text-gray-600">Administra el catálogo de materiales disponibles</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {editingMaterial ? 'Editar Material' : 'Agregar Nuevo Material'}
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Material
              </label>
              <input
                type="text"
                {...register('nombre')}
                className="input-field"
                placeholder="Ej: Cemento Portland"
              />
              {errors.nombre && (
                <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Unidad de Medida
              </label>
              <select {...register('unidad')} className="input-field">
                <option value="">Seleccionar unidad</option>
                <option value="kg">Kilogramos (kg)</option>
                <option value="m³">Metros cúbicos (m³)</option>
                <option value="m">Metros (m)</option>
                <option value="unidad">Unidad</option>
                <option value="l">Litros (l)</option>
                <option value="m²">Metros cuadrados (m²)</option>
              </select>
              {errors.unidad && (
                <p className="text-red-600 text-sm mt-1">{errors.unidad.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio por Unidad
              </label>
              <input
                type="number"
                step="0.01"
                {...register('precio')}
                className="input-field"
                placeholder="0.00"
              />
              {errors.precio && (
                <p className="text-red-600 text-sm mt-1">{errors.precio.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{editingMaterial ? 'Actualizar' : 'Agregar'} Material</span>
            </button>
            
            {editingMaterial && (
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla de Materiales */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Materiales Registrados</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {materiales.map((material) => (
                <tr key={material._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Package className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">
                        {material.nombre}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.unidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${material.precio.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(material._id)}
                        className="text-red-600 hover:text-red-900"
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

        {materiales.length === 0 && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay materiales registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materiales; 