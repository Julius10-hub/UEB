"""Past Paper Model"""
from datetime import datetime
from . import db


class PastPaper(db.Model):
    """PastPaper model for study materials"""
    
    __tablename__ = 'past_papers'
    
    id = db.Column(db.Integer, primary_key=True, index=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    subject = db.Column(db.String(100), nullable=False, index=True)
    subject_code = db.Column(db.String(50), nullable=True)
    year = db.Column(db.Integer, nullable=False, index=True)
    exam_board = db.Column(db.String(100), nullable=True)  # Cambridge, IB, IGCSE, etc.
    category = db.Column(db.String(50), nullable=False, index=True)  # Primary, Secondary, Tertiary
    level = db.Column(db.String(50), nullable=True)  # O-Level, A-Level, Form 4, etc.
    paper_number = db.Column(db.Integer, nullable=True)
    duration = db.Column(db.String(50), nullable=True)  # e.g., "2 hours"
    file_url = db.Column(db.String(500), nullable=True)
    download_url = db.Column(db.String(500), nullable=True)
    solution_url = db.Column(db.String(500), nullable=True)
    file_size = db.Column(db.String(50), nullable=True)
    file_type = db.Column(db.String(20), nullable=True)  # PDF, DOC, etc.
    download_count = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0.0)
    total_reviews = db.Column(db.Integer, default=0)
    difficulty_level = db.Column(db.String(50), nullable=True)  # Easy, Medium, Hard
    is_featured = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    provider = db.Column(db.String(150), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def increment_download_count(self):
        """Increment download counter"""
        self.download_count += 1
        db.session.commit()
    
    def update_rating(self, rating_value):
        """Update rating"""
        self.total_reviews += 1
        self.rating = ((self.rating * (self.total_reviews - 1)) + rating_value) / self.total_reviews
        db.session.commit()
    
    def to_dict(self, detailed=False):
        """Convert past paper to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'subject': self.subject,
            'year': self.year,
            'category': self.category,
            'level': self.level,
            'download_url': self.download_url,
            'is_featured': self.is_featured,
            'rating': self.rating,
            'download_count': self.download_count
        }
        if detailed:
            data.update({
                'subject_code': self.subject_code,
                'exam_board': self.exam_board,
                'paper_number': self.paper_number,
                'duration': self.duration,
                'file_size': self.file_size,
                'file_type': self.file_type,
                'total_reviews': self.total_reviews,
                'difficulty_level': self.difficulty_level,
                'provider': self.provider
            })
        return data
    
    def __repr__(self):
        return f'<PastPaper {self.subject} {self.year}>'
