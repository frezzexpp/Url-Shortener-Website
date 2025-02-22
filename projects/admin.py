from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import ShortenedURL


admin.site.register(ShortenedURL)