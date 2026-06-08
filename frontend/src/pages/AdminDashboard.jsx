import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function AdminDashboard() {
  const [formulare, setFormulare] = useState([]);
  const [tokeniTotal, setTokeniTotal] = useState(0);
  const [turnatoriiTotal, setTurnatoriiTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [fRes, tRes, rRes] = await Promise.all([api.get('/formulare/'), api.get('/tokeni/'), api.get('/turnatorii/')]);
        setFormulare(fRes.data);
        setTokeniTotal(tRes.data.length);
        setTurnatoriiTotal(rRes.data.length);
      } catch { setError('Eroare la conectare sau nu ești admin.'); }
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="animate-slideUp">
      <h1 className="text-4xl font-black text-rat-red text-center mb-2">🕵️‍♂️ Panoul Administratorului</h1>
      <p className="text-rat-text-dim text-center mb-10 text-lg">Aici vezi totul. Ești Big Brother, dar mai simpatic și cu emoji-uri.</p>

      {error && <div className="text-rat-amber font-bold bg-rat-amber/10 border border-rat-amber/30 rounded-xl p-4 text-center mb-6">⚠️ {error}</div>}

      {!loading && !error && (
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          <StatCard emoji="📝" value={formulare.length} label="Formulare Totale" color="#e94560" />
          <StatCard emoji="🎫" value={tokeniTotal} label="Tokeni Activi" color="#ffa502" />
          <StatCard emoji="🗣️" value={turnatoriiTotal} label="Turnătorii Totale" color="#2ed573" />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{ [1,2,3].map(n => <div key={n} className="h-20 rounded-xl animate-pulse-soft" style={{ background: 'rgba(255,255,255,0.05)' }} />) }</div>
      ) : (
        <div className="rounded-2xl p-6 space-y-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
          <h3 className="text-rat-red font-bold mb-2">📋 Toate Formularele</h3>
          {formulare.map(f => (
            <div key={f.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(233,69,96,0.1)' }}>
              <div className="min-w-0">
                <span className="font-bold text-rat-red">{f.titlu}</span>
                <span className="text-rat-text-muted text-xs ml-2">#{f.id} · {new Date(f.creat_la).toLocaleDateString('ro-RO')}</span>
              </div>
              <div className="flex gap-2">
                <Link to={`/formular/${f.id}`}
                  className="text-xs font-bold bg-rat-red hover:bg-rat-red-hover text-white px-3 py-1.5 rounded-lg whitespace-nowrap inline-block">📋 Vezi</Link>
                <a href={`/dashboard/formular/${f.id}/export-pdf/`} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-bold border border-rat-red text-rat-red hover:bg-rat-red hover:text-white px-3 py-1.5 rounded-lg whitespace-nowrap">📄 PDF</a>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <Link to="/dashboard" className="text-rat-text-muted hover:text-rat-red font-bold text-sm">← Dashboard personal</Link>
      </div>
    </div>
  );
}

function StatCard({ emoji, value, label, color }) {
  return (
    <div className="text-center rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="text-4xl font-black" style={{ color }}>{value}</div>
      <div className="text-rat-text-muted text-sm mt-1">{label}</div>
    </div>
  );
}
