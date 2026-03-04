import uuid
from django.db import models
from django.contrib.auth.models import User


class Persoana(models.Model):
    nume = models.CharField(max_length=200)
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='persoane')

    def __str__(self):
        return f'{self.nume} (de {self.creator.username})'

    class Meta:
        verbose_name_plural = 'Persoane'


class Formular(models.Model):
    titlu = models.CharField(max_length=200)
    mesaj = models.TextField(default='Spune-ne ce crezi, fără frică. Sau cu frică, dar scrie oricum.')
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='formulare')
    creat_la = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'🐀 {self.titlu} (de {self.creator.username})'

    class Meta:
        verbose_name_plural = 'Formulare'


class CampFormular(models.Model):
    TIP_CHOICES = [
        ('text', 'Text Liber'),
        ('optiuni', 'Alegere Multiplă'),
    ]
    formular = models.ForeignKey(Formular, on_delete=models.CASCADE, related_name='campuri')
    persoana = models.ForeignKey(Persoana, on_delete=models.CASCADE, related_name='campuri')
    tip = models.CharField(max_length=10, choices=TIP_CHOICES)
    intrebare = models.CharField(max_length=500)
    optiuni = models.TextField(blank=True, default='')
    ordine = models.PositiveIntegerField(default=0)

    def get_optiuni_list(self):
        if self.optiuni:
            return [o.strip() for o in self.optiuni.split(',') if o.strip()]
        return []

    def __str__(self):
        return f'{self.intrebare} ({self.persoana.nume}) - {self.tip}'

    class Meta:
        verbose_name_plural = 'Câmpuri Formular'
        ordering = ['ordine']


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


class RaspunsCamp(models.Model):
    turnatorie = models.ForeignKey('Turnatorie', on_delete=models.CASCADE, related_name='raspunsuri')
    camp = models.ForeignKey(CampFormular, on_delete=models.CASCADE, related_name='raspunsuri')
    valoare = models.TextField(blank=True, default='')

    def __str__(self):
        return f'{self.camp.intrebare}: {self.valoare[:50]}'

    class Meta:
        verbose_name_plural = 'Răspunsuri Câmpuri'


class Turnatorie(models.Model):
    formular = models.ForeignKey(Formular, on_delete=models.CASCADE, related_name='turnatorii')
    text = models.TextField(blank=True, default='')
    creat_la = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'🗣️ Turnătorie pe "{self.formular.titlu}"'

    class Meta:
        verbose_name_plural = 'Turnătorii'
