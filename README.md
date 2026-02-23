# Thrive School Hub - World-Class Educational Platform

A professional, full-stack educational platform built with Flask (Python backend) and modern HTML/CSS/JavaScript frontend. Features integrated MySQL database for persistent data management.

## 🌟 Features

### Backend (Flask + SQLAlchemy ORM)
- ✅ Robust REST API with 50+ endpoints
- ✅ MySQL database integration
- ✅ User authentication & authorization
- ✅ Role-based access control (Admin/User)
- ✅ Data validation and error handling
- ✅ Session management
- ✅ Comprehensive logging

### Frontend (HTML/CSS/JavaScript)
- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Modern color scheme (Blue, Green, Gold, White, Black)
- ✅ Smooth animations and transitions
- ✅ User-friendly interface
- ✅ Real-time data loading
- ✅ Search and filtering capabilities
- ✅ Organized file structure

### Core Modules
1. **User Management** - Registration, login, profiles
2. **School Directory** - Comprehensive school listings with filtering
3. **Events & Activities** - Event management system
4. **Job Board** - Career opportunities
5. **Bursaries** - Financial aid and scholarships
6. **Education Agents** - Agent network management
7. **Past Papers** - Study materials library
8. **Suggestions** - User feedback system
9. **Statistics** - Platform analytics

## 📁 Project Structure

```
thrive-school-hub/
├── backend/
│   ├── app.py                 # Application factory
│   ├── config.py             # Configuration management
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment variables template
│   ├── seed_data.py          # Database initialization
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── school.py
│   │   ├── event.py
│   │   ├── job.py
│   │   ├── bursary.py
│   │   ├── agent.py
│   │   ├── past_paper.py
│   │   └── suggestion.py
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── schools.py
│   │   ├── events.py
│   │   ├── jobs.py
│   │   ├── bursaries.py
│   │   ├── agents.py
│   │   ├── past_papers.py
│   │   ├── suggestions.py
│   │   └── stats.py
│   ├── services/
│   ├── utils/
│   │   ├── decorators.py
│   │   ├── validators.py
│   │   └── helpers.py
│   └── __pycache__/
├── frontend/
│   ├── *.html                # All HTML pages
│   ├── static/
│   │   ├── css/              # Stylesheets
│   │   └── js/               # JavaScript files
│   └── templates/            # Future use
└── MYSQL_SETUP_GUIDE.md     # MySQL setup instructions
```

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.8+
- MySQL 5.7+
- pip

### 2. Database Setup
```bash
mysql -u root -p
CREATE DATABASE thrive_school_dev;
EXIT;
```

### 3. Backend Installation
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MySQL credentials
```

### 4. Initialize Database
```bash
python seed_data.py
```

### 5. Run Application
```bash
python app.py
```

### 6. Access Application
- **Frontend**: http://localhost:5000
- **API**: http://localhost:5000/api
- **Admin Email**: admin@thrive.com
- **Admin Password**: admin123

## 🎨 Design & Architecture

### Technology Stack

**Backend:**
- Flask 3.0.0
- SQLAlchemy 2.0
- PyMySQL
- Flask-CORS
- Werkzeug

**Frontend:**
- HTML5
- CSS3 (Responsive, Animations)
- Vanilla JavaScript

**Database:**
- MySQL 5.7+

### Architecture Patterns

1. **MVC Architecture** - Models, Views, Controllers clearly separated
2. **REST API** - Proper HTTP methods and status codes
3. **Blueprints** - Modular route organization
4. **ORM** - Type-safe database operations
5. **Security** - Password hashing, CORS, input validation
6. **Error Handling** - Comprehensive exception handling

## 📊 Database Models

- **User** - Authentication and profiles
- **School** - Educational institutions
- **Event** - Activities and events
- **Job** - Career opportunities
- **Bursary** - Financial aid
- **Agent** - Education agents
- **PastPaper** - Study materials
- **Suggestion** - User feedback

## 🔌 API Endpoints (50+)

### Authentication
```
POST   /api/auth/register      - Create account
POST   /api/auth/login         - Sign in
POST   /api/auth/logout        - Sign out
GET    /api/auth/me            - Current user
GET    /api/auth/profile       - User profile
PUT    /api/auth/profile       - Update profile
```

### Schools
```
GET    /api/schools            - List all schools
GET    /api/schools?category=X - Filter by category
GET    /api/schools/<id>       - School details
POST   /api/schools            - Create (admin)
PUT    /api/schools/<id>       - Update (admin)
DELETE /api/schools/<id>       - Delete (admin)
GET    /api/schools/categories - Categories list
```

### Events
```
GET    /api/events             - List events
GET    /api/events/<id>        - Event details
POST   /api/events             - Create (admin)
PUT    /api/events/<id>        - Update (admin)
DELETE /api/events/<id>        - Delete (admin)
```

### Jobs, Bursaries, Agents, Past Papers, Suggestions
Similar structure with appropriate endpoints

### Statistics
```
GET    /api/stats              - Platform stats
GET    /api/stats/categories   - Category stats
```

## 💻 Development

### Adding a New Endpoint

1. Create model in `models/`
2. Create routes in `routes/`
3. Register blueprint in `routes/__init__.py`
4. Test with API client

### Database Migrations
```bash
# Modify models, then Reset:
python seed_data.py
```

## 🔐 Security

- ✅ Password hashing (Werkzeug)
- ✅ Session authentication
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention (ORM)
- ✅ Role-based access
- ✅ Secure cookies

## 📱 Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop scaling
- Touch-friendly UI
- Fast performance

## 📚 Documentation

- **MYSQL_SETUP_GUIDE.md** - Detailed MySQL setup
- **SETUP_GUIDE.md** - Original setup guide
- API documentation in README

## 🐛 Troubleshooting

### MySQL Connection Error
```bash
# Check MySQL is running
mysql -u root -p
# Verify .env DATABASE_URL
```

### Module Import Errors
```bash
pip install -r requirements.txt
```

### Port 5000 Already in Use
```bash
# Change port in app.py or kill process
lsof -ti:5000 | xargs kill -9
```

## 🚢 Production Deployment

1. Update `.env`:
   ```
   FLASK_ENV=production
   DEBUG=False
   DATABASE_URL=production_database_url
   ```

2. Install Gunicorn:
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
   ```

3. Use reverse proxy (Nginx)

4. Enable HTTPS/SSL

## 📝 Configuration

Edit `config.py` for:
- Database connection
- Session settings
- CORS origins
- Debug mode
- Logging level

## 🤝 Contributing

1. Follow code structure
2. Maintain separation of concerns
3. Add input validation
4. Document changes
5. Test endpoints

## 📞 Support

See MYSQL_SETUP_GUIDE.md for detailed setup help.

## 🎯 Future Enhancements

- [ ] JWT authentication
- [ ] Advanced search
- [ ] File uploads
- [ ] Email notifications
- [ ] Payment integration
- [ ] WebSocket real-time
- [ ] Analytics
- [ ] Mobile app
- [ ] Multi-language
- [ ] API documentation

---

**Version**: 2.0  
**Status**: Production Ready for MySQL  
**Last Updated**: February 2025
