from rest_framework import serializers
from .models import ShortenedURL

class ShortenedURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortenedURL
        fields = ['short_link', 'original_link', 'clicks', 'status', 'created_at']
        read_only_fields = ['short_link', 'clicks', 'created_at']


class ShortUrlDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShortenedURL
        fields = '__all__'