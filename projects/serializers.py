from rest_framework import serializers, reverse
from .models import ShortenedURL

class ShortenedURLSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShortenedURL
        fields = ('original_link', )
        # read_only_fields = ['short_link', 'clicks', 'created_at']


class ShortUrlDetailSerializer(serializers.ModelSerializer):
    short_link = serializers.SerializerMethodField()
    user = serializers.PrimaryKeyRelatedField(read_only=True)  # Foydalanuvchi ID qaytadi


    class Meta:
        model = ShortenedURL
        fields = '__all__'

    def get_short_link(self, obj):
        return f"http://127.0.0.1:8000/api/{obj.short_link}"




#
# class ShortenURLSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ShortenedURL
#         fields = ["original_link", "short_link", "user"]
#         extra_kwargs = {"user": {"read_only": True}}  # User o‘zgartirilmasligi uchun
#
#     def create(self, validated_data):
#         validated_data["user"] = self.context["request"].user  # Foydalanuvchini avtomatik qo‘shish
#         return super().create(validated_data)
