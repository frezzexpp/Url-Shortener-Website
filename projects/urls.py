from django.urls import path
from .views import ShortenURLListView, RedirectShortURLView

urlpatterns = [
    path('shorten/', ShortenURLListView.as_view(), name='shorten-url'),
    path('<str:short_link>/', RedirectShortURLView.as_view(), name='redirect-url'),
]
