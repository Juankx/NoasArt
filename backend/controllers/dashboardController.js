const Cotizacion = require('../models/Cotizacion');
const Material = require('../models/Material');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Obtener estadísticas del dashboard
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = asyncHandler(async (req, res) => {
  // Estadísticas de cotizaciones
  const cotizacionesStats = await Cotizacion.aggregate([
    {
      $group: {
        _id: null,
        totalCotizaciones: { $sum: 1 },
        totalFacturado: { $sum: '$total' },
        promedioCotizacion: { $avg: '$total' },
        cotizacionesEsteMes: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $gte: ['$createdAt', new Date(new Date().getFullYear(), new Date().getMonth(), 1)] },
                  { $lte: ['$createdAt', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  // Estadísticas de materiales
  const materialesStats = await Material.aggregate([
    {
      $group: {
        _id: null,
        totalMateriales: { $sum: 1 },
        materialesActivos: { $sum: { $cond: ['$activo', 1, 0] } },
        precioPromedio: { $avg: '$precio' }
      }
    }
  ]);

  // Cotizaciones por estado
  const cotizacionesPorEstado = await Cotizacion.aggregate([
    {
      $group: {
        _id: '$estado',
        count: { $sum: 1 },
        total: { $sum: '$total' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Top 5 clientes
  const topClientes = await Cotizacion.aggregate([
    {
      $group: {
        _id: '$cliente',
        cotizaciones: { $sum: 1 },
        totalFacturado: { $sum: '$total' }
      }
    },
    { $sort: { totalFacturado: -1 } },
    { $limit: 5 }
  ]);

  // Cotizaciones por mes (últimos 6 meses)
  const cotizacionesPorMes = await Cotizacion.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 5, 1)
        }
      }
    },
    {
      $group: {
        _id: {
          año: { $year: '$createdAt' },
          mes: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        total: { $sum: '$total' }
      }
    },
    { $sort: { '_id.año': 1, '_id.mes': 1 } }
  ]);

  // Materiales más utilizados
  const materialesMasUtilizados = await Cotizacion.aggregate([
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.material',
        vecesUtilizado: { $sum: 1 },
        cantidadTotal: { $sum: '$items.cantidad' }
      }
    },
    { $sort: { vecesUtilizado: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'materials',
        localField: '_id',
        foreignField: '_id',
        as: 'material'
      }
    },
    { $unwind: '$material' },
    {
      $project: {
        nombre: '$material.nombre',
        vecesUtilizado: 1,
        cantidadTotal: 1
      }
    }
  ]);

  const stats = {
    cotizaciones: cotizacionesStats[0] || {
      totalCotizaciones: 0,
      totalFacturado: 0,
      promedioCotizacion: 0,
      cotizacionesEsteMes: 0
    },
    materiales: materialesStats[0] || {
      totalMateriales: 0,
      materialesActivos: 0,
      precioPromedio: 0
    },
    porEstado: cotizacionesPorEstado,
    topClientes,
    porMes: cotizacionesPorMes,
    materialesMasUtilizados
  };

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Obtener actividad reciente
// @route   GET /api/dashboard/recent-activity
// @access  Public
const getRecentActivity = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  // Cotizaciones recientes
  const cotizacionesRecientes = await Cotizacion.find()
    .populate('items.material', 'nombre unidad')
    .sort('-createdAt')
    .limit(parseInt(limit))
    .select('numero cliente proyecto total estado createdAt');

  // Materiales recientemente agregados
  const materialesRecientes = await Material.find()
    .sort('-createdAt')
    .limit(5)
    .select('nombre precio unidad createdAt');

  // Actividad combinada
  const actividad = [
    ...cotizacionesRecientes.map(cot => ({
      tipo: 'cotizacion',
      accion: 'creada',
      descripcion: `Cotización ${cot.numero} creada para ${cot.cliente}`,
      monto: cot.total,
      fecha: cot.createdAt,
      datos: cot
    })),
    ...materialesRecientes.map(mat => ({
      tipo: 'material',
      accion: 'agregado',
      descripcion: `Material ${mat.nombre} agregado al catálogo`,
      monto: mat.precio,
      fecha: mat.createdAt,
      datos: mat
    }))
  ].sort((a, b) => b.fecha - a.fecha).slice(0, parseInt(limit));

  res.status(200).json({
    success: true,
    count: actividad.length,
    data: actividad
  });
});

// @desc    Obtener resumen rápido
// @route   GET /api/dashboard/summary
// @access  Public
const getDashboardSummary = asyncHandler(async (req, res) => {
  // Contadores rápidos
  const [
    totalCotizaciones,
    totalMateriales,
    cotizacionesEsteMes,
    totalFacturado
  ] = await Promise.all([
    Cotizacion.countDocuments(),
    Material.countDocuments({ activo: true }),
    Cotizacion.countDocuments({
      createdAt: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    }),
    Cotizacion.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ])
  ]);

  const summary = {
    totalCotizaciones,
    totalMateriales,
    cotizacionesEsteMes,
    totalFacturado: totalFacturado[0]?.total || 0
  };

  res.status(200).json({
    success: true,
    data: summary
  });
});

module.exports = {
  getDashboardStats,
  getRecentActivity,
  getDashboardSummary
}; 