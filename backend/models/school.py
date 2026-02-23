"""School Model"""
from datetime import datetime
from . import db


class School(db.Model):
    """School model for educational institutions"""
    
    __tablename__ = 'schools'
    
    CATEGORIES = ['Kindergarten', 'Nursery', 'Primary', 'Secondary', 'Technical', 'University']
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    name = db.Column(db.String(150), nullable=False, index=True)
    location = db.Column(db.String(150), nullable=False, index=True)
    city = db.Column(db.String(100), nullable=True, index=True)
    country = db.Column(db.String(100), nullable=True)
    description = db.Column(db.Text, nullable=True)
    long_description = db.Column(db.Text, nullable=True)
    students = db.Column(db.Integer, default=0)
    faculty = db.Column(db.Integer, default=0)
    image = db.Column(db.String(500), nullable=True)
    logo = db.Column(db.String(500), nullable=True)
    established = db.Column(db.Integer, nullable=True)
    category = db.Column(db.String(50), nullable=False, index=True)
    programs = db.Column(db.JSON, default=list)
    contact_email = db.Column(db.String(120), nullable=True)
    contact_phone = db.Column(db.String(20), nullable=True)
    website = db.Column(db.String(500), nullable=True)
    rating = db.Column(db.Float, default=0.0)
    total_reviews = db.Column(db.Integer, default=0)
    is_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True, index=True)
    meta_keywords = db.Column(db.String(500), nullable=True)
    meta_description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def update_rating(self, rating_value):
        """Update school rating"""
        self.total_reviews += 1
        self.rating = ((self.rating * (self.total_reviews - 1)) + rating_value) / self.total_reviews
        db.session.commit()
    
    def to_dict(self, detailed=False):
        """Convert school to dictionary"""
        data = {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'city': self.city,
            'country': self.country,
            'description': self.description,
            'students': self.students,
            'image': self.image,
            'established': self.established,
            'category': self.category,
            'programs': self.programs or [],
            'rating': self.rating,
            'is_verified': self.is_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if detailed:
            data.update({
                'long_description': self.long_description,
                'faculty': self.faculty,
                'logo': self.logo,
                'contact_email': self.contact_email,
                'contact_phone': self.contact_phone,
                'website': self.website,
                'total_reviews': self.total_reviews,
                'is_active': self.is_active
            })
        return data
    
    def __repr__(self):
        return f'<School {self.name}>'
