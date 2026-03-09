"""
Past Papers API Handler for Vercel
Handles all past paper-related API endpoints
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

SAMPLE_PAPERS = [
    {
        "id": 1,
        "title": "PLE Mathematics Past Papers 2025",
        "description": "Primary Leaving Examination Mathematics papers",
        "subject": "Mathematics",
        "level": "Primary",
        "year": 2025,
        "downloads": 1250,
        "file_url": "#"
    },
    {
        "id": 2,
        "title": "UCE Physics Past Papers 2024",
        "description": "Uganda Certificate of Education Physics papers",
        "subject": "Physics",
        "level": "Secondary",
        "year": 2024,
        "downloads": 890,
        "file_url": "#"
    },
    {
        "id": 3,
        "title": "UACE Biology Past Papers 2024",
        "description": "Uganda Advanced Certificate of Education Biology",
        "subject": "Biology",
        "level": "Advanced",
        "year": 2024,
        "downloads": 567,
        "file_url": "#"
    },
    {
        "id": 4,
        "title": "Mathematics KCSE Past Papers",
        "description": "Kenya Certificate of Secondary Education Math",
        "subject": "Mathematics",
        "level": "Secondary",
        "year": 2025,
        "downloads": 2100,
        "file_url": "#"
    }
]

def handle(req, resource_id=None, params=None):
    method = req.get('method', 'GET')
    
    if method == 'OPTIONS':
        return get_response(200, {"message": "OK"})
    
    if method == 'GET' and resource_id is None:
        return get_response(200, {
            "success": True,
            "past_papers": SAMPLE_PAPERS,
            "total": len(SAMPLE_PAPERS)
        })
    
    if method == 'GET' and resource_id:
        paper = next((p for p in SAMPLE_PAPERS if str(p["id"]) == resource_id), None)
        if paper:
            return get_response(200, {"success": True, "past_paper": paper})
        return get_response(404, {"error": "Past paper not found"})
    
    if method == 'POST':
        return get_response(201, {"success": True, "message": "Past paper uploaded"})
    
    return get_response(405, {"error": "Method not allowed"})

