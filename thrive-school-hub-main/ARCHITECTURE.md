# Thrive School Hub - Architecture & Design Document

## System Architecture Overview

This document provides comprehensive details about the architecture, design patterns, and organization of the Thrive School Hub platform.

## 1. Architecture Principles

### Layered Architecture
```
┌─────────────────────────────────────┐
│   Presentation Layer (Frontend)     │
│   (HTML/CSS/JavaScript)             │
├─────────────────────────────────────┤
│   API Layer (Flask Routes)          │
│   (REST Endpoints)                  │
├─────────────────────────────────────┤
│   Business Logic Layer (Services)   │
│   (Validation, Processing)          │
├─────────────────────────────────────┤
│   Data Access Layer (Models/ORM)    │
│   (SQLAlchemy)                      │
├─────────────────────────────────────┤
│   Database Layer (MySQL)            │
│   (Persistent Storage)              │
└─────────────────────────────────────┘
```

### Design Patterns Used

1. **Model-View-Controller (MVC)**
   - Models: Database models in `/models`
   - Views: HTML Templates in `/frontend`
   - Controllers: Route handlers in `/routes`

2. **Blueprint Pattern**
   - Modular route organization
   - Each domain has its own blueprint
   - Centralized registration in `routes/__init__.py`

3. **Factory Pattern**
   - Application factory in `app.py`
   - Flexible configuration management
   - Easy testing and deployment

4. **Decorators Pattern**
   - Authentication decorators
   - Authorization decorators
   - Validation decorators

5. **Repository/DAO Pattern**
   - SQLAlchemy ORM provides data access layer
   - Query abstraction from business logic
   - Flexible data source changes

## 2. Backend Architecture

### 2.1 Configuration Management

**File**: `config.py`

Three configuration classes:
- `DevelopmentConfig` - Local development with MySQL
- `TestingConfig` - In-memory SQLite for testing
- `ProductionConfig` - Secured production settings

```python
CONFIG = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
```

### 2.2 Database Models

**Location**: `backend/models/`

#### User Model
```python
- id (PK)
- email (Unique, Indexed)
- password (Hashed)
- name
- phone
- is_admin
- is_active
- created_at
- updated_at
- last_login
```

#### School Model
```python
- id (PK)
- name (Indexed)
- location
- city (Indexed)
- country
- category (Indexed)
- students
- faculty
- rating
- is_verified
- programs (JSON)
- contact_email
- contact_phone
- created_at
```

#### Event Model
```python
- id (PK)
- title (Indexed)
- date (Indexed)
- status (Indexed)
- capacity
- registered_count
- is_featured
- event_type
- organizer
```

#### Job Model
```python
- id (PK)
- title (Indexed)
- company (Indexed)
- location
- job_type
- salary_min/max
- status (Indexed)
- deadline
- is_featured
```

#### Bursary Model
```python
- id (PK)
- title
- bursary_type (Indexed)
- amount
- provider (Indexed)
- education_level
- field_of_study
- status (Indexed)
- is_featured
```

#### Agent Model
```python
- id (PK)
- name (Indexed)
- email (Indexed)
- promo_code (Unique, Indexed)
- region (Indexed)
- students_referred
- commission_percentage
- status (Indexed)
- verification_status (Indexed)
```

#### PastPaper Model
```python
- id (PK)
- title (Indexed)
- subject (Indexed)
- year (Indexed)
- category (Indexed)
- exam_board
- download_count
- rating
- download_url
```

#### Suggestion Model
```python
- id (PK)
- name (Indexed)
- email (Indexed)
- status (Indexed)
- suggestion_type
- priority
- response
- responded_at
```

### 2.3 Route Organization

**Location**: `backend/routes/`

Each module has dedicated route file:
- `auth.py` - Authentication endpoints
- `schools.py` - School management
- `events.py` - Event management
- `jobs.py` - Job listings
- `bursaries.py` - Bursary management
- `agents.py` - Agent management
- `past_papers.py` - Past paper management
- `suggestions.py` - Suggestion management
- `stats.py` - Statistics endpoints

All routes registered via blueprints in `__init__.py`

### 2.4 Utilities & Helpers

**Location**: `backend/utils/`

#### decorators.py
```python
- login_required()     # Check if user logged in
- admin_required()     # Check if user is admin
- role_required(roles) # Check specific role
```

#### validators.py
```python
- validate_email()           # Email format
- validate_password()        # Password strength
- validate_phone()           # Phone format
- validate_date()            # Date format
- validate_required_fields() # Required fields check
- sanitize_string()          # Remove harmful characters
```

#### helpers.py
```python
- format_datetime()     # DateTime formatting
- get_pagination_info() # Pagination metadata
- calculate_age()       # Age calculation
- get_date_range()      # Date range helpers
- batch_items()         # Batch processing
- convert_bytes()       # Byte conversion
```

## 3. API Design

### 3.1 REST Conventions

All endpoints follow standard REST conventions:

```
GET    /api/resource           → List all
POST   /api/resource           → Create
GET    /api/resource/<id>      → Get one
PUT    /api/resource/<id>      → Update
DELETE /api/resource/<id>      → Delete
```

### 3.2 Response Format

**Success Response (200)**
```json
{
  "data": {},
  "total": 100,
  "pages": 5,
  "current_page": 1
}
```

**Error Response (4xx/5xx)**
```json
{
  "error": "Error message",
  "status": 400
}
```

### 3.3 Authentication Flow

```
Register → Login → Session Created → Authenticated Requests → Logout
```

Session stored in Flask session (can use database, Redis, etc.)

### 3.4 Authorization

```
User Request → Check Session → Check Role → Execute → Return Result
```

Admin routes use `@admin_required` decorator

### 3.5 Pagination

```
GET /api/schools?page=1&per_page=20
```

Returns:
```json
{
  "schools": [...],
  "total": 150,
  "pages": 8,
  "current_page": 1
}
```

### 3.6 Filtering

```
GET /api/schools?category=Secondary&city=Dubai&search=school
GET /api/jobs?location=Dubai&job_type=Full-time
GET /api/bursaries?type=Scholarship&level=Tertiary
```

## 4. Frontend Architecture

### 4.1 File Organization

```
frontend/
├── static/
│   ├── css/
│   │   ├── main.css      # Global styles, CSS variables
│   │   ├── navbar.css    # Navigation styles
│   │   ├── auth.css      # Auth page styles
│   │   └── admin.css     # Admin panel styles
│   └── js/
│       ├── api.js        # API communication layer
│       ├── navbar.js     # Navigation logic
│       ├── home.js       # Home page logic
│       ├── schools.js    # Schools page logic
│       ├── admin.js      # Admin logic
│       └── ...           # Other page logic
└── *.html               # All HTML pages
```

### 4.2 CSS Architecture

**main.css Structure:**
```css
/* 1. CSS Variables */
:root {
  --primary: #0052cc;
  --secondary: #1e7a34;
  --accent: #d4af37;
}

/* 2. Global Styles */
* { box-sizing: border-box; }
body { margin: 0; font-family: ...; }

/* 3. Component Styles */
.btn { ... }
.card { ... }
.form-group { ... }

/* 4. Layout Styles */
.container { ... }
.grid { ... }

/* 5. Utility Classes */
.text-center { ... }
.mt-1 { ... }

/* 6. Media Queries */
@media (max-width: 768px) { ... }
```

### 4.3 JavaScript Architecture

**api.js:**
```javascript
const API_BASE = 'http://localhost:5000/api';

// All API calls go through fetch wrapper
async function apiCall(endpoint, options = {}) { ... }

export const API = {
  auth: { register, login, logout, getUser },
  schools: { getAll, getOne, create, update, delete },
  events: { getAll, getOne },
  // ... other modules
};
```

**Page Logic Pattern:**
```javascript
// 1. Check authentication
const user = await API.auth.getUser();

// 2. Load data
const data = await API.schools.getAll();

// 3. Render UI
renderSchools(data);

// 4. Attach event listeners
attachEventListeners();
```

### 4.4 Responsive Design

**Breakpoints:**
```css
/* Mobile */
0px - 480px (phones in portrait)

/* Tablet */
481px - 768px (tablets)

/* Desktop */
769px and above (desktops)
```

**Approach:**
- Mobile-first design
- Flexible grid layouts
- Responsive images
- Touch-friendly buttons (48px minimum)

### 4.5 Color Scheme

```css
Primary:    #0052cc    (Corporate Blue)    - Main brand color
Secondary:  #1e7a34    (Forest Green)      - Growth, sustainability
Accent:     #d4af37    (Premium Gold)      - Highlights, premium
White:      #ffffff    (Clean White)       - Background, text
Black:      #000000    (Deep Black)        - Text, contrast
```

## 5. Data Flow Diagram

```
                    Frontend (HTML/CSS/JS)
                            ↓
                    User Interaction
                            ↓
                    Fetch API Request
                            ↓
                    ┌───────────────────┐
                    │   Flask Router    │
                    │  (/routes/*.py)   │
                    └─────────┬─────────┘
                              ↓
                    ┌───────────────────┐
                    │  Validation       │
                    │  (/utils)         │
                    └─────────┬─────────┘
                              ↓
                    ┌───────────────────┐
                    │ Business Logic    │
                    │  (/services)      │
                    └─────────┬─────────┘
                              ↓
                    ┌───────────────────┐
                    │ ORM Models        │
                    │  (/models)        │
                    └─────────┬─────────┘
                              ↓
                    ┌───────────────────┐
                    │   MySQL Database  │
                    │                   │
                    └───────────────────┘
```

## 6. Authentication & Security

### 6.1 Password Security
```python
# Registration
user.set_password(plain_text) # Uses werkzeug.security.generate_password_hash

# Login
user.check_password(plain_text) # Uses werkzeug.security.check_password_hash
```

### 6.2 Session Management
```python
# Login
session['user_id'] = user.id
session['is_admin'] = user.is_admin
session.permanent = True

# Protected Routes
@login_required
def protected_endpoint():
    user_id = session['user_id']
```

### 6.3 CORS Protection
```python
CORS(app, resources={
    r"/api/*": {
        "origins": CORS_ORIGINS,
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": True
    }
})
```

## 7. Database Relationships

### ER Diagram (Conceptual)

```
User (1) ──────────────── (M) Session
         ├────── (1) Profile
         └────── (M) Feedback

School (1) ──────────────── (M) Event
        ├────── (M) Program
        └────── (1) Category

Job (1) ──────────────── (1) Company
    ├────── (M) Application
    └────── (1) Category

Agent (1) ──────────────── (M) Referral
      ├────── (M) Commission
      └────── (1) Region

PastPaper (1) ──────────────── (M) Rating
          ├────── (M) Download
          └────── (1) Subject
```

## 8. Error Handling

### 8.1 HTTP Status Codes

```
200 OK                 - Successful request
201 Created            - Resource created
400 Bad Request        - Invalid input
401 Unauthorized       - Not authenticated
403 Forbidden          - Not authorized
404 Not Found          - Resource not found
500 Server Error       - Internal error
```

### 8.2 Error Response Format

```json
{
  "error": "User not found",
  "status": 404,
  "timestamp": "2025-02-21T10:30:00Z"
}
```

## 9. Performance Optimization

### 9.1 Database Indexing

- Primary keys on all tables
- Indexes on frequently searched fields
- Composite indexes for common queries

### 9.2 Query Optimization

- Use pagination for large datasets
- Select only needed columns
- Use ORM relationships efficiently
- Avoid N+1 query problems

### 9.3 Frontend Optimization

- Minimal CSS/JS files
- Lazy loading images
- Browser caching
- Minimize HTTP requests

## 10. Deployment Architecture

### 10.1 Development
```
Local Machine
├── Python 3.8+
├── MySQL running locally
└── Flask dev server on localhost:5000
```

### 10.2 Production
```
Production Server
├── Gunicorn (WSGI server)
├── Nginx (Reverse proxy)
├── MySQL (Remote database)
└── SSL/TLS (HTTPS)
```

### 10.3 Environment Variables

```
FLASK_ENV=production
DEBUG=False
DATABASE_URL=mysql+pymysql://user:pass@host/db
SECRET_KEY=long-random-secret-key
CORS_ORIGINS=https://example.com
```

## 11. Scaling Considerations

### 11.1 Horizontal Scaling
- Multiple Flask instances behind load balancer
- Shared database
- Session store (Redis)

### 11.2 Vertical Scaling
- Increase server resources
- Database optimization
- Caching layer (Redis)

### 11.3 Database Optimization
- Sharding for large tables
- Read replicas
- Connection pooling

## 12. Monitoring & Logging

### Logging
```python
import logging
logger = logging.getLogger(__name__)
logger.info("User logged in: %s", email)
logger.error("Database error: %s", error)
```

### Health Checks
```
GET /api/health → System status
```

## 13. Future Architecture Improvements

1. **Caching**
   - Redis for session storage
   - Query result caching

2. **Message Queue**
   - Celery for async tasks
   - Email notifications

3. **Search Engine**
   - Elasticsearch for advanced search
   - Full-text search

4. **API Gateway**
   - Rate limiting
   - Request validation
   - Authentication

5. **Monitoring**
   - Prometheus metrics
   - ELK stack for logs

## Conclusion

The Thrive School Hub platform is built with a clean, scalable architecture that follows industry best practices. The separation of concerns, use of design patterns, and proper organization make it easy to maintain, test, and extend.

The system is production-ready with MySQL integration and follows RESTful principles, providing a solid foundation for future enhancements.
