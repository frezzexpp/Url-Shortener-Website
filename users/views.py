from drf_spectacular.utils import extend_schema_view, extend_schema
from rest_framework import status, generics
from django.contrib.auth import login, logout
from .serializers import RegisterSerializer, LoginSerializer, LogoutSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


# Register view:
@extend_schema_view(
    create=extend_schema(summary='Users register', tags=['Users']),
)
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "User registered successfully."},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


# Login view:
@extend_schema_view(
    create=extend_schema(summary='Users login', tags=['Users']),
)
class LoginView(generics.CreateAPIView):  # CreateAPIView ishlatilmoqda
    serializer_class = LoginSerializer

    def create(self, request, *args, **kwargs):  # POST so'rov uchun
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)  # Foydalanuvchini tizimga kiritish
        return Response({"message": "Login successful."}, status=status.HTTP_200_OK)


# Logout view:
@extend_schema_view(
    post=extend_schema(summary='Users logout', tags=['Users']),
)
class LogoutView(generics.GenericAPIView):  # GenericAPIView ishlatiladi
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):  # POST so'rov uchun
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()
        logout(request)  # Tizimdan chiqarish
        return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
