# 1단계: Node.js를 사용하여 Webpack 빌드
FROM node:14 AS build-stage

# 작업 디렉토리 설정
WORKDIR /app/frontend

# package.json과 package-lock.json 파일을 복사
COPY frontend/package*.json ./
COPY frontend/webpack.config.js ./

# 의존성 설치
RUN npm install

# 애플리케이션 소스 코드 복사
COPY frontend/ ./

# Webpack을 사용하여 빌드 (Webpack 설정에 따라 다름)
RUN npm run build

# Nginx를 기반으로 한 이미지 사용
FROM nginx:alpine

# 1단계에서 빌드된 파일들을 Nginx의 html 디렉토리로 복사
RUN mkdir /usr/share/build
COPY frontend/index.html /usr/share/build
COPY --from=build-stage /app/frontend/dist /usr/share/build
