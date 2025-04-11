from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from django.conf import settings
import os
import uuid
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.parsers import MultiPartParser, FormParser
from app.models import Product, Review
from app.serializer import ProductSerializer

from rest_framework import status


@api_view(['GET'])
def getProducts(request):
    product = Product.objects.all()
    serializer = ProductSerializer(product, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)
@api_view(['DELETE'])
@permission_classes([ IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(_id=pk)
    product.delete()
    return Response('Product was deleted!')
@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    product = Product.objects.create(
        name='Sample name',
        price=0,
        user=request.user,
        brand='Sample brand',
        countInStock=0,
        category='Sample category',
        description='Sample description',
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        
        # Initialize serializer with BOTH instance and data
        serializer = ProductSerializer(
            instance=product, 
            data=request.data,  # Add data parameter
            partial=True  # Allow partial updates
        )
        
        if serializer.is_valid():
            serializer.save()  # This handles all field updates
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Product.DoesNotExist:
        return Response(
            {'detail': 'Product not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
def uploadImage(request):
    data = request.data
    
    try:
        product = Product.objects.get(_id=data['product_id'])
        serializer = ProductSerializer(
            instance=product,
            data={'image': request.FILES.get('image')},
            partial=True
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Product.DoesNotExist:
        return Response(
            {'detail': 'Product not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # 1 - Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 2 - No Rating or 0
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # 3 - Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review Added')






