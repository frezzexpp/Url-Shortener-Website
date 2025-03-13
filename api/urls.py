from projects.urls import urlpatterns as shortened_urls
from users.urls import urlpatterns as users_urls
from projects.short_link.urls import urlpatterns as project_short_link

app_name = 'api'

urlpatterns = [
]

# services urls:
urlpatterns += users_urls
urlpatterns += shortened_urls
urlpatterns += project_short_link
