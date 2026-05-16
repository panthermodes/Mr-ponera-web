from django.db import models
from django.utils import timezone
from apps.authentication.models import User


class Slip(models.Model):
    CATEGORY_CHOICES = [
        ('free', 'FREE ODDS'),
        ('vip', 'SURE DRAW VIP'),
        ('ht', 'HALF TIME DRAW VIP'),
        ('htft', 'HALF TIME / FULL TIME DRAW VIP'),
        ('daily_fixed', 'DAILY SURE FIXED ODD'),
    ]
    
    VISIBILITY_CHOICES = [
        ('free', 'Free'),
        ('vip', 'VIP Only'),
    ]
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES)
    visibility = models.CharField(max_length=10, choices=VISIBILITY_CHOICES, default='free')
    booking_link = models.URLField(max_length=500, null=True, blank=True)
    booking_code = models.CharField(max_length=100, null=True, blank=True)
    image = models.ImageField(upload_to='slips/', null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_slips')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'slips'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_category_display()}"
