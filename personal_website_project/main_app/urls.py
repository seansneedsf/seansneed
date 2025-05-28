from django.urls import path
from . import views

app_name = 'main_app'  # Optional, but good practice for namespacing

urlpatterns = [
    path('', views.home_view, name='home'),
    path('about/', views.about_view, name='about'),
    path('services/', views.services_view, name='services'),
    path('contact/', views.contact_view, name='contact'),
]
