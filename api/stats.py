"""
Stats API Handler for Vercel
Handles all statistics-related API endpoints
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

STATS_DATA = {
    "schools": {
        "total": 156,
        "by_category": {
            "kindergarten": 45,
            "primary": 52,
            "secondary": 38,
            "technical": 12,
            "university": 9
        },
        "by_region": {
            "kampala": 45,
            "jinja": 18,
            "mbarara": 15,
            "other": 78
        }
    },
    "bursaries": {
        "total": 28,
        "active": 15,
        "by_category": {
            "government": 8,
            "private": 12,
            "international": 8
        }
    },
    "agents": {
        "total": 24,
        "active": 20
    },
    "events": {
        "total": 12,
        "upcoming": 5
    },
    "jobs": {
        "total": 35,
        "open": 18
    },
    "past_papers": {
        "total": 156,
        "downloads": 45200
    },
    "users": {
        "total": 1250,
        "active": 890
    }
}

def handle(req, resource_id=None, params=None):
    method = req.get('method', 'GET')
    
    if method == 'OPTIONS':
        return get_response(200, {"message": "OK"})
    
    if method == 'GET':
        if resource_id:
            # Get specific stat
            stat = STATS_DATA.get(resource_id)
            if stat:
                return get_response(200, {"success": True, resource_id: stat})
            return get_response(404, {"error": "Stat not found"})
        
        # Get all stats
        return get_response(200, {
            "success": True,
            "stats": STATS_DATA
        })
    
    return get_response(405, {"error": "Method not allowed"})

