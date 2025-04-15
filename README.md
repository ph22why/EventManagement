# AWANA Events v1.1

AWANA 이벤트 관리 시스템입니다.

## 주요 기능 (v1.1)

- 이벤트 관리 (생성, 수정, 삭제)
  - 샘플 이벤트 템플릿 제공
  - 이벤트 연도별 관리
  - 이벤트 공개/비공개 설정
- 이벤트 목록 조회
  - 연도별 필터링
  - 이벤트 상세 정보 표시
- 영수증 발급
  - 교회별 영수증 관리
  - 영수증 번호 자동 생성
- 관리자 대시보드
  - 이벤트 통계
  - 참가자 관리

## 기술 스택

- Frontend: React.js, TypeScript, Tailwind CSS, Ant Design
- Backend: Node.js, Express, TypeScript, MySQL2
- Database: MySQL 8.0
- Infrastructure: Docker, Docker Compose

## 개발 환경 설정

### 공통 설정 (Docker MySQL)
1. MySQL 컨테이너 실행:
```bash
# MySQL 컨테이너만 실행
docker compose up -d mysql

# MySQL 상태 확인
docker compose ps mysql
```

2. MySQL 환경 변수 설정:
```bash
# .env 파일 생성 (backend/.env)
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=root
DB_NAME=awana_db
```

### 프론트엔드 개발
```bash
cd frontend/awana-app
npm install
npm start
```

### 백엔드 개발
```bash
cd backend
npm install
npm run dev
```

### 포트 설정
- 프론트엔드: http://localhost:3000
- 백엔드: http://localhost:5000
- MySQL: localhost:3307 (Docker 컨테이너)

### 데이터베이스 연결 확인
```bash
# MySQL 컨테이너 접속
docker compose exec mysql mysql -u root -proot

# 데이터베이스 확인
SHOW DATABASES;
USE awana_db;
SHOW TABLES;
```

## 데이터베이스 테이블 구조

### EventDB
- event_ID (PK)
- event_Name
- event_Date
- event_Year
- event_Location
- event_Place
- event_Registration_Start_Date
- event_Registration_End_Date
- event_Start_Date
- event_End_Date
- event_Max_Participants
- event_Registration_Fee
- event_Is_Public

### SampleEventDB
- sampleEvent_ID (PK)
- sampleEvent_Name
- sampleEvent_Date
- sampleEvent_Year
- sampleEvent_Location
- sampleEvent_Place
- sampleEvent_Registration_Start_Date
- sampleEvent_Registration_End_Date
- sampleEvent_Start_Date
- sampleEvent_End_Date
- sampleEvent_Max_Participants
- sampleEvent_Registration_Fee
- sampleEvent_Open_Available

## API 엔드포인트

### 이벤트 관련
- GET /api/events - 모든 이벤트 조회
- GET /api/events/sampleEvents - 샘플 이벤트 조회
- GET /api/events/:id - 특정 이벤트 조회
- POST /api/events - 새 이벤트 생성
- PUT /api/events/:id - 이벤트 수정
- DELETE /api/events/:id - 이벤트 삭제

### 영수증 관련
- GET /api/receipts - 모든 영수증 조회
- GET /api/receipts/:id - 특정 영수증 조회
- POST /api/receipts - 새 영수증 생성
- PUT /api/receipts/:id - 영수증 수정
- DELETE /api/receipts/:id - 영수증 삭제

## 도커 컨테이너 관리

- 컨테이너 시작: `docker compose up -d`
- 컨테이너 중지: `docker compose down`
- 로그 확인: `docker compose logs`
- 컨테이너 재시작: `docker compose restart`
- 특정 서비스 재시작: `docker compose restart [service_name]`

## 데이터베이스 백업 및 복원

1. 데이터베이스 백업:
```bash
docker compose exec mysql mysqldump -u root -proot awana_db > backup.sql
```

2. 데이터베이스 복원:
```bash
docker compose exec -T mysql mysql -u root -proot awana_db < backup.sql
```

## 문제 해결

### MySQL 연결 문제
1. Docker MySQL 상태 확인:
```bash
docker compose ps mysql
docker compose logs mysql
```

2. 연결 테스트:
```bash
# MySQL 클라이언트로 테스트
mysql -h localhost -P 3307 -u root -proot
```

3. 일반적인 문제:
- 포트 충돌: 3307 포트가 다른 프로세스에 의해 사용 중인지 확인
- 컨테이너 상태: MySQL 컨테이너가 정상적으로 실행 중인지 확인
- 방화벽 설정: 로컬 개발 환경의 방화벽이 3307 포트를 허용하는지 확인

### 일반적인 문제
1. API 404 오류
   - 라우트 순서 확인
   - 엔드포인트 URL 확인
   - 서버 재시작

3. CORS 오류
   - 프론트엔드 URL이 백엔드 CORS 설정에 포함되어 있는지 확인
   - 환경 변수 확인

### 로그 확인
```bash
# 백엔드 로그
docker compose logs backend

# MySQL 로그
docker compose logs mysql

# 프론트엔드 로그
docker compose logs frontend
``` 