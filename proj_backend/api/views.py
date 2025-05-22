#views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, VisitorSerializer
from .models import CustomUser, Visitor
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from datetime import date

class CreateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            user = CustomUser.objects.get(pk=pk)
        except CustomUser.DoesNotExist:
            return Response({'detail': 'User not found'}, status=404)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class ActiveVisitorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Only visitors with time_in set and time_out not set
        active_visitors = Visitor.objects.filter(time_in__isnull=False, time_out__isnull=True)
        serializer = VisitorSerializer(active_visitors, many=True)
        return Response(serializer.data)

class VisitorCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VisitorSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VisitorListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        visitors = Visitor.objects.all().order_by('-created_at')
        serializer = VisitorSerializer(visitors, many=True)
        return Response(serializer.data)

class VisitorDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            visitor = Visitor.objects.get(pk=pk)
        except Visitor.DoesNotExist:
            return Response({'detail': 'Visitor not found'}, status=404)
        serializer = VisitorSerializer(visitor)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            visitor = Visitor.objects.get(pk=pk)
        except Visitor.DoesNotExist:
            return Response({'detail': 'Visitor not found'}, status=404)
        serializer = VisitorSerializer(visitor, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def patch(self, request, pk):
        try:
            visitor = Visitor.objects.get(pk=pk)
        except Visitor.DoesNotExist:
            return Response({'detail': 'Visitor not found'}, status=404)
        # Handle time_out update
        time_out = request.data.get('time_out')
        if time_out:
            visitor.time_out = time_out
            visitor.save()
            serializer = VisitorSerializer(visitor)
            return Response(serializer.data)
        # Existing location logic
        location = request.data.get('location')
        if location:
            if not visitor.location_history:
                visitor.location_history = []
            visitor.location_history.append({
                'location': location,
                'timestamp': timezone.now().isoformat()
            })
            visitor.save()
            serializer = VisitorSerializer(visitor)
            return Response(serializer.data)
        return Response({'detail': 'No valid field provided'}, status=400)

    def post(self, request, pk):
        # Set the time_in field to now for the visitor
        try:
            visitor = Visitor.objects.get(pk=pk)
        except Visitor.DoesNotExist:
            return Response({'detail': 'Visitor not found'}, status=404)
        visitor.time_in = timezone.now().time()
        visitor.save()
        serializer = VisitorSerializer(visitor)
        return Response(serializer.data)

class VisitorsTodayView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        visitors = Visitor.objects.filter(date=today)
        serializer = VisitorSerializer(visitors, many=True)
        return Response(serializer.data)

class AllUsersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
