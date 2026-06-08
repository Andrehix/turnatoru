from rest_framework import serializers
from .models import Persoana, Formular, CampFormular, TokenTurnator, RaspunsCamp, Turnatorie

class PersoanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persoana
        fields = '__all__'
        extra_kwargs = {'creator': {'required': False, 'read_only': True}}

class FormularSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formular
        fields = '__all__'
        extra_kwargs = {'creator': {'required': False, 'read_only': True}}

class CampFormularSerializer(serializers.ModelSerializer):
    persoana_nume = serializers.CharField(source='persoana.nume', read_only=True)

    class Meta:
        model = CampFormular
        fields = '__all__'

class TokenTurnatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TokenTurnator
        fields = '__all__'

class RaspunsCampSerializer(serializers.ModelSerializer):
    sentiment_label = serializers.SerializerMethodField()

    class Meta:
        model = RaspunsCamp
        fields = '__all__'

    def get_sentiment_label(self, obj):
        try: return obj.sentiment.sentiment
        except: return None

class TurnatorieSerializer(serializers.ModelSerializer):
    sentiment_label = serializers.SerializerMethodField()
    sentiment_poz = serializers.SerializerMethodField()
    sentiment_neu = serializers.SerializerMethodField()
    sentiment_neg = serializers.SerializerMethodField()

    class Meta:
        model = Turnatorie
        fields = '__all__'

    def get_sentiment_label(self, obj):
        try: return obj.sentiment.sentiment
        except: return None

    def get_sentiment_poz(self, obj):
        try: return obj.sentiment.procent_pozitiv
        except: return 0

    def get_sentiment_neu(self, obj):
        try: return obj.sentiment.procent_neutru
        except: return 0

    def get_sentiment_neg(self, obj):
        try: return obj.sentiment.procent_negativ
        except: return 0
