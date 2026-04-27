from django.db import models
from core.models import Turnatorie, RaspunsCamp

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
    procent_pozitiv = models.PositiveSmallIntegerField(default=0)
    procent_neutru = models.PositiveSmallIntegerField(default=0)
    procent_negativ = models.PositiveSmallIntegerField(default=0)
    analizat_la = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Sentiment {self.sentiment} — {self.turnatorie}'

    class Meta:
        verbose_name = 'Rezultat Sentiment'
        verbose_name_plural = 'Rezultate Sentiment'


class SentimentRaspuns(models.Model):
    raspuns = models.OneToOneField(
        RaspunsCamp,
        on_delete=models.CASCADE,
        related_name='sentiment',
    )
    sentiment = models.CharField(max_length=10, choices=SENTIMENT_CHOICES, default='neutru')

    def __str__(self):
        return f'Sentiment {self.sentiment} — {self.raspuns}'

    class Meta:
        verbose_name = 'Sentiment Răspuns'
        verbose_name_plural = 'Sentimente Răspunsuri'
