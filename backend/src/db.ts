import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Docker MySQL 연결 설정
const pool = mysql.createPool({
  host: 'localhost',  // Docker MySQL은 호스트의 localhost:3307에 매핑됨
  port: 3307,         // Docker MySQL 포트
  user: 'awana',      // Docker MySQL 사용자
  password: 'awana',  // Docker MySQL 비밀번호
  database: 'awana_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export default pool; 