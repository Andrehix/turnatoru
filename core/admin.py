from django.contrib import admin
from .models import Formular, TokenTurnator, Turnatorie


@admin.register(Formular)
class FormularAdmin(admin.ModelAdmin):
    list_display = ('titlu', 'creator', 'creat_la')
    list_filter = ('creat_la', 'creator')
    search_fields = ('titlu',)


@admin.register(TokenTurnator)
class TokenTurnatorAdmin(admin.ModelAdmin):
    list_display = ('cod', 'formular', 'folosit', 'creat_la')
    list_filter = ('folosit', 'creat_la')
    search_fields = ('cod',)


@admin.register(Turnatorie)
class TurnatorieAdmin(admin.ModelAdmin):
    list_display = ('formular', 'text_scurt', 'creat_la')
    list_filter = ('creat_la', 'formular')

    def text_scurt(self, obj):
        return obj.text[:80] + '...' if len(obj.text) > 80 else obj.text
    text_scurt.short_description = 'Text'
