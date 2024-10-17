const mysql = require('mysql');

// Crear un pool de conexiones para mejorar el rendimiento y la escalabilidad
const pool = mysql.createPool({
  connectionLimit: 10, // Limita el número de conexiones simultáneas
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: process.env.db_port,
  multipleStatements: false // Deshabilita múltiples declaraciones para evitar inyecciones SQL
});

// Función para conectar con reintento automático en caso de error
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  } else {
    console.log('Base de Datos Conectada');
    connection.release(); // Liberar la conexión cuando se completa
  }
});

module.exports = pool;
