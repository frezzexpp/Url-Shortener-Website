from modeltranslation.translator import register, TranslationOptions
from .models import ShortenedURL


@register(ShortenedURL)
class ShortenedURLTranslationOptions(TranslationOptions):
    fields = ('original_link',)
