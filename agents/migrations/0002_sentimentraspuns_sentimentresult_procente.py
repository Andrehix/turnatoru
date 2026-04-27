import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agents', '0001_initial'),
        ('core', '0002_alter_turnatorie_text_persoana_campformular_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='sentimentresult',
            name='procent_pozitiv',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='sentimentresult',
            name='procent_neutru',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='sentimentresult',
            name='procent_negativ',
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.CreateModel(
            name='SentimentRaspuns',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sentiment', models.CharField(
                    choices=[('pozitiv', 'Pozitiv'), ('neutru', 'Neutru'), ('negativ', 'Negativ')],
                    default='neutru',
                    max_length=10,
                )),
                ('raspuns', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='sentiment',
                    to='core.raspunscamp',
                )),
            ],
            options={
                'verbose_name': 'Sentiment Răspuns',
                'verbose_name_plural': 'Sentimente Răspunsuri',
            },
        ),
    ]
