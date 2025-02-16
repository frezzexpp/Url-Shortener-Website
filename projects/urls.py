from django.urls import path, include
from .views import ShortenURLListView, ShortUrlCrud, RedirectShortURLView
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'urls', ShortUrlCrud, basename='shorturldetail')

urlpatterns = [
    path('shorter/', ShortenURLListView.as_view(), name='shorten-url'),
    path('<str:short_link>/', RedirectShortURLView.as_view(), name='redirect-url'),
    path('shorten/', include(router.urls))
]





