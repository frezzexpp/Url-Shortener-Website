from django.urls import path
from .views import ShortenURLView, RedirectURLView

urlpatterns = [
    # shorter:
    path('2/shorter/', ShortenURLView.as_view(), name='shorter-url'),

    # short -> org url:
    path('2/<str:short_url>/', RedirectURLView.as_view(), name='redirect-url'),
]