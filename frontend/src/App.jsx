import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import TokenLogin from './pages/TokenLogin';
import TokenFormular from './pages/TokenFormular';
import Login from './pages/Login';
import Chatbot from './pages/Chatbot';
import Persoane from './pages/Persoane';
import AdminDashboard from './pages/AdminDashboard';
import FormularReviews from './pages/FormularReviews';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isFullPage = location.pathname.startsWith('/token/') && location.pathname !== '/token';

  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/user/', { credentials: 'include' });
      const data = await res.json();
      setUser(data.is_authenticated ? data : null);
    } catch {
      setUser(null);
    }
    setAuthChecked(true);
  };

  // Check auth on mount and on every route change
  useEffect(() => { checkAuth(); }, [location.pathname]);

  const handleLogout = async () => {
    await fetch('/logout/', { method: 'GET', credentials: 'include' });
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      {!isFullPage && (
        <header className="border-b-2 border-rat-red sticky top-0 z-50"
          style={{ background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(10px)' }}>
          <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-2xl font-black text-rat-red text-glow tracking-wider">
              <span className="text-3xl">🐀</span>
              <span>TURNATORU</span>
            </Link>
            <nav className="flex items-center gap-2 sm:gap-3">
              {authChecked && user ? (
                <>
                  {/* Logged in */}
                  <span className="hidden sm:inline text-rat-text-muted text-sm">
                    Salut, <strong className="text-rat-red">{user.username}</strong> 👋
                  </span>
                  <Link
                    to="/create"
                    className="hidden sm:inline-flex bg-rat-red hover:bg-rat-red-hover text-white px-4 py-2 rounded-lg font-bold text-sm shadow hover:shadow-[0_5px_15px_rgba(233,69,96,0.4)] hover:-translate-y-0.5 transition-all"
                  >
                    📝 Fă Formular
                  </Link>
                  <Link
                    to="/dashboard"
                    className="hidden sm:inline-flex text-rat-text-dim hover:text-rat-red font-semibold text-sm transition-colors"
                  >
                    📊 Dashboard
                  </Link>
                  {user.is_staff && (
                    <Link
                      to="/admin"
                      className="hidden sm:inline-flex text-rat-amber hover:text-rat-amber-hover font-semibold text-sm transition-colors"
                    >
                      🕵️ Admin
                    </Link>
                  )}
                  <Link
                    to="/chatbot"
                    className="inline-flex text-rat-text-dim hover:text-rat-red font-semibold text-sm transition-colors"
                    title="Asistent AI"
                  >
                    🤖
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex text-rat-text-dim hover:text-rat-red font-semibold text-sm transition-colors cursor-pointer border border-rat-red/30 hover:border-rat-red rounded-lg px-3 py-1.5"
                    title="Logout"
                  >
                    Logout 🚪
                  </button>
                </>
              ) : (
                <>
                  {/* Not logged in */}
                  <Link
                    to="/token"
                    className="bg-rat-amber hover:bg-rat-amber-hover text-rat-bg px-4 py-2 rounded-lg font-bold text-sm hover:-translate-y-0.5 transition-all"
                  >
                    🎫 Ai Token?
                  </Link>
                  <Link
                    to="/login"
                    className="bg-rat-red hover:bg-rat-red-hover text-white px-4 py-2 rounded-lg font-bold text-sm shadow hover:shadow-[0_5px_15px_rgba(233,69,96,0.4)] hover:-translate-y-0.5 transition-all"
                  >
                    Login 🔑
                  </Link>
                  <Link
                    to="/chatbot"
                    className="inline-flex text-rat-text-dim hover:text-rat-red font-semibold text-sm transition-colors"
                    title="Asistent AI"
                  >
                    🤖
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>
      )}

      <main className={isFullPage ? '' : 'max-w-6xl mx-auto px-5 py-10'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/token" element={<TokenLogin />} />
          <Route path="/token/:token" element={<TokenFormular />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/persoane" element={<Persoane />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/formular/:id" element={<FormularReviews />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
