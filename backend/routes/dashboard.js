const express = require('express');
const { query } = require('express-validator');
const {
  getDashboardStats,
  getRecentActivity,
  getDashboardSummary
} = require('../controllers/dashboardController');
const validate = require('../middleware/validate');

const router = express.Router();

// Validaciones
const queryValidation = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('El límite debe ser un número entre 1 y 50')
];

// Rutas
router.get('/stats', getDashboardStats);
router.get('/recent-activity', queryValidation, validate, getRecentActivity);
router.get('/summary', getDashboardSummary);

module.exports = router; 