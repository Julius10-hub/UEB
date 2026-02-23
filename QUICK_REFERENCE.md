# Thrive School Hub - Quick Reference Guide

## 🚀 Getting Started (5 Minutes)

### 1. Setup MySQL
```bash
mysql -u root -p
CREATE DATABASE thrive_school_dev;
EXIT;
```

### 2. Install Python Packages
```bash
cd backend
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env:
# DATABASE_URL=mysql+pymysql://root:password@localhost/thrive_school_dev
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
- **App**: http://localhost:5000
- **Admin**: admin@thrive.com / admin123
- **User**: user@thrive.com / user123

---

## 📚 API Quick Reference

### Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123","name":"John"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'

# Get Current User
curl http://localhost:5000/api/auth/me
```

### Schools
```bash
# Get all schools
curl http://localhost:5000/api/schools

# Filter by category
curl http://localhost:5000/api/schools?category=Secondary

# Get specific school
curl http://localhost:5000/api/schools/1

# Create school (admin)
curl -X POST http://localhost:5000/api/schools \
  -H "Content-Type: application/json" \
  -d '{"name":"New School","location":"Dubai","category":"Secondary"}'
```

### Events
```bash
curl http://localhost:5000/api/events
curl http://localhost:5000/api/events?type=Workshop
curl http://localhost:5000/api/events/1
```

### Jobs
```bash
curl http://localhost:5000/api/jobs
curl http://localhost:5000/api/jobs?location=Dubai
```

### Bursaries
```bash
curl http://localhost:5000/api/bursaries
curl http://localhost:5000/api/bursaries?type=Scholarship
```

### Agents
```bash
curl http://localhost:5000/api/agents
curl http://localhost:5000/api/agents/1
curl http://localhost:5000/api/agents/promo/JOHN2024
```

### Past Papers
```bash
curl http://localhost:5000/api/past-papers
curl http://localhost:5000/api/past-papers?subject=Mathematics
curl http://localhost:5000/api/past-papers/subjects
```

### Suggestions
```bash
# Create suggestion
curl -X POST http://localhost:5000/api/suggestions \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","message":"Good platform"}'

# Get suggestions (admin)
curl http://localhost:5000/api/suggestions
```

### Statistics
```bash
curl http://localhost:5000/api/stats
curl http://localhost:5000/api/stats/categories
```

---

## 📁 Project Structure

```
backend/
├── app.py              # Main application
├── config.py           # Configuration
├── models/             # Database models
├── routes/             # API endpoints
├── services/           # Business logic
└── utils/              # Helpers

frontend/
├── static/css/         # Stylesheets
├── static/js/          # JavaScript
└── *.html              # Pages
```

---

## 🔐 Authentication Decorators

### Protect Routes
```python
from utils.decorators import login_required, admin_required

@app.route('/api/protected')
@login_required
def protected():
    return jsonify({'data': 'only logged in users'})

@app.route('/api/admin-only')
@admin_required
def admin_only():
    return jsonify({'data': 'only admins'})
```

---

## ✅ Validation

```python
from utils.validators import validate_email, validate_password

# Validate email
if not validate_email(email):
    return jsonify({'error': 'Invalid email'}), 400

# Validate password
is_valid, message = validate_password(password)
if not is_valid:
    return jsonify({'error': message}), 400
```

---

## 🗄️ Database Models at a Glance

| Model | Key Fields | Purpose |
|-------|-----------|---------|
| User | email, password, name | Authentication |
| School | name, location, category | School directory |
| Event | title, date, venue | Event management |
| Job | title, company, location | Job listings |
| Bursary | title, amount, type | Financial aid |
| Agent | name, region, promo_code | Agent network |
| PastPaper | subject, year, category | Study materials |
| Suggestion | name, email, message | User feedback |

---

## 🔧 Common Commands

### Flask
```bash
# Run development server
python app.py

# Check for syntax errors
python -m py_compile *.py

# Interactive Python shell
python
>>> from app import create_app, db
>>> app = create_app()
```

### MySQL
```bash
# Connect
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use database
USE thrive_school_dev;

# Show tables
SHOW TABLES;

# Reset database
DROP DATABASE thrive_school_dev;
CREATE DATABASE thrive_school_dev;
```

### Database Seeding
```bash
# Run seed script
python seed_data.py

# Clear database
mysql -u root -p thrive_school_dev < /dev/null
```

---

## 📊 Environment Variables

Key variables in `.env`:

```
FLASK_ENV=development|production
DEBUG=True|False
DATABASE_URL=mysql+pymysql://root:password@localhost/thrive_school_dev
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
```

---

## 🐛 Debugging

### Check Flask Logs
```bash
# Run with verbose output
FLASK_ENV=development python app.py
```

### Check Database Connection
```python
from app import create_app, db
app = create_app()
with app.app_context():
    db.create_all()
    print("Database connected!")
```

### Test API Endpoint
```bash
curl -v http://localhost:5000/api/schools
```

---

## 📈 Performance Tips

1. **Use Pagination**
   ```
   /api/schools?page=1&per_page=20
   ```

2. **Use Indexes** (already set up)
   - Search by indexed fields

3. **Minimize Data Transfer**
   - Limit fields in response
   - Use pagination

4. **Cache Results**
   - Can be added with Redis

---

## 🚀 Deployment Checklist

- [ ] Update FLASK_ENV=production in .env
- [ ] Set DEBUG=False
- [ ] Set strong SECRET_KEY
- [ ] Configure production DATABASE_URL
- [ ] Update CORS_ORIGINS
- [ ] Install Gunicorn: `pip install gunicorn`
- [ ] Run: `gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()`
- [ ] Setup Nginx reverse proxy
- [ ] Enable HTTPS/SSL
- [ ] Setup database backups
- [ ] Monitor application logs

---

## 💡 Code Examples

### Create New School
```python
from models import db, School

school = School(
    name='New School',
    location='Dubai',
    city='Dubai',
    country='UAE',
    category='Secondary',
    description='Great school',
    students=500,
    programs=['STEM', 'Arts']
)
db.session.add(school)
db.session.commit()
```

### Query Schools
```python
from models import School

# All schools
schools = School.query.all()

# Filter by category
secondary = School.query.filter_by(category='Secondary').all()

# Search by name
results = School.query.filter(School.name.ilike('%Dubai%')).all()

# Paginated
page = School.query.paginate(page=1, per_page=20)
```

### Create User
```python
from models import User

user = User(email='test@example.com', name='Test User')
user.set_password('password123')
db.session.add(user)
db.session.commit()
```

### Verify Password
```python
user = User.query.filter_by(email='test@example.com').first()
if user.check_password('password123'):
    print("Password correct!")
```

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| app.py | Application factory |
| config.py | Configuration classes |
| requirements.txt | Python dependencies |
| .env.example | Environment template |
| seed_data.py | Database initialization |
| models/__init__.py | Model exports |
| models/*.py | Individual models |
| routes/__init__.py | Route registration |
| routes/*.py | API endpoints |
| utils/decorators.py | Auth decorators |
| utils/validators.py | Input validation |
| utils/helpers.py | Utility functions |

---

## 🎯 Tips & Tricks

1. **Use Flask Shell**
   ```bash
   export FLASK_APP=app.py
   flask shell
   >>> from models import db, School
   >>> School.query.count()
   ```

2. **Check Python Version**
   ```bash
   python --version  # Should be 3.8+
   ```

3. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # macOS/Linux
   venv\Scripts\activate     # Windows
   ```

4. **Export Requirements**
   ```bash
   pip freeze > requirements.txt
   ```

5. **Run Tests** (when added)
   ```bash
   python -m pytest tests/
   ```

---

## ❓ Frequently Asked Questions

**Q: How do I reset the database?**
A: Run `python seed_data.py` again (drops and recreates all tables)

**Q: How do I add a new field to a model?**
A: Edit the model file, then run `seed_data.py`

**Q: How do I change the admin password?**
A: Login as admin, then use the profile update endpoint

**Q: How do I deploy to production?**
A: See "Deployment Checklist" section above

**Q: How do I enable HTTPS?**
A: Use Nginx with SSL certificate (Let's Encrypt)

---

## 📞 Getting Help

1. Check documentation files:
   - README.md
   - MYSQL_SETUP_GUIDE.md
   - ARCHITECTURE.md

2. Check error messages in:
   - Terminal output
   - logs/thrive_school.log

3. Verify configuration:
   - .env file settings
   - MySQL connection
   - Python version

---

**Version:** 2.0  
**Last Updated:** February 2025  
**Status:** Production Ready

For detailed information, refer to the full documentation in README.md and MYSQL_SETUP_GUIDE.md
