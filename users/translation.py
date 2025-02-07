from modeltranslation.translator import register, TranslationOptions
from django.contrib.auth.models import User

@register(User)
class UserTranslationOptions(TranslationOptions):
    fields = ('first_name', 'last_name')