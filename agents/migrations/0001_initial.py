import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('core', '0002_alter_turnatorie_text_persoana_campformular_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='SentimentResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sentiment', models.CharField(
                    choices=[('pozitiv', 'Pozitiv'), ('neutru', 'Neutru'), ('negativ', 'Negativ')],
                    default='neutru',
                    max_length=10,
                )),
                ('analizat_la', models.DateTimeField(auto_now_add=True)),
                ('turnatorie', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='sentiment',
                    to='core.turnatorie',
                )),
            ],
            options={
                'verbose_name': 'Rezultat Sentiment',
                'verbose_name_plural': 'Rezultate Sentiment',
            },
        ),
    ]
