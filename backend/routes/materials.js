const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getActiveMaterials,
  getMaterialStats
} = require('../controllers/materialController');
const validate = require('../middleware/validate');

const router = express.Router();

// Validaciones
const materialValidation = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del material es requerido')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede tener más de 100 caracteres'),
  body('unidad')
    .isIn(['kg', 'm³', 'm', 'unidad', 'l', 'm²'])
    .withMessage('Unidad de medida no válida'),
  body('precio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('La descripción no puede tener más de 500 caracteres'),
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('El campo activo debe ser un booleano')
];

const idValidation = [
  param('id')
    .isMongoId()
    .withMessage('ID de material inválido')
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
  query('activo')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('El filtro activo debe ser true o false')
];

// Rutas
router.get('/', queryValidation, validate, getMaterials);
router.get('/active', getActiveMaterials);
router.get('/stats', getMaterialStats);
router.get('/:id', idValidation, validate, getMaterial);
router.post('/', materialValidation, validate, createMaterial);
router.put('/:id', [...idValidation, ...materialValidation], validate, updateMaterial);
router.delete('/:id', idValidation, validate, deleteMaterial);

module.exports = router; 