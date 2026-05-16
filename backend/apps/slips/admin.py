from django.contrib import admin
from .models import Slip


@admin.register(Slip)
class SlipAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'visibility', 'is_active', 'created_by', 'created_at')
    list_filter = ('category', 'visibility', 'is_active', 'created_at')
    search_fields = ('title', 'content', 'booking_code')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at', 'created_by')
    
    fieldsets = (
        (None, {
            'fields': ('title', 'category', 'content', 'image')
        }),
        ('Booking Information', {
            'fields': ('booking_link', 'booking_code')
        }),
        ('Visibility & Expiry', {
            'fields': ('visibility', 'expires_at')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Metadata', {
            'fields': ('created_by',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
