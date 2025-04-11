from django.urls import path
from app.views import order_views as views

urlpatterns = [
    path('', views.getOrders, name='orders'),
    path('add/', views.addOrderItems, name='orders-add'),
    
    path('myorders/', views.getMyOrders, name='my-orders'),    path('<str:pk>/', views.getOrderById, name='orders-id'),
    path('<str:orderId>/pay/', views.updateOrderToPaid, name='order-pay'),
    path('<str:orderId>/deliver/', views.updateOrderToDelivered, name='order-deliver'),
]