# views.py

import requests
from django.conf import settings
from django.http import JsonResponse
from urllib.parse import urlencode
from django.contrib.auth.models import User
from django.shortcuts import redirect, get_object_or_404
from .models import UserProfile
from django.http import HttpResponse

def home_view(request):
  return HttpResponse("<h1>Welcome to the Home Page!</h1>")

def login_view(request):
#   # OAuth 로그인 시작: 첫 요청
#   if 'code' not in request.GET:
#     # 인증 서버로 보낼 URL 구성
#     oauth_url = 'https://oauth-provider.com/auth'
#     params = {
#       'response_type': 'code',  # authorization code 요청
#       'client_id': settings.OAUTH_CLIENT_ID,  # 클라이언트 ID
#       'redirect_uri': settings.OAUTH_REDIRECT_URI,  # 리다이렉트 URI
#       'scope': 'profile email',  # 요청할 범위
#     }
#
#     # 인증 서버로 리다이렉트
#     auth_url = f"{oauth_url}?{urlencode(params)}"
#     return redirect(auth_url)
#
#   # OAuth 인증 후 돌아온 요청 (code가 포함된 경우)
#   else:
#     # 인증 서버에서 전달된 authorization code를 받음
#     authorization_code = request.GET.get('code')
#
#     # 받은 authorization code로 access token을 요청
#     token_url = 'https://oauth-provider.com/token'
#     data = {
#       'grant_type': 'authorization_code',
#       'code': authorization_code,
#       'redirect_uri': settings.OAUTH_REDIRECT_URI,
#       'client_id': settings.OAUTH_CLIENT_ID,
#       'client_secret': settings.OAUTH_CLIENT_SECRET,
#     }
#
#     # POST 요청으로 access token을 받아옴
#     response = requests.post(token_url, data=data)
#     token_data = response.json()
#
#     # 응답에서 access token을 확인
#     if 'access_token' in token_data:
#       access_token = token_data['access_token']
#
#       # 사용자 정보를 요청하는 API URL
#       user_info_url = 'https://oauth-provider.com/userinfo'
#       headers = {
#         'Authorization': f'Bearer {access_token}'  # Bearer token 방식으로 인증
#       }
#
#       # 사용자 정보 요청
#       user_info_response = requests.get(user_info_url, headers=headers)
#       user_info = user_info_response.json()
#
#       # User 객체 찾기 또는 생성
#       user_email = user_info['email']
#       user, created = User.objects.get_or_create(username=user_email,
#                                                  defaults={'email': user_email})
#
#       if created:
#         # User가 없으면 2단계 인증을 진행
#         if login_2fa(user_info):
#           # 2단계 인증이 성공하면 UserProfile에 정보 저장
#           user_profile, _ = UserProfile.objects.get_or_create(user=user)
#           user_profile.access_token = access_token
#           user_profile.save()
#           return JsonResponse({
#             'user': {
#               'username': user.username,
#               'email': user.email,
#               'name': user_info.get('name'),  # API에서 받아온 사용자 이름
#             }
#           })
#         else:
#           return JsonResponse({'error': '2FA failed'}, status=400)
#
#       else:
#         # User가 이미 존재할 경우 UserProfile 업데이트
#         user_profile, _ = UserProfile.objects.get_or_create(user=user)
#         user_profile.access_token = access_token
#         user_profile.save()
#
#         return JsonResponse({
#           'user': {
#             'username': user.username,
#             'email': user.email,
#             'name': user_info.get('name'),  # API에서 받아온 사용자 이름
#           }
#         })
#
#     else:
#       return JsonResponse({'error': 'Failed to retrieve access token'},
#                           status=400)
#
# def login_2fa(user_info):
#     # 여기에 2단계 인증 로직을 구현합니다.
#     # 인증에 성공하면 True, 실패하면 False를 반환합니다.
#
#     # 예시: 사용자에게 2FA 코드를 보내고 입력받기
#     two_fa_code = input("Enter the 2FA code sent to your email or phone: ")
#
#     # 여기서 2FA 코드 검증 로직을 구현합니다.
#     if verify_two_fa_code(user_info['email'], two_fa_code):
#       return True
#     return False
#
#
# def verify_two_fa_code(email, code):
#   # 여기에 실제 2FA 코드 검증 로직을 구현합니다.
#   # 예를 들어, 데이터베이스에 저장된 코드와 비교하거나 API 요청을 통해 검증할 수 있습니다.
#
#   # 이 부분은 단순화된 예시입니다.
#   return code == "123456"  # 실제 검증 로직에 맞게 수정