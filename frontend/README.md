# Sistema de Cotizaciones - Frontend

Aplicación web para gestión de cotizaciones de construcción desarrollada con React, Vite y Tailwind CSS.

## 🚀 Características

- **Gestión de Materiales**: Agregar, editar y eliminar materiales con precios y unidades
- **Creación de Cotizaciones**: Generar cotizaciones detalladas con materiales, mano de obra y pintura
- **Cálculo Automático**: Totales calculados automáticamente con posibilidad de modificar precios individuales
- **Historial**: Consulta de todas las cotizaciones creadas con estadísticas
- **Diseño Responsive**: Interfaz adaptada para dispositivos móviles y desktop
- **Validación de Formularios**: Validación en tiempo real con React Hook Form y Yup
- **Integración API**: Servicios preparados para conectar con backend REST

## 🛠️ Tecnologías Utilizadas

- **React 18**: Biblioteca de interfaz de usuario
- **Vite**: Herramienta de construcción rápida
- **Tailwind CSS**: Framework de CSS utility-first
- **React Router**: Navegación entre páginas
- **React Hook Form**: Manejo de formularios
- **Yup**: Validación de esquemas
- **Axios**: Cliente HTTP para llamadas API
- **Lucide React**: Iconos modernos

## 📦 Instalación

1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno** (opcional):
   Crear archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**:
   La aplicación estará disponible en `http://localhost:5173`

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   └── Layout/
│       ├── Layout.jsx          # Layout principal con navegación
│       └── Navbar.jsx          # Barra de navegación
├── pages/
│   ├── Home.jsx               # Página de inicio con dashboard
│   ├── Materiales.jsx         # Gestión de materiales
│   ├── Cotizaciones.jsx       # Creación de cotizaciones
│   └── Historial.jsx          # Historial de cotizaciones
├── services/
│   └── api.js                 # Servicios para llamadas API
├── App.jsx                    # Componente principal con rutas
├── main.jsx                   # Punto de entrada
└── index.css                  # Estilos globales y Tailwind
```

## 📱 Funcionalidades Principales

### 1. Dashboard (Inicio)
- Estadísticas generales del negocio
- Acciones rápidas para navegar
- Actividad reciente

### 2. Gestión de Materiales
- Formulario para agregar/editar materiales
- Tabla con lista de materiales
- Validación de campos requeridos
- Precios y unidades configurables

### 3. Creación de Cotizaciones
- Información del cliente y proyecto
- Selección de materiales con cantidades
- Precios personalizables por ítem
- Cálculo de mano de obra por hora
- Cálculo de pintura por metro cuadrado
- Resumen detallado en tiempo real

### 4. Historial de Cotizaciones
- Lista de todas las cotizaciones
- Estadísticas de ventas
- Vista detallada de cada cotización
- Funcionalidad de eliminación

## 🔧 Configuración de API

El proyecto incluye servicios preparados para conectar con un backend REST. Los endpoints esperados son:

### Materiales
- `GET /api/materiales` - Obtener todos los materiales
- `POST /api/materiales` - Crear nuevo material
- `PUT /api/materiales/:id` - Actualizar material
- `DELETE /api/materiales/:id` - Eliminar material

### Cotizaciones
- `GET /api/cotizaciones` - Obtener todas las cotizaciones
- `POST /api/cotizaciones` - Crear nueva cotización
- `PUT /api/cotizaciones/:id` - Actualizar cotización
- `DELETE /api/cotizaciones/:id` - Eliminar cotización

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas generales
- `GET /api/dashboard/recent-activity` - Actividad reciente

## 🎨 Personalización

### Colores
Los colores principales se pueden personalizar en `tailwind.config.js`:

```javascript
colors: {
  primary: {
    50: '#eff6ff',
    // ... más tonos
    900: '#1e3a8a',
  },
}
```

### Componentes CSS
Los estilos de componentes están definidos en `src/index.css`:

```css
@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
  }
  /* ... más estilos */
}
```

## 📋 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la construcción
- `npm run lint` - Ejecutar linter

## 🚀 Despliegue

### Construcción para Producción
```bash
npm run build
```

### Despliegue en Vercel
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Despliegue en Netlify
1. Subir archivos de `dist/` después de `npm run build`
2. Configurar redirecciones para React Router

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el proyecto, contacta al equipo de desarrollo.

---

Desarrollado con ❤️ para empresas de construcción
