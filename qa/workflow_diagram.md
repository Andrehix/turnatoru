# Workflow Diagram — Turnatoru

## User Journey: Complete Feedback Flow

```mermaid
flowchart TD
    A[🏠 Pagina Principală] --> B{Utilizator?}
    B -->|Creator| C[🔐 Login / Înregistrare]
    B -->|Turnător| D[🎫 Introdu Token]
    B -->|Vizitator| E[🤖 Chatbot AI]

    C --> F[📊 Dashboard]
    F --> G[👥 Gestionează Persoane]
    F --> H[📝 Creează Formular]
    F --> I[🐀 Vezi Turnătorii]

    G --> G1[➕ Adaugă Persoană]
    G --> G2[🗑️ Șterge Persoană]

    H --> H1[📝 Titlu + Mesaj]
    H1 --> H2[➕ Adaugă Întrebări]
    H2 --> H3[👤 Asociază Persoana]
    H3 --> H4[🏷️ Alege Tip: Text / Opțiuni]
    H4 --> H5[✅ Salvează Formular]

    I --> I1[📊 Vezi Răspunsuri + Sentiment]
    I --> I2[🎫 Generează Tokeni]
    I --> I3[📄 Exportă PDF]

    D --> D1{Token valid?}
    D1 -->|Da, nefolosit| D2[📝 Completează Formular]
    D1 -->|Deja folosit| D3[🚫 Token Expirat]
    D3 --> D4[🎫 Vezi Tokeni Disponibili]

    D2 --> D5[✅ Trimite Feedback]
    D5 --> D6[🤖 AI: Analiză Sentiment]
    D6 --> D7[🎉 Succes!]

    E --> E1[💬 Întreabă Asistentul AI]
    E1 --> E2{Utilizator logat?}
    E2 -->|Creator| E3[Context: formulare + răspunsuri]
    E2 -->|Turnător cu token| E4[Context: întrebări formular]
    E2 -->|Anonim| E5[Asistență generală feedback]
    E3 --> E6[Răspuns AI]
    E4 --> E6
    E5 --> E6
```

## Flow Description

1. **Landing**: Userul alege rolul — Creator (creează formulare), Turnător (răspunde anonim), sau folosește Chatbot-ul AI
2. **Creator Flow**: Login → Dashboard → Gestionează persoane → Creează formular cu întrebări dinamice → Generează tokeni → Analizează răspunsuri
3. **Turnător Flow**: Introduce token → Dacă valid: completează formular anonim → AI analizează sentimentul → Succes. Dacă folosit: vede tokeni disponibili
4. **Chatbot AI**: Oferă răspunsuri contextualizate în funcție de rolul utilizatorului
