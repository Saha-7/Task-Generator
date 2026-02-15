# Tasks Generator

AI-powered web app that generates user stories and engineering tasks from feature ideas.

## ✅ What's Done

- ✅ Form to enter feature idea (goal, users, constraints)
- ✅ Templates: Mobile App, Web Application, Internal Tool
- ✅ AI generates user stories with acceptance criteria
- ✅ Risk/unknowns section included
- ✅ Export to Markdown and Text (download + copy)
- ✅ View last 5 generated specs
- ✅ Delete specs from history
- ✅ Status page showing backend, storage, and LLM health
- ✅ Input validation
- ✅ Responsive design (mobile-friendly)

## 🚫 What's Not Done

- ❌ Edit/reorder tasks (can only view generated output)
- ❌ Manual grouping of tasks (AI groups automatically by category)
- ❌ Persistent database (uses JSON file storage instead)
- ❌ User authentication
- ❌ Collaborative editing

## 🚀 Quick Start

### Prerequisites
- Node.js
- React.js
- Gemini API key (free)

## ✅ 100% FREE - No Credit Card Needed!

This version uses **Google Gemini API** which is completely FREE for development and testing!

## 🚀 Quick Start

### 1. Get FREE Gemini API Key (2 minutes)

1. Go to: **https://makersuite.google.com/app/apikey**
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

**No credit card required!**

### 2. Install Backend

```bash
cd backend
npm install
```

**Dependencies installed:**
- express (web server)
- cors (cross-origin)
- dotenv (environment variables)
- @google/generative-ai (FREE Gemini API)

### 3. Configure API Key in .env

```bash
# Edit .env and add your Gemini API key

# GEMINI_API_KEY=your_key_here
# PORT=5000
# NODE_ENV=development
# FRONTEND_URL=http://localhost:5173
```

### 4. Start Backend

```bash
npm start
```

You should see:
```
🚀 Tasks Generator (FREE - Gemini)
Server: http://localhost:5000
```

### 5. Install Frontend (New Terminal)

```bash
cd frontend
npm install
```

**Dependencies installed:**
- react
- react-dom
- react-router-dom
- react-scripts

### 6. Start Frontend

```bash
npm start
```

Browser opens to: **http://localhost:3000**

## ✅ Verify It Works

1. Go to **http://localhost:3000/status**
2. All should be green (healthy)
3. Go back to home
4. Fill the form and click "Generate"
5. Wait 10-15 seconds
6. See your generated tasks!





## 🎯 Features Included

✅ Feature form with templates
✅ AI task generation (FREE!)
✅ Edit and organize tasks
✅ Export to Markdown/Text
✅ Last 5 specs history
✅ Health status dashboard
✅ Responsive design
✅ Simple, clean code

## 🔧 Deployment

### Free Options:

**Frontend:** Vercel 
**Backend:** Render 

### Quick Deploy:

1. Push to GitHub
2. Vercel for frontend (auto-deploy)
3. Render for backend (add GEMINI_API_KEY in env vars)

