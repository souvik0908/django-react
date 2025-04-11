# users/urls/user_urls.py (or similar)
from django.urls import path
from app.views import user_views as views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', views.registerUser, name='register'),
    path('profile/', views.getUserProfile, name="profile"),
    path('profile/update/', views.updateUserProfile, name="profile-update"),
    path('', views.getUsers, name="users"),
    path('<str:pk>/', views.getUserById, name="user"),
    path('delete/<str:pk>/', views.deleteUser, name="delete-user"),
    path('update/<str:pk>/', views.updateUser, name="update-user"),
]
