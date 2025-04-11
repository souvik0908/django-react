# app/urls/products_urls.py
from django.urls import path
from app.views import product_views as views

# app/urls/products_urls.py
urlpatterns = [
    path('', views.getProducts, name="products"),
    path('create/', views.createProduct, name="product-create"),
    path('upload/', views.uploadImage, name="image-upload"),
    path('update/<str:pk>/', views.updateProduct, name="product-update"),
    path('upload/image/', views.uploadImage, name="image-upload"),
    path('delete/<str:pk>/', views.deleteProduct, name="product-delete"),
    path('<str:pk>/', views.getProduct, name="product-detail"),  # Keep last
]