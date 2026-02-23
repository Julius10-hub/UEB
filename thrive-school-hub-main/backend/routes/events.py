"""Event Routes"""
from flask import request, jsonify
from datetime import datetime
from . import events_bp
from ..models import Event, db
from ..utils.decorators import admin_required


@events_bp.route('', methods=['GET'])
def get_events():
    """Get all events with filtering"""
    try:
        event_type = request.args.get('type')
        status = request.args.get('status')
        featured = request.args.get('featured')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = Event.query.filter_by(is_active=True)
        
        if event_type:
            query = query.filter_by(event_type=event_type)
        if status:
            query = query.filter_by(status=status)
        if featured == 'true':
            query = query.filter_by(is_featured=True)
        
        # Order by date
        query = query.order_by(Event.date.desc())
        
        events = query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'events': [e.to_dict() for e in events.items],
            'total': events.total,
            'pages': events.pages,
            'current_page': page
        }), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@events_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id):
    """Get event details"""
    event = Event.query.get(event_id)
    if not event:
        return jsonify({'error': 'Event not found'}), 404
    
    return jsonify({
        'event': event.to_dict(detailed=True)
    }), 200


@events_bp.route('', methods=['POST'])
@admin_required
def create_event():
    """Create event (admin only)"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ['title', 'date']):
            return jsonify({'error': 'Missing required fields: title, date'}), 400
        
        event = Event(
            title=data['title'],
            description=data.get('description'),
            event_type=data.get('event_type'),
            date=datetime.fromisoformat(data['date'].replace('Z', '+00:00')),
            end_date=datetime.fromisoformat(data['end_date'].replace('Z', '+00:00')) if data.get('end_date') else None,
            venue=data.get('venue'),
            location=data.get('location'),
            capacity=data.get('capacity', 0),
            image=data.get('image'),
            organizer=data.get('organizer'),
            contact_email=data.get('contact_email'),
            contact_phone=data.get('contact_phone'),
            is_featured=data.get('is_featured', False)
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': event.to_dict(detailed=True)
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Creation failed: {str(e)}'}), 500


@events_bp.route('/<int:event_id>', methods=['PUT'])
@admin_required
def update_event(event_id):
    """Update event (admin only)"""
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        data = request.get_json()
        
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'date' in data:
            event.date = datetime.fromisoformat(data['date'].replace('Z', '+00:00'))
        if 'venue' in data:
            event.venue = data['venue']
        if 'status' in data:
            event.status = data['status']
        if 'is_featured' in data:
            event.is_featured = data['is_featured']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': event.to_dict(detailed=True)
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@events_bp.route('/<int:event_id>', methods=['DELETE'])
@admin_required
def delete_event(event_id):
    """Delete event (admin only)"""
    try:
        event = Event.query.get(event_id)
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        event.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Event deleted successfully'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
