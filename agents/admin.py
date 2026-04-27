from django.contrib import admin
from .models import SentimentResult


@admin.register(SentimentResult)
class SentimentResultAdmin(admin.ModelAdmin):
    list_display = ('turnatorie', 'sentiment', 'analizat_la')
    list_filter = ('sentiment',)
    readonly_fields = ('analizat_la',)
