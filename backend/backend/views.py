# views.py

import requests
from urllib.parse import urlencode
from django.contrib.auth.models import User
from django.shortcuts import redirect, get_object_or_404
from .models import UserProfile
from django.http import HttpResponse, HttpResponseRedirect
import logging
import random
import json
from django.core.mail import send_mail
from django.conf import settings
from django import forms
from django.http import JsonResponse
from django.shortcuts import render
from django.core.mail import BadHeaderError
from smtplib import SMTPException
from rest_framework_simplejwt.tokens import RefreshToken


logger = logging.getLogger(__name__)

def home_view(request):
  return HttpResponse("<h1>Welcome to the Home Page!</h1>")

def login_view(request):
  # OAuth 로그인 시작: 첫 요청
  if 'code' not in request.GET:
    return start_ouath(request)

  # OAuth 인증 후 돌아온 요청 (code가 포함된 경우)
  else:
    return complete_oauth(request)

def start_ouath(request):
  # 인증 서버로 보낼 URL 구성
  oauth_url = settings.OAUTH_URI
  params = {
    'response_type': 'code',  # authorization code 요청
    'client_id': settings.CLIENT_ID,  # 클라이언트 ID
    'redirect_uri': settings.LOGIN_REDIRECT_URL,  # 리다이렉트 URI
    'scope': 'public',  # 요청할 범위
  }

  # 인증 서버로 리다이렉트
  auth_url = f"{oauth_url}?{urlencode(params)}"
  return redirect(auth_url)

def complete_oauth(request):
  # 인증 서버에서 전달된 authorization code를 받음
  authorization_code = request.GET.get('code')
  access_token = request_access_token(authorization_code)

  # 응답에서 access token을 확인
  if access_token:
    user_info = request_user_info(access_token)
    user, created = get_or_create_user_object(user_info)

    try:
      # UserProfile 객체 찾기
      user_profile = UserProfile.objects.get(user=user)
      response = HttpResponseRedirect('https://localhost')
      response.set_cookie('user_data', json.dumps(update_user_info(user_profile, access_token)),
      httponly=True,
      secure=True,  # 로컬 개발에서는 False로 설정
      samesite='None',
      path='/',  # 필요 시 모든 경로에 쿠키 적용
      )
      return response

    # UserProfile이 없을 경우 2단계 인증 진행
    except UserProfile.DoesNotExist:
      save_user_info_to_sessioin(request, user, access_token)
      return login_2fa(request, user)  # 2단계 인증 시작

  else:
    return JsonResponse({'error': 'Failed to retrieve access token'},
                        status=400)

def request_access_token(authorization_code):
  # 받은 authorization code로 access token을 요청
  token_url = settings.TOKEN_URI
  data = {
    'grant_type': 'authorization_code',
    'code': authorization_code,
    'redirect_uri': settings.LOGIN_REDIRECT_URL,
    'client_id': settings.CLIENT_ID,
    'client_secret': settings.CLIENT_SECRET,
  }

  # POST 요청으로 access token을 받아옴
  response = requests.post(token_url, data=data)
  token_data = response.json()
  return token_data['access_token']

def request_user_info(access_token):
  # 사용자 정보를 요청하는 API URL
  user_info_url = settings.USER_INFO_URL
  headers = {
    'Authorization': f'Bearer {access_token}'  # Bearer token 방식으로 인증
  }

  # 사용자 정보 요청
  user_info_response = requests.get(user_info_url, headers=headers)
  return user_info_response.json()

def get_or_create_user_object(user_info):
  # User 객체 찾기 또는 생성
  return User.objects.get_or_create(
      username=user_info['login'],  # OAuth에서 받은 username
      defaults={
        'first_name': user_info['first_name'],
        'last_name': user_info['last_name'],
        'email': user_info['email'],
        'username': user_info['login'],
      }
  )

def update_user_info(user_profile, access_token):
  # UserProfile이 존재할 경우 access_token 업데이트
  user_profile.access_token = access_token
  user_profile.save()  # 변경 사항 저장

  return {
    'user': {
      'username': user_profile.user.username,
      'email': user_profile.user.email,
      'first_name': user_profile.user.first_name,
      'last_name': user_profile.user.last_name,  # API에서 받아온 사용자 이름
    }
  }

def save_user_info_to_sessioin(request, user, access_token):
  request.session['user_id'] = user.id  # 사용자 ID를 세션에 저장
  request.session['username'] = user.username  # 사용자 ID를 세션에 저장
  request.session['email'] = user.email  # 이메일을 세션에 저장
  request.session['first_name'] = user.first_name  # 이름을 세션에 저장
  request.session['last_name'] = user.last_name  # 성을 세션에 저장
  request.session['access_token'] = access_token  # access_token을 세션에 저장
# ----------------- 2FA -----------------

# 2FA 시작 함수
def login_2fa(request, user):
  user_email = user.email
  code = send_2fa_code(user_email)

  # 세션에 코드 저장
  request.session['2fa_code'] = code  # 예시
  return redirect('verify_2fa_code')

# 2FA 코드 전송 함수
def send_2fa_code(user_email):
  # 6자리 랜덤 숫자 생성
  code = random.randint(100000, 999999)

  try:
    # 이메일 전송
    send_mail(
        'Your 2FA Code',
        f'Your 2FA code is {code}.',
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
    )
    return code  # 생성된 코드를 반환
  except BadHeaderError:
    print("Invalid header found.")
    return None
  except SMTPException as e:
    print(f"Email sending failed: {e}")
    return None

# 2FA 코드 입력 폼
class TwoFactorAuthForm(forms.Form):
  code = forms.CharField(max_length=6, required=True,
                         label='Enter your 2FA code')

# 2FA 코드 검증 함수
def verify_2fa_code(request):
  if request.method == 'POST':
    return process_2fa_code(request)
  else:
   return render_2fa_form(request)

def process_2fa_code(request):
  form = TwoFactorAuthForm(request.POST)
  if form.is_valid():
    entered_code = form.cleaned_data['code']
    stored_code = request.session.get('2fa_code')

    # 코드가 일치하는 경우
    if entered_code == str(stored_code):
      return complete_auth_login(request)

    # 코드가 일치하지 않는 경우
    else:
      return JsonResponse({'error': 'Invalid 2FA code'}, status=400)

def complete_auth_login(request):
  if '2fa_code' in request.session:
    del request.session['2fa_code']  # 세션에서 코드 삭제

  # UserProfile 생성
  user_id = request.session.get('user_id')  # 세션에서 사용자 ID 가져오기
  user = User.objects.get(id=user_id)  # User 객체 가져오기
  access_token = request.session.get('access_token')

  user_profile = UserProfile(user=user, access_token=access_token)
  user_profile.save()  # 객체 저장

  # JWT 토큰 발급
  refresh = RefreshToken.for_user(user)
  access_token = refresh.access_token

  # 사용자를 다른 URL로 리디렉션
  response = HttpResponseRedirect('https://localhost')
  # response = JsonResponse({
  #   'message': 'Authentication successful',
  #   'user': {
  #     'username': user.username,
  #     'email': user.email,
  #     'first_name': user.first_name,
  #     'last_name': user.last_name,
  #   }
  # })
  user_data = {
    'user': {
      'username': user_profile.user.username,
      'email': user_profile.user.email,
      'first_name': user_profile.user.first_name,
      'last_name': user_profile.user.last_name,  # API에서 받아온 사용자 이름
    } 
  }

  response.set_cookie(
      'user_data', json.dumps(user_data),
      httponly=True,
      secure=True,  # 로컬 개발에서는 False로 설정
      samesite='None',
      path='/',  # 필요 시 모든 경로에 쿠키 적용
  )

  # 쿠키에 jwt와 refresh 토큰 설정
  response.set_cookie(
      'jwt', str(access_token),
      httponly=True,
      secure=True,  # 로컬 개발에서는 False로 설정
      samesite='None',
      path='/',  # 필요 시 모든 경로에 쿠키 적용
  )
  response.set_cookie(
      'refresh', str(refresh),
      httponly=True,
      secure=True,
      samesite='None',
      path='/'
  )
  return response

def render_2fa_form(request):
  form = TwoFactorAuthForm()
  return render(request, 'verify_2fa.html', {'form': form})