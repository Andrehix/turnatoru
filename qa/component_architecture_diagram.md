# Component Architecture Diagram — Turnatoru

## Overview

This diagram shows how the main components of the Turnatoru platform interact with each other.

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser["Browser\n(Django Templates + Vanilla JS)"]
        React["React SPA\n(Vite + Tailwind CSS)"]
    end

    subgraph Django["Django Backend"]
        CoreApp["core app\n(views, models, URLs)"]
        AgentsApp["agents app\n(chatbot, sentiment)"]
        DRFAPI["Django REST Framework\n(/api/ endpoints)"]
        Auth["Django Auth\n(session-based)"]
    end

    subgraph AI["AI Agents"]
        ChatbotAgent["Chatbot Agent\nclaude-sonnet-4-6\nContext-aware: injects\nuser forms + responses\ninto system prompt"]
        SentimentAgent["Sentiment Agent\nclaude-sonnet-4-6\nAnalyzes each answer\n(positive/neutral/negative %)"]
    end

    subgraph DB["Data Layer"]
        PostgreSQL["PostgreSQL\n(production / Render)"]
        SQLite["SQLite\n(local development)"]
    end

    subgraph Hosting["Hosting"]
        Render["Render.com\n(auto-deploy on merge to main)"]
        GHActions["GitHub Actions CI/CD\n(lint + test on every PR)"]
    end

    Browser -->|"HTTP requests\n(form submit, token login)"| CoreApp
    Browser -->|"POST /agents/chatbot/"| AgentsApp
    React -->|"REST calls via Axios"| DRFAPI
    DRFAPI --> CoreApp
    CoreApp --> Auth
    CoreApp -->|"reads/writes"| PostgreSQL
    CoreApp -->|"reads/writes"| SQLite
    AgentsApp -->|"reads user data\n(forms, responses, sentiment)\nper request"| PostgreSQL
    AgentsApp -->|"reads user data\n(forms, responses, sentiment)\nper request"| SQLite
    AgentsApp -->|"Anthropic API call\nwith injected context"| ChatbotAgent
    AgentsApp -->|"Anthropic API call\non form submission"| SentimentAgent
    SentimentAgent -->|"saves SentimentResult\n+ SentimentRaspuns"| PostgreSQL
    Django --> Render
    GHActions -->|"runs ruff + pytest\non every PR"| Django
```

## Component Descriptions

| Component | Technology | Role |
|-----------|-----------|------|
| **Browser (Django Templates)** | HTML/CSS + Vanilla JS | Main user interface for creators and respondents |
| **React SPA** | React 18, Vite, Tailwind CSS | Alternative modern frontend for key pages |
| **core app** | Django 6, Python | Business logic: forms, tokens, responses, PDF export |
| **agents app** | Django + Anthropic SDK | AI chatbot and sentiment analysis services |
| **Django REST Framework** | DRF ViewSets | REST API consumed by the React frontend |
| **Chatbot Agent** | Claude Sonnet 4.6 | Context-aware assistant — receives real user data (forms, answers, sentiment scores) injected into system prompt per request |
| **Sentiment Agent** | Claude Sonnet 4.6 | Analyzes each submitted answer individually, stores positive/neutral/negative percentages |
| **PostgreSQL** | Render free tier | Production database |
| **SQLite** | Local file | Development database |
| **Render.com** | PaaS | Auto-deploys on merge to main via webhook |
| **GitHub Actions** | CI/CD | Runs ruff linter + pytest on every pull request |
```
