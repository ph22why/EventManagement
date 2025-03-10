const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// JSON 파싱 미들웨어
app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Express 서버가 작동 중입니다.');
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 작동 중입니다.`);
});
