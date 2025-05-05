from django.contrib import admin
from .models import User, Chat, Group, GroupChat, GroupMember

admin.site.register(User)
admin.site.register(Chat)
admin.site.register(Group)
admin.site.register(GroupChat)
admin.site.register(GroupMember)
