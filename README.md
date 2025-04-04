# AWANA Events

이벤트 관리 시스템

## 시스템 요구사항

- Docker
- Docker Compose
- Git

## 설치 및 실행 방법

1. 저장소 클론
```bash
git clone [repository-url]
cd AWANAEvents
```

2. Docker 컨테이너 실행
```bash
docker-compose up -d
```

3. 접속 정보
- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:5000
- MySQL: localhost:3306

## 개발 환경 설정

1. 프론트엔드 개발
```bash
cd frontend/awana-app
npm install
npm start
```

2. 백엔드 개발
```bash
cd backend
npm install
npm start
```

## Git 배포 방법

1. 원격 저장소 설정
```bash
git remote add origin [repository-url]
```

2. 변경사항 커밋
```bash
git add .
git commit -m "Initial commit"
```

3. 메인 브랜치에 푸시
```bash
git push -u origin main
```

## 컨테이너 관리

- 모든 컨테이너 중지
```bash
docker-compose down
```

- 컨테이너 로그 확인
```bash
docker-compose logs -f
```

- 특정 서비스 재시작
```bash
docker-compose restart [service-name]
```

## 데이터베이스 백업

```bash
docker-compose exec mysql mysqldump -u root -ppassword awana_events > backup.sql
```

## 데이터베이스 복원

```bash
docker-compose exec -T mysql mysql -u root -ppassword awana_events < backup.sql
``` 