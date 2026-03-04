from django.contrib import admin
from .models import Formular, TokenTurnator, Turnatorie, Persoana, CampFormular, RaspunsCamp


@admin.register(Persoana)
class PersoanaAdmin(admin.ModelAdmin):
    list_display = ('nume', 'creator')
    list_filter = ('creator',)
    search_fields = ('nume',)


class CampFormularInline(admin.TabularInline):
    model = CampFormular
    extra = 0


@admin.register(Formular)
class FormularAdmin(admin.ModelAdmin):
    list_display = ('titlu', 'creator', 'creat_la')
    list_filter = ('creat_la', 'creator')
    search_fields = ('titlu',)
    inlines = [CampFormularInline]


@admin.register(TokenTurnator)
class TokenTurnatorAdmin(admin.ModelAdmin):
    list_display = ('cod', 'formular', 'folosit', 'creat_la')
    list_filter = ('folosit', 'creat_la')
    search_fields = ('cod',)


@admin.register(CampFormular)
class CampFormularAdmin(admin.ModelAdmin):
    list_display = ('intrebare', 'formular', 'persoana', 'tip', 'ordine')
    list_filter = ('tip', 'formular')


@admin.register(RaspunsCamp)
class RaspunsCampAdmin(admin.ModelAdmin):
    list_display = ('camp', 'valoare_scurt', 'turnatorie')

    def valoare_scurt(self, obj):
        return obj.valoare[:80] + '...' if len(obj.valoare) > 80 else obj.valoare
    valoare_scurt.short_description = 'Valoare'


@admin.register(Turnatorie)
class TurnatorieAdmin(admin.ModelAdmin):
    list_display = ('formular', 'creat_la')
    list_filter = ('creat_la', 'formular')
