from rest_framework import serializers
from .models import Persoana, Formular, CampFormular, TokenTurnator, RaspunsCamp, Turnatorie

class PersoanaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Persoana
        fields = '__all__'

class FormularSerializer(serializers.ModelSerializer):
    class Meta:
        model = Formular
        fields = '__all__'

class CampFormularSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampFormular
        fields = '__all__'

class TokenTurnatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TokenTurnator
        fields = '__all__'

class RaspunsCampSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaspunsCamp
        fields = '__all__'

class TurnatorieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Turnatorie
        fields = '__all__'
