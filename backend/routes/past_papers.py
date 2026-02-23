"""Past Papers Routes"""
from flask import request, jsonify
from . import past_papers_bp
from ..models import PastPaper, db
from ..utils.decorators import admin_required, login_required


@past_papers_bp.route('', methods=['GET'])
def get_past_papers():
    """Get all past papers with filtering"""
    try:
        subject = request.args.get('subject')
        category = request.args.get('category')
        year = request.args.get('year', type=int)
        exam_board = request.args.get('board')
        featured = request.args.get('featured')
        search = request.args.get('search')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = PastPaper.query.filter_by(is_active=True)
        
        if subject:
            query = query.filter_by(subject=subject)
        if category:
            query = query.filter_by(category=category)
        if year:
            query = query.filter_by(year=year)
        if exam_board:
            query = query.filter_by(exam_board=exam_board)
        if featured == 'true':
            query = query.filter_by(is_featured=True)
        if search:
            query = query.filter(PastPaper.title.ilike(f'%{search}%'))
        
        papers = query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'papers': [p.to_dict() for p in papers.items],
            'total': papers.total,
            'pages': papers.pages,
            'current_page': page
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@past_papers_bp.route('/<int:paper_id>', methods=['GET'])
def get_past_paper(paper_id):
    """Get past paper details"""
    paper = PastPaper.query.get(paper_id)
    if not paper:
        return jsonify({'error': 'Paper not found'}), 404
    
    return jsonify({
        'paper': paper.to_dict(detailed=True)
    }), 200


@past_papers_bp.route('/<int:paper_id>/download', methods=['POST'])
@login_required
def download_paper(paper_id):
    """Track paper download"""
    try:
        paper = PastPaper.query.get(paper_id)
        if not paper:
            return jsonify({'error': 'Paper not found'}), 404
        
        paper.increment_download_count()
        
        return jsonify({
            'message': 'Download recorded',
            'download_url': paper.download_url
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@past_papers_bp.route('', methods=['POST'])
@admin_required
def create_past_paper():
    """Create past paper (admin only)"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['title', 'subject', 'year', 'category']):
            return jsonify({'error': 'Missing required fields: title, subject, year, category'}), 400
        
        paper = PastPaper(
            title=data['title'],
            subject=data['subject'],
            subject_code=data.get('subject_code'),
            year=data['year'],
            exam_board=data.get('exam_board'),
            category=data['category'],
            level=data.get('level'),
            paper_number=data.get('paper_number'),
            duration=data.get('duration'),
            file_url=data.get('file_url'),
            download_url=data.get('download_url'),
            solution_url=data.get('solution_url'),
            file_size=data.get('file_size'),
            file_type=data.get('file_type'),
            difficulty_level=data.get('difficulty_level'),
            provider=data.get('provider'),
            is_featured=data.get('is_featured', False)
        )
        
        db.session.add(paper)
        db.session.commit()
        
        return jsonify({
            'message': 'Paper created successfully',
            'paper': paper.to_dict(detailed=True)
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Creation failed: {str(e)}'}), 500


@past_papers_bp.route('/<int:paper_id>', methods=['PUT'])
@admin_required
def update_past_paper(paper_id):
    """Update past paper (admin only)"""
    try:
        paper = PastPaper.query.get(paper_id)
        if not paper:
            return jsonify({'error': 'Paper not found'}), 404
        
        data = request.get_json()
        
        for field in ['title', 'subject', 'year', 'category', 'exam_board',
                      'level', 'download_url', 'is_featured', 'difficulty_level']:
            if field in data:
                setattr(paper, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Paper updated successfully',
            'paper': paper.to_dict(detailed=True)
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@past_papers_bp.route('/<int:paper_id>', methods=['DELETE'])
@admin_required
def delete_past_paper(paper_id):
    """Delete past paper (admin only)"""
    try:
        paper = PastPaper.query.get(paper_id)
        if not paper:
            return jsonify({'error': 'Paper not found'}), 404
        
        paper.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Paper deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@past_papers_bp.route('/subjects', methods=['GET'])
def get_subjects():
    """Get all unique subjects"""
    subjects = db.session.query(PastPaper.subject).distinct().all()
    return jsonify({
        'subjects': [s[0] for s in subjects if s[0]]
    }), 200
