"""
API URL Configuration
Defines all API endpoints for the voting system
"""

from django.urls import path
from . import views

urlpatterns = [
    # Health check endpoint
    path('health/', views.health_check, name='health_check'),
    
    # Authentication endpoints
    path('auth/login/', views.login, name='login'),
    path('auth/verify-biometric/', views.verify_biometric, name='verify_biometric'),
    path('auth/election/current/', views.get_current_election, name='current_election'),
    
    # Voting endpoints
    path('voting/cast/', views.cast_vote, name='cast_vote'),
    path('voting/verify/<str:receipt_id>/', views.verify_receipt, name='verify_receipt'),
    path('voting/stats/', views.get_voting_stats, name='voting_stats'),
    
    # Admin endpoints
    path('admin/dashboard/stats/', views.get_dashboard_stats, name='dashboard_stats'),
    path('admin/votes/recent/', views.get_recent_votes, name='recent_votes'),
    path('admin/logs/', views.get_system_logs, name='system_logs'),
]
