const mongoose = require('mongoose');
const Material = require('../models/Material');
const Cotizacion = require('../models/Cotizacion');
require('dotenv').config();

// Datos de ejemplo para materiales
const materialesEjemplo = [
  {
    nombre: 'Cemento Portland',
    unidad: 'kg',
    precio: 15.50,
    descripcion: 'Cemento Portland tipo I para construcción general',
    activo: true
  },
  {
    nombre: 'Arena',
    unidad: 'm³',
    precio: 45.00,
    descripcion: 'Arena de río lavada para construcción',
    activo: true
  },
  {
    nombre: 'Grava',
    unidad: 'm³',
    precio: 55.00,
    descripcion: 'Grava triturada 3/4" para concreto',
    activo: true
  },
  {
    nombre: 'Ladrillos',
    unidad: 'unidad',
    precio: 2.50,
    descripcion: 'Ladrillos de arcilla cocida 6x12x24 cm',
    activo: true
  },
  {
    nombre: 'Varilla 3/8"',
    unidad: 'm',
    precio: 12.00,
    descripcion: 'Varilla corrugada de acero 3/8"',
    activo: true
  },
  {
    nombre: 'Varilla 1/2"',
    unidad: 'm',
    precio: 18.50,
    descripcion: 'Varilla corrugada de acero 1/2"',
    activo: true
  },
  {
    nombre: 'Pintura Interior',
    unidad: 'l',
    precio: 25.00,
    descripcion: 'Pintura vinílica para interiores',
    activo: true
  },
  {
    nombre: 'Pintura Exterior',
    unidad: 'l',
    precio: 35.00,
    descripcion: 'Pintura acrílica para exteriores',
    activo: true
  },
  {
    nombre: 'Alambre',
    unidad: 'kg',
    precio: 8.50,
    descripcion: 'Alambre recocido #16 para amarre',
    activo: true
  },
  {
    nombre: 'Yeso',
    unidad: 'kg',
    precio: 5.20,
    descripcion: 'Yeso para acabados interiores',
    activo: true
  }
];

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado para seeding');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

// Función para limpiar la base de datos
const limpiarDB = async () => {
  try {
    await Material.deleteMany({});
    await Cotizacion.deleteMany({});
    console.log('🗑️ Base de datos limpiada');
  } catch (error) {
    console.error('❌ Error limpiando la base de datos:', error.message);
  }
};

// Función para insertar materiales
const insertarMateriales = async () => {
  try {
    const materiales = await Material.insertMany(materialesEjemplo);
    console.log(`✅ ${materiales.length} materiales insertados`);
    return materiales;
  } catch (error) {
    console.error('❌ Error insertando materiales:', error.message);
    throw error;
  }
};

// Función para crear cotizaciones de ejemplo
const crearCotizacionesEjemplo = async (materiales) => {
  try {
    const cotizaciones = [
      {
        numero: 'COT-202412-001',
        cliente: 'Juan Pérez',
        proyecto: 'Construcción de muro perimetral',
        items: [
          {
            material: materiales[0]._id, // Cemento
            cantidad: 500,
            precioUnitario: 15.50,
            subtotal: 7750
          },
          {
            material: materiales[1]._id, // Arena
            cantidad: 2,
            precioUnitario: 45.00,
            subtotal: 90
          },
          {
            material: materiales[3]._id, // Ladrillos
            cantidad: 1000,
            precioUnitario: 2.50,
            subtotal: 2500
          }
        ],
        manoObra: {
          horas: 16,
          precioPorHora: 25,
          total: 400
        },
        pintura: {
          metrosCuadrados: 0,
          precioPorMetro: 15,
          total: 0
        },
        subtotalMateriales: 10340,
        total: 10740,
        estado: 'aprobada',
        notas: 'Cotización aprobada por el cliente'
      },
      {
        numero: 'COT-202412-002',
        cliente: 'María García',
        proyecto: 'Pintura de casa habitación',
        items: [
          {
            material: materiales[6]._id, // Pintura Interior
            cantidad: 20,
            precioUnitario: 25.00,
            subtotal: 500
          },
          {
            material: materiales[7]._id, // Pintura Exterior
            cantidad: 15,
            precioUnitario: 35.00,
            subtotal: 525
          }
        ],
        manoObra: {
          horas: 24,
          precioPorHora: 25,
          total: 600
        },
        pintura: {
          metrosCuadrados: 120,
          precioPorMetro: 15,
          total: 1800
        },
        subtotalMateriales: 1025,
        total: 3425,
        estado: 'enviada',
        notas: 'Pendiente de aprobación'
      },
      {
        numero: 'COT-202412-003',
        cliente: 'Carlos López',
        proyecto: 'Cimentación para ampliación',
        items: [
          {
            material: materiales[0]._id, // Cemento
            cantidad: 800,
            precioUnitario: 15.50,
            subtotal: 12400
          },
          {
            material: materiales[1]._id, // Arena
            cantidad: 3,
            precioUnitario: 45.00,
            subtotal: 135
          },
          {
            material: materiales[2]._id, // Grava
            cantidad: 3,
            precioUnitario: 55.00,
            subtotal: 165
          },
          {
            material: materiales[4]._id, // Varilla 3/8"
            cantidad: 50,
            precioUnitario: 12.00,
            subtotal: 600
          }
        ],
        manoObra: {
          horas: 32,
          precioPorHora: 25,
          total: 800
        },
        pintura: {
          metrosCuadrados: 0,
          precioPorMetro: 15,
          total: 0
        },
        subtotalMateriales: 13300,
        total: 14100,
        estado: 'borrador',
        notas: 'Cotización en revisión'
      }
    ];

    const cotizacionesCreadas = await Cotizacion.insertMany(cotizaciones);
    console.log(`✅ ${cotizacionesCreadas.length} cotizaciones creadas`);
  } catch (error) {
    console.error('❌ Error creando cotizaciones:', error.message);
    throw error;
  }
};

// Función principal
const seedData = async () => {
  try {
    console.log('🌱 Iniciando proceso de seeding...');
    
    await connectDB();
    await limpiarDB();
    
    const materiales = await insertarMateriales();
    await crearCotizacionesEjemplo(materiales);
    
    console.log('✅ Proceso de seeding completado exitosamente');
    console.log('📊 Resumen:');
    console.log(`   - Materiales: ${materiales.length}`);
    console.log(`   - Cotizaciones: 3`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el proceso de seeding:', error.message);
    process.exit(1);
  }
};

// Ejecutar si el script se llama directamente
if (require.main === module) {
  seedData();
}

module.exports = { seedData }; 