#serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser, Visitor

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'role', 'first_name', 'last_name', 'email', 'date_joined', 'is_active', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_username(self, value):
        user_id = self.instance.id if self.instance else None
        if CustomUser.objects.filter(username=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        user_id = self.instance.id if self.instance else None
        if CustomUser.objects.filter(email=value).exclude(id=user_id).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['name'] = user.get_full_name()
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['name'] = self.user.get_full_name()
        data['username'] = self.user.username
        return data

class UserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = CustomUser.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class ActiveVisitorListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        active_visitors = CustomUser.objects.filter(role='visitor', is_active=True)
        serializer = UserSerializer(active_visitors, many=True)
        return Response(serializer.data)

class VisitorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visitor
        fields = '__all__'
