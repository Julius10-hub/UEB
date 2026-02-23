"""Routes Package - API Endpoints"""
from flask import Blueprint

# Create blueprints
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
schools_bp = Blueprint('schools', __name__, url_prefix='/api/schools')
events_bp = Blueprint('events', __name__, url_prefix='/api/events')
jobs_bp = Blueprint('jobs', __name__, url_prefix='/api/jobs')
bursaries_bp = Blueprint('bursaries', __name__, url_prefix='/api/bursaries')
agents_bp = Blueprint('agents', __name__, url_prefix='/api/agents')
past_papers_bp = Blueprint('past_papers', __name__, url_prefix='/api/past-papers')
suggestions_bp = Blueprint('suggestions', __name__, url_prefix='/api/suggestions')
stats_bp = Blueprint('stats', __name__, url_prefix='/api/stats')

# Import and register
from . import auth, schools, events, jobs, bursaries, agents, past_papers, suggestions, stats

def register_blueprints(app):
    """Register all blueprints with app"""
    app.register_blueprint(auth.auth_bp)
    app.register_blueprint(schools.schools_bp)
    app.register_blueprint(events.events_bp)
    app.register_blueprint(jobs.jobs_bp)
    app.register_blueprint(bursaries.bursaries_bp)
    app.register_blueprint(agents.agents_bp)
    app.register_blueprint(past_papers.past_papers_bp)
    app.register_blueprint(suggestions.suggestions_bp)
    app.register_blueprint(stats.stats_bp)

__all__ = ['register_blueprints']
