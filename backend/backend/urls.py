"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# urls.py

from django.urls import path, include
from . import views

urlpatterns = [

    path('', views.home_view, name='home'),  # 기본 URL에 대한 뷰

    path('api/login', views.login_view, name='login'),
    # # 기존 URL들
    # path('auth/', include('social_django.urls', namespace='social')),  # OAuth 경로
    # path('dashboard/', views.dashboard, name='dashboard'),  # 로그인 후 대시보드
]
