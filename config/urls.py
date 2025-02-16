from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.urls import path, include, re_path
from drf_spectacular.views import SpectacularAPIView


urlpatterns = [
    # admin:
    path('admin/', admin.site.urls),

    # djoser:
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),

    # api urls:
    path('api/', include('api.urls')),

    # swagger schema:
    # path('schema/', SpectacularAPIView.as_view(), name='schema')

]

