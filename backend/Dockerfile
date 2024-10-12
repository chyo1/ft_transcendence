# base image
FROM python:3.10-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/

RUN pip install --upgrade pip \
  && pip install -r requirements.txt

# Copy the Django project
COPY ./backend /app/

## Command to run Django
#CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]


# Django 애플리케이션의 시작 명령어
#CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

CMD ["python", "manage.py", "runserver_plus", "--cert-file", "/etc/ssl/certs/your_certificate.crt", "0.0.0.0:8000"]
