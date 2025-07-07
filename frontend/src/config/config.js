// Configuración de la aplicación
export const config = {
  // URL base de la API
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // Configuración de la aplicación
  APP_NAME: 'NoasArt - Sistema de Cotizaciones',
  APP_VERSION: '1.0.0',
  
  // Configuración de paginación
  ITEMS_PER_PAGE: 10,
  
  // Configuración de moneda
  CURRENCY: 'MXN',
  CURRENCY_SYMBOL: '$',
  
  // Configuración de fechas
  DATE_FORMAT: 'es-ES',
  TIME_FORMAT: 'HH:mm',
}; 