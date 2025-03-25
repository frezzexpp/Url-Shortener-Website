import os
import environ
from django.utils.translation import gettext_lazy as _


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
SHORT_URL = env.int('SHORT_URL_LENGTH')  #def=6
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
    'rest_framework.authtoken',
    'modeltranslation',
]

# cors:
INSTALLED_APPS += ['corsheaders', ]
CORS_ALLOW_ALL_ORIGINS = True
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# rest-framework default setting:
REST_FRAMEWORK = {
    # 'DEFAULT_PERMISSION_CLASSES': (
    #     'common.permissions.IsAdminOrAuthenticatedOrReadOnly',),
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
        'rest_framework.parsers.FormParser',
        'rest_framework.parsers.MultiPartParser',
        'rest_framework.parsers.FileUploadParser',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    'DEFAULT_PAGINATION_CLASS': 'common.paginations.CustomPagination',
    # 'PAGE_SIZE': 20,
}
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# middleware:
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
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

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = ['*']
CSRF_COOKIE_SECURE = False

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
LANGUAGES = [
    ('en', _('English')),
    ('uz', _('Uzbek')),
    ('ru', _('Russian')),
]

LOCALE_PATHS = [
    os.path.join(BASE_DIR, "locale"),
]

USE_I18N = True
USE_L10N = True
MODELTRANSLATION_DEFAULT_LANGUAGE = 'en'
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------


STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')  # STATIC_ROOT ni aniqlaymiz

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



# Default primary key field type:
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
# ------------------------------------------------------------------------------------------------
# ------------------------------------------------------------------------------------------------



DJOSER = {
    'USER_CREATE_PASSWORD_RETYPE': True,
    'USER_ID_FIELD': 'username',
    'LOGIN_FIELD': 'username',
    'SEND_ACTIVATION_EMAIL': False,
    'PASSWORD_RESET_CONFIRM_URL': '#/password/reset/confirm/{uid}/{token}/',
    'ACTIVATION_URL': '#/activate/{uid}/{token}/',
}


