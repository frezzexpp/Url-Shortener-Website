from drf_spectacular.utils import extend_schema
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from django.contrib.auth import login
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import Registration, LoginSerializer, LogoutSerializer



# Register view:
@extend_schema(summary='Create Register Users', tags=['Users'])
class RegisterView(generics.CreateAPIView):
    serializer_class = Registration

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)  # Xato bo‘lsa, avtomatik error tashlaydi
        user = serializer.save()
        return Response({"message": "User registered successfully."},
                        status=status.HTTP_201_CREATED)



# Login view:
@extend_schema(summary='Create user login', tags=['Users'])
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
@extend_schema(summary='Create user logout', tags=['Users'])
class LogoutView(generics.CreateAPIView):  # POST so‘rovini qabul qiladi
    serializer_class = LogoutSerializer  # Bo‘sh serializer

    def create(self, request, *args, **kwargs):
        try:
            request.user.auth_token.delete()  # Tokenni o‘chirish
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({"error": "User is already logged out or token not found."},
                            status=status.HTTP_400_BAD_REQUEST)