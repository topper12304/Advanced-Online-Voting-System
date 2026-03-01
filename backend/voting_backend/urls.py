"""
URL configuration for voting_backend project.
This file defines all the URL routes for the application.
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # Django admin interface
    path('admin/', admin.site.urls),
    
    # API endpoints - all routes under /api/
    path('api/', include('api.urls')),
]
