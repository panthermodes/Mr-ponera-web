from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('vip', 'VIP User'),
        ('admin', 'Admin'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    vip_expiry_date = models.DateTimeField(null=True, blank=True)
    # Tier-specific expiry dates
    vip_sure_draw_expiry = models.DateTimeField(null=True, blank=True, verbose_name='Sure Draw VIP Expiry')
    vip_ht_draw_expiry = models.DateTimeField(null=True, blank=True, verbose_name='HT Draw VIP Expiry')
    vip_htft_draw_expiry = models.DateTimeField(null=True, blank=True, verbose_name='HT/FT Draw VIP Expiry')
    vip_daily_fixed_expiry = models.DateTimeField(null=True, blank=True, verbose_name='Daily Fixed Odd Expiry')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email
    
    @property
    def is_vip(self):
        return self.role == 'vip' and (
            self.vip_expiry_date is None or 
            self.vip_expiry_date > timezone.now()
        )
    
    def has_vip_access(self, tier):
        """Check if user has access to a specific VIP tier"""
        now = timezone.now()
        tier_expiry_map = {
            'vip': self.vip_sure_draw_expiry,
            'ht': self.vip_ht_draw_expiry,
            'htft': self.vip_htft_draw_expiry,
            'daily_fixed': self.vip_daily_fixed_expiry,
        }
        expiry = tier_expiry_map.get(tier)
        return expiry is not None and expiry > now
    
    class Meta:
        db_table = 'auth_user'


class SocialLinks(models.Model):
    PLATFORM_CHOICES = [
        ('whatsapp', 'WhatsApp'),
        ('telegram', 'Telegram'),
        ('instagram', 'Instagram'),
        ('threads', 'Threads'),
    ]
    
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES, unique=True)
    url = models.URLField(max_length=500)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'social_links'
        verbose_name_plural = 'Social Links'
    
    def __str__(self):
        return f"{self.get_platform_display()} - {self.url}"
