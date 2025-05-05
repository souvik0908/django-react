from django.db import models

class User(models.Model):
    username = models.CharField(max_length=20, unique=True, verbose_name="Username")
    name = models.CharField(max_length=20)
    email = models.EmailField(max_length=50, unique=True, verbose_name="Email")
    phone = models.CharField(max_length=10, unique=True, verbose_name="Phone")
    password = models.CharField(max_length=20, verbose_name="Password")
    id=models.AutoField(primary_key=True,editable=False)
    def __str__(self):
        return self.username

class Chat(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sender")
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="receiver",null=True)
    message = models.TextField(verbose_name="Message")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Timestamp")
    is_read = models.BooleanField(default=False, verbose_name="Is Read")
    is_deleted = models.BooleanField(default=False, verbose_name="Is Deleted")
    is_deleted_by_sender = models.BooleanField(default=False, verbose_name="Is Deleted By Sender")
    is_deleted_by_receiver = models.BooleanField(default=False, verbose_name="Is Deleted By Receiver")
    id=models.AutoField(primary_key=True,editable=False)
    def __str__(self):
        return f"From {self.sender.username} to {self.receiver.username} at {self.timestamp}"

class Group(models.Model):
    group_name = models.CharField(max_length=20, verbose_name="Group Name")
    group_description = models.TextField(blank=True, null=True, verbose_name="Group Description")
    group_image = models.ImageField(upload_to='group_images/', blank=True, null=True, verbose_name="Group Image")
    group_admin = models.ForeignKey(User, on_delete=models.CASCADE, related_name="group_admin", verbose_name="Group Admin")
    group_members = models.ManyToManyField(User, related_name="group_members", verbose_name="Group Members")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created At")
    id=models.AutoField(primary_key=True,editable=False)
    def __str__(self):
        return self.group_name

class GroupChat(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="group_chat")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="group_sender")
    message = models.TextField(verbose_name="Message")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Timestamp")
    is_read = models.BooleanField(default=False, verbose_name="Is Read")
    is_deleted = models.BooleanField(default=False, verbose_name="Is Deleted")
    is_deleted_by_sender = models.BooleanField(default=False, verbose_name="Is Deleted By Sender")
    id=models.AutoField(primary_key=True,editable=False)
    def __str__(self):
        return f"{self.sender.username} in {self.group.group_name} at {self.timestamp}"

class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="group_member")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_group_member")
    is_admin = models.BooleanField(default=False, verbose_name="Is Admin")
    is_deleted = models.BooleanField(default=False, verbose_name="Is Deleted")
    id=models.AutoField(primary_key=True,editable=False)
    def __str__(self):
        return f"{self.user.username} in {self.group.group_name}"

    


