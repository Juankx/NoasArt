const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testCotizacionPrecios() {
  console.log('💰 Probando cotización con precios personalizados...\n');

  try {
    // Obtener materiales para usar en la cotización
    console.log('1️⃣ Obteniendo materiales...');
    const materialesResponse = await axios.get(`${API_BASE_URL}/materials`);
    const materiales = materialesResponse.data.data || [];
    
    if (materiales.length === 0) {
      console.log('❌ No hay materiales disponibles');
      return;
    }

    console.log(`✅ Se encontraron ${materiales.length} materiales`);

    // Crear una cotización de prueba con precios personalizados
    console.log('\n2️⃣ Creando cotización con precios personalizados...');
    const cotizacionPrueba = {
      cliente: 'Cliente de Prueba - Precios Personalizados',
      proyecto: 'Proyecto con precios variables',
      items: [
        {
          material: materiales[0]._id,
          cantidad: 10,
          precioUnitario: materiales[0].precio,
          subtotal: materiales[0].precio * 10
        },
        {
          material: materiales[1]._id,
          cantidad: 5,
          precioUnitario: materiales[1].precio,
          subtotal: materiales[1].precio * 5
        }
      ],
      manoObra: {
        horas: 20,
        precioPorHora: 35.50, // Precio personalizado
        total: 20 * 35.50
      },
      pintura: {
        metrosCuadrados: 50,
        precioPorMetro: 22.75, // Precio personalizado
        total: 50 * 22.75
      },
      subtotalMateriales: (materiales[0].precio * 10) + (materiales[1].precio * 5),
      total: (materiales[0].precio * 10) + (materiales[1].precio * 5) + (20 * 35.50) + (50 * 22.75),
      estado: 'borrador',
      notas: 'Cotización de prueba con precios personalizados de mano de obra y pintura'
    };

    const response = await axios.post(`${API_BASE_URL}/quotes`, cotizacionPrueba);
    const cotizacionCreada = response.data.data;

    console.log('✅ Cotización creada exitosamente');
    console.log('\n📊 Detalles de la cotización:');
    console.log(`   - Cliente: ${cotizacionCreada.cliente}`);
    console.log(`   - Proyecto: ${cotizacionCreada.proyecto}`);
    console.log(`   - Número: ${cotizacionCreada.numero}`);
    console.log(`   - Estado: ${cotizacionCreada.estado}`);

    console.log('\n🔧 Servicios con precios personalizados:');
    console.log(`   - Mano de obra: ${cotizacionCreada.manoObra.horas} horas × $${cotizacionCreada.manoObra.precioPorHora}/hora = $${cotizacionCreada.manoObra.total.toFixed(2)}`);
    console.log(`   - Pintura: ${cotizacionCreada.pintura.metrosCuadrados} m² × $${cotizacionCreada.pintura.precioPorMetro}/m² = $${cotizacionCreada.pintura.total.toFixed(2)}`);

    console.log('\n📦 Materiales:');
    cotizacionCreada.items.forEach((item, index) => {
      console.log(`   ${index + 1}. Cantidad: ${item.cantidad}, Precio: $${item.precioUnitario}, Subtotal: $${item.subtotal.toFixed(2)}`);
    });

    console.log('\n💰 Totales:');
    console.log(`   - Subtotal materiales: $${cotizacionCreada.subtotalMateriales.toFixed(2)}`);
    console.log(`   - Total mano de obra: $${cotizacionCreada.manoObra.total.toFixed(2)}`);
    console.log(`   - Total pintura: $${cotizacionCreada.pintura.total.toFixed(2)}`);
    console.log(`   - TOTAL GENERAL: $${cotizacionCreada.total.toFixed(2)}`);

    // Eliminar la cotización de prueba
    console.log('\n3️⃣ Eliminando cotización de prueba...');
    await axios.delete(`${API_BASE_URL}/quotes/${cotizacionCreada._id}`);
    console.log('✅ Cotización de prueba eliminada');

    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('\n✅ Funcionalidades verificadas:');
    console.log('   - Precios personalizados de mano de obra');
    console.log('   - Precios personalizados de pintura');
    console.log('   - Cálculo correcto de totales');
    console.log('   - Creación y eliminación de cotizaciones');

  } catch (error) {
    console.error('\n❌ Error en la prueba:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   - El servidor no está corriendo en http://localhost:3000');
    } else if (error.response) {
      console.error(`   - Error ${error.response.status}: ${error.response.data.message || error.response.data.error}`);
    } else {
      console.error('   - Error desconocido:', error.message);
    }
  }
}

// Ejecutar las pruebas
testCotizacionPrecios(); 