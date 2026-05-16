from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import redirect
from django.utils import timezone
from .models import Slip
from .serializers import SlipSerializer, SlipCreateSerializer, SlipUpdateSerializer


def get_filtered_slips(queryset, user, include_booking_links=False):
    """Helper function to filter slips based on visibility and user status"""
    slips = queryset.filter(is_active=True)
    
    # Filter expired slips
    slips = slips.filter(
        expires_at__isnull=True
    ) | slips.filter(expires_at__gt=timezone.now())
    
    # Filter by visibility
    if not user or not user.is_authenticated:
        slips = slips.filter(visibility='free')
    elif not user.is_vip:
        slips = slips.filter(visibility='free')
    
    serializer = SlipSerializer(slips, many=True)
    data = serializer.data
    
    # Remove booking links if user is not VIP
    if not include_booking_links and (not user or not user.is_vip):
        for slip in data:
            slip['booking_link'] = None
            slip['booking_code'] = None
    
    return data


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def free_slips(request):
    slips = Slip.objects.filter(category='free')
    data = get_filtered_slips(slips, request.user)
    return Response(data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def vip_slips(request):
    if not request.user.has_vip_access('vip'):
        return Response({'error': 'Sure Draw VIP access required'}, status=status.HTTP_403_FORBIDDEN)
    
    slips = Slip.objects.filter(category='vip')
    data = get_filtered_slips(slips, request.user, include_booking_links=True)
    return Response(data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def ht_slips(request):
    if not request.user.has_vip_access('ht'):
        return Response({'error': 'HT Draw VIP access required'}, status=status.HTTP_403_FORBIDDEN)
    
    slips = Slip.objects.filter(category='ht')
    data = get_filtered_slips(slips, request.user, include_booking_links=True)
    return Response(data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def htft_slips(request):
    if not request.user.has_vip_access('htft'):
        return Response({'error': 'HT/FT Draw VIP access required'}, status=status.HTTP_403_FORBIDDEN)
    
    slips = Slip.objects.filter(category='htft')
    data = get_filtered_slips(slips, request.user, include_booking_links=True)
    return Response(data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def daily_fixed_slips(request):
    if not request.user.has_vip_access('daily_fixed'):
        return Response({'error': 'Daily Fixed Odd VIP access required'}, status=status.HTTP_403_FORBIDDEN)
    
    slips = Slip.objects.filter(category='daily_fixed')
    data = get_filtered_slips(slips, request.user, include_booking_links=True)
    return Response(data)


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def create_slip(request):
    serializer = SlipCreateSerializer(data=request.data)
    if serializer.is_valid():
        slip = serializer.save(created_by=request.user)
        return Response(SlipSerializer(slip).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([permissions.IsAdminUser])
def update_slip(request, pk):
    try:
        slip = Slip.objects.get(pk=pk)
    except Slip.DoesNotExist:
        return Response({'error': 'Slip not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = SlipUpdateSerializer(slip, data=request.data, partial=True)
    if serializer.is_valid():
        slip = serializer.save()
        return Response(SlipSerializer(slip).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([permissions.IsAdminUser])
def delete_slip(request, pk):
    try:
        slip = Slip.objects.get(pk=pk)
        slip.delete()
        return Response({'message': 'Slip deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Slip.DoesNotExist:
        return Response({'error': 'Slip not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def list_all_slips(request):
    slips = Slip.objects.all()
    serializer = SlipSerializer(slips, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def open_booking_link(request, pk):
    """Secure endpoint to redirect VIP users to booking links"""
    try:
        slip = Slip.objects.get(pk=pk)
    except Slip.DoesNotExist:
        return Response({'error': 'Slip not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if not request.user.is_vip:
        return Response({'error': 'VIP access required to open booking links'}, status=status.HTTP_403_FORBIDDEN)
    
    if not slip.booking_link:
        return Response({'error': 'No booking link available for this slip'}, status=status.HTTP_400_BAD_REQUEST)
    
    return redirect(slip.booking_link)
