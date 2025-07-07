const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del material es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  unidad: {
    type: String,
    required: [true, 'La unidad de medida es requerida'],
    enum: {
      values: ['kg', 'm³', 'm', 'unidad', 'l', 'm²'],
      message: 'Unidad de medida no válida'
    }
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar el rendimiento de las consultas
materialSchema.index({ nombre: 1 });
materialSchema.index({ activo: 1 });

// Método para formatear el precio
materialSchema.methods.formatearPrecio = function() {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(this.precio);
};

// Método estático para obtener materiales activos
materialSchema.statics.getActivos = function() {
  return this.find({ activo: true }).sort({ nombre: 1 });
};

module.exports = mongoose.model('Material', materialSchema); 