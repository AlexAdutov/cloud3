"""
Django settings for cloud project.

Generated by 'django-admin startproject' using Django 5.0.1.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""

from pathlib import Path
import os
from dotenv import load_dotenv

# �������� ���������� ����� �� ����� .env
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# ���� � �������� ���������� �������
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# �������� ��������� ��� ����������
SECRET_KEY = os.getenv('SECRET_KEY')  # ��������� ���� ����������
DEBUG = os.getenv('DEBUG')  # ����� �������
ALLOWED_HOSTS = [os.getenv('ALLOWED_HOSTS')]  # ����������� ����� ��� ����������

# Application definition
# ������������� ����������
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'cloud_api.apps.CloudApiConfig',
    'rest_framework',
    'corsheaders',
]

# ������������� ����������� ����������� (middleware)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# �������� URL-������
ROOT_URLCONF = 'cloud.urls'

# �������
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# ���������� WSGI (Web Server Gateway Interface)
WSGI_APPLICATION = 'cloud.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases
# ��������� ���� ������

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE'),
        'NAME': os.getenv('DB_NAME'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators
# ��������� ��������� ������� �������������

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/
# ��������� �������������������

LANGUAGE_CODE = os.getenv('LANGUAGE_CODE')

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/
# ����������� ����� (CSS, JavaScript, �����������)

STATIC_URL = '/django-static/'
STATIC_ROOT = 'staticfiles'

# Media files
# �����-�����

MEDIA_URL = f'/{os.getenv("CLOUD_DIR")}/'
MEDIA_ROOT = os.path.join(BASE_DIR, os.getenv('CLOUD_DIR'))


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field
# ��� ���� �� ��������� ��� ��������� ������

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Add custom user
# ���������� ��������� ������ ������������
AUTH_USER_MODEL = 'cloud_api.CloudUser'


# DRF settings
# ��������� DRF (Django REST Framework)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ]
}

# ��������� ������������ ������� CSRF � ������
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = True
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost',
    'http://127.0.0.1',
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost',
    'http://127.0.0.1',
]

# PROD ONLY
CSRF_COOKIE_SECURE = os.getenv('CSRF_COOKIE_SECURE')
SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE')


# LOGGING

# ��������� �����������
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,

    'formatters': {
        'console_format': {
            'format': '{asctime} : {levelname} : {module} : {filename} : {message}',
            'style': '{',
        },
    },

    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'console_format',
        },
    },

    'loggers': {
        'main': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'DEBUG'),
            'propagate': True,
        },
    },
}
