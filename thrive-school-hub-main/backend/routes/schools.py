"""School Routes"""
from flask import request, jsonify, session
from . import schools_bp
from ..models import School, User, db
from ..utils.decorators import admin_required


@schools_bp.route('', methods=['GET'])
def get_schools():
    """Get all schools with filtering"""
    try:
        # Filters
        category = request.args.get('category')
        city = request.args.get('city')
        search = request.args.get('search')
        is_verified = request.args.get('verified')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = School.query.filter_by(is_active=True)
        
        if category:
            query = query.filter_by(category=category)
        if city:
            query = query.filter_by(city=city)
        if is_verified == 'true':
            query = query.filter_by(is_verified=True)
        if search:
            query = query.filter(School.name.ilike(f'%{search}%'))
        
        # Pagination
        schools = query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'schools': [s.to_dict() for s in schools.items],
            'total': schools.total,
            'pages': schools.pages,
            'current_page': page
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@schools_bp.route('/<int:school_id>', methods=['GET'])
def get_school(school_id):
    """Get single school details"""
    school = School.query.get(school_id)
    if not school:
        return jsonify({'error': 'School not found'}), 404
    
    return jsonify({
        'school': school.to_dict(detailed=True)
    }), 200


@schools_bp.route('', methods=['POST'])
@admin_required
def create_school():
    """Create new school (admin only)"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['name', 'location', 'category']):
            return jsonify({'error': 'Missing required fields: name, location, category'}), 400
        
        school = School(
            name=data['name'],
            location=data['location'],
            city=data.get('city'),
            country=data.get('country'),
            description=data.get('description'),
            long_description=data.get('long_description'),
            students=data.get('students', 0),
            faculty=data.get('faculty', 0),
            image=data.get('image'),
            logo=data.get('logo'),
            established=data.get('established'),
            category=data['category'],
            programs=data.get('programs', []),
            contact_email=data.get('contact_email'),
            contact_phone=data.get('contact_phone'),
            website=data.get('website'),
            is_verified=data.get('is_verified', False)
        )
        
        db.session.add(school)
        db.session.commit()
        
        return jsonify({
            'message': 'School created successfully',
            'school': school.to_dict(detailed=True)
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Creation failed: {str(e)}'}), 500


@schools_bp.route('/<int:school_id>', methods=['PUT'])
@admin_required
def update_school(school_id):
    """Update school details (admin only)"""
    try:
        school = School.query.get(school_id)
        if not school:
            return jsonify({'error': 'School not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        for field in ['name', 'location', 'city', 'country', 'description', 
                      'long_description', 'students', 'faculty', 'image', 'logo',
                      'established', 'category', 'contact_email', 'contact_phone',
                      'website', 'is_verified']:
            if field in data:
                setattr(school, field, data[field])
        
        if 'programs' in data:
            school.programs = data['programs']
        
        db.session.commit()
        
        return jsonify({
            'message': 'School updated successfully',
            'school': school.to_dict(detailed=True)
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Update failed: {str(e)}'}), 500


@schools_bp.route('/<int:school_id>', methods=['DELETE'])
@admin_required
def delete_school(school_id):
    """Delete school (admin only)"""
    try:
        school = School.query.get(school_id)
        if not school:
            return jsonify({'error': 'School not found'}), 404
        
        school.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'School deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@schools_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all school categories"""
    return jsonify({
        'categories': School.CATEGORIES
    }), 200
