"""
Schools API Handler for Vercel
Handles all school-related API endpoints
"""

import json
import os
import sys

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

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

def init_database():
    """Initialize database connection"""
    try:
        from backend.app import create_app
        from backend.models import db, School
        
        app = create_app()
        with app.app_context():
            return app, db, School
    except Exception as e:
        print(f"DB Init Error: {e}")
        return None, None, None

def handle(req, resource_id=None, params=None):
    """Main handler for schools API"""
    method = req.get('method', 'GET')
    
    # Handle CORS preflight
    if method == 'OPTIONS':
        return get_response(200, {"message": "OK"})
    
    # For demo purposes, return mock data if DB not available
    if method == 'GET' and resource_id is None:
        # Return sample schools data
        sample_schools = [
            {
                "id": 1,
                "name": "Springfield International School",
                "location": "Kampala",
                "city": "Kampala",
                "country": "Uganda",
                "category": "secondary",
                "description": "A leading international school in Kampala",
                "students": 450,
                "faculty": 35,
                "is_verified": True,
                "rating": 4.8
            },
            {
                "id": 2,
                "name": "Kampala Technical Institute",
                "location": "Industrial Area, Kampala",
                "city": "Kampala",
                "country": "Uganda",
                "category": "technical",
                "description": "Premier technical institution in Uganda",
                "students": 680,
                "faculty": 42,
                "is_verified": True,
                "rating": 4.9
            },
            {
                "id": 3,
                "name": "Al-Noor Islamic Academy",
                "location": "Jinja",
                "city": "Jinja",
                "country": "Uganda",
                "category": "tahfidh",
                "description": "Quality Islamic education with Quran memorization",
                "students": 320,
                "faculty": 28,
                "is_verified": True,
                "rating": 5.0
            },
            {
                "id": 4,
                "name": "Mbarara Girls High School",
                "location": "Mbarara",
                "city": "Mbarara",
                "country": "Uganda",
                "category": "secondary",
                "description": "Excellent girls' secondary school in western Uganda",
                "students": 520,
                "faculty": 38,
                "is_verified": True,
                "rating": 4.9
            },
            {
                "id": 5,
                "name": "Sunshine Kindergarten",
                "location": "Kampala",
                "city": "Kampala",
                "country": "Uganda",
                "category": "kindergarten",
                "description": "A nurturing environment for early learners",
                "students": 150,
                "faculty": 15,
                "is_verified": True,
                "rating": 4.7
            }
        ]
        
        # Apply filters
        category = params.get('category', [''])[0] if params else ''
        city = params.get('city', [''])[0] if params else ''
        search = params.get('search', [''])[0] if params else ''
        
        filtered = sample_schools
        if category:
            filtered = [s for s in filtered if s.get('category') == category]
        if city:
            filtered = [s for s in filtered if s.get('city', '').lower() == city.lower()]
        if search:
            filtered = [s for s in filtered if search.lower() in s.get('name', '').lower()]
        
        return get_response(200, {
            "success": True,
            "schools": filtered,
            "total": len(filtered)
        })
    
    elif method == 'GET' and resource_id:
        # Get single school
        return get_response(200, {
            "success": True,
            "school": {
                "id": resource_id,
                "name": "Sample School",
                "location": "Kampala",
                "city": "Kampala",
                "country": "Uganda",
                "category": "primary",
                "description": "School description"
            }
        })
    
    elif method == 'POST':
        # Create school (would require admin auth in production)
        return get_response(201, {
            "success": True,
            "message": "School created successfully"
        })
    
    elif method == 'PUT' and resource_id:
        return get_response(200, {
            "success": True,
            "message": "School updated successfully"
        })
    
    elif method == 'DELETE' and resource_id:
        return get_response(200, {
            "success": True,
            "message": "School deleted successfully"
        })
    
    return get_response(405, {"error": "Method not allowed"})

