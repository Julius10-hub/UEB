"""
Suggestions API Handler for Vercel
Handles all suggestion-related API endpoints
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

SAMPLE_SUGGESTIONS = [
    {
        "id": 1,
        "name": "Mary Wanjiku",
        "email": "mary@email.com",
        "category": "school",
        "subject": "Add more schools in Northern Uganda",
        "message": "Please consider adding more schools from Gulu, Lira, and other northern regions.",
        "status": "pending",
        "created_at": "2026-01-15"
    },
    {
        "id": 2,
        "name": "James Odhiambo",
        "email": "james@email.com",
        "category": "bursary",
        "subject": "More scholarship information",
        "message": "It would be helpful to have more details about scholarship requirements.",
        "status": "reviewed",
        "created_at": "2026-02-10"
    }
]

def handle(req, resource_id=None, params=None):
    method = req.get('method', 'GET')
    
    if method == 'OPTIONS':
        return get_response(200, {"message": "OK"})
    
    if method == 'GET' and resource_id is None:
        return get_response(200, {
            "success": True,
            "suggestions": SAMPLE_SUGGESTIONS,
            "total": len(SAMPLE_SUGGESTIONS)
        })
    
    if method == 'GET' and resource_id:
        suggestion = next((s for s in SAMPLE_SUGGESTIONS if str(s["id"]) == resource_id), None)
        if suggestion:
            return get_response(200, {"success": True, "suggestion": suggestion})
        return get_response(404, {"error": "Suggestion not found"})
    
    if method == 'POST':
        return get_response(201, {"success": True, "message": "Suggestion submitted successfully"})
    
    return get_response(405, {"error": "Method not allowed"})

