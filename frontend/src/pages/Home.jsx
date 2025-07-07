import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calculator, History, TrendingUp } from 'lucide-react';
import { dashboardService, handleApiError } from '../services/api';

const Home = () => {
  const [stats, setStats] = useState([
    { label: 'Materiales Registrados', value: '0', icon: Package, color: 'bg-blue-500' },
    { label: 'Cotizaciones Creadas', value: '0', icon: Calculator, color: 'bg-green-500' },
    { label: 'Total Facturado', value: '$0', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Clientes Atendidos', value: '0', icon: History, color: 'bg-orange-500' },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Obtener estadísticas
        const statsResponse = await dashboardService.getStats();
        const dashboardStats = statsResponse.data;
        
        // Obtener actividad reciente
        const activityResponse = await dashboardService.getRecentActivity();
        const activity = activityResponse.data || [];

        // Actualizar estadísticas
        const newStats = [
          { 
            label: 'Materiales Registrados', 
            value: dashboardStats.materiales?.totalMateriales?.toString() || '0', 
            icon: Package, 
            color: 'bg-blue-500' 
          },
          { 
            label: 'Cotizaciones Creadas', 
            value: dashboardStats.cotizaciones?.totalCotizaciones?.toString() || '0', 
            icon: Calculator, 
            color: 'bg-green-500' 
          },
          { 
            label: 'Total Facturado', 
            value: new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN'
            }).format(dashboardStats.cotizaciones?.totalFacturado || 0), 
            icon: TrendingUp, 
            color: 'bg-purple-500' 
          },
          { 
            label: 'Clientes Atendidos', 
            value: dashboardStats.topClientes?.length?.toString() || '0', 
            icon: History, 
            color: 'bg-orange-500' 
          },
        ];

        setStats(newStats);
        setRecentActivity(activity);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        alert(handleApiError(error));
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Función para formatear fechas relativas
  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInSeconds = Math.floor((now - activityDate) / 1000);

    if (diffInSeconds < 60) {
      return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
    }
  };

  const quickActions = [
    {
      title: 'Gestionar Materiales',
      description: 'Agregar, editar o eliminar materiales del catálogo',
      icon: Package,
      path: '/materiales',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Crear Cotización',
      description: 'Generar una nueva cotización para un cliente',
      icon: Calculator,
      path: '/cotizaciones',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Ver Historial',
      description: 'Consultar cotizaciones anteriores',
      icon: History,
      path: '/historial',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sistema de Cotizaciones
        </h1>
        <p className="text-gray-600 text-lg">
          Gestiona materiales, crea cotizaciones y mantén un control total de tu negocio
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.path}
                className="card hover:shadow-lg transition-shadow duration-200 group"
              >
                <div className="flex items-center mb-4">
                  <div className={`${action.color} p-3 rounded-lg transition-colors duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                  {action.title}
                </h3>
                <p className="text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actividad Reciente</h2>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando actividad reciente...</p>
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-3">
            {recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{activity.descripcion}</p>
                  {activity.monto && (
                    <p className="text-sm text-gray-600">
                      {new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: 'MXN'
                      }).format(activity.monto)}
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {formatTimeAgo(activity.fecha)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No hay actividad reciente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 