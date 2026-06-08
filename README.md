# Turnatoru 🐀

An anonymous feedback platform built with Django. Users create feedback forms, distribute unique tokens, and collect fully anonymous responses ("turnătorii"). Integrated AI agents analyze sentiment and assist users via a context-aware chatbot.


---

## Table of Contents

1. [Features & Roles](#features--roles)
2. [Tech Stack](#tech-stack)
3. [AI Agents](#ai-agents)
4. [User Stories & Backlog](#user-stories--backlog)
5. [Diagrams](#diagrams)
6. [Automated Tests & Agent Evals](#automated-tests--agent-evals)
7. [Bug Reports](#bug-reports)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [AI Tools Report](#ai-tools-report)
10. [Local Setup](#local-setup)

---

## Features & Roles

| Role | What they can do |
|------|-----------------|
| **Admin** | See all forms, tokens, and submissions across all users |
| **Creator** | Register, create forms with dynamic questions, generate tokens, read anonymous feedback, export PDF reports |
| **Turnător** | Access a form via a unique token, submit anonymous feedback, use the AI chatbot to formulate responses |

---

## Tech Stack

- **Backend:** Python, Django 6, Django REST Framework
- **Frontend:** Django templates + Vanilla JS; React 18 + Vite + Tailwind CSS (SPA)
- **AI:** Anthropic Claude Sonnet 4.6 (via `anthropic` Python SDK)
- **Database:** PostgreSQL (production) / SQLite (local dev)
- **CI/CD:** GitHub Actions (lint + test on every PR)

---

## AI Agents

Two AI agents are integrated as part of the platform's core functionality:

### 1. Sentiment Analysis Agent (`agents/sentiment.py`)
Runs automatically after every form submission. Analyzes each individual answer using Claude and stores:
- Per-answer sentiment: `pozitiv` / `neutru` / `negativ`
- Overall submission sentiment with percentages (e.g. 70% pozitiv, 20% neutru, 10% negativ)

Results are displayed on the creator's dashboard next to each response.

### 2. Context-Aware Chatbot Agent (`agents/chatbot.py`)
Interactive assistant accessible to all users. What makes it context-aware:
- **For Creators:** on every request, the agent receives the creator's actual forms, all anonymous responses, and sentiment scores injected into the system prompt — enabling questions like *"Do you think Marius is being honest compared to the other answers?"*
- **For Turnători (with token):** the agent receives the form's title, intro message, and all questions — enabling help with formulating answers
- **For anonymous visitors:** generic feedback formulation assistant

Both agents use `claude-sonnet-4-6` and fall back gracefully if the API is unavailable.

---

## User Stories & Backlog

Full backlog tracked on [GitHub Projects](https://github.com/Andrehix/turnatoru/issues).

| # | As a... | I want to... | Acceptance Criteria |
|---|---------|-------------|---------------------|
| 1 | Creator | Create a new form with a title and intro message | Form is created only if title + at least one question are present; redirects to dashboard |
| 2 | Creator | Define dynamic questions in the form | Can add multiple questions of type text or multiple-choice |
| 3 | Creator | Choose question type (free text or multiple choice) | Both types supported; multiple-choice requires options |
| 4 | Creator | Associate each question with a target person | Each question is linked to a person from the creator's list |
| 5 | Creator | Manage a list of target people (add/delete) | People can be added and deleted; used in question assignment |
| 6 | Creator | Generate unique tokens in controlled batches | System creates exactly the requested number (1–50), each unique and linked to the form |
| 7 | Creator | See token status (used/unused) and response count | Dashboard shows live token state and response totals |
| 8 | Creator | Access a dashboard with all my forms | Dashboard lists all forms with response counts and actions |
| 9 | Creator | Export form results as a structured PDF | PDF contains form title, per-person sections, questions and answers |
| 10 | Creator | Register and log in to the platform | Authenticated account required to manage forms and data |
| 11 | Turnător | Access a form only with a valid token | Token must exist, be unused, and be linked to an active form |
| 12 | Turnător | Have my token invalidated after submitting | Token is marked as used after successful submission; cannot be reused |
| 13 | Creator | Ask the AI chatbot about my feedback data | Chatbot has access to all forms, answers, and sentiment scores for the logged-in creator |
| 14 | Turnător | Get AI help formulating my answers | Chatbot receives the form's context (questions, people) when token is active in session |

---

## Diagrams

All diagrams are in the [`qa/`](./qa/) folder in Mermaid format.

| Diagram | Description |
|---------|-------------|
| [Component Architecture Diagram](./qa/component_architecture_diagram.md) | How Django, React, Chatbot Agent, Sentiment Agent, and PostgreSQL interact |
| [Class & Sequence Diagrams](./qa/class_and_sequence_diagrams.md) | UML class diagram of all models + sequence diagram of the token submission flow |
| [Workflow Diagram](./qa/workflow_diagram.md) | Complete user journey: Creator, Turnător, and Visitor flows |
| [Data Flow Diagram](./qa/data_flow_diagram.md) | How data flows through React, Vite Proxy, Django, AI Agents, and PostgreSQL |

---

## Automated Tests & Agent Evals

Tests live in `agents/tests/` and `core/tests.py`.

Run all tests:
```bash
pytest
```

### Unit Tests
- Model creation and relationships (Formular, TokenTurnator, Turnatorie, RaspunsCamp)
- Sentiment analysis output validation
- Chatbot response format checks

### Agent Evals
The evaluation dataset is at [`qa/agent_eval_dataset.json`](./qa/agent_eval_dataset.json). It contains known inputs and expected sentiment ranges used to assert that the sentiment agent behaves correctly across positive, neutral, and negative feedback samples.

---

## Bug Reports

Bug reports are tracked as [GitHub Issues](https://github.com/Andrehix/turnatoru/issues).

| Bug | Severity | Status |
|-----|----------|--------|
| [PDF export fails for names with special characters](./qa/bug_report.md) | High | Fixed — `_escape_reportlab_text()` added in `core/views.py` |

---

## CI/CD Pipeline

File: [`.github/workflows/django.yml`](./.github/workflows/django.yml)

- **Trigger:** every push and pull request to `main`
- **Steps:** `ruff` linter → `pytest` test suite

---

## AI Tools Report

### Razvan Zapodeanu — Claude Code (Anthropic)
Used Claude Code (CLI) throughout the AI agents feature development:
- Generated the full `agents/` app structure: `sentiment.py`, `chatbot.py`, `views.py`, models and migrations for `SentimentResult` and `SentimentRaspuns`
- Designed and implemented the context-aware chatbot: injecting live DB data (creator's forms, responses, sentiment scores) into the Claude system prompt per request
- Implemented session-based token detection so the chatbot knows which form a turnător has access to
- Wrote unit tests for sentiment analysis and chatbot response validation
- Generated the Component Architecture Diagram in Mermaid
- Used for debugging API integration issues (model ID, dotenv loading, ANTHROPIC_API_KEY detection)

### Luca George-Iulian — Gemini Code Assist (Google)
Used Gemini Code Assist (Google) to build the complete React frontend:

- **Full SPA rebuild**: Scaffolded a fresh Vite + React 19 + Tailwind CSS 4 project as the new frontend
- **9-page component suite**: `Home`, `Dashboard`, `CreateForm`, `TokenLogin`, `TokenFormular`, `Login` (unified login/register), `Persoane` (CRUD), `AdminDashboard`, `Chatbot` (AI chat interface), `FormularReviews` (response viewer with sentiment bars)
- **Django-style dark theme**: Replicated the original color palette (`#1a1a2e` background, `#e94560` red accent, `#2ed573` green, `#ffa502` amber) and humorous Romanian copy across all components
- **Axios API layer**: Configured Axios with CSRF token support, session credentials, and base URL pointing to the Vite dev server proxy
- **Authentication**: Built custom Django REST endpoints (`POST /api/login/`, `POST /api/register/`) returning JSON; logout via `GET /logout/` with auth state refresh; dynamic header that shows username + Dashboard + Admin + Logout when logged in, or "Ai Token?" + "Login" when anonymous
- **Form builder**: Dynamic field array with person selection, text/multiple-choice toggle, per-field validation; DRF `perform_create` auto-assigns the `creator` field
- **Token flow**: Validation, expired token page listing remaining unused tokens as clickable codes, multi-step submission (create `Turnatorie` → create `RaspunsCamp` entries → trigger AI sentiment analysis → mark token used)
- **Backend API enhancements**: Added `persoana_nume` and `sentiment_label` to DRF serializers, `@csrf_exempt` on all API ViewSets, filtered querysets to only return the authenticated user's data, added `?formular=` and `?turnatorie=` query parameter filtering
- **Vite proxy**: Configured dev server to forward `/api`, `/agents`, `/dashboard`, `/login`, `/logout`, `/register`, `/token` to Django, sharing session cookies between frontend and backend

### Voiculet Iulian Alexandru — GitHub Copilot + Gemini (Google)
Used GitHub Copilot and Gemini for QA setup and testing:
- Generated test scaffolding and database setup for `pytest-django`
- Wrote bug report scenario and UML diagrams (Class, Sequence)
- Assisted with CI/CD workflow configuration
- Used Gemini for agent evaluation dataset design

### Prodan Adrian-Andrei — Gemini (Browser) + VS Code Copilot (Gemini 3.1 Pro)
Used Gemini in the browser to consult on project structure and core ideas, then VS Code Copilot with Gemini 3.1 Pro for the actual coding:
- Planned the overall platform architecture (Django + DRF + React)
- Designed the data models (`Formular`, `TokenTurnator`, `Turnatorie`, `Persoana`, `CampFormular`, `RaspunsCamp`)
- Implemented the dynamic form builder with per-person question assignment
- Built the Django template-based views (token login, form rendering, creator dashboard)
- Configured CI/CD pipeline with GitHub Actions

---

## Local Setup

### Backend (Django)
```bash
git clone https://github.com/Andrehix/turnatoru.git
cd turnatoru
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # add your ANTHROPIC_API_KEY
python manage.py migrate
python manage.py runserver
```

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### Environment variables (`.env`)
```
ANTHROPIC_API_KEY=sk-ant-...    # Required for AI agents (sentiment + chatbot)
DB_PASSWORD=...                 # Required for PostgreSQL (set USE_SQLITE=false)
USE_SQLITE=false                # Set to false for PostgreSQL (default: true for SQLite)
DEBUG=True                      # Set to False in production
```

### Database
- **SQLite** (default) — no setup needed, uses `db.sqlite3`
- **PostgreSQL** — set `USE_SQLITE=false` and `DB_PASSWORD` in `.env`, then create the database:
  ```sql
  CREATE DATABASE turnatoru_db;
  ```

### Access the app
| Service | URL |
|---------|-----|
| React Frontend | http://localhost:5173 |
| Django Backend | http://localhost:8000 |
| Django Admin | http://localhost:8000/admin/ |
