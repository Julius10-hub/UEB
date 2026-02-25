"""
Main Flask Application Factory
World-class backend with MySQL integration
"""

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os
from pathlib import Path
import logging

from .config import get_config
from .models import db, User, School, Event, Job, Bursary, Agent, PastPaper, Suggestion
from .routes import register_blueprints


def create_app(config=None):
    """Application factory function"""
    
    # Create Flask app
    app = Flask(__name__, 
                static_folder=os.path.join(os.path.dirname(__file__), '..', 'frontend', 'static'),
                static_url_path='/static',
                template_folder=os.path.join(os.path.dirname(__file__), '..', 'frontend', 'templates'))
    
    # Load configuration
    if config is None:
        config = get_config()
    app.config.from_object(config)
    
    # Initialize database
    db.init_app(app)
    
    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": app.config.get('CORS_ORIGINS', ["*"]),
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register blueprints (API routes)
    register_blueprints(app)
    
    # Register frontend routes
    register_frontend_routes(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    # Setup logging
    setup_logging(app)
    
    return app


def register_error_handlers(app):
    """Register global error handlers"""
    
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request'}), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized'}), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden'}), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def server_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(Exception)
    def handle_exception(error):
        app.logger.error(f'Unhandled exception: {str(error)}')
        return jsonify({'error': 'An error occurred'}), 500


def register_frontend_routes(app):
    """Register frontend HTML routes"""
    
    frontend_path = os.path.join(os.path.dirname(__file__), '..', 'frontend')
    
    @app.route('/')
    def index():
        from flask import send_file
        return send_file(os.path.join(frontend_path, 'index.html'))
    
    @app.route('/<path:filename>')
    def serve_static(filename):
        if filename.endswith('.html'):
            return send_from_directory(frontend_path, filename)
        return send_from_directory(app.static_folder, filename)


def setup_logging(app):
    """Setup application logging"""
    if not app.debug:
        # File handler
        logs_dir = Path('logs')
        logs_dir.mkdir(exist_ok=True)
        
        file_handler = logging.FileHandler(logs_dir / 'thrive_school.log')
        file_handler.setLevel(logging.INFO)
        
        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        file_handler.setFormatter(formatter)
        
        app.logger.addHandler(file_handler)
        app.logger.setLevel(logging.INFO)


if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
