"""Suggestion Model"""
from datetime import datetime
from . import db


class Suggestion(db.Model):
    """Suggestion model for user feedback"""
    
    __tablename__ = 'suggestions'
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    name = db.Column(db.String(120), nullable=False, index=True)
    email = db.Column(db.String(120), nullable=False, index=True)
    phone = db.Column(db.String(20), nullable=True)
    subject = db.Column(db.String(200), nullable=True)
    suggestion_type = db.Column(db.String(50), nullable=True)  # Feedback, Bug Report, Feature Request, etc.
    message = db.Column(db.Text, nullable=False)
    priority = db.Column(db.String(20), default='Normal', index=True)  # Low, Normal, High, Critical
    status = db.Column(db.String(20), default='New', index=True)  # New, In Review, In Progress, Completed, Rejected
    assigned_to = db.Column(db.String(120), nullable=True)
    response = db.Column(db.Text, nullable=True)
    responded_at = db.Column(db.DateTime, nullable=True)
    is_public = db.Column(db.Boolean, default=False)
    rating = db.Column(db.Integer, nullable=True)  # 1-5 star rating
    attachment_url = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self, detailed=False):
        """Convert suggestion to dictionary"""
        data = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'suggestion_type': self.suggestion_type,
            'message': self.message,
            'status': self.status,
            'priority': self.priority,
            'rating': self.rating,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        if detailed:
            data.update({
                'phone': self.phone,
                'assigned_to': self.assigned_to,
                'response': self.response,
                'responded_at': self.responded_at.isoformat() if self.responded_at else None,
                'is_public': self.is_public,
                'attachment_url': self.attachment_url
            })
        return data
    
    def __repr__(self):
        return f'<Suggestion {self.subject}>'
