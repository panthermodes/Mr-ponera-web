from django.urls import path
from . import views

urlpatterns = [
    path('free/', views.free_slips, name='free_slips'),
    path('vip/', views.vip_slips, name='vip_slips'),
    path('ht/', views.ht_slips, name='ht_slips'),
    path('htft/', views.htft_slips, name='htft_slips'),
    path('daily-fixed/', views.daily_fixed_slips, name='daily_fixed_slips'),
    path('create/', views.create_slip, name='create_slip'),
    path('update/<int:pk>/', views.update_slip, name='update_slip'),
    path('delete/<int:pk>/', views.delete_slip, name='delete_slip'),
    path('all/', views.list_all_slips, name='list_all_slips'),
    path('open-link/<int:pk>/', views.open_booking_link, name='open_booking_link'),
]
