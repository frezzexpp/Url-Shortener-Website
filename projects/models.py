import random
import string
from django.db import models
from django.contrib.auth.models import User
from config.settings import SHORT_URL


# Qisqa URL yaratish uchun funksiyani o‘zgartiramiz
def generate_short_link():
    while True:
        short_link = ''.join(random.choices(string.ascii_letters + string.digits, k=SHORT_URL))
        if not ShortenedURL.objects.filter(short_link=short_link).exists():
            return short_link


class ShortenedURL(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="shortened_urls", null=True, blank=True)
    short_link = models.CharField(max_length=100, unique=True, default=generate_short_link)
    original_link = models.URLField(max_length=500)
    clicks = models.PositiveIntegerField(default=0)
    status = models.BooleanField(default=True)  # True = Active, False = Inactive
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        user_info = f"by {self.user.username}" if self.user else "by Anonymous"
        return f"{self.short_link} -> {self.original_link} ({user_info})"