from datetime import timedelta
from pathlib import Path
from django.utils.translation import gettext_lazy as _
import os
import environ
from tutorial.settings import AUTH_PASSWORD_VALIDATORS

# ________________________________________________________________________________
# ________________________________________________________________________________



# from env file
root = environ.Path(__file__) - 2
env = environ.Env()
environ.Env.read_env(env.str(root(), '.env'))
# ________________________________________________________________________________
# ________________________________________________________________________________



# --Base_dir,Secret_key,Debug,Hosts_permission:
SECRET_KEY = env.str('SECRET_KEY')
DEBUG = env.bool('DEBUG', default=True)
ALLOWED_HOSTS = env.str('ALLOWED_HOSTS', default='').split(' ')
BASE_DIR = root()
# ________________________________________________________________________________
# ________________________________________________________________________________



# Application definition:
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# services:
INSTALLED_APPS += [
    'api',
    'common',
    'users',
    'projects',
]

# packages:
INSTALLED_APPS += [
    'rest_framework',
    'drf_spectacular',
    'djoser',
    'rest_framework_simplejwt',
    'rest_framework.authtoken',
    'modeltranslation',


]
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# rest-framework default setting:
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'common.permissions.IsAdminOrAuthenticatedOrReadOnly',),
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',

    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FileUploadParser',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'common.paginations.CustomPagination',
    'PAGE_SIZE': 20,
}
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# middleware:
MIDDLEWARE = [
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# root_urlconfig and templates:
ROOT_URLCONF = 'config.urls'
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

WSGI_APPLICATION = 'config.wsgi.application'
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# Database:
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': env.str('PG_DATABASE', 'postgres'),
        'USER': env.str('PG_USER', 'postgres'),
        'PASSWORD': env.str('PG_PASSWORD', 'postgres'),
        'HOST': env.str('DB_HOST', 'localhost'),
        'PORT': env.int('DB_PORT', 5432),
    },
    'extra': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    },
}
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# Auth settings:
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
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# Internationalization:
LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

MODELTRANSLATION_DEFAULT_LANGUAGE = 'en'

LANGUAGES = [
   ('uz', _('Uzbek')),
   ('en', _('English')),
   ('ru', _('Russian')),
]
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# Static files (CSS, JavaScript, Images):
STATIC_URL = 'static/'
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# Default primary key field type:
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# swagger setting
SPECTACULAR_SETTINGS = {
    'TITLE': 'Url Shortener',
    'DESCRIPTION': 'Online App',
    'VERSION': '1.0.0',
    "SERVE_INCLUDE_SCHEMA": False,
    'PREPROCESSING_HOOKS': [
        'api.spectacular.hooks.custom_preprocessing_hook',
    ],
    'SERVE_PERMISSIONS': [
        'rest_framework.permissions.IsAuthenticated'],
    'SERVE_AUTHENTICATION': [
        'rest_framework.authentication.BasicAuthentication'],
    'SWAGGER_UI_SETTINGS': {
        'DeepLinking': True,
        'DisplayOperationId': True,
    },
    'COMPONENT_SPLIT_REQUEST': True,
    'SORT_OPERATIONS': False,
}
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# # SimpleJwt setting:
# SIMPLE_JWT = {
#     "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
#     "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
#     "ROTATE_REFRESH_TOKENS": False,
#     "BLACKLIST_AFTER_ROTATION": False,
#     "UPDATE_LAST_LOGIN": False,
#
#     "ALGORITHM": "HS256",
#     "SIGNING_KEY": env("SECRET_KEY"),  # SECRET_KEY .env fayldan olinadi
#     "VERIFYING_KEY": "",
#     "AUDIENCE": None,
#     "ISSUER": None,
#     "JSON_ENCODER": None,
#     "JWK_URL": None,
#     "LEEWAY": 0,
#
#     "AUTH_HEADER_TYPES": ("Bearer",),
#     "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
#     "USER_ID_FIELD": "id",
#     "USER_ID_CLAIM": "user_id",
#     "USER_AUTHENTICATION_RULE": "rest_framework_simplejwt.authentication.default_user_authentication_rule",
#
#     "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
#     "TOKEN_TYPE_CLAIM": "token_type",
#     "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
#
#     "JTI_CLAIM": "jti",
#
#     "SLIDING_TOKEN_REFRESH_EXP_CLAIM": "refresh_exp",
#     "SLIDING_TOKEN_LIFETIME": timedelta(minutes=5),
#     "SLIDING_TOKEN_REFRESH_LIFETIME": timedelta(days=1),
#
#     "TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainPairSerializer",
#     "TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSerializer",
#     "TOKEN_VERIFY_SERIALIZER": "rest_framework_simplejwt.serializers.TokenVerifySerializer",
#     "TOKEN_BLACKLIST_SERIALIZER": "rest_framework_simplejwt.serializers.TokenBlacklistSerializer",
#     "SLIDING_TOKEN_OBTAIN_SERIALIZER": "rest_framework_simplejwt.serializers.TokenObtainSlidingSerializer",
#     "SLIDING_TOKEN_REFRESH_SERIALIZER": "rest_framework_simplejwt.serializers.TokenRefreshSlidingSerializer",
# }

DJOSER = {
    'USER_CREATE_PASSWORD_RETYPE': True,
    'USER_ID_FIELD': 'username',
    'LOGIN_FIELD': 'username',
    'SEND_ACTIVATION_EMAIL': False,
    'PASSWORD_RESET_CONFIRM_URL': '#/password/reset/confirm/{uid}/{token}/',
    'ACTIVATION_URL': '#/activate/{uid}/{token}/',
}
