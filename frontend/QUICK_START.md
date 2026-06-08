# 🐀 Turnatoru Frontend - Quick Start

## 1️⃣ Install Dependencies

```bash
cd frontend
npm install
```

Takes ~30 seconds.

## 2️⃣ Start Backend & Frontend

**Terminal 1 - Backend (Django)**:
```bash
cd turnatoru
python manage.py runserver
# Runs on http://localhost:8000
```

**Terminal 2 - Frontend (React)**:
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

## 3️⃣ First Steps in App

### 👤 Create Account
- Go to http://localhost:3000
- Click "Sign up"
- Create a test account (e.g., `testuser` / `test@example.com` / `password123`)

### 📝 Create a Form
- After login, you're in Dashboard
- Click "+ New Form"
- Add title: "Feedback on Team"
- Add 2-3 questions:
  - Q1: "What's my biggest strength?" (Text answer)
  - Q2: "How often do I help team?" (Multiple choice: "Always" / "Often" / "Sometimes" / "Never")
  - Associate each to a target person (create one first if needed)
- Click "Create Form"

### 🎫 Generate Tokens
- In Dashboard, click "Manage" on your form
- Enter "5" in token count
- Click "Generate"
- Copy one token code (e.g., `ABC123DEF456`)

### 📤 Test Anonymous Submission
- Open new incognito window
- Go to `http://localhost:3000/token/ABC123DEF456` (replace with actual token)
- Fill the form
- Click "Submit Feedback"
- ✅ Success screen appears

### 📊 View Results
- Back to main window (creator view)
- Click "Results" on your form
- See aggregated feedback
- Click "Export PDF" to download

## 4️⃣ Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot reach /api/" | Ensure Django runs on `:8000` |
| Form won't load | Check browser console for errors |
| Token says "used" | Each token can only submit once by design |
| Export PDF is blank | Ensure form has responses first |

## 5️⃣ Explore Features

- **Persoane** (Targets): Add people to form feedback-loop
- **Dynamic Questions**: Add/remove questions without page reload
- **Token Status**: Real-time tracking of used/available tokens
- **Anonymous Submission**: No login required with valid token

## 📚 Full Docs

See `README.md` for complete setup and `AI_USAGE_DOCUMENTATION.md` for component details.

---

**Ready?** Run `npm run dev` and start 🚀!
