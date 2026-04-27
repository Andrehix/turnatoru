from django.db import models
from core.models import Turnatorie

SENTIMENT_CHOICES = [
    ('pozitiv', 'Pozitiv'),
    ('neutru', 'Neutru'),
    ('negativ', 'Negativ'),
]


class SentimentResult(models.Model):
    turnatorie = models.OneToOneField(
        Turnatorie,
        on_delete=models.CASCADE,
        related_name='sentiment',
    )
    sentiment = models.CharField(max_length=10, choices=SENTIMENT_CHOICES, default='neutru')
    analizat_la = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Sentiment {self.sentiment} — {self.turnatorie}'

    class Meta:
        verbose_name = 'Rezultat Sentiment'
        verbose_name_plural = 'Rezultate Sentiment'
