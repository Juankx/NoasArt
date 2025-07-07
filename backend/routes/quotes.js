const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  getQuoteStats,
  updateQuoteStatus,
  getQuotesByClient,
  getRecentQuotes
} = require('../controllers/quoteController');
const validate = require('../middleware/validate');

const router = express.Router();

// Validaciones
const itemValidation = [
  body('items.*.material')
    .isMongoId()
    .withMessage('ID de material inválido'),
  body('items.*.cantidad')
    .isFloat({ min: 0.01 })
    .withMessage('La cantidad debe ser mayor a 0'),
  body('items.*.precioUnitario')
    .isFloat({ min: 0 })
    .withMessage('El precio unitario debe ser un número positivo'),
  body('items.*.precioPersonalizado')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio personalizado debe ser un número positivo')
];

const quoteValidation = [
  body('cliente')
    .trim()
    .notEmpty()
    .withMessage('El nombre del cliente es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre del cliente no puede tener más de 100 caracteres'),
  body('proyecto')
    .trim()
    .notEmpty()
    .withMessage('La descripción del proyecto es requerida')
    .isLength({ max: 500 })
    .withMessage('La descripción del proyecto no puede tener más de 500 caracteres'),
  body('items')
    .isArray({ min: 0 })
    .withMessage('Los items deben ser un array'),
  body('manoObra.horas')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Las horas de mano de obra no pueden ser negativas'),
  body('manoObra.precioPorHora')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio por hora no puede ser negativo'),
  body('pintura.metrosCuadrados')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Los metros cuadrados no pueden ser negativos'),
  body('pintura.precioPorMetro')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio por metro cuadrado no puede ser negativo'),
  body('estado')
    .optional()
    .isIn(['borrador', 'enviada', 'aprobada', 'rechazada', 'cancelada'])
    .withMessage('Estado no válido'),
  body('notas')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las notas no pueden tener más de 1000 caracteres'),
  body('fechaVencimiento')
    .optional()
    .isISO8601()
    .withMessage('Fecha de vencimiento inválida')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de cotización inválido')
];

const clienteValidation = [
  param('cliente')
    .trim()
    .notEmpty()
    .withMessage('El nombre del cliente es requerido')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  query('search')
    .optional()
    .isString()
    .withMessage('El término de búsqueda debe ser una cadena de texto'),
  query('estado')
    .optional()
    .isIn(['borrador', 'enviada', 'aprobada', 'rechazada', 'cancelada'])
    .withMessage('Estado no válido'),
  query('cliente')
    .optional()
    .isString()
    .withMessage('El nombre del cliente debe ser una cadena de texto'),
  query('sort')
    .optional()
    .isString()
    .withMessage('El ordenamiento debe ser una cadena de texto')
];

const statusValidation = [
  body('estado')
    .isIn(['borrador', 'enviada', 'aprobada', 'rechazada', 'cancelada'])
    .withMessage('Estado no válido')
];

// Rutas
router.get('/', queryValidation, validate, getQuotes);
router.get('/stats', getQuoteStats);
router.get('/recent', getRecentQuotes);
router.get('/client/:cliente', clienteValidation, validate, getQuotesByClient);
router.get('/:id', idValidation, validate, getQuote);
router.post('/', [...quoteValidation, ...itemValidation], validate, createQuote);
router.put('/:id', [...idValidation, ...quoteValidation, ...itemValidation], validate, updateQuote);
router.patch('/:id/status', [...idValidation, statusValidation], validate, updateQuoteStatus);
router.delete('/:id', idValidation, validate, deleteQuote);

module.exports = router; 