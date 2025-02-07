from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import ShortenedURL


@admin.register(ShortenedURL)
class ShortenedURLAdmin(admin.ModelAdmin):
    list_display = ('short_link', 'original_link', 'clicks', 'status', 'created_at')
    search_fields = ('short_link', 'original_link')