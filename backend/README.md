# Sistema de Cotizaciones - Backend

API REST para gestión de cotizaciones de construcción desarrollada con Node.js, Express y MongoDB.

## 🚀 Características

- **API RESTful** completa con endpoints para materiales y cotizaciones
- **Base de datos MongoDB** con Mongoose para modelado de datos
- **Validación robusta** con express-validator
- **Manejo de errores** centralizado y personalizado
- **Seguridad** con Helmet, CORS y rate limiting
- **Logging** con Morgan
- **Documentación** completa de endpoints
- **Scripts de seeding** para datos de prueba

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **express-validator**: Validación de datos
- **Helmet**: Seguridad HTTP
- **CORS**: Cross-Origin Resource Sharing
- **Morgan**: Logging HTTP
- **dotenv**: Variables de entorno

## 📦 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd backend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crear archivo `.env` basado en `.env.example`:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/noasart_cotizaciones
   CORS_ORIGIN=http://localhost:5173
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Configurar MongoDB**:
   - Instalar MongoDB localmente o usar MongoDB Atlas
   - Asegurar que la URI de conexión sea correcta

5. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

6. **Poblar con datos de ejemplo** (opcional):
   ```bash
   node scripts/seedData.js
   ```

## 🏗️ Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de MongoDB
├── controllers/
│   ├── materialController.js # Controlador de materiales
│   ├── quoteController.js    # Controlador de cotizaciones
│   └── dashboardController.js # Controlador del dashboard
├── middleware/
│   ├── asyncHandler.js       # Wrapper para funciones async
│   ├── errorHandler.js       # Manejo de errores
│   └── validate.js           # Validación de datos
├── models/
│   ├── Material.js           # Modelo de materiales
│   └── Cotizacion.js         # Modelo de cotizaciones
├── routes/
│   ├── materials.js          # Rutas de materiales
│   ├── quotes.js             # Rutas de cotizaciones
│   └── dashboard.js          # Rutas del dashboard
├── scripts/
│   └── seedData.js           # Script para datos de ejemplo
├── server.js                 # Archivo principal del servidor
├── package.json              # Dependencias y scripts
└── README.md                 # Documentación
```

## 📚 Documentación de la API

### Base URL
```
http://localhost:3000/api
```

### Endpoints de Materiales

#### GET /materials
Obtener todos los materiales con paginación y filtros.

**Query Parameters:**
- `page` (number): Número de página (default: 1)
- `limit` (number): Elementos por página (default: 10, max: 100)
- `search` (string): Búsqueda por nombre
- `activo` (boolean): Filtrar por estado activo

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "pagination": {
    "page": 1,
    "limit": 10,
    "pages": 3
  },
  "data": [...]
}
```

#### GET /materials/:id
Obtener un material específico por ID.

#### POST /materials
Crear un nuevo material.

**Body:**
```json
{
  "nombre": "Cemento Portland",
  "unidad": "kg",
  "precio": 15.50,
  "descripcion": "Cemento para construcción",
  "activo": true
}
```

#### PUT /materials/:id
Actualizar un material existente.

#### DELETE /materials/:id
Eliminar un material.

#### GET /materials/active
Obtener solo materiales activos.

#### GET /materials/stats
Obtener estadísticas de materiales.

### Endpoints de Cotizaciones

#### GET /quotes
Obtener todas las cotizaciones con paginación y filtros.

**Query Parameters:**
- `page` (number): Número de página
- `limit` (number): Elementos por página
- `search` (string): Búsqueda por número, cliente o proyecto
- `estado` (string): Filtrar por estado
- `cliente` (string): Filtrar por cliente
- `sort` (string): Ordenamiento

#### GET /quotes/:id
Obtener una cotización específica por ID.

#### POST /quotes
Crear una nueva cotización.

**Body:**
```json
{
  "cliente": "Juan Pérez",
  "proyecto": "Construcción de muro",
  "items": [
    {
      "material": "64f1a2b3c4d5e6f7g8h9i0j1",
      "cantidad": 100,
      "precioUnitario": 15.50,
      "precioPersonalizado": null
    }
  ],
  "manoObra": {
    "horas": 16,
    "precioPorHora": 25
  },
  "pintura": {
    "metrosCuadrados": 50,
    "precioPorMetro": 15
  },
  "estado": "borrador",
  "notas": "Cotización inicial"
}
```

#### PUT /quotes/:id
Actualizar una cotización existente.

#### DELETE /quotes/:id
Eliminar una cotización.

#### PATCH /quotes/:id/status
Cambiar el estado de una cotización.

**Body:**
```json
{
  "estado": "aprobada"
}
```

#### GET /quotes/stats
Obtener estadísticas de cotizaciones.

#### GET /quotes/recent
Obtener cotizaciones recientes.

#### GET /quotes/client/:cliente
Obtener cotizaciones por cliente.

### Endpoints del Dashboard

#### GET /dashboard/stats
Obtener estadísticas generales del dashboard.

#### GET /dashboard/recent-activity
Obtener actividad reciente.

#### GET /dashboard/summary
Obtener resumen rápido de estadísticas.

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | 3000 |
| `NODE_ENV` | Ambiente de ejecución | development |
| `MONGODB_URI` | URI de conexión a MongoDB | - |
| `CORS_ORIGIN` | Origen permitido para CORS | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Ventana de rate limiting | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Máximo de requests por ventana | 100 |

### Modelos de Datos

#### Material
```javascript
{
  nombre: String,        // Requerido, max 100 chars
  unidad: String,        // Requerido, enum: ['kg', 'm³', 'm', 'unidad', 'l', 'm²']
  precio: Number,        // Requerido, min 0
  descripcion: String,   // Opcional, max 500 chars
  activo: Boolean,       // Default: true
  timestamps: true
}
```

#### Cotización
```javascript
{
  numero: String,        // Auto-generado
  cliente: String,       // Requerido, max 100 chars
  proyecto: String,      // Requerido, max 500 chars
  items: [ItemMaterial], // Array de items
  manoObra: {            // Objeto con horas, precioPorHora, total
    horas: Number,
    precioPorHora: Number,
    total: Number
  },
  pintura: {             // Objeto con metrosCuadrados, precioPorMetro, total
    metrosCuadrados: Number,
    precioPorMetro: Number,
    total: Number
  },
  subtotalMateriales: Number,
  total: Number,
  estado: String,        // enum: ['borrador', 'enviada', 'aprobada', 'rechazada', 'cancelada']
  notas: String,         // Opcional, max 1000 chars
  fechaVencimiento: Date,
  timestamps: true
}
```

## 📋 Scripts Disponibles

- `npm start` - Ejecutar en producción
- `npm run dev` - Ejecutar en desarrollo con nodemon
- `node scripts/seedData.js` - Poblar base de datos con datos de ejemplo

## 🔒 Seguridad

- **Helmet**: Headers de seguridad HTTP
- **CORS**: Configuración de Cross-Origin Resource Sharing
- **Rate Limiting**: Límite de requests por IP
- **Validación**: Validación de datos de entrada
- **Sanitización**: Limpieza de datos de entrada

## 🚀 Despliegue

### Producción
1. Configurar variables de entorno para producción
2. Ejecutar `npm start`
3. Usar PM2 o similar para gestión de procesos

### Docker (opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

Para ejecutar tests (cuando se implementen):
```bash
npm test
```

## 📞 Soporte

Para soporte técnico o preguntas sobre la API, contacta al equipo de desarrollo.

---

Desarrollado con ❤️ para empresas de construcción 