import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function FormularReviews() {
  const { id } = useParams();
  const [formular, setFormular] = useState(null);
  const [campuri, setCampuri] = useState([]);
  const [turnatorii, setTurnatorii] = useState([]);
  const [tokeni, setTokeni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data: form } = await api.get(`/formulare/${id}/`);
        setFormular(form);
        const { data: fields } = await api.get('/campuri/', { params: { formular: id } });
        setCampuri(fields);
        const { data: tokens } = await api.get('/tokeni/', { params: { formular: id } });
        setTokeni(tokens);
        const { data: reviews } = await api.get('/turnatorii/', { params: { formular: id } });
        // Fetch raspunsuri for each turnatorie individually (to avoid cross-formular leakage)
        const reviewsWithAnswers = await Promise.all(reviews.map(async (t) => {
          const { data: raspunsuri } = await api.get('/raspunsuri/', { params: { turnatorie: t.id } });
          return { ...t, raspunsuri };
        }));
        setTurnatorii(reviewsWithAnswers);
      } catch {
        setError('Eroare la încărcare.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // Build camp lookup map
  const campMap = {};
  campuri.forEach(c => { campMap[c.id] = c; });

  const [generating, setGenerating] = useState(false);
  const [numTokeni, setNumTokeni] = useState(5);

  const handleGenerateTokeni = async (e) => {
    if (e) e.preventDefault();
    const num = Math.min(Math.max(numTokeni, 1), 50);
    try {
      setGenerating(true);
      for (let i = 0; i < num; i++) {
        await api.post('/tokeni/', { formular: id });
      }
      const { data: tokens } = await api.get('/tokeni/', { params: { formular: id } });
      setTokeni(tokens);
    } catch {
      alert('Eroare la generare.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl animate-spin">🐀</div>
        <p className="text-rat-text-muted mt-4">Se încarcă...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-rat-red">{error}</p>
        <Link to="/dashboard" className="text-rat-text-dim hover:text-rat-red mt-4 inline-block">← Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="animate-slideUp">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-black text-rat-red text-glow">🐀 {formular?.titlu}</h1>
          <p className="text-rat-text-dim mt-1 italic">{formular?.mesaj}</p>
        </div>
        <div className="flex gap-3 items-center">
          <form onSubmit={handleGenerateTokeni} className="flex items-center gap-2">
            <input type="number" min="1" max="50" value={numTokeni}
              onChange={e => setNumTokeni(parseInt(e.target.value) || 5)}
              className="w-16 px-2 py-2 text-center text-sm rounded-lg font-bold"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #2ed573', color: '#fff' }} />
            <button type="submit" disabled={generating}
               className="bg-rat-green hover:bg-rat-green-hover disabled:opacity-50 text-rat-bg px-4 py-2 rounded-lg font-bold text-sm transition-all whitespace-nowrap">
              {generating ? '...' : 'Generează 🎫'}
            </button>
          </form>
          <a href={`/dashboard/formular/${id}/export-pdf/`} target="_blank" rel="noopener noreferrer"
             className="bg-rat-amber hover:bg-rat-amber-hover text-rat-bg px-4 py-2 rounded-lg font-bold text-sm transition-all">
            Exportă PDF 📄
          </a>
          <Link to="/dashboard" className="text-rat-text-dim hover:text-rat-red font-semibold text-sm self-center">
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Campuri */}
      {campuri.length > 0 && (
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
          <h3 className="text-rat-red font-bold mb-3">📋 Structura Formularului</h3>
          <div className="space-y-2">
            {campuri.map(camp => (
              <div key={camp.id} className="flex items-center gap-2 px-4 py-2 rounded-lg"
                   style={{ background: 'rgba(255,255,255,0.03)', borderLeft: `3px solid ${camp.tip === 'text' ? '#2ed573' : '#ffa502'}` }}>
                <span className="text-rat-text">👤 {camp.persoana_nume || 'Persoana #' + camp.persoana} — {camp.intrebare}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${camp.tip === 'text' ? 'bg-rat-green/20 text-rat-green' : 'bg-rat-amber/20 text-rat-amber'}`}>
                  {camp.tip === 'text' ? 'Text liber' : 'Alegere multiplă'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tokeni */}
      {tokeni.length > 0 && (
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
          <h3 className="text-rat-red font-bold mb-3">🎫 Tokeni ({tokeni.length})</h3>
          <p className="text-rat-text-muted text-sm mb-3">Copiază-i și dă-i la turnători.</p>
          <div className="flex flex-wrap gap-2">
            {tokeni.map(t => (
              <span key={t.id} className="px-3 py-1.5 rounded-lg font-mono text-sm font-bold border"
                    style={{
                      color: t.folosit ? '#666' : '#ffa502',
                      background: t.folosit ? 'rgba(100,100,100,0.1)' : 'rgba(255,165,2,0.1)',
                      borderColor: t.folosit ? '#444' : '#ffa502',
                      textDecoration: t.folosit ? 'line-through' : 'none',
                    }}>
                {t.cod}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Turnătorii */}
      <h3 className="text-2xl font-bold text-rat-red mb-4">📝 Turnătorii Primite ({turnatorii.length})</h3>

      {turnatorii.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <p className="text-rat-text-muted">Nicio turnătorie încă.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {turnatorii.map(t => (
            <div key={t.id} className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.04)', borderLeft: '4px solid #e94560' }}>
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-rat-amber font-mono font-bold">🐀 Turnătorie anonimă</span>
                <span className="text-rat-text-muted">{new Date(t.creat_la).toLocaleString('ro-RO')}</span>
              </div>

              {t.sentiment_label && (
                <div className="mb-3">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-xs text-rat-text-dim">Sentiment general:</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      t.sentiment_label === 'pozitiv' ? 'bg-rat-green/20 text-rat-green' :
                      t.sentiment_label === 'negativ' ? 'bg-rat-red/20 text-rat-red' :
                      'bg-rat-amber/20 text-rat-amber'
                    }`}>
                      {t.sentiment_label === 'pozitiv' ? '😊 Pozitiv' :
                       t.sentiment_label === 'negativ' ? '😠 Negativ' : '😐 Neutru'}
                    </span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                    <div style={{width: `${t.sentiment_poz || 0}%`, background: '#2ed573'}} title={`Pozitiv ${t.sentiment_poz}%`} />
                    <div style={{width: `${t.sentiment_neu || 0}%`, background: '#ffa502'}} title={`Neutru ${t.sentiment_neu}%`} />
                    <div style={{width: `${t.sentiment_neg || 0}%`, background: '#e94560'}} title={`Negativ ${t.sentiment_neg}%`} />
                  </div>
                  <div className="flex gap-3 text-xs mt-1">
                    <span className="text-rat-green">😊 {t.sentiment_poz}%</span>
                    <span className="text-rat-amber">😐 {t.sentiment_neu}%</span>
                    <span className="text-rat-red">😠 {t.sentiment_neg}%</span>
                  </div>
                </div>
              )}

              {t.raspunsuri?.map(r => {
                const camp = campMap[r.camp];
                const campLabel = camp ? `👤 ${camp.persoana_nume || 'Persoana #' + camp.persoana} — ${camp.intrebare}` : `👤 Camp #${r.camp}`;
                const sent = r.sentiment_label;
                return (
                  <div key={r.id} className="py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-rat-amber text-sm">{campLabel}</span>
                      {sent && (
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                          sent === 'pozitiv' ? 'bg-rat-green/20 text-rat-green' :
                          sent === 'negativ' ? 'bg-rat-red/20 text-rat-red' :
                          'bg-rat-amber/20 text-rat-amber'
                        }`}>
                          {sent === 'pozitiv' ? '😊 Pozitiv' : sent === 'negativ' ? '😠 Negativ' : '😐 Neutru'}
                        </span>
                      )}
                    </div>
                    <div className="text-rat-text-dim mt-0.5">{r.valoare || '(gol)'}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
