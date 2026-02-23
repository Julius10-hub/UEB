"""Validators for data validation"""
import re
from datetime import datetime


def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password):
    """Validate password strength"""
    if len(password) < 6:
        return False, 'Password must be at least 6 characters'
    if not any(c.isupper() for c in password):
        return True, 'Consider using uppercase letters'
    if not any(c.isdigit() for c in password):
        return True, 'Consider using numbers'
    return True, 'Password is strong'


def validate_phone(phone):
    """Validate phone number format"""
    pattern = r'^[\d\s\-\+\(\)]{7,}$'
    return re.match(pattern, phone) is not None


def validate_date(date_string, format='%Y-%m-%d'):
    """Validate date format"""
    try:
        datetime.strptime(date_string, format)
        return True
    except ValueError:
        return False


def validate_required_fields(data, required_fields):
    """Validate that all required fields are present"""
    missing = [field for field in required_fields if field not in data or not data[field]]
    return len(missing) == 0, missing


def sanitize_string(value):
    """Remove potentially harmful characters from string"""
    if not isinstance(value, str):
        return value
    return ''.join(c for c in value if c.isprintable())
