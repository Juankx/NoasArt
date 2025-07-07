const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testModalData() {
  console.log('🔍 Probando estructura de datos para el modal...\n');

  try {
    // Obtener cotizaciones
    console.log('1️⃣ Obteniendo cotizaciones...');
    const response = await axios.get(`${API_BASE_URL}/quotes`);
    const cotizaciones = response.data.data || [];
    
    if (cotizaciones.length === 0) {
      console.log('❌ No hay cotizaciones para probar');
      return;
    }

    console.log(`✅ Se encontraron ${cotizaciones.length} cotizaciones`);
    
    // Probar la primera cotización
    const cotizacion = cotizaciones[0];
    console.log('\n2️⃣ Analizando estructura de la primera cotización:');
    console.log('   - ID:', cotizacion._id);
    console.log('   - Número:', cotizacion.numero);
    console.log('   - Cliente:', cotizacion.cliente);
    console.log('   - Proyecto:', cotizacion.proyecto);
    console.log('   - Estado:', cotizacion.estado);
    console.log('   - Total:', cotizacion.total);
    console.log('   - Fecha:', cotizacion.createdAt);

    // Verificar estructura de manoObra
    console.log('\n3️⃣ Verificando estructura de manoObra:');
    if (cotizacion.manoObra) {
      console.log('   ✅ manoObra es un objeto con propiedades:');
      console.log('      - horas:', cotizacion.manoObra.horas);
      console.log('      - precioPorHora:', cotizacion.manoObra.precioPorHora);
      console.log('      - total:', cotizacion.manoObra.total);
    } else {
      console.log('   ❌ manoObra no está definido');
    }

    // Verificar estructura de pintura
    console.log('\n4️⃣ Verificando estructura de pintura:');
    if (cotizacion.pintura) {
      console.log('   ✅ pintura es un objeto con propiedades:');
      console.log('      - metrosCuadrados:', cotizacion.pintura.metrosCuadrados);
      console.log('      - precioPorMetro:', cotizacion.pintura.precioPorMetro);
      console.log('      - total:', cotizacion.pintura.total);
    } else {
      console.log('   ❌ pintura no está definido');
    }

    // Verificar estructura de items
    console.log('\n5️⃣ Verificando estructura de items:');
    if (cotizacion.items && cotizacion.items.length > 0) {
      console.log(`   ✅ Hay ${cotizacion.items.length} items`);
      const primerItem = cotizacion.items[0];
      console.log('   - Primer item:');
      console.log('      - material:', primerItem.material);
      console.log('      - cantidad:', primerItem.cantidad);
      console.log('      - precioUnitario:', primerItem.precioUnitario);
      console.log('      - subtotal:', primerItem.subtotal);
      
      // Verificar si el material está poblado
      if (primerItem.material && typeof primerItem.material === 'object') {
        console.log('      - material.nombre:', primerItem.material.nombre);
        console.log('      - material.unidad:', primerItem.material.unidad);
      } else {
        console.log('      - material (ID):', primerItem.material);
      }
    } else {
      console.log('   ❌ No hay items en esta cotización');
    }

    console.log('\n🎉 Análisis completado. El modal debería funcionar correctamente.');

  } catch (error) {
    console.error('\n❌ Error al analizar los datos:');
    
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
testModalData(); 