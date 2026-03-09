"""
Events API Handler for Vercel
Handles all event-related API endpoints
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

# Sample events data
SAMPLE_EVENTS = [
    {
        "id": 1,
        "title": "Open Day - Sunshine Academy",
        "description": "Visit our campus and meet our teachers",
        "date": "2026-04-15",
        "time": "10:00 AM - 2:00 PM",
        "location": "Main Campus, Kampala",
        "category": "open-day"
    },
    {
        "id": 2,
        "title": "STEM Workshop for Kids",
        "description": "Hands-on science experiments for children aged 8-14",
        "date": "2026-04-20",
        "time": "9:00 AM - 12:00 PM",
        "location": "Science Lab, Kampala",
        "category": "workshop"
    },
    {
        "id": 3,
        "title": "University Fair 2026",
        "description": "Meet representatives from 20+ universities",
        "date": "2026-04-25",
        "time": "11:00 AM - 4:00 PM",
        "location": "Kampala Convention Center",
        "category": "fair"
    }
]

def handle(req, resource_id=None, params=None):
    method = req.get('method', 'GET')
    
    if method == 'OPTIONS':
        return get_response(200, {"message": "OK"})
    
    if method == 'GET' and resource_id is None:
        return get_response(200, {
            "success": True,
            "events": SAMPLE_EVENTS,
            "total": len(SAMPLE_EVENTS)
        })
    
    if method == 'GET' and resource_id:
        event = next((e for e in SAMPLE_EVENTS if str(e["id"]) == resource_id), None)
        if event:
            return get_response(200, {"success": True, "event": event})
        return get_response(404, {"error": "Event not found"})
    
    if method == 'POST':
        return get_response(201, {"success": True, "message": "Event created successfully"})
    
    return get_response(405, {"error": "Method not allowed"})

