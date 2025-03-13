from django.urls import path
from .views import *

urlpatterns = [
    # short url create and get list urls:
    path('shorter/', ShortenURLCreateView.as_view(), name='shorten-url'),
    path('shorten/list/', UserShortUrlListView.as_view(), name='user-short-url-list'),  # Faqat GET uchun

    # Actions urls:
    path('shorten/delete/<int:pk>/', UserShortUrlActionDestroyView.as_view(), name='user-short-url-action'),  # Delete uchun
    path('status/update/<int:pk>/', UserShortUrlActionStatusUpdateView.as_view(), name='user-short-url-status-action'),  # Update uchun

    path('last-five-urls/', LastFiveShortenedURLsView.as_view(), name='last-five-urls'),

    # short link to org link url:
    path('<str:short_link>/', RedirectShortURLView.as_view(), name='redirect-url'),

]
