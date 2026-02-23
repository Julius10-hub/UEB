"""Job Model"""
from datetime import datetime
from . import db


class Job(db.Model):
    """Job model for job listings"""
    
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    requirements = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(150), nullable=True, index=True)
    job_type = db.Column(db.String(50), nullable=True)  # Full-time, Part-time, Contract, Internship
    company = db.Column(db.String(150), nullable=True, index=True)
    salary_min = db.Column(db.Float, nullable=True)
    salary_max = db.Column(db.Float, nullable=True)
    currency = db.Column(db.String(10), default='USD')
    experience_level = db.Column(db.String(50), nullable=True)  # Entry, Mid, Senior
    deadline = db.Column(db.DateTime, nullable=True, index=True)
    status = db.Column(db.String(20), default='Active', index=True)  # Active, Closed, Filled
    applications_count = db.Column(db.Integer, default=0)
    is_featured = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    company_logo = db.Column(db.String(500), nullable=True)
    company_website = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self, detailed=False):
        """Convert job to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'job_type': self.job_type,
            'status': self.status,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if detailed:
            data.update({
                'description': self.description,
                'requirements': self.requirements,
                'salary_min': self.salary_min,
                'salary_max': self.salary_max,
                'currency': self.currency,
                'experience_level': self.experience_level,
                'deadline': self.deadline.isoformat() if self.deadline else None,
                'applications_count': self.applications_count,
                'company_logo': self.company_logo,
                'company_website': self.company_website
            })
        return data
    
    def __repr__(self):
        return f'<Job {self.title}>'
