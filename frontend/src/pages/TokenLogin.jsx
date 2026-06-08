import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function TokenLogin() {
  const navigate = useNavigate();
  const [cod, setCod] = useState('');
  const [loading, setLoading] = useState(false);
  const [eroare, setEroare] = useState('');
  const [tokenExpirat, setTokenExpirat] = useState(null); // { formular, tokeni_ramasi }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tokenCurat = cod.trim().toUpperCase();
    if (!tokenCurat) { setEroare('Introdu un cod de token.'); return; }

    try {
      setLoading(true); setEroare(''); setTokenExpirat(null);
      const { data } = await api.get('/tokeni/', { params: { cod: tokenCurat } });
      if (!data?.length) { setEroare('Token invalid. Verifică codul.'); setTimeout(() => setEroare(''), 4000); return; }
      const token = data[0];
      if (token.folosit) {
        // Fetch remaining tokens for this form
        const { data: allTokens } = await api.get('/tokeni/', { params: { formular: token.formular } });
        const ramasi = allTokens.filter(t => !t.folosit);
        const { data: formular } = await api.get(`/formulare/${token.formular}/`);
        setTokenExpirat({ formular, tokeni_ramasi: ramasi });
        return;
      }
      navigate(`/token/${tokenCurat}`);
    } catch {
      setEroare('Eroare de conexiune. Serverul rulează?'); setTimeout(() => setEroare(''), 4000);
    } finally { setLoading(false); }
  };

  // Show expired token page with remaining tokens
  if (tokenExpirat) {
    const { formular, tokeni_ramasi } = tokenExpirat;
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-slideUp">
        <h1 className="text-5xl font-black text-rat-red text-glow mb-4">🚫 Token Expirat!</h1>
        <p className="text-rat-text-dim text-lg mb-6">
          Acest token a fost deja folosit. Un turnător nu toarnă de două ori cu același bilet!
        </p>

        <div className="rounded-xl p-5 mb-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <p className="text-rat-text-dim">
            Formular: <strong className="text-rat-amber">{formular.titlu}</strong>
          </p>
        </div>

        {tokeni_ramasi.length > 0 ? (
          <div className="rounded-2xl p-6 mb-6 text-left" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
            <h3 className="text-rat-red font-bold mb-2">🎫 Tokeni Disponibili ({tokeni_ramasi.length})</h3>
            <p className="text-rat-text-muted text-sm mb-4">Ia-ți unul și toarnă!</p>
            <div className="flex flex-wrap gap-2">
              {tokeni_ramasi.map(t => (
                <button
                  key={t.id}
                  onClick={() => navigate(`/token/${t.cod}`)}
                  className="px-3 py-1.5 rounded-lg font-mono text-sm font-bold border transition-colors hover:bg-rat-green/20 hover:border-rat-green hover:text-rat-green"
                  style={{ background: 'rgba(46,213,115,0.05)', borderColor: '#2ed573', color: '#2ed573' }}
                >
                  {t.cod}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-8 mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
            <h3 className="text-xl font-bold text-rat-red mb-2">😱 Nu mai sunt tokeni disponibili!</h3>
            <p className="text-rat-text-muted">Cere alt token de la creatorul formularului.</p>
          </div>
        )}

        <button onClick={() => { setTokenExpirat(null); setCod(''); }}
          className="inline-block bg-rat-red hover:bg-rat-red-hover text-white px-6 py-3 rounded-xl font-bold transition-all">
          🔄 Încearcă alt Token
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto text-center py-20 animate-slideUp">
      <h1 className="text-5xl font-black text-rat-red text-glow mb-4">🎫 Login Turnător</h1>
      <p className="text-rat-text-dim text-lg mb-10">
        Ai primit un token secret? Introdu-l mai jos și pregătește-te să torni tot ce ai pe suflet. Anonim, desigur.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {eroare && <div className="text-rat-red text-sm font-bold bg-rat-red/10 border border-rat-red/30 rounded-xl px-4 py-3 animate-slideUp">{eroare}</div>}
        <input
          type="text" value={cod} onChange={e => setCod(e.target.value)}
          placeholder="INTRODU TOKENUL" maxLength={12}
          className="w-full py-5 px-6 text-2xl text-center tracking-[5px] font-bold font-mono uppercase rounded-xl border-3 focus:outline-none transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', borderColor: '#e94560', color: '#fff' }}
          autoFocus
        />
        <button type="submit" disabled={loading}
          className="w-full bg-rat-red hover:bg-rat-red-hover disabled:opacity-50 text-white py-4 rounded-xl font-black text-lg shadow hover:shadow-[0_5px_15px_rgba(233,69,96,0.4)] transition-all">
          {loading ? '🐀 Se verifică...' : 'Intră în formular 🐀'}
        </button>
      </form>

      <p className="mt-8 text-rat-text-muted text-sm">
        🔒 Tokenul tău nu va fi asociat cu identitatea ta. Ești mai anonim decât un cont de trolling pe Reddit.
      </p>

      <div className="mt-8 p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
        <p className="text-rat-text-muted text-sm">
          <strong className="text-rat-amber">⚠️ Atenție:</strong> Dacă n-ai primit un token, înseamnă că nimeni nu vrea
          opinia ta. Glumesc. Sau nu. Întreabă-l pe cel care a creat formularul.
        </p>
      </div>

      <p className="mt-6 text-rat-text-muted text-sm">
        <Link to="/" className="text-rat-red hover:underline font-bold">← Înapoi acasă</Link>
      </p>
    </div>
  );
}
