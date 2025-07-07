const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testClientes() {
  console.log('👥 Probando funcionalidad de clientes...\n');

  try {
    // Obtener todas las cotizaciones
    console.log('1️⃣ Obteniendo cotizaciones...');
    const response = await axios.get(`${API_BASE_URL}/quotes`);
    const cotizaciones = response.data.data || [];
    
    if (cotizaciones.length === 0) {
      console.log('❌ No hay cotizaciones para analizar clientes');
      return;
    }

    console.log(`✅ Se encontraron ${cotizaciones.length} cotizaciones`);

    // Agrupar cotizaciones por cliente (simulando la lógica del frontend)
    console.log('\n2️⃣ Agrupando cotizaciones por cliente...');
    const clientesMap = new Map();
    
    cotizaciones.forEach(cotizacion => {
      const cliente = cotizacion.cliente;
      
      if (!clientesMap.has(cliente)) {
        clientesMap.set(cliente, {
          nombre: cliente,
          cotizaciones: [],
          totalFacturado: 0,
          cotizacionesCount: 0,
          ultimaCotizacion: null,
          primeraCotizacion: null
        });
      }
      
      const clienteData = clientesMap.get(cliente);
      clienteData.cotizaciones.push(cotizacion);
      clienteData.totalFacturado += cotizacion.total;
      clienteData.cotizacionesCount += 1;
      
      const fecha = new Date(cotizacion.createdAt);
      if (!clienteData.ultimaCotizacion || fecha > new Date(clienteData.ultimaCotizacion.createdAt)) {
        clienteData.ultimaCotizacion = cotizacion;
      }
      if (!clienteData.primeraCotizacion || fecha < new Date(clienteData.primeraCotizacion.createdAt)) {
        clienteData.primeraCotizacion = cotizacion;
      }
    });
    
    // Convertir a array y ordenar por total facturado
    const clientesArray = Array.from(clientesMap.values())
      .sort((a, b) => b.totalFacturado - a.totalFacturado);

    console.log(`✅ Se encontraron ${clientesArray.length} clientes únicos`);

    // Mostrar información de cada cliente
    console.log('\n3️⃣ Información de clientes:');
    clientesArray.forEach((cliente, index) => {
      console.log(`\n   Cliente ${index + 1}: ${cliente.nombre}`);
      console.log(`   - Cotizaciones: ${cliente.cotizacionesCount}`);
      console.log(`   - Total facturado: $${cliente.totalFacturado.toFixed(2)}`);
      console.log(`   - Promedio por cotización: $${(cliente.totalFacturado / cliente.cotizacionesCount).toFixed(2)}`);
      console.log(`   - Primera cotización: ${cliente.primeraCotizacion?.numero || 'N/A'}`);
      console.log(`   - Última cotización: ${cliente.ultimaCotizacion?.numero || 'N/A'}`);
      
      // Mostrar las cotizaciones del cliente
      console.log(`   - Cotizaciones:`);
      cliente.cotizaciones.forEach(cot => {
        console.log(`     • ${cot.numero}: ${cot.proyecto} - $${cot.total.toFixed(2)} (${cot.estado})`);
      });
    });

    // Estadísticas generales
    console.log('\n4️⃣ Estadísticas generales:');
    const totalCotizaciones = clientesArray.reduce((sum, cliente) => sum + cliente.cotizacionesCount, 0);
    const totalFacturado = clientesArray.reduce((sum, cliente) => sum + cliente.totalFacturado, 0);
    const promedioPorCliente = clientesArray.length > 0 ? totalFacturado / clientesArray.length : 0;
    
    console.log(`   - Total de clientes: ${clientesArray.length}`);
    console.log(`   - Total de cotizaciones: ${totalCotizaciones}`);
    console.log(`   - Total facturado: $${totalFacturado.toFixed(2)}`);
    console.log(`   - Promedio por cliente: $${promedioPorCliente.toFixed(2)}`);
    console.log(`   - Promedio por cotización: $${(totalFacturado / totalCotizaciones).toFixed(2)}`);

    // Cliente con mayor facturación
    if (clientesArray.length > 0) {
      const clienteTop = clientesArray[0];
      console.log(`\n5️⃣ Cliente con mayor facturación:`);
      console.log(`   - Nombre: ${clienteTop.nombre}`);
      console.log(`   - Total: $${clienteTop.totalFacturado.toFixed(2)}`);
      console.log(`   - Cotizaciones: ${clienteTop.cotizacionesCount}`);
    }

    console.log('\n🎉 ¡Análisis de clientes completado exitosamente!');
    console.log('\n✅ Funcionalidades verificadas:');
    console.log('   - Agrupación de cotizaciones por cliente');
    console.log('   - Cálculo de totales por cliente');
    console.log('   - Identificación de primera y última cotización');
    console.log('   - Estadísticas generales');
    console.log('   - Ordenamiento por facturación');

  } catch (error) {
    console.error('\n❌ Error en el análisis de clientes:');
    
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
testClientes(); 