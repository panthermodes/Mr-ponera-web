from rest_framework import status, permissions, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_ratelimit.decorators import ratelimit
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer, SocialLinksSerializer
from .models import User, SocialLinks


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@ratelimit(key='ip', rate='5/h', method='POST')
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserProfileSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@ratelimit(key='ip', rate='10/h', method='POST')
def login(request):
    serializer = UserLoginSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserProfileSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)


class SocialLinksListCreateView(generics.ListCreateAPIView):
    queryset = SocialLinks.objects.all()
    serializer_class = SocialLinksSerializer
    permission_classes = [permissions.IsAdminUser]


class SocialLinksDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SocialLinks.objects.all()
    serializer_class = SocialLinksSerializer
    permission_classes = [permissions.IsAdminUser]


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def social_links_public(request):
    social_links = SocialLinks.objects.filter(is_active=True)
    serializer = SocialLinksSerializer(social_links, many=True)
    return Response(serializer.data)
