from rest_framework import serializers
from .models import User, Chat, Group, GroupChat, GroupMember

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'phone']  # Exclude password for security
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'phone': {'required': True},
            'password': {'write_only': True}  # Password should be write-only
        }

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ["id", "sender", "receiver", "message", "timestamp", "is_read", "is_deleted", "is_deleted_by_sender", "is_deleted_by_receiver"]
        extra_kwargs = {
            'sender': {'read_only': True},
            'receiver': {'read_only': True},
            'timestamp': {'read_only': True}
        }

class GroupSerializer(serializers.ModelSerializer):
    group_admin = UserSerializer(read_only=True)
    group_members = UserSerializer(read_only=True, many=True)

    class Meta:
        model = Group
        fields = ['id', 'group_name', 'group_description', 'group_image', 'group_admin', 'group_members', 'created_at']
        extra_kwargs = {
            'created_at': {'read_only': True}
        }

class GroupChatSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    group = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = GroupChat
        fields = ["id", "group", "sender", "message", "timestamp", "is_read", "is_deleted", "is_deleted_by_sender"]
        extra_kwargs = {
            'timestamp': {'read_only': True},
        }

class GroupMemberSerializer(serializers.ModelSerializer):
    group = serializers.StringRelatedField(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = GroupMember
        fields = ["id", "group", "user", "is_admin", "is_deleted"]
