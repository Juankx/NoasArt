require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Probando conexión a MongoDB...');
console.log('URI:', process.env.MONGODB_URI ? 'Configurada' : 'NO CONFIGURADA');

if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI no está configurada en el archivo .env');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('🔄 Intentando conectar...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conexión exitosa!');
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️ Base de datos: ${conn.connection.name}`);
    
    // Probar una operación simple
    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`📁 Colecciones existentes: ${collections.length}`);
    
    await mongoose.disconnect();
    console.log('👋 Conexión cerrada');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n💡 Posibles soluciones:');
      console.log('1. Verifica que el usuario y contraseña sean correctos');
      console.log('2. Asegúrate de que el usuario tenga permisos de lectura/escritura');
      console.log('3. Verifica que Network Access permita conexiones desde tu IP');
      console.log('4. Intenta crear un nuevo usuario en Atlas');
    }
    
    process.exit(1);
  }
}

testConnection(); 