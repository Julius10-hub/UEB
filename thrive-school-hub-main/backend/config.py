"""
Application Configuration Settings
Development, Testing, and Production configurations
"""

import os
from datetime import timedelta


class Config:
    """Base configuration with common settings"""
    # Flask config
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production-12345')
    DEBUG = False
    TESTING = False
    
    # Session config
    PERMANENT_SESSION_LIFETIME = timedelta(days=7)
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # SQLAlchemy config
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    
    # CORS config
    CORS_ORIGINS = ["http://localhost:3000", "http://localhost:5000", "http://127.0.0.1:5000"]
    
    # API config
    JSON_SORT_KEYS = False
    JSONIFY_PRETTYPRINT_REGULAR = False


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SESSION_COOKIE_SECURE = False
    
    # MySQL Development Database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'mysql+pymysql://root:@localhost/thrive_school_dev'
    )
    
    # CORS for development
    CORS_ORIGINS = ["*"]


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    
    # In-memory SQLite for tests
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    
    # Disable CSRF for testing
    WTF_CSRF_ENABLED = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    
    # MySQL Production Database - change these in production
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'mysql+pymysql://user:password@localhost/thrive_school_prod'
    )
    
    # Strict CORS in production
    CORS_ORIGINS = [
        "https://yourdomain.com",
        "https://www.yourdomain.com"
    ]


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}


def get_config():
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'development')
    return config.get(env, config['default'])
