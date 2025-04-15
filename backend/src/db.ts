import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Docker MySQL 연결 설정
const pool = mysql.createPool({
<<<<<<< HEAD
  host: process.env.DB_HOST || (isDocker ? 'mysql' : '127.0.0.1'),
  port: parseInt(process.env.DB_PORT || (isDocker ? '3307' : '3307')),
  user: process.env.DB_USER || 'awana',
  password: process.env.DB_PASSWORD || 'awana',
  database: process.env.DB_NAME || 'awana_db',
=======
  host: 'localhost',  // Docker MySQL은 호스트의 localhost:3307에 매핑됨
  port: 3307,         // Docker MySQL 포트
  user: 'awana',      // Docker MySQL 사용자
  password: 'awana',  // Docker MySQL 비밀번호
  database: 'awana_db',
>>>>>>> a66c51ea50d95b44cb738aa92169ff4c853c41c7
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export default pool; 