from django.shortcuts import get_object_or_404, redirect
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import ShortenedURL
from .serializers import ShortUrlDetailSerializer, ShortenedURLSerializer, StatusSerializer
from rest_framework.generics import ListAPIView




# list all short url and create new short url:
class ShortenURLCreateView(generics.CreateAPIView):
    queryset = ShortenedURL.objects.all()
    serializer_class = ShortenedURLSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # User maydonini to‘ldirish

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



# Main page get list:
class UserShortUrlListView(generics.ListAPIView):
    serializer_class = ShortUrlDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ShortenedURL.objects.filter(user=self.request.user)

    def get_object(self):
        return self.request.user  # Foydalanuvchini bevosita qaytarish




# main page actions:
class UserShortUrlActionDestroyView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ShortUrlDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ShortenedURL.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"error": "Siz bu URL'ni o‘chirish huquqiga ega emassiz!"},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)




# main page actions:
class UserShortUrlActionStatusUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StatusSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ShortenedURL.objects.filter(user=self.request.user).order_by('-created_at')

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"error": "Siz bu URL'ni yangilash huquqiga ega emassiz!"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)



# Last five urls:
class LastFiveShortenedURLsView(ListAPIView):
    serializer_class = ShortUrlDetailSerializer
    permission_classes = [AllowAny]  # Foydalanuvchi authentication talab qilinmaydi

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None

        if user:
            return ShortenedURL.objects.filter(user=user).order_by('-created_at')[:5]
        return ShortenedURL.objects.order_by('-created_at')[:5]







