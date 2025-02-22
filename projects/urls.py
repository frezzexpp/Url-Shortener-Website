from django.urls import path, include
from .views import ShortenURLListView, ShortUrlCrud, RedirectShortURLView, LastFiveShortenedURLsView
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'urls', ShortUrlCrud, basename='shorturldetail')

urlpatterns = [
    path('shorter/', ShortenURLListView.as_view(), name='shorten-url'),
    path('shorten/', include(router.urls)),  # Router oldin kelishi kerak
    path('last-five-urls/', LastFiveShortenedURLsView.as_view(), name='last-five-urls'),
    path('<str:short_link>/', RedirectShortURLView.as_view(), name='redirect-url'),  # Prefix qo‘shildi
]





