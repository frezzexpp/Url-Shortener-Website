from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^auth/', include('djoser.urls')),

    # JWT urls:
    path('auth/jwt/create/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

urlpatterns += i18n_patterns(
    path("i18n/", include('django.conf.urls.i18n')),

    # api urls:
    path('api/', include('api.urls')),

    # swagger schema:
    path('schema/', SpectacularAPIView.as_view(), name='schema')
)