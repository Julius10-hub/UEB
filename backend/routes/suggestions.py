"""Suggestions Routes"""
from flask import request, jsonify, session
from . import suggestions_bp
from ..models import Suggestion, db
from ..utils.decorators import admin_required


@suggestions_bp.route('', methods=['GET'])
@admin_required
def get_suggestions():
    """Get all suggestions (admin only)"""
    try:
        status = request.args.get('status')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = Suggestion.query
        
        if status:
            query = query.filter_by(status=status)
        
        suggestions = query.order_by(Suggestion.created_at.desc()).paginate(
            page=page, per_page=per_page
        )
        
        return jsonify({
            'suggestions': [s.to_dict(detailed=True) for s in suggestions.items],
            'total': suggestions.total,
            'pages': suggestions.pages,
            'current_page': page
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@suggestions_bp.route('/<int:suggestion_id>', methods=['GET'])
@admin_required
def get_suggestion(suggestion_id):
    """Get suggestion details (admin only)"""
    suggestion = Suggestion.query.get(suggestion_id)
    if not suggestion:
        return jsonify({'error': 'Suggestion not found'}), 404
    
    return jsonify({
        'suggestion': suggestion.to_dict(detailed=True)
    }), 200


@suggestions_bp.route('', methods=['POST'])
def create_suggestion():
    """Create suggestion"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['name', 'email', 'message']):
            return jsonify({'error': 'Missing required fields: name, email, message'}), 400
        
        suggestion = Suggestion(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            subject=data.get('subject'),
            suggestion_type=data.get('type', 'Feedback'),
            message=data['message'],
            rating=data.get('rating'),
            attachment_url=data.get('attachment_url')
        )
        
        db.session.add(suggestion)
        db.session.commit()
        
        return jsonify({
            'message': 'Thank you for your suggestion!',
            'suggestion_id': suggestion.id
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Submission failed: {str(e)}'}), 500


@suggestions_bp.route('/<int:suggestion_id>', methods=['PUT'])
@admin_required
def update_suggestion(suggestion_id):
    """Update suggestion status and response (admin only)"""
    try:
        suggestion = Suggestion.query.get(suggestion_id)
        if not suggestion:
            return jsonify({'error': 'Suggestion not found'}), 404
        
        data = request.get_json()
        
        if 'status' in data:
            suggestion.status = data['status']
        if 'response' in data:
            suggestion.response = data['response']
            from datetime import datetime
            suggestion.responded_at = datetime.utcnow()
        if 'assigned_to' in data:
            suggestion.assigned_to = data['assigned_to']
        if 'priority' in data:
            suggestion.priority = data['priority']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Suggestion updated successfully',
            'suggestion': suggestion.to_dict(detailed=True)
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@suggestions_bp.route('/<int:suggestion_id>', methods=['DELETE'])
@admin_required
def delete_suggestion(suggestion_id):
    """Delete suggestion (admin only)"""
    try:
        suggestion = Suggestion.query.get(suggestion_id)
        if not suggestion:
            return jsonify({'error': 'Suggestion not found'}), 404
        
        db.session.delete(suggestion)
        db.session.commit()
        
        return jsonify({'message': 'Suggestion deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
