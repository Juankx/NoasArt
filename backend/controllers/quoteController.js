const Cotizacion = require('../models/Cotizacion');
const Material = require('../models/Material');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Obtener todas las cotizaciones
// @route   GET /api/quotes
// @access  Public
const getQuotes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, estado, cliente, sort = '-createdAt' } = req.query;
  
  // Construir filtros
  const filter = {};
  if (search) {
    filter.$or = [
      { numero: { $regex: search, $options: 'i' } },
      { cliente: { $regex: search, $options: 'i' } },
      { proyecto: { $regex: search, $options: 'i' } }
    ];
  }
  if (estado) {
    filter.estado = estado;
  }
  if (cliente) {
    filter.cliente = { $regex: cliente, $options: 'i' };
  }

  // Calcular paginación
  const skip = (page - 1) * limit;
  
  const quotes = await Cotizacion.find(filter)
    .populate('items.material', 'nombre unidad precio')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Cotizacion.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: quotes.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    data: quotes
  });
});

// @desc    Obtener cotización por ID
// @route   GET /api/quotes/:id
// @access  Public
const getQuote = asyncHandler(async (req, res) => {
  const quote = await Cotizacion.findById(req.params.id)
    .populate('items.material', 'nombre unidad precio');

  if (!quote) {
    return res.status(404).json({
      success: false,
      error: 'Cotización no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    data: quote
  });
});

// @desc    Crear nueva cotización
// @route   POST /api/quotes
// @access  Public
const createQuote = asyncHandler(async (req, res) => {
  // Validar que los materiales existan
  if (req.body.items && req.body.items.length > 0) {
    for (const item of req.body.items) {
      const material = await Material.findById(item.material);
      if (!material) {
        return res.status(400).json({
          success: false,
          error: `Material con ID ${item.material} no encontrado`
        });
      }
      // Establecer precio unitario si no se proporciona
      if (!item.precioUnitario) {
        item.precioUnitario = material.precio;
      }
    }
  }

  const quote = await Cotizacion.create(req.body);

  // Poblar los datos del material para la respuesta
  await quote.populate('items.material', 'nombre unidad precio');

  res.status(201).json({
    success: true,
    message: 'Cotización creada exitosamente',
    data: quote
  });
});

// @desc    Actualizar cotización
// @route   PUT /api/quotes/:id
// @access  Public
const updateQuote = asyncHandler(async (req, res) => {
  let quote = await Cotizacion.findById(req.params.id);

  if (!quote) {
    return res.status(404).json({
      success: false,
      error: 'Cotización no encontrada'
    });
  }

  // Validar que los materiales existan si se están actualizando
  if (req.body.items && req.body.items.length > 0) {
    for (const item of req.body.items) {
      const material = await Material.findById(item.material);
      if (!material) {
        return res.status(400).json({
          success: false,
          error: `Material con ID ${item.material} no encontrado`
        });
      }
      // Establecer precio unitario si no se proporciona
      if (!item.precioUnitario) {
        item.precioUnitario = material.precio;
      }
    }
  }

  quote = await Cotizacion.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('items.material', 'nombre unidad precio');

  res.status(200).json({
    success: true,
    message: 'Cotización actualizada exitosamente',
    data: quote
  });
});

// @desc    Eliminar cotización
// @route   DELETE /api/quotes/:id
// @access  Public
const deleteQuote = asyncHandler(async (req, res) => {
  const quote = await Cotizacion.findById(req.params.id);

  if (!quote) {
    return res.status(404).json({
      success: false,
      error: 'Cotización no encontrada'
    });
  }

  await quote.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Cotización eliminada exitosamente'
  });
});

// @desc    Obtener estadísticas de cotizaciones
// @route   GET /api/quotes/stats
// @access  Public
const getQuoteStats = asyncHandler(async (req, res) => {
  const stats = await Cotizacion.getStats();

  res.status(200).json({
    success: true,
    data: stats
  });
});

// @desc    Cambiar estado de cotización
// @route   PATCH /api/quotes/:id/status
// @access  Public
const updateQuoteStatus = asyncHandler(async (req, res) => {
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({
      success: false,
      error: 'El estado es requerido'
    });
  }

  const quote = await Cotizacion.findByIdAndUpdate(
    req.params.id,
    { estado },
    { new: true, runValidators: true }
  ).populate('items.material', 'nombre unidad precio');

  if (!quote) {
    return res.status(404).json({
      success: false,
      error: 'Cotización no encontrada'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Estado de cotización actualizado exitosamente',
    data: quote
  });
});

// @desc    Obtener cotizaciones por cliente
// @route   GET /api/quotes/client/:cliente
// @access  Public
const getQuotesByClient = asyncHandler(async (req, res) => {
  const { cliente } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const quotes = await Cotizacion.find({
    cliente: { $regex: cliente, $options: 'i' }
  })
    .populate('items.material', 'nombre unidad precio')
    .sort('-createdAt')
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Cotizacion.countDocuments({
    cliente: { $regex: cliente, $options: 'i' }
  });

  res.status(200).json({
    success: true,
    count: quotes.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    data: quotes
  });
});

// @desc    Obtener cotizaciones recientes
// @route   GET /api/quotes/recent
// @access  Public
const getRecentQuotes = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;

  const quotes = await Cotizacion.find()
    .populate('items.material', 'nombre unidad precio')
    .sort('-createdAt')
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    count: quotes.length,
    data: quotes
  });
});

module.exports = {
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  getQuoteStats,
  updateQuoteStatus,
  getQuotesByClient,
  getRecentQuotes
}; 