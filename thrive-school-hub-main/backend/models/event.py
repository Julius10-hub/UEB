"""Event Model"""
from datetime import datetime
from . import db


class Event(db.Model):
    """Event model for activities and events"""
    
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    event_type = db.Column(db.String(50), nullable=True)  # Workshop, Seminar, Conference, etc.
    date = db.Column(db.DateTime, nullable=False, index=True)
    end_date = db.Column(db.DateTime, nullable=True)
    venue = db.Column(db.String(200), nullable=True)
    location = db.Column(db.String(150), nullable=True)
    capacity = db.Column(db.Integer, default=0)
    registered_count = db.Column(db.Integer, default=0)
    image = db.Column(db.String(500), nullable=True)
    organizer = db.Column(db.String(150), nullable=True)
    contact_email = db.Column(db.String(120), nullable=True)
    contact_phone = db.Column(db.String(20), nullable=True)
    status = db.Column(db.String(20), default='Upcoming', index=True)  # Upcoming, Ongoing, Completed, Cancelled
    is_featured = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self, detailed=False):
        """Convert event to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'date': self.date.isoformat() if self.date else None,
            'venue': self.venue,
            'location': self.location,
            'status': self.status,
            'image': self.image,
            'is_featured': self.is_featured
        }
        if detailed:
            data.update({
                'description': self.description,
                'event_type': self.event_type,
                'end_date': self.end_date.isoformat() if self.end_date else None,
                'capacity': self.capacity,
                'registered_count': self.registered_count,
                'organizer': self.organizer,
                'contact_email': self.contact_email,
                'contact_phone': self.contact_phone
            })
        return data
    
    def __repr__(self):
        return f'<Event {self.title}>'
