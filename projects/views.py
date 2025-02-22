from django.shortcuts import get_object_or_404, redirect
from rest_framework import generics, viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from .models import ShortenedURL
from .serializers import ShortUrlDetailSerializer, ShortenedURLSerializer
from rest_framework.generics import ListAPIView



# list all short url and create new short url:
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
class RedirectShortURLView(APIView):
    def get(self, request, short_link):
        url_instance = get_object_or_404(ShortenedURL, short_link=short_link, status=True)
        url_instance.save()
        return redirect(url_instance.original_link)



# ShortUrl details CRUD:
class ShortUrlCrud(viewsets.ModelViewSet):
    queryset = ShortenedURL.objects.all()
    serializer_class = ShortUrlDetailSerializer




# Last five data:
class LastFiveShortenedURLsView(ListAPIView):
    serializer_class = ShortUrlDetailSerializer

    def get_queryset(self):
        return ShortenedURL.objects.order_by('-created_at')[:5]  # Oxirgi 5 ta URL



