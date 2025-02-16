from django.urls import path, include
from api.spectacular.urls import urlpatterns as doc_urls
from projects.urls import urlpatterns as shortened_urls
from users.urls import urlpatterns as users_urls

app_name = 'api'

urlpatterns = [
]

urlpatterns += users_urls
urlpatterns += shortened_urls
