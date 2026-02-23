"""Statistics Routes"""
from flask import jsonify
from . import stats_bp
from ..models import User, School, Event, Job, Bursary, Agent, PastPaper, Suggestion


@stats_bp.route('', methods=['GET'])
def get_statistics():
    """Get platform statistics"""
    try:
        stats = {
            'users': User.query.count(),
            'schools': School.query.filter_by(is_active=True).count(),
            'events': Event.query.filter_by(is_active=True).count(),
            'jobs': Job.query.filter_by(is_active=True, status='Active').count(),
            'bursaries': Bursary.query.filter_by(is_active=True, status='Active').count(),
            'agents': Agent.query.filter_by(is_active=True, verification_status='Verified').count(),
            'past_papers': PastPaper.query.filter_by(is_active=True).count(),
            'suggestions': Suggestion.query.count(),
            'total_students': sum([s.students for s in School.query.all()]) or 0,
            'verified_schools': School.query.filter_by(is_verified=True).count()
        }
        
        return jsonify(stats), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@stats_bp.route('/categories', methods=['GET'])
def get_category_stats():
    """Get statistics by school category"""
    try:
        from sqlalchemy import func
        
        category_stats = School.query.with_entities(
            School.category,
            func.count(School.id).label('count'),
            func.sum(School.students).label('total_students')
        ).filter_by(is_active=True).group_by(School.category).all()
        
        return jsonify({
            'categories': [{
                'category': cat[0],
                'count': cat[1],
                'total_students': cat[2] or 0
            } for cat in category_stats]
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
