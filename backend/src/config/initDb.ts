import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'awana_db';

const initDatabase = () => {
  const sqlFilePath = path.join(__dirname, 'init-db.sql');
  
  // SQL 파일 읽기
  const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
  
  // MySQL 명령어 구성
  const command = `mysql -h ${DB_HOST} -u ${DB_USER} ${DB_PASSWORD ? `-p${DB_PASSWORD}` : ''} < "${sqlFilePath}"`;
  
  console.log('데이터베이스 초기화 중...');
  
  // 명령어 실행
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('데이터베이스 초기화 중 오류 발생:', error);
      return;
    }
    
    if (stderr) {
      console.error('데이터베이스 초기화 중 경고:', stderr);
    }
    
    console.log('데이터베이스 초기화 완료!');
    console.log(stdout);
  });
};

// 스크립트가 직접 실행될 때만 초기화 함수 호출
if (require.main === module) {
  initDatabase();
}

export default initDatabase; 