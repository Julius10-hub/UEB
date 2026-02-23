"""Helper functions"""
from datetime import datetime, timedelta
import json


def format_datetime(dt):
    """Format datetime to ISO format"""
    if isinstance(dt, datetime):
        return dt.isoformat()
    return str(dt)


def get_pagination_info(page, per_page, total):
    """Generate pagination metadata"""
    return {
        'current_page': page,
        'per_page': per_page,
        'total': total,
        'total_pages': (total + per_page - 1) // per_page
    }


def calculate_age(birthdate):
    """Calculate age from birthdate"""
    today = datetime.today()
    return today.year - birthdate.year - ((today.month, today.day) < (birthdate.month, birthdate.day))


def get_date_range(days):
    """Get date range for last N days"""
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days)
    return start_date, end_date


def batch_items(items, batch_size):
    """Split items into batches"""
    for i in range(0, len(items), batch_size):
        yield items[i:i + batch_size]


def convert_bytes(bytes_value):
    """Convert bytes to human-readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_value < 1024.0:
            return f"{bytes_value:.2f}{unit}"
        bytes_value /= 1024.0
    return f"{bytes_value:.2f}TB"
