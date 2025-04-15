import mysql from 'mysql2/promise';

// Determine if running in Docker
const isDocker = process.env.DOCKER_ENV === 'true';

const pool = mysql.createPool({
  host: process.env.DB_HOST || (isDocker ? 'mysql' : '127.0.0.1'),
  port: parseInt(process.env.DB_PORT || (isDocker ? '3307' : '3307')),
  user: process.env.DB_USER || 'awana',
  password: process.env.DB_PASSWORD || 'awana',
  database: process.env.DB_NAME || 'awana_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export default pool; 