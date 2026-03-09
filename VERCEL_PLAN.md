# Vercel Hosting Organization Plan

## Information Gathered

### Current Project Structure

```
UEB/
├── backend/           # Flask backend (Python)
│   ├── app.py
│   ├── config.py
│   ├── models/
│   ├── routes/
│   └── utils/
├── frontend/          # Frontend HTML/CSS/JS
│   ├── index.html
│   ├── schools.html
│   ├── about.html
│   ├── activities.html
│   ├── admin-dashboard.html
│   ├── agents.html
│   ├── bursaries.html
│   ├── contact.html
│   ├── e-library.html
│   ├── login.html
│   ├── register.html
│   ├── schools.html
│   ├── suggestion.html
│   ├── privacy-policy.html
│   ├── terms-and-conditions.html
│   ├── styles/         # CSS files
│   ├── js/            # JavaScript files
│   └── gallery/       # Images
├── instance/          # SQLite database
├── api/              # Vercel API handlers (NEW)
└── Various config files
```

### Key Issues for Vercel Deployment

1. **Backend**: Flask app needs to be converted to Vercel Serverless Functions
2. **API Routes**: Current `/api/*` routes need to be in `api/` folder
3. **Static Files**: Frontend HTML files need proper routing
4. **Database**: SQLite may have issues on Vercel - consider using Vercel Postgres or external DB

## ✅ COMPLETED TASKS

### Phase 1: Directory Restructuring ✅

1. ✅ Created root-level `api/` folder for Vercel serverless functions
2. ✅ Configured `vercel.json` to use `frontend/` folder for static files
3. ✅ Set up proper routing rules for all static assets

### Phase 2: Backend Conversion ✅

1. ✅ Created API endpoint files:
   - `api/index.py` - Main API router
   - `api/schools.py` - Schools endpoint
   - `api/auth.py` - Authentication endpoint
   - `api/bursaries.py` - Bursaries endpoint
   - `api/agents.py` - Agents endpoint
   - `api/events.py` - Events endpoint
   - `api/jobs.py` - Jobs endpoint
   - `api/past_papers.py` - Past Papers endpoint
   - `api/suggestions.py` - Suggestions endpoint
   - `api/stats.py` - Statistics endpoint

### Phase 3: Frontend Updates ✅

1. ✅ Updated `frontend/js/api.js` with dynamic API URL detection
   - Uses `/api` for production (Vercel)
   - Uses `http://localhost:5000/api` for local development

### Phase 4: Configuration Files ✅

1. ✅ Created `vercel.json` with proper routing rules
2. ✅ Created `requirements.txt` for Python dependencies
3. ✅ Created `api/__init__.py` package initializer

## Deployment Instructions

### To Deploy to Vercel:

1. **Install Vercel CLI** (if not already):

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel
   ```

4. **For Production**:
   ```bash
   vercel --prod
   ```

### Environment Variables (if needed):

Set these in Vercel Dashboard:

- `DATABASE_URL` - For production database
- `SECRET_KEY` - For session management

## Project Structure After Organization

```
UEB/
├── api/                    # Vercel Serverless API
│   ├── __init__.py
│   ├── index.py           # Main API router
│   ├── schools.py         # Schools endpoint
│   ├── auth.py           # Auth endpoint
│   ├── bursaries.py      # Bursaries endpoint
│   ├── agents.py         # Agents endpoint
│   ├── events.py         # Events endpoint
│   ├── jobs.py           # Jobs endpoint
│   ├── past_papers.py    # Past papers endpoint
│   ├── suggestions.py    # Suggestions endpoint
│   └── stats.py          # Stats endpoint
├── frontend/              # Frontend static files
│   ├── index.html
│   ├── schools.html
│   ├── about.html
│   ├── ...
│   ├── styles/
│   ├── js/
│   └── gallery/
├── backend/              # Original Flask backend (for reference)
├── vercel.json          # Vercel configuration
├── requirements.txt     # Python dependencies
└── README.md
```

## Notes

- The API handlers return sample/demo data by default
- For production database integration, update the API handlers to connect to your database
- The frontend works both locally and on Vercel with the same code
