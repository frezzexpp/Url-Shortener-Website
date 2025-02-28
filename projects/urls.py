from django.urls import path
from .views import (
    ShortenURLCreateView,
    UserShortUrlListView,
    UserShortUrlActionView,
    RedirectShortURLView,
    LastFiveShortenedURLsView
)

urlpatterns = [
    path('shorter/', ShortenURLCreateView.as_view(), name='shorten-url'),
    path('shorten/list/', UserShortUrlListView.as_view(), name='user-short-url-list'),  # Faqat GET uchun
    path('shorten/<int:pk>/', UserShortUrlActionView.as_view(), name='user-short-url-action'),  # Update & Delete uchun
    path('last-five-urls/', LastFiveShortenedURLsView.as_view(), name='last-five-urls'),
    path('<str:short_link>/', RedirectShortURLView.as_view(), name='redirect-url'),
]
