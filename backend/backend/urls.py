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

    path('oauth', views.login_view, name='login'),
    path('api/oauth', views.complete_oauth, name='complete_oauth'),

    path('2fa/verify', views.verify_2fa_code, name='verify_2fa_code'),
]
