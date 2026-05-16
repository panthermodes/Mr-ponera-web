from django.db import models
from django.utils import timezone
from apps.authentication.models import User


class Payment(models.Model):
    NETWORK_CHOICES = [
        ('mpesa', 'M-Pesa'),
        ('tigo', 'Tigo Pesa'),
        ('airtel', 'Airtel Money'),
        ('halopesa', 'HaloPesa'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    MEMBERSHIP_CHOICES = [
        ('vip', 'SURE DRAW VIP - 40,000 TSh'),
        ('ht', 'HALF TIME DRAW VIP - 25,000 TSh'),
        ('htft', 'HT/FT DRAW VIP - 60,000 TSh'),
        ('daily_fixed', 'DAILY SURE FIXED ODD - 20,000 TSh'),
    ]
    
    MEMBERSHIP_PRICES = {
        'vip': 40000,
        'ht': 25000,
        'htft': 60000,
        'daily_fixed': 20000,
    }
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    transaction_id = models.CharField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=20)
    network = models.CharField(max_length=10, choices=NETWORK_CHOICES)
    membership_type = models.CharField(max_length=15, choices=MEMBERSHIP_CHOICES, default='vip')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    screenshot = models.ImageField(upload_to='payment_screenshots/')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='verified_payments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.transaction_id} - {self.status}"
    
    def approve(self, admin_user):
        self.status = 'approved'
        self.processed_at = timezone.now()
        self.verified_by = admin_user
        self.user.role = 'vip'
        
        # Set tier-specific expiry date
        expiry_date = timezone.now() + timezone.timedelta(days=30)
        if self.membership_type == 'vip':
            self.user.vip_sure_draw_expiry = expiry_date
        elif self.membership_type == 'ht':
            self.user.vip_ht_draw_expiry = expiry_date
        elif self.membership_type == 'htft':
            self.user.vip_htft_draw_expiry = expiry_date
        elif self.membership_type == 'daily_fixed':
            self.user.vip_daily_fixed_expiry = expiry_date
        
        # Also set general VIP expiry for backward compatibility
        self.user.vip_expiry_date = expiry_date
        self.user.save()
        self.save()
    
    def reject(self, admin_user, notes=''):
        self.status = 'rejected'
        self.admin_notes = notes
        self.processed_at = timezone.now()
        self.verified_by = admin_user
        self.save()
