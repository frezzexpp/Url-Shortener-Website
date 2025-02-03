from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# User Model:
class User(AbstractUser):
    username = models.CharField('Nickname', max_length=64, unique=True)
    email = models.EmailField('Email', unique=True)
    first_name = models.CharField('First Name', max_length=100, blank=True, null=True)
    last_name = models.CharField('Last Name', max_length=100, blank=True, null=True)
    phone = models.CharField('Phone', max_length=20, blank=True, null=True)
    address = models.TextField('Address', blank=True, null=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_set",
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions_set",
        blank=True,
    )

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.username}"

# Token yaratish signali
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
