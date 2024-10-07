# Debian 기반 Nginx 이미지 사용
FROM nginx:latest

# OpenSSL 설치
RUN apt-get update  \
    && apt-get install -y openssl  \
    && apt-get clean

# SSL 인증서 및 개인 키 생성
RUN openssl req -x509  \
    -newkey rsa:2048  \
    -keyout /etc/ssl/private/your_private.key \
    -out /etc/ssl/certs/your_certificate.crt  \
    -days 365 -nodes \
    -subj "/C=KR/ST=Seoul/L=Seoul/O=Your Company Name/CN=localhost"

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/nginx.conf

# Nginx는 기본적으로 80번 포트와 443번 포트에서 실행됨
EXPOSE 80
EXPOSE 443

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]
