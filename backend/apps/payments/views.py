from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer, PaymentProcessSerializer


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def upload_payment(request):
    serializer = PaymentCreateSerializer(data=request.data)
    if serializer.is_valid():
        payment = serializer.save(user=request.user)
        return Response(PaymentSerializer(payment).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_payments(request):
    payments = Payment.objects.filter(user=request.user)
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def pending_payments(request):
    payments = Payment.objects.filter(status='pending')
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def all_payments(request):
    payments = Payment.objects.all()
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def approve_payment(request, pk):
    try:
        payment = Payment.objects.get(pk=pk)
        if payment.status != 'pending':
            return Response({'error': 'Payment has already been processed'}, status=status.HTTP_400_BAD_REQUEST)
        
        payment.approve(request.user)
        return Response(PaymentSerializer(payment).data, status=status.HTTP_200_OK)
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def reject_payment(request, pk):
    try:
        payment = Payment.objects.get(pk=pk)
        if payment.status != 'pending':
            return Response({'error': 'Payment has already been processed'}, status=status.HTTP_400_BAD_REQUEST)
        
        notes = request.data.get('admin_notes', '')
        payment.reject(request.user, notes)
        return Response(PaymentSerializer(payment).data, status=status.HTTP_200_OK)
    except Payment.DoesNotExist:
        return Response({'error': 'Payment not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def payment_stats(request):
    stats = {
        'total_payments': Payment.objects.count(),
        'pending_payments': Payment.objects.filter(status='pending').count(),
        'approved_payments': Payment.objects.filter(status='approved').count(),
        'rejected_payments': Payment.objects.filter(status='rejected').count(),
        'total_revenue': Payment.objects.filter(status='approved').aggregate(
            total=models.Sum('amount'))['total'] or 0,
        'membership_breakdown': {
            'vip': Payment.objects.filter(status='approved', membership_type='vip').count(),
            'ht': Payment.objects.filter(status='approved', membership_type='ht').count(),
            'htft': Payment.objects.filter(status='approved', membership_type='htft').count(),
            'daily_fixed': Payment.objects.filter(status='approved', membership_type='daily_fixed').count(),
        }
    }
    return Response(stats)
