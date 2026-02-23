# Thrive School Hub - MySQL Setup Guide

This project is now fully configured to work with MySQL database. Follow these steps to get started.

## Prerequisites

- Python 3.8+
- MySQL 5.7+ or MariaDB
- pip (Python package manager)

## Backend Setup

### 1. Install MySQL

**Windows:**
```
Download from https://dev.mysql.com/downloads/mysql/
Run installer and complete setup
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo service mysql start
```

### 2. Create Database

```bash
mysql -u root -p
# Enter your MySQL root password when prompted

CREATE DATABASE thrive_school_dev;
CREATE DATABASE thrive_school_test;
EXIT;
```

### 3. Configure Environment Variables

Copy the example environment file and update it:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and update the database URL:
```
DATABASE_URL=mysql+pymysql://your_username:your_password@localhost/thrive_school_dev
```

### 4. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 5. Initialize Database

```bash
python seed_data.py
```

This will:
- Create all tables
- Populate with sample data
- Create admin user (admin@thrive.com / admin123)
- Create regular user (user@thrive.com / user123)

### 6. Run the Application

```bash
python app.py
```

The backend will be available at `http://localhost:5000`

## Frontend Setup

The frontend files are already organized in the `frontend/` directory:

### Static Files Organization
```
frontend/static/
├── css/          (CSS stylesheets)
├── js/           (JavaScript files)
└── images/       (Image assets)

frontend/        (HTML templates)
├── index.html
├── login.html
├── register.html
└── ... other pages
```

### Serving Frontend

The Flask backend automatically serves frontend files from the frontend directory.

Navigate to `http://localhost:5000/` to access the application.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Schools
- `GET /api/schools` - List all schools
- `GET /api/schools?category=Secondary` - Filter by category
- `GET /api/schools/<id>` - Get school details
- `POST /api/schools` - Create school (admin)
- `PUT /api/schools/<id>` - Update school (admin)
- `DELETE /api/schools/<id>` - Delete school (admin)

### Events
- `GET /api/events` - List all events
- `GET /api/events/<id>` - Get event details
- `POST /api/events` - Create event (admin)
- `PUT /api/events/<id>` - Update event (admin)
- `DELETE /api/events/<id>` - Delete event (admin)

### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs?location=Dubai` - Filter by location
- `GET /api/jobs/<id>` - Get job details
- `POST /api/jobs` - Create job (admin)

### Bursaries
- `GET /api/bursaries` - List all bursaries
- `GET /api/bursaries?type=Scholarship` - Filter by type
- `GET /api/bursaries/<id>` - Get bursary details
- `POST /api/bursaries` - Create bursary (admin)

### Agents
- `GET /api/agents` - List all agents
- `GET /api/agents/<id>` - Get agent details
- `GET /api/agents/promo/<code>` - Get agent by promo code
- `POST /api/agents` - Create agent (admin)

### Past Papers
- `GET /api/past-papers` - List papers
- `GET /api/past-papers?subject=Mathematics` - Filter by subject
- `POST /api/past-papers/<id>/download` - Track download
- `GET /api/past-papers/subjects` - Get all subjects

### Suggestions
- `POST /api/suggestions` - Submit suggestion
- `GET /api/suggestions` - Get all suggestions (admin)
- `PUT /api/suggestions/<id>` - Update suggestion (admin)

### Statistics
- `GET /api/stats` - Get platform statistics
- `GET /api/stats/categories` - Get category statistics

## Database Schema

The system includes 8 main database models:

1. **User** - User accounts and authentication
2. **School** - Educational institutions
3. **Event** - Events and activities
4. **Job** - Job listings
5. **Bursary** - Financial support
6. **Agent** - Education agents
7. **PastPaper** - Study materials
8. **Suggestion** - User feedback

## Architecture

### Backend Structure
```
backend/
├── app.py                 # Application factory
├── config.py             # Configuration settings
├── models/               # Database models
│   ├── user.py
│   ├── school.py
│   └── ...
├── routes/               # API endpoints (blueprints)
│   ├── auth.py
│   ├── schools.py
│   └── ...
├── services/             # Business logic
├── utils/                # Helper functions
│   ├── decorators.py    # Auth decorators
│   └── validators.py    # Data validation
├── requirements.txt      # Python dependencies
└── seed_data.py         # Database seeding
```

### Frontend Structure
```
frontend/
├── static/
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   └── images/          # Images
├── templates/           # HTML templates (future)
└── index.html           # Main pages
```

## Development Tips

1. **Database Migrations**: For schema changes, update models and run:
   ```bash
   python seed_data.py  # This recreates all tables
   ```

2. **Testing API**: Use tools like Postman or curl:
   ```bash
   curl http://localhost:5000/api/schools
   ```

3. **Enable Debug Mode**: Already enabled in development config

4. **View Logs**: Check `logs/thrive_school.log`

## Troubleshooting

### MySQL Connection Error
```
Error: (2003, "Can't connect to MySQL server")
```
Solution: Make sure MySQL is running and credentials in .env are correct.

### Port Already in Use
Solution: Change the port in app.py or kill the process using port 5000.

### Module Import Errors
Solution: Ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

## Production Deployment

For production, update your `.env` file:

```
FLASK_ENV=production
DEBUG=False
DATABASE_URL=mysql+pymysql://prod_user:prod_password@prod_host/thrive_school_prod
SECRET_KEY=your-secure-random-key-here
SESSION_COOKIE_SECURE=True
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Use a production WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
```

## Support

For issues or questions, please check the logs and ensure:
- MySQL is running
- .env file is properly configured
- All dependencies are installed
- Tables are created with seed_data.py
