from django.shortcuts import get_object_or_404, redirect
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.viewsets import GenericViewSet
from .models import ShortenedURL
from .serializers import ShortUrlDetailSerializer, ShortenedURLSerializer



# list all short url and create new short url:
@extend_schema_view(
    create=extend_schema(summary="Create a new shortened URL", tags=["URL Shortener"]),
)
class ShortenURLListView(generics.CreateAPIView):
    queryset = ShortenedURL.objects.all()
    serializer_class = ShortenedURLSerializer

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(
            {"message": "Success! Your shortened URL has been created."},
            status=status.HTTP_201_CREATED
        )



# Short url to original url:
@extend_schema_view(summary="Redirect a shortened URL", tags=["URL Shortener"])
class RedirectShortURLView(APIView):
    def get(self, request, short_link):
        url_instance = get_object_or_404(ShortenedURL, short_link=short_link, status=True)
        url_instance.save()
        return redirect(url_instance.original_link)



# ShortUrl details CRUD:
@extend_schema_view(
    list=extend_schema(summary='List Short Urls', tags=['Short Url Details']),
)
class ShortUrlCrud(viewsets.mixins.ListModelMixin,
                   GenericViewSet):
    queryset = ShortenedURL.objects.all()
    serializer_class = ShortUrlDetailSerializer
