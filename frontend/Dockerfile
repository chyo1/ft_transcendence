# Nginx를 기반으로 한 이미지 사용
FROM nginx:alpine

# Nginx 설정 파일 복사 (선택 사항)
#COPY ../nginx/nginx.conf /etc/nginx/nginx.conf

# 정적 파일을 Nginx의 기본 경로로 복사
COPY ./frontend /usr/share/nginx/html

# 기본적으로 Nginx는 80번 포트에서 실행됨
EXPOSE 80

# Nginx 시작
CMD ["nginx", "-g", "daemon off;"]
