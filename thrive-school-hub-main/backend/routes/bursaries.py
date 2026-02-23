"""Bursary Routes"""
from flask import request, jsonify
from . import bursaries_bp
from ..models import Bursary, db
from ..utils.decorators import admin_required


@bursaries_bp.route('', methods=['GET'])
def get_bursaries():
    """Get all bursaries with filtering"""
    try:
        bursary_type = request.args.get('type')
        education_level = request.args.get('level')
        field_of_study = request.args.get('field')
        featured = request.args.get('featured')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = Bursary.query.filter_by(is_active=True, status='Active')
        
        if bursary_type:
            query = query.filter_by(bursary_type=bursary_type)
        if education_level:
            query = query.filter_by(education_level=education_level)
        if field_of_study:
            query = query.filter(Bursary.field_of_study.ilike(f'%{field_of_study}%'))
        if featured == 'true':
            query = query.filter_by(is_featured=True)
        
        bursaries = query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'bursaries': [b.to_dict() for b in bursaries.items],
            'total': bursaries.total,
            'pages': bursaries.pages,
            'current_page': page
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@bursaries_bp.route('/<int:bursary_id>', methods=['GET'])
def get_bursary(bursary_id):
    """Get bursary details"""
    bursary = Bursary.query.get(bursary_id)
    if not bursary:
        return jsonify({'error': 'Bursary not found'}), 404
    
    return jsonify({
        'bursary': bursary.to_dict(detailed=True)
    }), 200


@bursaries_bp.route('', methods=['POST'])
@admin_required
def create_bursary():
    """Create bursary (admin only)"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['title', 'bursary_type']):
            return jsonify({'error': 'Missing required fields: title, bursary_type'}), 400
        
        bursary = Bursary(
            title=data['title'],
            bursary_type=data['bursary_type'],
            description=data.get('description'),
            amount=data.get('amount'),
            currency=data.get('currency', 'USD'),
            coverage_type=data.get('coverage_type'),
            eligibility_criteria=data.get('eligibility_criteria'),
            provider=data.get('provider'),
            provider_logo=data.get('provider_logo'),
            provider_website=data.get('provider_website'),
            education_level=data.get('education_level'),
            field_of_study=data.get('field_of_study'),
            award_frequency=data.get('award_frequency'),
            number_of_awards=data.get('number_of_awards', 0),
            is_featured=data.get('is_featured', False)
        )
        
        db.session.add(bursary)
        db.session.commit()
        
        return jsonify({
            'message': 'Bursary created successfully',
            'bursary': bursary.to_dict(detailed=True)
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Creation failed: {str(e)}'}), 500


@bursaries_bp.route('/<int:bursary_id>', methods=['PUT'])
@admin_required
def update_bursary(bursary_id):
    """Update bursary (admin only)"""
    try:
        bursary = Bursary.query.get(bursary_id)
        if not bursary:
            return jsonify({'error': 'Bursary not found'}), 404
        
        data = request.get_json()
        
        for field in ['title', 'bursary_type', 'description', 'amount', 'provider',
                      'education_level', 'field_of_study', 'status', 'is_featured']:
            if field in data:
                setattr(bursary, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Bursary updated successfully',
            'bursary': bursary.to_dict(detailed=True)
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bursaries_bp.route('/<int:bursary_id>', methods=['DELETE'])
@admin_required
def delete_bursary(bursary_id):
    """Delete bursary (admin only)"""
    try:
        bursary = Bursary.query.get(bursary_id)
        if not bursary:
            return jsonify({'error': 'Bursary not found'}), 404
        
        bursary.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Bursary deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
