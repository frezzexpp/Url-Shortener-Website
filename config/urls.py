from django.contrib import admin
from django.urls import path, include, re_path


urlpatterns = [
    # admin:
    path('admin/', admin.site.urls),

    # djoser:
    re_path(r'^auth/', include('djoser.urls')),
    re_path(r'^auth/', include('djoser.urls.authtoken')),

    # api urls:
    path('api/', include('api.urls')),

]

