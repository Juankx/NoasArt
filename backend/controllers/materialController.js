const Material = require('../models/Material');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Obtener todos los materiales
// @route   GET /api/materials
// @access  Public
const getMaterials = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, activo } = req.query;
  
  // Construir filtros
  const filter = {};
  if (search) {
    filter.nombre = { $regex: search, $options: 'i' };
  }
  if (activo !== undefined) {
    filter.activo = activo === 'true';
  }

  // Calcular paginación
  const skip = (page - 1) * limit;
  
  const materials = await Material.find(filter)
    .sort({ nombre: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Material.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: materials.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    data: materials
  });
});

// @desc    Obtener material por ID
// @route   GET /api/materials/:id
// @access  Public
const getMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);
  
  if (!material) {
    return res.status(404).json({
      success: false,
      error: 'Material no encontrado'
    });
  }

  res.status(200).json({
    success: true,
    data: material
  });
});

// @desc    Crear nuevo material
// @route   POST /api/materials
// @access  Public
const createMaterial = asyncHandler(async (req, res) => {
  const material = await Material.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Material creado exitosamente',
    data: material
  });
});

// @desc    Actualizar material
// @route   PUT /api/materials/:id
// @access  Public
const updateMaterial = asyncHandler(async (req, res) => {
  let material = await Material.findById(req.params.id);

  if (!material) {
    return res.status(404).json({
      success: false,
      error: 'Material no encontrado'
    });
  }

  material = await Material.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Material actualizado exitosamente',
    data: material
  });
});

// @desc    Eliminar material
// @route   DELETE /api/materials/:id
// @access  Public
const deleteMaterial = asyncHandler(async (req, res) => {
  const material = await Material.findById(req.params.id);

  if (!material) {
    return res.status(404).json({
      success: false,
      error: 'Material no encontrado'
    });
  }

  // Verificar si el material está siendo usado en cotizaciones
  // Aquí podrías agregar lógica para verificar dependencias

  await material.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Material eliminado exitosamente'
  });
});

// @desc    Obtener materiales activos
// @route   GET /api/materials/active
// @access  Public
const getActiveMaterials = asyncHandler(async (req, res) => {
  const materials = await Material.getActivos();

  res.status(200).json({
    success: true,
    count: materials.length,
    data: materials
  });
});

// @desc    Obtener estadísticas de materiales
// @route   GET /api/materials/stats
// @access  Public
const getMaterialStats = asyncHandler(async (req, res) => {
  const stats = await Material.aggregate([
    {
      $group: {
        _id: null,
        totalMateriales: { $sum: 1 },
        materialesActivos: {
          $sum: { $cond: ['$activo', 1, 0] }
        },
        materialesInactivos: {
          $sum: { $cond: ['$activo', 0, 1] }
        },
        precioPromedio: { $avg: '$precio' },
        precioMinimo: { $min: '$precio' },
        precioMaximo: { $max: '$precio' }
      }
    }
  ]);

  const materialesPorUnidad = await Material.aggregate([
    {
      $group: {
        _id: '$unidad',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      general: stats[0] || {
        totalMateriales: 0,
        materialesActivos: 0,
        materialesInactivos: 0,
        precioPromedio: 0,
        precioMinimo: 0,
        precioMaximo: 0
      },
      porUnidad: materialesPorUnidad
    }
  });
});

module.exports = {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getActiveMaterials,
  getMaterialStats
}; 