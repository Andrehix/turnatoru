from django.urls import path

from . import views

app_name = 'agents'

urlpatterns = [
    path('chatbot/', views.chatbot_view, name='chatbot'),
]
