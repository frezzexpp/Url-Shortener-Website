from django.shortcuts import get_object_or_404, redirect
from rest_framework import generics, viewsets, status, mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from .models import ShortenedURL
from .serializers import ShortUrlDetailSerializer, ShortenedURLSerializer
from rest_framework.generics import ListAPIView



# list all short url and create new short url:
class ShortenURLCreateView(generics.CreateAPIView):
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
        url_instance.clicks += 1
        url_instance.save()
        return redirect(url_instance.original_link)



# Main page get list:
class UserShortUrlListView(generics.ListAPIView):
    serializer_class = ShortUrlDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ShortenedURL.objects.filter(user=self.request.user)

    def get_object(self):
        return self.request.user  # Foydalanuvchini bevosita qaytarish




# main page actions:
class UserShortUrlActionView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ShortUrlDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ShortenedURL.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"error": "Siz bu URL'ni yangilash huquqiga ega emassiz!"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"error": "Siz bu URL'ni o‘chirish huquqiga ega emassiz!"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)




# Last five data:
class LastFiveShortenedURLsView(ListAPIView):
    serializer_class = ShortUrlDetailSerializer

    def get_queryset(self):
        return ShortenedURL.objects.order_by('-created_at')[:5]  # Oxirgi 5 ta URL



