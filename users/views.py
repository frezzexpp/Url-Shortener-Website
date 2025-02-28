from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema
from rest_framework import status, generics, mixins
from rest_framework.authtoken.models import Token
from django.contrib.auth import login
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import GenericViewSet
from .serializers import Registration, LoginSerializer, LogoutSerializer, UserProfileSerializer


# Register view:
class RegisterView(generics.CreateAPIView):
    serializer_class = Registration

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Xato bo‘lsa, avtomatik error tashlaydi
        user = serializer.save()
        return Response({"message": "User registered successfully."},
                        status=status.HTTP_201_CREATED)



# Login view:
class LoginView(generics.CreateAPIView):
    serializer_class = LoginSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({"message": "Login successful.", "token": token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Logout view:
class LogoutView(generics.CreateAPIView):  # POST so‘rovini qabul qiladi
    serializer_class = LogoutSerializer  # Bo‘sh serializer

    def create(self, request, *args, **kwargs):
        try:
            request.user.auth_token.delete()  # Tokenni o‘chirish
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({"error": "User is already logged out or token not found."},
                            status=status.HTTP_400_BAD_REQUEST)





# Get user's Profile:
class UserProfileView(mixins.UpdateModelMixin,
                      mixins.RetrieveModelMixin,
                      GenericViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]  # Faqat kirgan foydalanuvchilar uchun

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)  # Faqat login qilgan foydalanuvchini oladi

    def get_object(self):
        return self.request.user  # Foydalanuvchini bevosita qaytarish
