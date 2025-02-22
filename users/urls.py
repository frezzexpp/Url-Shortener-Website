from django.urls import path, include
from rest_framework import routers
from users.views import RegisterView, LoginView, LogoutView, UserProfileView

router = routers.SimpleRouter()
router.register(r'profile', UserProfileView, basename='usersprofile')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('user/', include(router.urls))
]
