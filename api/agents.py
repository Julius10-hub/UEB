"""
Agents API Handler for Vercel
Handles all agent-related API endpoints
"""

import json

def get_response(status_code, body):
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

# Sample agents data
SAMPLE_AGENTS = [
    {
        "id": 1,
        "name": "John Mukama",
        "email": "john@edubridge.com",
        "phone": "+256 700 123456",
        "region": "Kampala",
        "specialization": "Primary & Secondary Schools",
        "rating": 4.8
    },
    {
        "id": 2,
        "name": "Sarah Nakato",
        "email": "sarah@edubridge.com",
        "phone": "+256 700 234567",
        "region": "Jinja & Eastern Uganda",
        "specialization": "Islamic Schools",
        "rating": 4.9
    },
    {
        "id": 3,
        "name": "David Okello",
        "email": "david@edubridge.com",
        "phone": "+256 700 345678",
        "region": "Western Uganda",
        "specialization": "Technical Institutes",
        "rating": 4.7
    }
]

def handle(req, resource_id=None, params=None):
    method = req.get('method', 'GET')
    
    if method == 'OPTIONS':
        return get_response(200, {"message": "OK"})
    
    if method == 'GET' and resource_id is None:
        return get_response(200, {
            "success": True,
            "agents": SAMPLE_AGENTS,
            "total": len(SAMPLE_AGENTS)
        })
    
    if method == 'GET' and resource_id:
        agent = next((a for a in SAMPLE_AGENTS if str(a["id"]) == resource_id), None)
        if agent:
            return get_response(200, {"success": True, "agent": agent})
        return get_response(404, {"error": "Agent not found"})
    
    if method == 'POST':
        return get_response(201, {"success": True, "message": "Agent registered successfully"})
    
    return get_response(405, {"error": "Method not allowed"})

