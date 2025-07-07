const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testDashboard() {
  console.log('📊 Probando endpoints del Dashboard...\n');

  try {
    // Test 1: Estadísticas del dashboard
    console.log('1️⃣ Probando estadísticas del dashboard...');
    const statsResponse = await axios.get(`${API_BASE_URL}/dashboard/stats`);
    const stats = statsResponse.data.data;
    
    console.log('✅ Estadísticas obtenidas:');
    console.log(`   - Materiales registrados: ${stats.materiales?.totalMateriales || 0}`);
    console.log(`   - Cotizaciones creadas: ${stats.cotizaciones?.totalCotizaciones || 0}`);
    console.log(`   - Total facturado: $${stats.cotizaciones?.totalFacturado?.toLocaleString() || 0}`);
    console.log(`   - Clientes únicos: ${stats.topClientes?.length || 0}`);

    // Test 2: Actividad reciente
    console.log('\n2️⃣ Probando actividad reciente...');
    const activityResponse = await axios.get(`${API_BASE_URL}/dashboard/recent-activity`);
    const activity = activityResponse.data.data;
    
    console.log(`✅ Actividad reciente obtenida: ${activity.length} actividades`);
    if (activity.length > 0) {
      console.log('   - Últimas actividades:');
      activity.slice(0, 3).forEach((item, index) => {
        console.log(`     ${index + 1}. ${item.descripcion}`);
      });
    }

    // Test 3: Resumen del dashboard
    console.log('\n3️⃣ Probando resumen del dashboard...');
    const summaryResponse = await axios.get(`${API_BASE_URL}/dashboard/summary`);
    const summary = summaryResponse.data.data;
    
    console.log('✅ Resumen obtenido:');
    console.log(`   - Total cotizaciones: ${summary.totalCotizaciones}`);
    console.log(`   - Total materiales: ${summary.totalMateriales}`);
    console.log(`   - Cotizaciones este mes: ${summary.cotizacionesEsteMes}`);
    console.log(`   - Total facturado: $${summary.totalFacturado?.toLocaleString() || 0}`);

    console.log('\n🎉 ¡Todos los endpoints del dashboard funcionan correctamente!');
    console.log('\n📋 Resumen de datos reales:');
    console.log(`   - Materiales: ${stats.materiales?.totalMateriales || 0}`);
    console.log(`   - Cotizaciones: ${stats.cotizaciones?.totalCotizaciones || 0}`);
    console.log(`   - Total facturado: $${stats.cotizaciones?.totalFacturado?.toLocaleString() || 0}`);
    console.log(`   - Clientes: ${stats.topClientes?.length || 0}`);

  } catch (error) {
    console.error('\n❌ Error en las pruebas del dashboard:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   - El servidor no está corriendo en http://localhost:3000');
      console.error('   - Ejecuta: npm run dev en el directorio backend');
    } else if (error.response) {
      console.error(`   - Error ${error.response.status}: ${error.response.data.message || error.response.data.error}`);
    } else {
      console.error('   - Error desconocido:', error.message);
    }
  }
}

// Ejecutar las pruebas
testDashboard(); 