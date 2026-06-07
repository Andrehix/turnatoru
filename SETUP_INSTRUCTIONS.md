# 🐀 Turnatoru - Setup & Rulare

## Progres Realizat

✅ **Bug PDF fixat** - caractere speciale (& < > " ') sunt acum escapate corect în ReportLab  
✅ **React Frontend** - setup complet cu Vite + React + Tailwind + React Router  
✅ **API endpoints** - DRF RouterS configurate pentru /api/formulare/, /api/persoane/, etc.  
✅ **CORS** - configurat pentru React dev server pe port 5173  

## Cum să Porni Serverele

### 1. **Backend Django** (Terminal 1)
```bash
cd turnatoru
python manage.py runserver 0.0.0.0:8000
```
✅ Django rulează pe `http://127.0.0.1:8000/`
✅ API disponibil la `http://127.0.0.1:8000/api/`

### 2. **Frontend React** (Terminal 2)
```bash
cd turnatoru
npm run dev
```
✅ React rulează pe `http://127.0.0.1:5173/`

## Pagini Disponibile

| Pagina | Path | Funcție |
|--------|------|---------|
| Home | / | Landing page cu navigație |
| Dashboard | /dashboard | Panoul creatorului - vede formularele |
| Create Form | /create | Crează formular nou |
| Token Login | /token | Intră cu token |
| Token Form | /token/:token | Respondentul completează formular |

## API Endpoints

```
GET    /api/formulare/          - Listează formulare
POST   /api/formulare/          - Crează formular
GET    /api/persoane/           - Listează persoane
POST   /api/persoane/           - Adaugă persoană
GET    /api/campuri/            - Listează câmpuri
POST   /api/campuri/            - Adaugă câmp
GET    /api/tokeni/             - Listează token-uri
POST   /api/tokeni/             - Generează token-uri
POST   /api/raspunsuri/         - Salvează răspunsuri
```

## Componente React

- **Home.jsx** - Landing page cu butoane de start
- **Dashboard.jsx** - Panoul creatorului cu liste formulare + export PDF
- **CreateForm.jsx** - Formular pentru creare turnătorii noi
- **TokenLogin.jsx** - Verificare token și redirect la formular
- **TokenFormular.jsx** - Formularul pe care respondentul îl completează
- **App.jsx** - Router principal cu 5 rute

## Buguri Fixate

### PDF Export Bug
**Problema**: Dacă o persoană avea nume cu caractere speciale (Ana & Popescu, O'Connor, etc), PDF export se blocau.

**Soluție**: Adăugată funcție `_escape_reportlab_text()` în `core/views.py` care escapează:
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&apos;`

## Database

- **Development**: SQLite (db.sqlite3)
- **Production**: PostgreSQL (setezi DB_PASSWORD în .env)

### Migrations

Au fost aplicate automat toate migrations. Dacă nu, rulează:
```bash
python manage.py migrate
```

## Setup Flow

1. ✅ npm install - dependencies instalate
2. ✅ python manage.py migrate - DB prepped
3. ✅ Django runserver - backend online
4. ✅ npm run dev - frontend online
5. 🎯 Accesează http://127.0.0.1:5173/ în browser

## Cum Contribui

Componentele React sunt în root folder pentru simplitate. De preferat ar fi să le muți în `src/pages/` pentru organizare, dar pentru acum funcționează și așa.

---

**Made with 🐀 and Copilot**
