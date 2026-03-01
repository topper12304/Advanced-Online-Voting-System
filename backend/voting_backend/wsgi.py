"""
WSGI config for voting_backend project.
This file exposes the WSGI callable as a module-level variable named 'application'.
Used for deploying Django with WSGI-compatible web servers like Gunicorn.
"""

import os
from django.core.wsgi import get_wsgi_application

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_backend.settings')

# Get the WSGI application
application = get_wsgi_application()
