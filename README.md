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

### 로컬 개발 환경

1. 프론트엔드 설정:
```bash
cd frontend/awana-app
npm install
npm start
```

2. 백엔드 설정:
```bash
cd backend
npm install
npm run dev
```

3. MySQL 설정 (로컬):
- 포트: 3306
- 사용자: root
- 비밀번호: root
- 데이터베이스: awana_db

### 도커 환경

1. Docker Compose로 실행:
```bash
docker compose up -d --build
```

2. 환경 변수 설정:
```bash
# .env 파일 생성
# 로컬 환경
DB_HOST=localhost
DB_PORT=3306

# 도커 환경
DB_HOST=mysql
DB_PORT=3306
```

3. 컨테이너 포트 매핑:
- 프론트엔드: 3000
- 백엔드: 5000
- MySQL: 3307 (호스트) -> 3306 (컨테이너)

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

### 일반적인 문제
1. MySQL 연결 오류
   - 포트 확인 (로컬: 3306, 도커: 3307)
   - 사용자 권한 확인
   - 데이터베이스 존재 여부 확인

2. API 404 오류
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