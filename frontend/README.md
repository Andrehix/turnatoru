# Turnatoru - React SPA Frontend

A modern Single Page Application for anonymous feedback collection, built with React + Vite + Tailwind CSS.

## Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend Django server running on `http://localhost:8000`

### Installation Steps

```bash
cd frontend

npm install
```

### Development Server

```bash
npm run dev
```

App will be available at `http://localhost:3000`

The dev server automatically proxies API calls to `http://localhost:8000/api/`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable React components
│   │   └── Layout.jsx     # App shell / navigation
│   ├── pages/             # Page components (route targets)
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── FormBuilder.jsx
│   │   ├── FormDetails.jsx
│   │   ├── TokenForm.jsx
│   │   └── ResultsViewer.jsx
│   ├── services/          # API communication
│   │   └── api.js         # Axios instance + DRF endpoints
│   ├── utils/             # Helper functions
│   │   └── helpers.js
│   ├── styles/            # Global CSS
│   │   └── index.css      # Tailwind + custom classes
│   ├── App.jsx            # Router & auth logic
│   └── main.jsx           # React entry point
├── public/                # Static assets
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind theme
├── postcss.config.js      # PostCSS config
└── package.json           # Dependencies
```

## Key Features

### 📝 Form Builder
- Create forms with dynamic questions
- Support for text (free answer) and multiple choice questions
- Associate questions to specific target persons
- Personalized intro messages

### 🎫 Token-Based Anonymous Feedback
- Generate tokens in batches for secure, anonymous submissions
- Each token can only be used once
- Real-time token status tracking (used/available)

### 📊 Results & Analytics
- View aggregated feedback grouped by person and question
- Export results to PDF for archival and distribution

### 🔐 Authentication
- User registration & login
- JWT token stored in localStorage
- Protected routes (login required for dashboard)

## User Flows

### 1. Create a Form
1. Login → Dashboard
2. Click "New Form"
3. Add title + intro message
4. Add questions (text or multiple choice)
5. Associate questions to target persons
6. Submit to create

### 2. Generate Access Tokens
1. In Dashboard, click "Manage" on form
2. Enter number of tokens to generate
3. Copy tokens for distribution
4. Monitor token status (used/available)

### 3. Submit Anonymous Feedback
1. Respondent receives token (e.g., via email/Slack)
2. Visit `/token/:tokenCode`
3. Form loads with personalized questions
4. Submit feedback → token marked as used
5. Cannot reuse same token

### 4. Export Results
1. In Dashboard, click "Results" on form
2. View aggregated feedback
3. Click "Export PDF" to download structured report

## API Integration

All frontend requests go to Django REST Framework endpoints:

- **Forms**: `GET/POST /api/formulare/`, `GET /api/formulare/{id}/`
- **Questions**: `GET/POST /api/campuri/`
- **Tokens**: `GET /api/formulare/{id}/tokeni/`, `POST /api/formulare/{id}/genereaza-tokeni/`
- **Feedback**: `GET /api/token/{tokenCode}/`, `POST /api/token/{tokenCode}/submit/`
- **Targets**: `GET/POST /api/persoane/`

## Development Notes

- **Authentication**: Bearer tokens stored in localStorage, injected via axios interceptors
- **State Management**: Component-level state + localStorage for persistence
- **Styling**: Tailwind CSS with custom utility classes (`.btn-primary`, `.card`, `.input-base`)
- **Error Handling**: User-friendly error messages, validation on submit
- **Loading States**: UI shows loading indicators during async operations

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### "Cannot reach /api/..."
- Ensure Django backend is running on `http://localhost:8000`
- Check `vite.config.js` proxy configuration

### "Token already used"
- Tokens can only be used once by design
- Generate new tokens for additional submissions

### PDF export not working
- Requires `html2canvas` and `jspdf` packages (included)
- May fail on very large result sets; try exporting smaller ranges

## License

Project Turnatoru - Anonymous Feedback Platform
