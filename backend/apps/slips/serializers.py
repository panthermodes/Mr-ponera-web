from rest_framework import serializers
from .models import Slip


class SlipSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = Slip
        fields = ('id', 'title', 'content', 'category', 'visibility', 'booking_link', 'booking_code', 
                  'image', 'is_active', 'created_by', 'created_by_username', 'created_at', 'updated_at', 'expires_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'created_by')


class SlipCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slip
        fields = ('title', 'content', 'category', 'visibility', 'booking_link', 'booking_code', 'image', 'is_active', 'expires_at')
    
    def validate_image(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:  # 5MB limit
                raise serializers.ValidationError("Image size should not exceed 5MB")
            if value.content_type not in ['image/jpeg', 'image/png', 'image/webp']:
                raise serializers.ValidationError("Only JPEG, PNG, and WebP images are allowed")
        return value


class SlipUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slip
        fields = ('title', 'content', 'category', 'visibility', 'booking_link', 'booking_code', 'image', 'is_active', 'expires_at')
    
    def validate_image(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:  # 5MB limit
                raise serializers.ValidationError("Image size should not exceed 5MB")
            if value.content_type not in ['image/jpeg', 'image/png', 'image/webp']:
                raise serializers.ValidationError("Only JPEG, PNG, and WebP images are allowed")
        return value
