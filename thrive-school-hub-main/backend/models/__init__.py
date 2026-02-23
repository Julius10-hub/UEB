"""
Database Models Package
Centralized imports for all database models
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .user import User
from .school import School
from .event import Event
from .job import Job
from .bursary import Bursary
from .agent import Agent
from .past_paper import PastPaper
from .suggestion import Suggestion

__all__ = [
    'db',
    'User',
    'School',
    'Event',
    'Job',
    'Bursary',
    'Agent',
    'PastPaper',
    'Suggestion'
]
