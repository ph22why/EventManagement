# AWANA Events

AWANA 이벤트 관리 시스템입니다.

## 기능

- 이벤트 관리 (생성, 수정, 삭제)
- 이벤트 목록 조회
- 영수증 발급
- 관리자 대시보드

## 기술 스택

- Frontend: React.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Sequelize
- Database: MySQL
- Infrastructure: Docker, Docker Compose

## 배포 방법

1. Git 저장소 클론:
```bash
git clone <repository-url>
cd AWANAEvents
```

2. Docker Compose로 실행:
```bash
docker compose up -d --build
```

3. 애플리케이션 접속:
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:5000

## 환경 변수

필요한 경우 다음 환경 변수를 수정할 수 있습니다:

### Backend (.env)
```
NODE_ENV=development
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=root
DB_NAME=awana_db
DB_PORT=3306
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## 개발 환경 설정

1. 프론트엔드 개발:
```bash
cd frontend/awana-app
npm install
npm start
```

2. 백엔드 개발:
```bash
cd backend
npm install
npm run dev
```

## 도커 컨테이너 관리

- 컨테이너 시작: `docker compose up -d`
- 컨테이너 중지: `docker compose down`
- 로그 확인: `docker compose logs`
- 컨테이너 재시작: `docker compose restart`

## 데이터베이스 백업 및 복원

1. 데이터베이스 백업:
```bash
docker compose exec mysql mysqldump -u root -proot awana_db > backup.sql
```

2. 데이터베이스 복원:
```bash
docker compose exec -T mysql mysql -u root -proot awana_db < backup.sql
``` 