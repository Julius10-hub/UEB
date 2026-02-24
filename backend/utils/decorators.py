"""Decorators for authentication and authorization"""
from functools import wraps
from flask import session, jsonify, request
import os

# Secret key for token validation (should match frontend)
ADMIN_TOKEN_PREFIX = 'demo-admin-token-'
SYSTEMS_TOKEN_PREFIX = 'demo-systems-token-'
USER_TOKEN_PREFIX = 'demo-user-token-'


def extract_bearer_token(request_obj):
    """Extract Bearer token from Authorization header"""
    auth_header = request_obj.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        return auth_header[7:]  # Remove 'Bearer ' prefix
    return None


def validate_admin_token(token):
    """Validate if token belongs to admin"""
    return token and token.startswith(ADMIN_TOKEN_PREFIX)


def validate_systems_token(token):
    """Validate if token belongs to systems admin"""
    return token and token.startswith(SYSTEMS_TOKEN_PREFIX)


def login_required(f):
    """Decorator to check if user is logged in (via session or Bearer token)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check Bearer token first
        token = extract_bearer_token(request)
        if token and (token.startswith(ADMIN_TOKEN_PREFIX) or 
                     token.startswith(SYSTEMS_TOKEN_PREFIX) or 
                     token.startswith(USER_TOKEN_PREFIX)):
            return f(*args, **kwargs)
        
        # Fall back to session
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function


def admin_required(f):
    """Decorator to check if user is admin (via session or Bearer token)"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check Bearer token first
        token = extract_bearer_token(request)
        if token and validate_admin_token(token):
            # Admin token is valid
            return f(*args, **kwargs)
        
        # Fall back to session
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        if not session.get('is_admin'):
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated_function


def systems_required(f):
    """Decorator to check if user is systems admin"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check Bearer token
        token = extract_bearer_token(request)
        if token and validate_systems_token(token):
            return f(*args, **kwargs)
        
        # Fall back to session
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        if not session.get('is_systems'):
            return jsonify({'error': 'Systems access required'}), 403
        return f(*args, **kwargs)
    return decorated_function


def role_required(roles):
    """Decorator to check if user has required role"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check Bearer token
            token = extract_bearer_token(request)
            if token:
                # Token-based auth is valid for any specified role
                return f(*args, **kwargs)
            
            # Fall back to session
            if 'user_id' not in session:
                return jsonify({'error': 'Authentication required'}), 401
            user_role = session.get('role', 'user')
            if user_role not in roles:
                return jsonify({'error': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        return decorated_function
    return decorator
