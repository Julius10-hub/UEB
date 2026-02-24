"""Job Routes"""
from flask import request, jsonify
from . import jobs_bp
from ..models import Job, db
from ..utils.decorators import admin_required


@jobs_bp.route('', methods=['GET'])
def get_jobs():
    """Get all jobs with filtering"""
    try:
        job_type = request.args.get('type')
        company = request.args.get('company')
        location = request.args.get('location')
        search = request.args.get('search')
        featured = request.args.get('featured')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = Job.query.filter_by(is_active=True, status='Active')
        
        if job_type:
            query = query.filter_by(job_type=job_type)
        if company:
            query = query.filter(Job.company.ilike(f'%{company}%'))
        if location:
            query = query.filter(Job.location.ilike(f'%{location}%'))
        if featured == 'true':
            query = query.filter_by(is_featured=True)
        if search:
            query = query.filter(Job.title.ilike(f'%{search}%'))
        
        jobs = query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'jobs': [j.to_dict() for j in jobs.items],
            'total': jobs.total,
            'pages': jobs.pages,
            'current_page': page
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@jobs_bp.route('/<int:job_id>', methods=['GET'])
def get_job(job_id):
    """Get job details"""
    job = Job.query.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404
    
    return jsonify({
        'job': job.to_dict(detailed=True)
    }), 200


@jobs_bp.route('', methods=['POST'])
@admin_required
def create_job():
    """Create job (admin only)"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['title', 'company']):
            return jsonify({'error': 'Missing required fields: title, company'}), 400
        
        job = Job(
            title=data['title'],
            description=data.get('description'),
            requirements=data.get('requirements'),
            location=data.get('location'),
            job_type=data.get('job_type'),
            company=data['company'],
            salary_min=data.get('salary_min'),
            salary_max=data.get('salary_max'),
            experience_level=data.get('experience_level'),
            contact_email=data.get('contact_email'),
            contact_phone=data.get('contact_phone'),
            company_logo=data.get('company_logo'),
            company_website=data.get('company_website'),
            is_featured=data.get('is_featured', False)
        )
        
        db.session.add(job)
        db.session.commit()
        
        return jsonify({
            'message': 'Job created successfully',
            'job': job.to_dict(detailed=True)
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Creation failed: {str(e)}'}), 500


@jobs_bp.route('/<int:job_id>', methods=['PUT'])
@admin_required
def update_job(job_id):
    """Update job (admin only)"""
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        data = request.get_json()
        
        for field in ['title', 'description', 'requirements', 'location', 'job_type',
                      'company', 'salary_min', 'salary_max', 'experience_level',
                      'status', 'is_featured']:
            if field in data:
                setattr(job, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Job updated successfully',
            'job': job.to_dict(detailed=True)
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@jobs_bp.route('/<int:job_id>', methods=['DELETE'])
@admin_required
def delete_job(job_id):
    """Delete job (admin only)"""
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        job.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Job deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
