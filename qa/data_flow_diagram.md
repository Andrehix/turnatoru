# Data Flow Diagram — Turnatoru

## API Data Flow: How Data Moves Through the System

```mermaid
flowchart LR
    subgraph Frontend["React SPA (Vite :5173)"]
        Home["Home"]
        Dashboard["Dashboard"]
        CreateForm["CreateForm"]
        TokenForm["TokenFormular"]
        ChatbotUI["Chatbot UI"]
        Reviews["FormularReviews"]
    end

    subgraph Proxy["Vite Proxy"]
        P1["/api/* → Django"]
        P2["/agents/* → Django"]
        P3["/login, /logout → Django"]
    end

    subgraph Django["Django (runserver :8000)"]
        DRF["DRF ViewSets
/api/persoane/
/api/formulare/
/api/campuri/
/api/tokeni/
/api/turnatorii/
/api/raspunsuri/"]
        Auth["Auth Views
/api/login/
/api/register/
/api/user/
/api/submit/"]
        CB["Chatbot View
POST /agents/chatbot/"]
    end

    subgraph AI["AI Agents"]
        Sentiment["Sentiment Agent
analyze_turnatorie()
→ SentimentResult
→ SentimentRaspuns"]
        Claude["Claude API
claude-sonnet-4-6"]
    end

    subgraph DB["PostgreSQL"]
        Tables["Users
People
Forms
Fields
Tokens
Submissions
Responses
SentimentResults
SentimentResponses"]
    end

    %% Frontend → Proxy → Django
    Dashboard -->|GET /api/formulare/| P1
    CreateForm -->|POST /api/formulare/| P1
    CreateForm -->|GET /api/persoane/| P1
    TokenForm -->|GET /api/campuri/| P1
    TokenForm -->|POST /api/submit/| P1
    Reviews -->|GET /api/turnatorii/| P1
    ChatbotUI -->|POST /agents/chatbot/| P2

    P1 --> DRF
    P1 --> Auth
    P2 --> CB

    %% Django → Database
    DRF -->|CRUD| Tables
    Auth -->|Sessions + Users| Tables
    CB -->|DB Context| Tables

    %% Django → AI
    Auth -->|After submit| Sentiment
    Sentiment -->|API Call| Claude
    Claude -->|JSON Response| Sentiment
    Sentiment -->|Saves| Tables

    CB -->|System Prompt + User Data| Claude
    Claude -->|Text Response| CB

    %% Database → Frontend
    Tables -->|JSON Response| DRF
    DRF -->|JSON| Frontend
```

## Data Flow Steps

### 1. Creator creates a form
```
CreateForm.jsx → POST /api/formulare/ → FormularViewSet.perform_create() → DB
CreateForm.jsx → POST /api/campuri/ (×N) → CampFormularViewSet → DB
```

### 2. Respondent submits feedback
```
TokenFormular.jsx → POST /api/submit/ {token, responses}
  → Validates token (exists + unused)
  → Creates Turnatorie + RaspunsCamp[]
  → Marks token as used
  → Sentiment Agent → Claude API → SentimentResult + SentimentRaspuns
  ← JSON {ok: true}
```

### 3. Chatbot AI
```
Chatbot UI → POST /agents/chatbot/ {messages[]}
  → Injects DB context (forms, responses, sentiment scores)
  → Claude API (system prompt + context + user messages)
  ← JSON {response: "..."}
```

### 4. Creator views reviews
```
FormularReviews.jsx → GET /api/formulare/{id}/
                    → GET /api/campuri/?formular={id}
                    → GET /api/turnatorii/?formular={id}
                    → GET /api/raspunsuri/?turnatorie={id} (×N)
  ← JSON with sentiment_label, persoana_nume, etc.
```
