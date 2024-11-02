# base image
FROM python:3.10-slim

# Set work directory
WORKDIR /app

# 시스템 패키지 업데이트 및 OpenSSL 설치
RUN apt-get update && apt-get install -y \
    libssl-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*


# Install dependencies
COPY requirements.txt /app/

RUN pip install --upgrade pip \
  && pip install -r requirements.txt

# Copy the Django project
COPY ./backend /app/

# Entrypoint 설정
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh
ENTRYPOINT ["/app/docker-entrypoint.sh"]

# Django 애플리케이션의 시작 명령어
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

CMD ["python", "manage.py", "runserver_plus", "0.0.0.0:8000"]
