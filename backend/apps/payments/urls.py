from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_payment, name='upload_payment'),
    path('my-payments/', views.my_payments, name='my_payments'),
    path('pending/', views.pending_payments, name='pending_payments'),
    path('all/', views.all_payments, name='all_payments'),
    path('approve/<int:pk>/', views.approve_payment, name='approve_payment'),
    path('reject/<int:pk>/', views.reject_payment, name='reject_payment'),
    path('stats/', views.payment_stats, name='payment_stats'),
]
