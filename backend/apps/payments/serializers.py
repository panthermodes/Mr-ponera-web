from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    verified_by_username = serializers.CharField(source='verified_by.username', read_only=True)
    membership_type_display = serializers.CharField(source='get_membership_type_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = ('id', 'user', 'user_email', 'username', 'transaction_id', 'phone_number', 'network',
                  'membership_type', 'membership_type_display', 'amount', 'screenshot', 'status', 'admin_notes',
                  'verified_by', 'verified_by_username', 'created_at', 'updated_at', 'processed_at')
        read_only_fields = ('id', 'user', 'status', 'created_at', 'updated_at', 'processed_at', 'verified_by')


class PaymentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('transaction_id', 'phone_number', 'network', 'membership_type', 'amount', 'screenshot')
    
    def validate(self, attrs):
        from .models import Payment
        membership_type = attrs.get('membership_type', 'vip')
        expected_amount = Payment.MEMBERSHIP_PRICES.get(membership_type, 40000)
        actual_amount = attrs.get('amount')
        
        if actual_amount != expected_amount:
            raise serializers.ValidationError(
                f"Amount mismatch. Expected {expected_amount} TSh for {membership_type} membership, but got {actual_amount} TSh"
            )
        return attrs
    
    def validate_screenshot(self, value):
        if value:
            if value.size > 5 * 1024 * 1024:  # 5MB limit
                raise serializers.ValidationError("Screenshot size should not exceed 5MB")
            if value.content_type not in ['image/jpeg', 'image/png', 'image/webp']:
                raise serializers.ValidationError("Only JPEG, PNG, and WebP images are allowed")
        return value
    
    def validate_transaction_id(self, value):
        if Payment.objects.filter(transaction_id=value).exists():
            raise serializers.ValidationError("Transaction ID already exists")
        return value


class PaymentProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('status', 'admin_notes')
