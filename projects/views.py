from django.db.models.functions import TruncDate
from django.shortcuts import get_object_or_404, redirect
from django.utils.dateparse import parse_date
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
        original_link = self.request.data.get("original_link", "").strip()

        # Agar URL `http://` yoki `https://` bilan boshlanmasa, oldiga `http://` qo‘shamiz
        if not original_link.startswith(("http://", "https://")):
            original_link = "http://" + original_link

        serializer.save(user=self.request.user, original_link=original_link)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(
            {"message": "Success! Your shortened URL has been created."},
            status=status.HTTP_201_CREATED
        )



# Short url to original url:
class RedirectShortURLView(APIView):
    def get(self, request, short_link):
        try:
            url_instance = ShortenedURL.objects.get(short_link=short_link)
            if not url_instance.status:  # URL aktiv emas
                return Response(
                    {"detail": "This URL is inactive or has been disabled."},
                    status=status.HTTP_403_FORBIDDEN
                )

            url_instance.clicks += 1
            url_instance.save()
            return redirect(url_instance.original_link)

        except ShortenedURL.DoesNotExist:
            return Response(
                {"detail": "This shortened URL does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )



# Main page get list:
class UserShortUrlListView(generics.ListAPIView):
    serializer_class = ShortUrlDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = ShortenedURL.objects.filter(user=self.request.user).order_by('-created_at')

        search_short = self.request.query_params.get('search_short')
        search_origin = self.request.query_params.get('search_origin')
        status = self.request.query_params.get('status')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if search_short:
            shorten_url = search_short.split('/')[-1]
            queryset = queryset.filter(short_link=shorten_url)

        if search_origin:
            queryset = queryset.filter(original_link=search_origin)

        # **Boolean statusni to'g'ri o'zgartirish**
        if status is not None:
            if status.lower() in ["true", "1"]:
                status = True
            elif status.lower() in ["false", "0"]:
                status = False
            else:
                status = None

        if status is not None:
            queryset = queryset.filter(status=status)

        # **Sanalar bo‘yicha filterlash**
        if start_date or end_date:
            start_date = parse_date(start_date) if start_date else None
            end_date = parse_date(end_date) if end_date else None

            if start_date and end_date and start_date > end_date:
                return queryset.none()

            if start_date:
                queryset = queryset.filter(created_at__date__gte=start_date)
            if end_date:
                queryset = queryset.filter(created_at__date__lte=end_date)

        return queryset

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
        queryset = ShortenedURL.objects.filter(user=self.request.user).order_by('-created_at')
        return queryset


    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.user != request.user:
            return Response(
                {"error": "Siz bu Status'ni yangilash huquqiga ega emassiz!"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)



# Last five urls:
class LastFiveShortenedURLsView(ListAPIView):
    serializer_class = ShortUrlDetailSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None

        if user:
            return ShortenedURL.objects.filter(user=user).order_by('-created_at')[:5]
        return ShortenedURL.objects.order_by('-created_at')[:5]







