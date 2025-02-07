from django.urls import path, include
from .views import ShortenURLListView, RedirectShortURLView, ShortUrlCrud
from rest_framework import routers


router = routers.SimpleRouter()
router.register(r'shorturldetails', ShortUrlCrud, basename='shorturldetail')

urlpatterns = [
    path('shorten/', ShortenURLListView.as_view(), name='shorten-url'),
    path('<str:short_link>/', RedirectShortURLView.as_view(), name='redirect-url'),
    path('product/', include(router.urls))
]





