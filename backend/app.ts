import express from 'express';
import cors from 'cors';
import eventRoutes from './routes/eventRoutes';
import churchRoutes from './routes/churches';
import receiptRoutes from './routes/receiptRoutes';

const app = express();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 미들웨어 설정
app.use(express.json());

// 라우트 설정
app.use('/api/events', eventRoutes);
app.use('/api/churches', churchRoutes);
app.use('/api', receiptRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'AWANA Events API' });
});

// 에러 핸들링 미들웨어
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: '서버 오류가 발생했습니다.',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`CORS 설정: http://localhost:3000에서의 요청만 허용`);
});

export default app; 