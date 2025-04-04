import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import eventRoutes from './routes/eventRoutes';
import churchRoutes from './routes/churchRoutes';
import receiptRoutes from './routes/receiptRoutes';

// 환경 변수 로드
dotenv.config();

// Express 앱 생성
const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use('/api/events', eventRoutes);
app.use('/api/churches', churchRoutes);
app.use('/api/receipts', receiptRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('AWANA Events API');
});

// 데이터베이스 연결 및 서버 시작
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('데이터베이스 연결 성공');
    
    // 모델 동기화
    await sequelize.sync();
    console.log('모델 동기화 완료');
    
    app.listen(5000, () => {
      console.log('서버가 5000번 포트에서 실행 중입니다.');
    });
  } catch (error) {
    console.error('서버 시작 중 오류 발생:', error);
  }
};

startServer(); 