from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('user_email', 'transaction_id', 'network', 'amount', 'status', 'verified_by_username', 'created_at')
    list_filter = ('status', 'network', 'created_at')
    search_fields = ('user__email', 'transaction_id', 'phone_number')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'processed_at', 'verified_by')
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Payment Details', {
            'fields': ('transaction_id', 'phone_number', 'network', 'amount', 'screenshot')
        }),
        ('Status', {
            'fields': ('status', 'admin_notes', 'verified_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'processed_at'),
            'classes': ('collapse',)
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'
    
    def verified_by_username(self, obj):
        return obj.verified_by.username if obj.verified_by else 'Not verified'
    verified_by_username.short_description = 'Verified By'
