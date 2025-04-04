# frontend/Dockerfile
FROM node:18-alpine

# 컨테이너 내 작업 디렉터리를 awana-app으로 설정
WORKDIR /app/awana-app

# 프로젝트 파일 복사: package.json과 package-lock.json을 먼저 복사하여 의존성 설치 캐싱 활용
COPY awana-app/package.json awana-app/package-lock.json ./

# 의존성 설치
RUN npm install

# 나머지 프로젝트 파일 복사
COPY awana-app/ ./

EXPOSE 3000

CMD ["npm", "start"]
