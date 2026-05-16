from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('social-links/', views.SocialLinksListCreateView.as_view(), name='social-links-list'),
    path('social-links/<int:pk>/', views.SocialLinksDetailView.as_view(), name='social-links-detail'),
    path('social-links/public/', views.social_links_public, name='social-links-public'),
]
