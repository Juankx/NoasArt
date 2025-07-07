const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testIntegration() {
  console.log('🧪 Probando integración entre frontend y backend...\n');

  try {
    // Test 1: Verificar que el servidor esté corriendo
    console.log('1️⃣ Verificando conexión al servidor...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Servidor respondiendo:', healthResponse.data);

    // Test 2: Obtener materiales
    console.log('\n2️⃣ Probando endpoint de materiales...');
    const materialesResponse = await axios.get(`${API_BASE_URL}/materials`);
    console.log(`✅ Materiales obtenidos: ${materialesResponse.data.data.length} materiales`);

    // Test 3: Obtener cotizaciones
    console.log('\n3️⃣ Probando endpoint de cotizaciones...');
    const cotizacionesResponse = await axios.get(`${API_BASE_URL}/quotes`);
    console.log(`✅ Cotizaciones obtenidas: ${cotizacionesResponse.data.data.length} cotizaciones`);

    // Test 4: Crear un material de prueba
    console.log('\n4️⃣ Probando creación de material...');
    const nuevoMaterial = {
      nombre: 'Material de Prueba',
      unidad: 'kg',
      precio: 10.50,
      descripcion: 'Material para pruebas de integración'
    };
    
    const createMaterialResponse = await axios.post(`${API_BASE_URL}/materials`, nuevoMaterial);
    console.log('✅ Material creado:', createMaterialResponse.data.data.nombre);

    // Test 5: Eliminar el material de prueba
    console.log('\n5️⃣ Probando eliminación de material...');
    await axios.delete(`${API_BASE_URL}/materials/${createMaterialResponse.data.data._id}`);
    console.log('✅ Material eliminado correctamente');

    console.log('\n🎉 ¡Todas las pruebas de integración pasaron exitosamente!');
    console.log('\n📋 Resumen:');
    console.log('   - Servidor: ✅ Funcionando');
    console.log('   - API de Materiales: ✅ Funcionando');
    console.log('   - API de Cotizaciones: ✅ Funcionando');
    console.log('   - Operaciones CRUD: ✅ Funcionando');

  } catch (error) {
    console.error('\n❌ Error en las pruebas de integración:');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   - El servidor no está corriendo en http://localhost:3000');
      console.error('   - Ejecuta: npm run dev en el directorio backend');
    } else if (error.response) {
      console.error(`   - Error ${error.response.status}: ${error.response.data.message}`);
    } else {
      console.error('   - Error desconocido:', error.message);
    }
    
    console.log('\n🔧 Soluciones:');
    console.log('   1. Asegúrate de que el backend esté corriendo (npm run dev)');
    console.log('   2. Verifica que MongoDB esté conectado');
    console.log('   3. Revisa los logs del servidor para más detalles');
  }
}

// Ejecutar las pruebas
testIntegration(); 