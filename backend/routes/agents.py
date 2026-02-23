"""Agent Routes"""
from flask import request, jsonify
from . import agents_bp
from ..models import Agent, db
from ..utils.decorators import admin_required, login_required


@agents_bp.route('', methods=['GET'])
def get_agents():
    """Get all agents with filtering"""
    try:
        region = request.args.get('region')
        status = request.args.get('status')
        featured = request.args.get('featured')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = Agent.query.filter_by(is_active=True, verification_status='Verified')
        
        if region:
            query = query.filter_by(region=region)
        if status:
            query = query.filter_by(status=status)
        if featured == 'true':
            query = query.filter_by(is_featured=True)
        
        agents = query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'agents': [a.to_dict() for a in agents.items],
            'total': agents.total,
            'pages': agents.pages,
            'current_page': page
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@agents_bp.route('/<int:agent_id>', methods=['GET'])
def get_agent(agent_id):
    """Get agent details"""
    agent = Agent.query.get(agent_id)
    if not agent:
        return jsonify({'error': 'Agent not found'}), 404
    
    return jsonify({
        'agent': agent.to_dict(detailed=True)
    }), 200


@agents_bp.route('/promo/<promo_code>', methods=['GET'])
def get_agent_by_promo(promo_code):
    """Get agent by promo code"""
    agent = Agent.query.filter_by(promo_code=promo_code, is_active=True).first()
    if not agent:
        return jsonify({'error': 'Promo code not found'}), 404
    
    return jsonify({
        'agent': agent.to_dict(detailed=True)
    }), 200


@agents_bp.route('', methods=['POST'])
@admin_required
def create_agent():
    """Create agent (admin only)"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['name', 'email']):
            return jsonify({'error': 'Missing required fields: name, email'}), 400
        
        if Agent.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        agent = Agent(
            name=data['name'],
            email=data['email'],
            phone_number=data.get('phone'),
            organization=data.get('organization'),
            region=data.get('region'),
            country=data.get('country'),
            promo_code=data.get('promo_code'),
            commission_percentage=data.get('commission_percentage', 10.0),
            profile_image=data.get('profile_image'),
            bio=data.get('bio'),
            bank_account=data.get('bank_account'),
            tax_id=data.get('tax_id')
        )
        
        db.session.add(agent)
        db.session.commit()
        
        return jsonify({
            'message': 'Agent created successfully',
            'agent': agent.to_dict(detailed=True)
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Creation failed: {str(e)}'}), 500


@agents_bp.route('/<int:agent_id>', methods=['PUT'])
@admin_required
def update_agent(agent_id):
    """Update agent (admin only)"""
    try:
        agent = Agent.query.get(agent_id)
        if not agent:
            return jsonify({'error': 'Agent not found'}), 404
        
        data = request.get_json()
        
        for field in ['name', 'email', 'organization', 'region', 'status',
                      'verification_status', 'commission_percentage', 'is_featured']:
            if field in data:
                setattr(agent, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Agent updated successfully',
            'agent': agent.to_dict(detailed=True)
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
