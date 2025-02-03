from django.shortcuts import get_object_or_404, redirect
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema_view, extend_schema
from .models import ShortenedURL
from .serializers import ShortenedURLSerializer



# list all short url and create new short url:
@extend_schema_view(
    list=extend_schema(summary="List all shortened URLs", tags=["URL Shortener"]),
    create=extend_schema(summary="Create a new shortened URL", tags=["URL Shortener"]),
)
class ShortenURLListView(generics.ListCreateAPIView):
    queryset = ShortenedURL.objects.all()
    serializer_class = ShortenedURLSerializer



# Short url to original url:
@extend_schema(summary="Redirect a shortened URL", tags=["URL Shortener"])
class RedirectShortURLView(APIView):
    def get(self, request, short_link):
        url_instance = get_object_or_404(ShortenedURL, short_link=short_link, status=True)
        url_instance.clicks += 1
        url_instance.save()
        return redirect(url_instance.original_link)
