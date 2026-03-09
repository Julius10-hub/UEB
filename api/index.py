"""
Vercel API Entry Point
Routes all /api/* requests to appropriate handlers
"""

import json
import os

def parse_query_params(query_string):
    """Parse query string into dictionary"""
    if not query_string:
        return {}
    params = {}
    for pair in query_string.split('&'):
        if '=' in pair:
            key, value = pair.split('=', 1)
            params[key] = value
    return params

def parse_path(path):
    """Parse API path into endpoint and resource ID"""
    parts = path.strip('/').split('/')
    if len(parts) > 1:
        return parts[0], parts[1]
    return parts[0] if parts else None, None

def handler(req):
    """Main API handler for Vercel"""
    path = req.get('path', '')
    method = req.get('method', 'GET')
    query_string = req.get('query', '')
    
    # Parse the path
    endpoint, resource_id = parse_path(path)
    params = parse_query_params(query_string)
    
    # Route to appropriate handler
    if endpoint == 'schools':
        from api import schools
        return schools.handle(req, resource_id, params)
    
    elif endpoint == 'auth':
        from api import auth
        return auth.handle(req, resource_id, params)
    
    elif endpoint == 'bursaries':
        from api import bursaries
        return bursaries.handle(req, resource_id, params)
    
    elif endpoint == 'agents':
        from api import agents
        return agents.handle(req, resource_id, params)
    
    elif endpoint == 'events':
        from api import events
        return events.handle(req, resource_id, params)
    
    elif endpoint == 'jobs':
        from api import jobs
        return jobs.handle(req, resource_id, params)
    
    elif endpoint == 'past-papers':
        from api import past_papers
        return past_papers.handle(req, resource_id, params)
    
    elif endpoint == 'suggestions':
        from api import suggestions
        return suggestions.handle(req, resource_id, params)
    
    elif endpoint == 'stats':
        from api import stats
        return stats.handle(req, resource_id, params)
    
    # Default: 404
    return {
        "statusCode": 404,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"error": "Endpoint not found"})
    }

