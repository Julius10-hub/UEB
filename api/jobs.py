"""
Jobs API Handler for Vercel
Handles all job-related API endpoints
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

SAMPLE_JOBS = [
    {
        "id": 1,
        "title": "Mathematics Teacher",
        "company": "Greenfield High",
        "location": "Jinja",
        "type": "Full-time",
        "description": "Teach Mathematics to secondary school students",
        "requirements": "Bachelor's in Mathematics, teaching experience",
        "salary": "UGX 1,500,000 - 2,000,000",
        "deadline": "2026-05-30"
    },
    {
        "id": 2,
        "title": "School Counselor",
        "company": "Sunshine Academy",
        "location": "Kampala",
        "type": "Full-time",
        "description": "Provide academic and career counseling",
        "requirements": "Degree in Psychology or Counseling",
        "salary": "UGX 1,200,000 - 1,500,000",
        "deadline": "2026-06-15"
    },
    {
        "id": 3,
        "title": "IT Support Specialist",
        "company": "Kampala Tech Institute",
        "location": "Kampala",
        "type": "Contract",
        "description": "Maintain school IT infrastructure",
        "requirements": "Diploma in IT, network management skills",
        "salary": "UGX 800,000 - 1,000,000",
        "deadline": "2026-05-20"
    }
]

def handle(req, resource_id=None, params=None):
    method = req.get('method', 'GET')
    
    if method == 'OPTIONS':
        return get_response(200, {"message": "OK"})
    
    if method == 'GET' and resource_id is None:
        return get_response(200, {
            "success": True,
            "jobs": SAMPLE_JOBS,
            "total": len(SAMPLE_JOBS)
        })
    
    if method == 'GET' and resource_id:
        job = next((j for j in SAMPLE_JOBS if str(j["id"]) == resource_id), None)
        if job:
            return get_response(200, {"success": True, "job": job})
        return get_response(404, {"error": "Job not found"})
    
    if method == 'POST':
        return get_response(201, {"success": True, "message": "Job application submitted"})
    
    return get_response(405, {"error": "Method not allowed"})

