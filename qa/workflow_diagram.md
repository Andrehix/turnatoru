# Workflow Diagram — Turnatoru

## User Journey: Complete Feedback Flow

```mermaid
flowchart TD
    A[🏠 Home Page] --> B{User?}
    B -->|Creator| C[🔐 Login / Register]
    B -->|Respondent| D[🎫 Enter Token]
    B -->|Visitor| E[🤖 AI Chatbot]

    C --> F[📊 Dashboard]
    F --> G[👥 Manage People]
    F --> H[📝 Create Form]
    F --> I[🐀 View Responses]

    G --> G1[➕ Add Person]
    G --> G2[🗑️ Delete Person]

    H --> H1[📝 Title + Message]
    H1 --> H2[➕ Add Questions]
    H2 --> H3[👤 Assign Person]
    H3 --> H4[🏷️ Choose Type: Text / Options]
    H4 --> H5[✅ Save Form]

    I --> I1[📊 View Responses + Sentiment]
    I --> I2[🎫 Generate Tokens]
    I --> I3[📄 Export PDF]

    D --> D1{Token valid?}
    D1 -->|Yes, unused| D2[📝 Fill Form]
    D1 -->|Already used| D3[🚫 Token Expired]
    D3 --> D4[🎫 View Available Tokens]

    D2 --> D5[✅ Submit Feedback]
    D5 --> D6[🤖 AI: Sentiment Analysis]
    D6 --> D7[🎉 Success!]

    E --> E1[💬 Ask AI Assistant]
    E1 --> E2{Logged in?}
    E2 -->|Creator| E3[Context: forms + responses]
    E2 -->|Respondent with token| E4[Context: form questions]
    E2 -->|Anonymous| E5[General feedback help]
    E3 --> E6[AI Response]
    E4 --> E6
    E5 --> E6
```

## Flow Description

1. **Landing**: User chooses role — Creator (creates forms), Respondent (answers anonymously), or uses the AI Chatbot
2. **Creator Flow**: Login → Dashboard → Manage people → Create form with dynamic questions → Generate tokens → Analyze responses
3. **Respondent Flow**: Enter token → If valid: complete anonymous form → AI analyzes sentiment → Success. If used: see available tokens
4. **AI Chatbot**: Provides contextual responses based on user role
