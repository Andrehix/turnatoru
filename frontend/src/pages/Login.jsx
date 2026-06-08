import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) { setError('Completează username-ul și parola.'); return; }
    if (isRegister && password !== password2) { setError('Parolele nu se potrivesc.'); return; }
    if (isRegister && password.length < 4) { setError('Parola aia e mai scurtă decât un haiku. Minim 4 caractere, te rog.'); return; }
    try {
      setLoading(true);
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      if (isRegister) {
        formData.append('email', email);
        formData.append('password1', password);
        formData.append('password2', password2);
      }

      // Use the new API endpoints that return JSON
      const url = isRegister
        ? '/api/register/'
        : '/api/login/';

      const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || `Eroare server (${res.status})`);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.ok) {
        navigate('/');
        return;
      }

      setError(data.error || 'Eroare necunoscută.');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Eroare de conexiune. Vezi consola (F12) pentru detalii.');
    }
    finally { setLoading(false); }
  };

  const handleLogout = async () => {
    try { await fetch('/logout/', { method: 'GET', credentials: 'include' }); } catch {}
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto text-center py-16 animate-slideUp">
      <h1 className="text-4xl font-black text-rat-red text-glow mb-3">{isRegister ? '🚪 Înregistrare' : '🔐 Login'}</h1>
      <p className="text-rat-text-dim mb-10">
        {isRegister ? "Vrei să afli ce cred oamenii despre tine? Ești sigur? Bine, las' că nu mai ai scăpare..." : 'Intră în cont pentru a-ți vedea formularele și turnătoriile.'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {error && <div className="text-rat-red text-sm font-bold bg-rat-red/10 border border-rat-red/30 rounded-xl px-4 py-3 animate-slideUp">{error}</div>}

        <FormGroup label="Nume de utilizator">
          <Input value={username} onChange={setUsername} placeholder="turnatoru_suprem_69" autoFocus />
        </FormGroup>
        {isRegister && (
          <FormGroup label="Email">
            <Input type="email" value={email} onChange={setEmail} placeholder="soricel@turnatoru.ro" />
          </FormGroup>
        )}
        <FormGroup label="Parolă">
          <Input type="password" value={password} onChange={setPassword} placeholder={isRegister ? 'Ceva mai bun decât 1234, te rog' : 'Parola ta'} />
        </FormGroup>
        {isRegister && (
          <FormGroup label="Confirmă parola">
            <Input type="password" value={password2} onChange={setPassword2} placeholder="Aceeași chestie ca mai sus, dai?" />
          </FormGroup>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-rat-red hover:bg-rat-red-hover disabled:opacity-50 text-white py-4 rounded-xl font-black text-lg shadow hover:shadow-[0_5px_15px_rgba(233,69,96,0.4)] transition-all">
          {loading ? '🐀 Se procesează...' : isRegister ? 'Creează Cont 🐀' : 'Intră în Cont 🔑'}
        </button>

        <div className="text-center text-sm text-rat-text-muted">
          {isRegister ? <>Ai deja cont? <button type="button" onClick={() => { setIsRegister(false); setError(''); }} className="text-rat-red font-bold hover:underline">Loghează-te</button></>
            : <>Nu ai cont? <button type="button" onClick={() => { setIsRegister(true); setError(''); }} className="text-rat-red font-bold hover:underline">Înregistrează-te</button></>}
        </div>

        <div className="text-center text-sm space-x-3">
          <Link to="/" className="text-rat-text-muted hover:text-rat-red">← Înapoi acasă</Link>
          <button onClick={handleLogout} className="text-rat-text-muted hover:text-rat-red cursor-pointer">👋 Logout</button>
        </div>
      </form>
    </div>
  );
}

function FormGroup({ label, children }) {
  return <div><label className="block text-rat-red font-bold mb-1 text-sm">{label}</label>{children}</div>;
}

function Input({ type = 'text', value, onChange, placeholder, autoFocus }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus}
      className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-rat-red focus:shadow-[0_0_10px_rgba(233,69,96,0.2)] transition-all"
      style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(233,69,96,0.3)', color: '#fff' }} />
  );
}
