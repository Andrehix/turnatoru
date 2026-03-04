import uuid
from django.db import models
from django.contrib.auth.models import User


class Formular(models.Model):
    titlu = models.CharField(max_length=200)
    mesaj = models.TextField(default='Spune-ne ce crezi, fără frică. Sau cu frică, dar scrie oricum.')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='formulare')
    creat_la = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'🐀 {self.titlu} (de {self.creator.username})'

    class Meta:
        verbose_name_plural = 'Formulare'


class TokenTurnator(models.Model):
    cod = models.CharField(max_length=12, unique=True, default='')
    formular = models.ForeignKey(Formular, on_delete=models.CASCADE, related_name='tokeni')
    creat_la = models.DateTimeField(auto_now_add=True)
    folosit = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.cod:
            self.cod = uuid.uuid4().hex[:12].upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'🎫 {self.cod} → {self.formular.titlu}'

    class Meta:
        verbose_name_plural = 'Tokeni Turnători'


class Turnatorie(models.Model):
    formular = models.ForeignKey(Formular, on_delete=models.CASCADE, related_name='turnatorii')
    text = models.TextField()
    creat_la = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'🗣️ Turnătorie pe "{self.formular.titlu}" — {self.text[:50]}...'

    class Meta:
        verbose_name_plural = 'Turnătorii'
