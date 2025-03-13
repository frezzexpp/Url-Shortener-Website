# Generated by Django 5.1.5 on 2025-03-03 11:37

import projects.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0016_remove_shortenedurl_clicks'),
    ]

    operations = [
        migrations.CreateModel(
            name='BaseShortenedURL',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('short_link', models.CharField(default=projects.models.generate_short_link, max_length=100, unique=True)),
                ('original_link', models.URLField(max_length=500)),
                ('status', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
