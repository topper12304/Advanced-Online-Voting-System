#!/usr/bin/env python
"""
Django's command-line utility for administrative tasks.
This file is the entry point for running Django management commands.
"""
import os
import sys


def main():
    """
    Main function to execute Django management commands.
    Sets up the Django settings module and runs the command-line utility.
    """
    # Set the default Django settings module for the project
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voting_backend.settings')
    
    try:
        # Import Django's command-line utility
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        # Raise error if Django is not installed
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Execute the command passed via command line
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
