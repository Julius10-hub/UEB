"""Bursary Model"""
from datetime import datetime
from . import db


class Bursary(db.Model):
    """Bursary model for financial support"""
    
    __tablename__ = 'bursaries'
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    bursary_type = db.Column(db.String(100), nullable=False, index=True)  # Scholarship, Grant, Loan, etc.
    description = db.Column(db.Text, nullable=True)
    amount = db.Column(db.Float, nullable=True)
    currency = db.Column(db.String(10), default='USD')
    coverage_type = db.Column(db.String(100), nullable=True)  # Full, Partial, Tuition, Accommodation, etc.
    eligibility_criteria = db.Column(db.Text, nullable=True)
    application_deadline = db.Column(db.DateTime, nullable=True, index=True)
    provider = db.Column(db.String(150), nullable=True, index=True)
    provider_logo = db.Column(db.String(500), nullable=True)
    provider_website = db.Column(db.String(500), nullable=True)
    education_level = db.Column(db.String(100), nullable=True)  # Primary, Secondary, Tertiary
    field_of_study = db.Column(db.String(150), nullable=True)
    award_frequency = db.Column(db.String(50), nullable=True)  # One-time, Annual, etc.
    number_of_awards = db.Column(db.Integer, default=0)
    status = db.Column(db.String(20), default='Active', index=True)  # Active, Closed, Pending
    is_featured = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self, detailed=False):
        """Convert bursary to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'bursary_type': self.bursary_type,
            'amount': self.amount,
            'currency': self.currency,
            'provider': self.provider,
            'status': self.status,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if detailed:
            data.update({
                'description': self.description,
                'coverage_type': self.coverage_type,
                'eligibility_criteria': self.eligibility_criteria,
                'application_deadline': self.application_deadline.isoformat() if self.application_deadline else None,
                'provider_logo': self.provider_logo,
                'provider_website': self.provider_website,
                'education_level': self.education_level,
                'field_of_study': self.field_of_study,
                'award_frequency': self.award_frequency,
                'number_of_awards': self.number_of_awards
            })
        return data
    
    def __repr__(self):
        return f'<Bursary {self.title}>'
