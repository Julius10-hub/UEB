"""Agent Model"""
from datetime import datetime
from . import db


class Agent(db.Model):
    """Agent model for education agents"""
    
    __tablename__ = 'agents'
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    name = db.Column(db.String(120), nullable=False, index=True)
    email = db.Column(db.String(120), nullable=True, index=True)
    contact = db.Column(db.String(20), nullable=True)
    phone_number = db.Column(db.String(20), nullable=True)
    organization = db.Column(db.String(150), nullable=True, index=True)
    region = db.Column(db.String(100), nullable=True, index=True)
    country = db.Column(db.String(100), nullable=True)
    promo_code = db.Column(db.String(50), unique=True, nullable=True, index=True)
    commission_percentage = db.Column(db.Float, default=10.0)
    students_referred = db.Column(db.Integer, default=0)
    total_enrollments = db.Column(db.Integer, default=0)
    total_commission = db.Column(db.Float, default=0.0)
    profile_image = db.Column(db.String(500), nullable=True)
    bio = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='Active', index=True)  # Active, Inactive, Suspended
    verification_status = db.Column(db.String(20), default='Pending', index=True)  # Pending, Verified, Rejected
    is_featured = db.Column(db.Boolean, default=False)
    rating = db.Column(db.Float, default=0.0)
    total_reviews = db.Column(db.Integer, default=0)
    bank_account = db.Column(db.String(100), nullable=True)
    tax_id = db.Column(db.String(50), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_activity = db.Column(db.DateTime, nullable=True)
    
    def to_dict(self, detailed=False):
        """Convert agent to dictionary"""
        data = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'organization': self.organization,
            'region': self.region,
            'promo_code': self.promo_code,
            'students_referred': self.students_referred,
            'status': self.status,
            'rating': self.rating,
            'is_featured': self.is_featured,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if detailed:
            data.update({
                'phone_number': self.phone_number,
                'country': self.country,
                'commission_percentage': self.commission_percentage,
                'total_enrollments': self.total_enrollments,
                'total_commission': self.total_commission,
                'profile_image': self.profile_image,
                'bio': self.bio,
                'verification_status': self.verification_status,
                'total_reviews': self.total_reviews
            })
        return data
    
    def __repr__(self):
        return f'<Agent {self.name}>'
