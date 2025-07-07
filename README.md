# 🏗️ NoasArt - Sistema de Cotizaciones

Sistema completo de gestión de cotizaciones para empresas de construcción, desarrollado con React (Frontend) y Node.js (Backend).

## 🚀 Características

### Frontend (React + Vite)
- ⚡ **Interfaz moderna** con Tailwind CSS
- 📱 **Diseño responsive** para todos los dispositivos
- 🔄 **Gestión de materiales** (CRUD completo)
- 📋 **Creación de cotizaciones** con cálculo automático
- 📊 **Historial de cotizaciones** con estadísticas
- 🎨 **UI/UX intuitiva** con iconos de Lucide React
- ✅ **Validación de formularios** con React Hook Form + Yup

### Backend (Node.js + Express)
- 🗄️ **Base de datos MongoDB** con Mongoose
- 🔒 **Validación de datos** con express-validator
- 🛡️ **Seguridad** con Helmet, CORS y rate limiting
- 📝 **Logging** con Morgan
- 🔄 **API RESTful** completa
- 🎯 **Middleware** para manejo de errores

## 📋 Requisitos Previos

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **MongoDB Atlas** (cuenta gratuita)

## 🛠️ Instalación

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd NoasArt
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env` en el directorio `backend/`:
```env
PORT=3000
MONGODB_URI=mongodb+srv://tu-usuario:tu-contraseña@tu-cluster.mongodb.net/noasart?retryWrites=true&w=majority
NODE_ENV=development
```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env` en el directorio `frontend/`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Poblar la base de datos

```bash
cd ../backend
node scripts/seedData.js
```

## 🚀 Ejecución

### Backend
```bash
cd backend
npm run dev
```
El servidor estará disponible en: http://localhost:3000

### Frontend
```bash
cd frontend
npm run dev
```
La aplicación estará disponible en: http://localhost:5173

## 🧪 Pruebas

### Probar la integración
```bash
node test-integration.js
```

### Probar la conexión a MongoDB
```bash
cd backend
node testConnection.js
```

## 📁 Estructura del Proyecto

```
NoasArt/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── materialController.js
│   │   └── cotizacionController.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── models/
│   │   ├── Material.js
│   │   └── Cotizacion.js
│   ├── routes/
│   │   ├── materiales.js
│   │   └── cotizaciones.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── config/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🔧 Configuración de MongoDB Atlas

1. **Crear cuenta** en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Crear cluster** (gratuito)
3. **Crear usuario** de base de datos
4. **Configurar acceso de red** (0.0.0.0/0 para desarrollo)
5. **Obtener URI** de conexión
6. **Actualizar** el archivo `.env` del backend

## 📊 Funcionalidades

### Gestión de Materiales
- ✅ Crear, editar, eliminar materiales
- ✅ Precios y unidades de medida
- ✅ Estado activo/inactivo
- ✅ Validación de datos

### Cotizaciones
- ✅ Crear cotizaciones con múltiples materiales
- ✅ Cálculo automático de totales
- ✅ Mano de obra y pintura
- ✅ Números de cotización automáticos
- ✅ Estados: borrador, enviada, aprobada

### Historial y Estadísticas
- ✅ Lista de todas las cotizaciones
- ✅ Estadísticas generales
- ✅ Filtros por fecha y estado
- ✅ Exportación de datos

## 🔒 Seguridad

- **Helmet**: Headers de seguridad
- **CORS**: Configurado para desarrollo
- **Rate Limiting**: Protección contra spam
- **Validación**: Todos los inputs validados
- **Sanitización**: Datos limpios antes de guardar

## 🚀 Despliegue

### Backend (Heroku/Railway)
1. Conectar repositorio
2. Configurar variables de entorno
3. Desplegar automáticamente

### Frontend (Vercel/Netlify)
1. Conectar repositorio
2. Configurar build settings
3. Desplegar automáticamente

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas:

1. **Verificar conexión MongoDB**: `node backend/testConnection.js`
2. **Probar integración**: `node test-integration.js`
3. **Revisar logs**: Backend y Frontend
4. **Verificar variables de entorno**: Archivos `.env`

## 🎯 Próximas Funcionalidades

- [ ] Autenticación de usuarios
- [ ] Roles y permisos
- [ ] Generación de PDFs
- [ ] Envío por email
- [ ] Dashboard avanzado
- [ ] Múltiples monedas
- [ ] Backup automático
- [ ] API para móviles

---

**Desarrollado con ❤️ para NoasArt** 