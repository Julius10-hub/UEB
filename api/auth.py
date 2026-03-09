"""
Auth API Handler for Vercel
Handles authentication-related API endpoints
"""

import json
import hashlib
import secrets

def get_response(status_code, body):
    """Helper to create response dict"""
    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        "body": json.dumps(body)
    }

# In-memory token storage (use Redis in production)
active_tokens = {}

def handle(req, resource_id=None, params=None):
    """Main handler for auth API"""
    method = req.get('method', 'GET')
    
    # Handle CORS preflight
    if method == 'OPTIONS':
        return get_response(200, {"message": "OK"})
    
    if resource_id == 'login':
        return handle_login(req)
    elif resource_id == 'register':
        return handle_register(req)
    elif resource_id == 'logout':
        return handle_logout(req)
    elif resource_id == 'me':
        return handle_me(req)
    elif resource_id == 'refresh':
        return handle_refresh(req)
    
    return get_response(404, {"error": "Auth endpoint not found"})

def handle_login(req):
    """Handle login request"""
    try:
        body = json.loads(req.get('body', '{}'))
        email = body.get('email', '')
        password = body.get('password', '')
        
        if not email or not password:
            return get_response(400, {"error": "Email and password required"})
        
        # Demo: Accept any login for now
        # In production: verify against database
        token = secrets.token_urlsafe(32)
        
        active_tokens[token] = {
            "email": email,
            "role": "admin" if "admin" in email else "user"
        }
        
        return get_response(200, {
            "success": True,
            "message": "Login successful",
            "token": token,
            "user": {
                "email": email,
                "role": "admin" if "admin" in email else "user"
            }
        })
    except Exception as e:
        return get_response(500, {"error": str(e)})

def handle_register(req):
    """Handle registration request"""
    try:
        body = json.loads(req.get('body', '{}'))
        email = body.get('email', '')
        password = body.get('password', '')
        name = body.get('name', '')
        
        if not email or not password:
            return get_response(400, {"error": "Email and password required"})
        
        # Demo: Return success
        return get_response(201, {
            "success": True,
            "message": "Registration successful"
        })
    except Exception as e:
        return get_response(500, {"error": str(e)})

def handle_logout(req):
    """Handle logout request"""
    auth_header = req.get('headers', {}).get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header[7:]
        if token in active_tokens:
            del active_tokens[token]
    
    return get_response(200, {"success": True, "message": "Logged out"})

def handle_me(req):
    """Get current user"""
    auth_header = req.get('headers', {}).get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return get_response(401, {"error": "Not authenticated"})
    
    token = auth_header[7:]
    user = active_tokens.get(token)
    
    if not user:
        return get_response(401, {"error": "Invalid token"})
    
    return get_response(200, {"success": True, "user": user})

def handle_refresh(req):
    """Refresh token"""
    return get_response(200, {"success": True, "message": "Token refreshed"})

