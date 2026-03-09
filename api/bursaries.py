"""
Bursaries API Handler for Vercel
Handles all bursary-related API endpoints
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

# Sample bursaries data
SAMPLE_BURSARIES = [
    {
        "id": 1,
        "name": "Uganda Government Bursary Scheme",
        "provider": "Ministry of Education",
        "description": "Government-funded bursary for students from disadvantaged backgrounds",
        "amount": "Up to UGX 2,000,000",
        "deadline": "2026-03-31",
        "eligibility": "Secondary school students with good academic performance",
        "category": "government"
    },
    {
        "id": 2,
        "name": "MTN Foundation Scholarship",
        "provider": "MTN Uganda",
        "description": "Full scholarship for bright students pursuing STEM courses",
        "amount": "Full tuition + stipend",
        "deadline": "2026-04-15",
        "eligibility": "University students in STEM fields",
        "category": "private"
    },
    {
        "id": 3,
        "name": "Islamic Development Bank Scholarship",
        "provider": "IsDB",
        "description": "Scholarship for Muslim students pursuing higher education",
        "amount": "Full tuition + living allowance",
        "deadline": "2026-05-01",
        "eligibility": "Muslim students with academic excellence",
        "category": "international"
    }
]

def handle(req, resource_id=None, params=None):
    method = req.get('method', 'GET')
    
    if method == 'OPTIONS':
        return get_response(200, {"message": "OK"})
    
    if method == 'GET' and resource_id is None:
        return get_response(200, {
            "success": True,
            "bursaries": SAMPLE_BURSARIES,
            "total": len(SAMPLE_BURSARIES)
        })
    
    if method == 'GET' and resource_id:
        bursary = next((b for b in SAMPLE_BURSARIES if str(b["id"]) == resource_id), None)
        if bursary:
            return get_response(200, {"success": True, "bursary": bursary})
        return get_response(404, {"error": "Bursary not found"})
    
    if method == 'POST':
        return get_response(201, {"success": True, "message": "Bursary application submitted"})
    
    return get_response(405, {"error": "Method not allowed"})

