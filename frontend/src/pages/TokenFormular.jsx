import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function TokenFormular() {
  const { token } = useParams();
  const [formular, setFormular] = useState(null);
  const [campuri, setCampuri] = useState([]);
  const [raspunsuri, setRaspunsuri] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [succes, setSucces] = useState(false);
  const [error, setError] = useState('');
  const [tokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: tokens } = await api.get('/tokeni/', { params: { cod: token.toUpperCase() } });
        if (!tokens?.length) return setError('Token invalid.');
        const tok = tokens[0];
        if (tok.folosit) return setError('Acest token a fost deja folosit.');
        setTokenInfo(tok);
        const { data: form } = await api.get(`/formulare/${tok.formular}/`);
        setFormular(form);
        const { data: fields } = await api.get('/campuri/', { params: { formular: tok.formular } });
        setCampuri(fields);
        const init = {}; fields.forEach(f => { init[f.id] = ''; }); setRaspunsuri(init);
      } catch { setError('Eroare la încărcare.'); }
      finally { setLoading(false); }
    })();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting || succes) return;
    for (const c of campuri) {
      if (!raspunsuri[c.id]?.trim()) { setError(`Completează răspunsul pentru: "${c.intrebare}"`); setTimeout(() => setError(''), 4000); return; }
    }
    try {
      setSubmitting(true); setError('');

      // Single atomic request
      const res = await fetch('/api/submit/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.toUpperCase(),
          raspunsuri: raspunsuri,
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setSucces(true);
        return;
      }

      // Token already used - show remaining tokens
      if (res.status === 409 && data.tokeni_ramasi) {
        setError('');
        setTokenExpiratData(data);
        return;
      }

      setError(data.error || 'Eroare la trimitere.');
    } catch {
      setError('Eroare de conexiune.');
    }
    finally { setSubmitting(false); }
  };

  const [tokenExpiratData, setTokenExpiratData] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="text-center">
          <div className="text-6xl animate-spin">🐀</div>
          <p className="text-rat-text-muted mt-4 text-lg">Se încarcă formularul...</p>
        </div>
      </div>
    );
  }

  if (error && !formular) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="text-center max-w-md rounded-2xl p-10" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-3xl font-black text-rat-red mb-3">Token Expirat!</h2>
          <p className="text-rat-text-dim mb-6">{error}</p>
          <Link to="/token" className="inline-block bg-rat-red hover:bg-rat-red-hover text-white px-6 py-3 rounded-xl font-bold">Încearcă alt Token</Link>
        </div>
      </div>
    );
  }

  if (succes) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="text-center max-w-md rounded-2xl p-10 animate-slideUp" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(46,213,115,0.3)' }}>
          <div className="text-7xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-rat-green mb-2">Gata, ai turnat!</h2>
          <p className="text-rat-text-dim mb-2">Turnătoria ta pentru "{formular?.titlu}" a fost salvată cu succes!</p>
          <p className="text-rat-text-muted mb-4">Nimeni nu va ști vreodată că tu ai scris asta. Poți dormi liniștit. Sau neliniștit, depinde ce ai scris.</p>
          <div className="p-5 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-rat-text-muted text-lg">🐀 "Un turnător bun este un turnător anonim."</p>
            <p className="text-rat-text-muted text-xs mt-1">— Nimeni, niciodată</p>
          </div>
          <Link to="/" className="inline-block bg-rat-green hover:bg-rat-green-hover text-rat-bg px-6 py-3 rounded-xl font-bold text-lg shadow transition-all">
            🏠 Mergi la Pagina Principală
          </Link>
        </div>
      </div>
    );
  }

  if (tokenExpiratData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="text-center max-w-lg rounded-2xl p-10 animate-slideUp" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-3xl font-black text-rat-red mb-2">Token Expirat!</h2>
          <p className="text-rat-text-dim mb-4">Acest token a fost deja folosit.</p>
          <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-rat-text-dim">Formular: <strong className="text-rat-amber">{tokenExpiratData.formular_titlu}</strong></p>
          </div>
          {tokenExpiratData.tokeni_ramasi?.length > 0 ? (
            <div className="rounded-2xl p-5 mb-6 text-left" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(46,213,115,0.2)' }}>
              <h3 className="text-rat-green font-bold mb-2">🎫 Tokeni Disponibili ({tokenExpiratData.tokeni_ramasi.length})</h3>
              <div className="flex flex-wrap gap-2">
                {tokenExpiratData.tokeni_ramasi.map(t => (
                  <a key={t.id} href={`/token/${t.cod}`}
                     className="px-3 py-1.5 rounded-lg font-mono text-sm font-bold border transition-colors hover:bg-rat-green/20 hover:border-rat-green hover:text-rat-green"
                     style={{ background: 'rgba(46,213,115,0.05)', borderColor: '#2ed573', color: '#2ed573' }}>
                    {t.cod}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-rat-text-muted mb-6">😱 Nu mai sunt tokeni.</p>
          )}
          <Link to="/token" className="inline-block bg-rat-red hover:bg-rat-red-hover text-white px-6 py-3 rounded-xl font-bold transition-all">
            Încearcă alt Token
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="max-w-2xl mx-auto px-4 py-12 animate-slideUp">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🐀</div>
          <h1 className="text-3xl font-black text-rat-red text-glow">{formular?.titlu}</h1>
          <p className="text-rat-text-dim mt-3 italic max-w-lg mx-auto">{formular?.mesaj}</p>
          <div className="mt-4 inline-block rounded-full px-5 py-2 text-xs font-mono text-rat-amber" style={{ background: 'rgba(255,165,2,0.1)', border: '1px solid rgba(255,165,2,0.3)' }}>
            🎫 Token: {token?.toUpperCase()}
          </div>
        </div>

        {error && <div className="text-rat-red text-sm font-bold bg-rat-red/10 border border-rat-red/30 rounded-xl px-5 py-3 mb-6 animate-slideUp">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {campuri.map((camp, idx) => (
            <div key={camp.id} className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(233,69,96,0.15)' }}>
              <div className="flex items-start gap-3 mb-4">
                <span className="w-8 h-8 rounded-full bg-rat-red text-white flex items-center justify-center font-bold text-sm shrink-0">{idx + 1}</span>
                <div>
                  <label className="block font-bold text-rat-red text-lg">{camp.intrebare}</label>
                  <span className="text-xs text-rat-text-muted">despre {camp.persoana_nume || ('persoana #' + camp.persoana)}</span>
                </div>
              </div>
              {camp.tip === 'text' ? (
                <textarea value={raspunsuri[camp.id] || ''} onChange={e => setRaspunsuri(prev => ({ ...prev, [camp.id]: e.target.value }))} rows={4}
                  placeholder="Scrie-ți părerea sinceră aici..."
                  className="w-full rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-rat-red transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(233,69,96,0.3)', color: '#fff' }} />
              ) : (
                <div className="space-y-2">
                  {(camp.optiuni || '').split(',').filter(Boolean).map((opt, i) => {
                    const val = opt.trim();
                    return (
                      <label key={i} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:border-rat-red"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(233,69,96,0.15)', color: '#ddd' }}>
                        <input type="radio" name={`camp-${camp.id}`} value={val} checked={raspunsuri[camp.id] === val}
                          onChange={e => setRaspunsuri(prev => ({ ...prev, [camp.id]: e.target.value }))}
                          className="accent-rat-red w-4 h-4" />
                        {val}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <button type="submit" disabled={submitting}
            className="w-full bg-rat-green hover:bg-rat-green-hover disabled:opacity-50 text-rat-bg py-4 rounded-xl font-black text-lg shadow hover:shadow-[0_5px_15px_rgba(46,213,115,0.4)] transition-all">
            {submitting ? '🐀 Se trimite...' : 'Trimite Turnătura 🐀'}
          </button>

          <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(46,213,115,0.05)' }}>
            <p className="text-rat-text-muted text-sm">
              🛡️ Răspunsul tău este complet anonim. Nici noi nu știm cine ești. Nici nu ne interesează.
              Ne interesează doar <em>adevărul</em>. Și poate un pic de dramă.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
