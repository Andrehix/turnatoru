from django.urls import path
from . import views

app_name = 'core'

urlpatterns = [
    path('', views.home, name='home'),
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('dashboard/', views.dashboard_creator, name='dashboard_creator'),
    path('dashboard/persoane/', views.persoane_view, name='persoane'),
    path('dashboard/formular-nou/', views.crear_formular, name='crear_formular'),
    path('dashboard/formular/<int:formular_id>/', views.dashboard_creator_formular, name='formular_reviews'),
    path('dashboard/formular/<int:formular_id>/genereaza-tokeni/', views.genereaza_tokeni, name='genereaza_tokeni'),
    path('dashboard/formular/<int:formular_id>/export-pdf/', views.export_pdf, name='export_pdf'),
    path('token-login/', views.token_login, name='token_login'),
    path('token/<str:token>/', views.token_formular, name='token_formular'),
    path('admin-dashboard/', views.dashboard_admin, name='dashboard_admin'),
]
