# Data Flow Diagram — Turnatoru

## API Data Flow: Cum circulă datele prin sistem

```mermaid
flowchart LR
    subgraph Frontend["React SPA (Vite :5173)"]
        Home["Home"]
        Dashboard["Dashboard"]
        CreateForm["CreateForm"]
        TokenForm["TokenFormular"]
        Chatbot["Chatbot UI"]
        Reviews["FormularReviews"]
    end

    subgraph Proxy["Vite Proxy"]
        P1["/api/* → Django"]
        P2["/agents/* → Django"]
        P3["/login, /logout → Django"]
    end

    subgraph Django["Django (runserver :8000)"]
        DRF["DRF ViewSets\n/api/persoane/\n/api/formulare/\n/api/campuri/\n/api/tokeni/\n/api/turnatorii/\n/api/raspunsuri/"]
        Auth["Auth Views\n/api/login/\n/api/register/\n/api/user/\n/api/submit/"]
        CB["Chatbot View\nPOST /agents/chatbot/"]
    end

    subgraph AI["AI Agents"]
        Sentiment["Sentiment Agent\nanalyze_turnatorie()\n→ SentimentResult\n→ SentimentRaspuns"]
        Claude["Claude API\nclaude-sonnet-4-6"]
    end

    subgraph DB["PostgreSQL"]
        Tables["Users\nPersoane\nFormulare\nCampuri\nTokeni\nTurnatorii\nRaspunsuri\nSentimentResults\nSentimentRaspuns"]
    end

    %% Frontend → Proxy → Django
    Dashboard -->|GET /api/formulare/| P1
    CreateForm -->|POST /api/formulare/| P1
    CreateForm -->|GET /api/persoane/| P1
    TokenForm -->|GET /api/campuri/| P1
    TokenForm -->|POST /api/submit/| P1
    Reviews -->|GET /api/turnatorii/| P1
    Chatbot -->|POST /agents/chatbot/| P2

    P1 --> DRF
    P1 --> Auth
    P2 --> CB

    %% Django → Database
    DRF -->|CRUD| Tables
    Auth -->|Sesiuni + Useri| Tables
    CB -->|Context DB| Tables

    %% Django → AI
    Auth -->|După submit| Sentiment
    Sentiment -->|API Call| Claude
    Claude -->|Răspuns JSON| Sentiment
    Sentiment -->|Salvează| Tables

    CB -->|System Prompt + User Data| Claude
    Claude -->|Răspuns text| CB

    %% Database → Frontend
    Tables -->|JSON Response| DRF
    DRF -->|JSON| Frontend
```

## Data Flow Steps

### 1. Creator creează formular
```
CreateForm.jsx → POST /api/formulare/ → FormularViewSet.perform_create() → PostgreSQL
CreateForm.jsx → POST /api/campuri/ (×N) → CampFormularViewSet → PostgreSQL
```

### 2. Turnător trimite feedback
```
TokenFormular.jsx → POST /api/submit/ {token, raspunsuri}
  → Verifică token (valid + nefolosit)
  → Creează Turnatorie + RaspunsCamp[]
  → Marchează token folosit
  → Sentiment Agent → Claude API → SentimentResult + SentimentRaspuns
  ← JSON {ok: true}
```

### 3. Chatbot AI
```
Chatbot UI → POST /agents/chatbot/ {messages[]}
  → Injectează context DB (formulare, răspunsuri, sentimente)
  → Claude API (system prompt + context + user messages)
  ← JSON {response: "..."}
```

### 4. Creator vede reviews
```
FormularReviews.jsx → GET /api/formulare/{id}/
                    → GET /api/campuri/?formular={id}
                    → GET /api/turnatorii/?formular={id}
                    → GET /api/raspunsuri/?turnatorie={id} (×N)
  ← JSON cu sentiment_label, persoana_nume, etc.
```
