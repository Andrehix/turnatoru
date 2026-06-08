import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [formulare, setFormulare] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFormulare = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/formulare/');
      setFormulare(data);
      setError('');
    } catch (e) {
      setError('Eroare la conectare. Ești logat? Serverul Django rulează?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFormulare(); }, []);

  return (
    <div className="animate-slideUp">
      <h1 className="text-4xl font-black text-rat-red text-center mb-2">👀 Dashboard-ul Tău</h1>
      <p className="text-rat-text-dim text-center mb-10 text-lg">
        Aici vezi tot ce au turnat oamenii despre tine. Pregătește-te emoțional.
      </p>

      <div className="flex gap-4 justify-center mb-10 flex-wrap">
        <Link to="/create" className="bg-rat-green hover:bg-rat-green-hover text-rat-bg px-8 py-4 rounded-xl font-black text-lg shadow hover:shadow-[0_5px_15px_rgba(46,213,115,0.4)] hover:-translate-y-0.5 transition-all">
          📝 Creează Formular Nou
        </Link>
        <Link to="/persoane" className="bg-rat-amber hover:bg-rat-amber-hover text-rat-bg px-8 py-4 rounded-xl font-black text-lg shadow hover:shadow-[0_5px_15px_rgba(255,165,2,0.4)] hover:-translate-y-0.5 transition-all">
          👥 Gestionează Persoane
        </Link>
      </div>

      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="rounded-2xl p-6 animate-pulse-soft h-48" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }} />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)', borderRadius: '16px' }}>
          <h3 className="text-xl font-bold text-rat-red mb-2">⚠️ {error}</h3>
        </div>
      )}

      {!loading && !error && formulare.length === 0 && (
        <div className="text-center py-20" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)', borderRadius: '16px' }}>
          <h3 className="text-2xl font-bold text-rat-text-dim mb-3">🦗 Aici e gol ca într-un birou luni la 8 dimineața</h3>
          <p className="text-rat-text-muted">Creează primul tău formular și începe să primești adevăruri pe care nu le-ai cerut!</p>
        </div>
      )}

      {!loading && !error && formulare.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formulare.map(f => (
            <FormCard key={f.id} formular={f} onDelete={fetchFormulare} />
          ))}
        </div>
      )}
    </div>
  );
}

function FormCard({ formular, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [numTokeni, setNumTokeni] = useState(5);

  const handleDelete = async () => {
    if (!window.confirm(`Ștergi formularul "${formular.titlu}"? Asta șterge și toate turnătoriile.`)) return;
    try { setDeleting(true); await api.delete(`/formulare/${formular.id}/`); onDelete(); }
    catch { alert('Eroare la ștergere.'); setDeleting(false); }
  };

  const handleGenerateTokeni = async (e) => {
    if (e) e.preventDefault();
    const num = Math.min(Math.max(numTokeni, 1), 50);
    try {
      setGenerating(true);
      for (let i = 0; i < num; i++) {
        await api.post('/tokeni/', { formular: formular.id });
      }
      setShowTokenInput(false);
      alert(`${num} tokeni generați! 🎫`);
    } catch {
      alert('Eroare la generare.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-2xl p-6 card-hover flex flex-col gap-3 transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-rat-red truncate">{formular.titlu}</h3>
          <p className="text-xs text-rat-text-muted mt-1">#{formular.id} · {new Date(formular.creat_la).toLocaleDateString('ro-RO')}</p>
        </div>
        <span className="text-2xl">🐀</span>
      </div>

      <p className="text-sm text-rat-text-dim line-clamp-2">{formular.mesaj}</p>

      {showTokenInput && (
        <form onSubmit={handleGenerateTokeni} className="flex items-center gap-2 bg-rat-card rounded-lg p-2 animate-slideUp">
          <input type="number" min="1" max="50" value={numTokeni}
            onChange={e => setNumTokeni(parseInt(e.target.value) || 5)}
            className="w-16 px-2 py-1.5 text-center text-sm rounded-lg font-bold"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #ffa502', color: '#fff' }} />
          <button type="submit" disabled={generating}
            className="text-xs font-bold bg-rat-green hover:bg-rat-green-hover text-rat-bg px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
            {generating ? '...' : 'Generează 🎫'}
          </button>
          <button type="button" onClick={() => setShowTokenInput(false)}
            className="text-xs text-rat-text-muted hover:text-rat-red">✕</button>
        </form>
      )}

      <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <Link to={`/formular/${formular.id}`}
           className="text-xs font-bold bg-rat-red hover:bg-rat-red-hover text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap inline-block">
          Vezi Turnătorii 🐀
        </Link>
        <button onClick={() => setShowTokenInput(!showTokenInput)}
           className="text-xs font-bold bg-rat-amber hover:bg-rat-amber-hover text-rat-bg px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
          Generează Tokeni 🎫
        </button>
        <a href={`/dashboard/formular/${formular.id}/export-pdf/`} target="_blank" rel="noopener noreferrer"
           className="text-xs font-bold border border-rat-red text-rat-red hover:bg-rat-red hover:text-white px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
          Exportă PDF 📄
        </a>
        <button onClick={handleDelete} disabled={deleting}
          className="text-xs font-bold text-rat-text-muted hover:text-rat-red border border-transparent hover:border-rat-red px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50">
          {deleting ? '🗑️ ...' : '🗑️ Șterge'}
        </button>
      </div>
    </div>
  );
}
