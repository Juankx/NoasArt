const mongoose = require('mongoose');

// Schema para los ítems de materiales en la cotización
const itemMaterialSchema = new mongoose.Schema({
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material',
    required: [true, 'El material es requerido']
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es requerida'],
    min: [0.01, 'La cantidad debe ser mayor a 0']
  },
  precioUnitario: {
    type: Number,
    required: [true, 'El precio unitario es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  precioPersonalizado: {
    type: Number,
    min: [0, 'El precio personalizado no puede ser negativo']
  },
  subtotal: {
    type: Number,
    required: true
  }
}, { _id: true });

// Schema para la cotización
const cotizacionSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true
  },
  cliente: {
    type: String,
    required: [true, 'El nombre del cliente es requerido'],
    trim: true,
    maxlength: [100, 'El nombre del cliente no puede tener más de 100 caracteres']
  },
  proyecto: {
    type: String,
    required: [true, 'La descripción del proyecto es requerida'],
    trim: true,
    maxlength: [500, 'La descripción del proyecto no puede tener más de 500 caracteres']
  },
  items: [itemMaterialSchema],
  manoObra: {
    horas: {
      type: Number,
      default: 0,
      min: [0, 'Las horas de mano de obra no pueden ser negativas']
    },
    precioPorHora: {
      type: Number,
      default: 25,
      min: [0, 'El precio por hora no puede ser negativo']
    },
    total: {
      type: Number,
      default: 0
    }
  },
  pintura: {
    metrosCuadrados: {
      type: Number,
      default: 0,
      min: [0, 'Los metros cuadrados no pueden ser negativos']
    },
    precioPorMetro: {
      type: Number,
      default: 15,
      min: [0, 'El precio por metro cuadrado no puede ser negativo']
    },
    total: {
      type: Number,
      default: 0
    }
  },
  subtotalMateriales: {
    type: Number,
    required: true,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  estado: {
    type: String,
    enum: {
      values: ['borrador', 'enviada', 'aprobada', 'rechazada', 'cancelada'],
      message: 'Estado no válido'
    },
    default: 'borrador'
  },
  notas: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las notas no pueden tener más de 1000 caracteres']
  },
  fechaVencimiento: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar el rendimiento
cotizacionSchema.index({ numero: 1 });
cotizacionSchema.index({ cliente: 1 });
cotizacionSchema.index({ estado: 1 });
cotizacionSchema.index({ createdAt: -1 });

// Middleware pre-save para generar número de cotización
cotizacionSchema.pre('save', async function(next) {
  if (this.isNew && !this.numero) {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    
    // Contar cotizaciones del mes actual
    const inicioMes = new Date(año, fecha.getMonth(), 1);
    const finMes = new Date(año, fecha.getMonth() + 1, 0);
    
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: inicioMes, $lte: finMes }
    });
    
    this.numero = `COT-${año}${mes}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// Middleware pre-save para calcular totales
cotizacionSchema.pre('save', function(next) {
  // Calcular subtotal de materiales
  this.subtotalMateriales = this.items.reduce((total, item) => {
    const precio = item.precioPersonalizado !== null ? item.precioPersonalizado : item.precioUnitario;
    return total + (precio * item.cantidad);
  }, 0);

  // Calcular total de mano de obra
  this.manoObra.total = this.manoObra.horas * this.manoObra.precioPorHora;

  // Calcular total de pintura
  this.pintura.total = this.pintura.metrosCuadrados * this.pintura.precioPorMetro;

  // Calcular total general
  this.total = this.subtotalMateriales + this.manoObra.total + this.pintura.total;

  next();
});

// Método para formatear el total
cotizacionSchema.methods.formatearTotal = function() {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(this.total);
};

// Método estático para obtener estadísticas
cotizacionSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalCotizaciones: { $sum: 1 },
        totalFacturado: { $sum: '$total' },
        promedioCotizacion: { $avg: '$total' }
      }
    }
  ]);

  const cotizacionesPorEstado = await this.aggregate([
    {
      $group: {
        _id: '$estado',
        count: { $sum: 1 }
      }
    }
  ]);

  const cotizacionesPorMes = await this.aggregate([
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
    { $sort: { '_id.año': -1, '_id.mes': -1 } },
    { $limit: 12 }
  ]);

  return {
    general: stats[0] || { totalCotizaciones: 0, totalFacturado: 0, promedioCotizacion: 0 },
    porEstado: cotizacionesPorEstado,
    porMes: cotizacionesPorMes
  };
};

module.exports = mongoose.model('Cotizacion', cotizacionSchema); 