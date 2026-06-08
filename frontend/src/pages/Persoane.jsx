import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Persoane() {
  const [persoane, setPersoane] = useState([]);
  const [numeNou, setNumeNou] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  const fetchPersoane = async () => {
    try { setLoading(true); const { data } = await api.get('/persoane/'); setPersoane(data); setError(''); }
    catch { setError('Eroare la conectare. Ești logat?'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchPersoane(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const nume = numeNou.trim();
    if (!nume) return setError('Pune un nume, nu lăsa câmpul gol ca sufletul tău.');
    if (persoane.some(p => p.nume.toLowerCase() === nume.toLowerCase())) return setError(`"${nume}" există deja în lista ta. Nu duplica oamenii.`);
    try { setAdding(true); setError(''); await api.post('/persoane/', { nume }); setNumeNou(''); await fetchPersoane(); }
    catch (err) { setError('Eroare la adăugare: ' + (err.response?.data?.detail || JSON.stringify(err.response?.data))); }
    finally { setAdding(false); }
  };

  const handleDelete = async (id, nume) => {
    if (!window.confirm(`Ștergi "${nume}"?`)) return;
    try { await api.delete(`/persoane/${id}/`); await fetchPersoane(); }
    catch { setError('Eroare la ștergere.'); }
  };

  return (
    <div className="max-w-2xl mx-auto animate-slideUp">
      <h1 className="text-4xl font-black text-rat-red text-center mb-2">👥 Lista Ta de Subiecți</h1>
      <p className="text-rat-text-dim text-center mb-10 text-lg">Adaugă persoanele despre care vrei să primești feedback. Profesori, șefi, colegi... oricine merită "evaluat".</p>

      {error && <div className="text-rat-red text-sm font-bold bg-rat-red/10 border border-rat-red/30 rounded-xl px-4 py-3 mb-4">{error}</div>}

      {/* Add */}
      <form onSubmit={handleAdd} className="flex gap-3 mb-8">
        <input type="text" value={numeNou} onChange={e => setNumeNou(e.target.value)} placeholder="Nume complet (ex: Prof. Ionescu)"
          className="flex-1 px-4 py-3 rounded-xl focus:outline-none focus:border-rat-red transition-all"
          style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(233,69,96,0.3)', color: '#fff' }} />
        <button type="submit" disabled={adding || !numeNou.trim()}
          className="bg-rat-green hover:bg-rat-green-hover disabled:opacity-50 text-rat-bg px-6 py-3 rounded-xl font-bold transition-all">
          {adding ? '...' : 'Adaugă ➕'}
        </button>
      </form>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{ [1,2,3].map(n => <div key={n} className="h-14 rounded-xl animate-pulse-soft" style={{ background: 'rgba(255,255,255,0.05)' }} />) }</div>
      ) : persoane.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
          <h3 className="text-xl font-bold text-rat-text-dim mb-2">🤷 Nicio persoană adăugată</h3>
          <p className="text-rat-text-muted">Adaugă persoane ca să le poți asocia întrebări în formulare.</p>
        </div>
      ) : (
        <div className="rounded-2xl p-5 space-y-2" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
          <h3 className="text-rat-red font-bold mb-3">📋 Persoane Salvate ({persoane.length})</h3>
          {persoane.map(p => (
            <div key={p.id} className="flex items-center justify-between px-5 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(233,69,96,0.1)' }}>
              <span className="text-rat-text text-lg">👤 {p.nume}</span>
              <button onClick={() => handleDelete(p.id, p.nume)}
                className="border border-rat-red text-rat-red hover:bg-rat-red hover:text-white px-3 py-1 rounded-lg font-bold text-sm transition-colors">
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <Link to="/dashboard" className="text-rat-text-muted hover:text-rat-red font-bold text-sm">← Dashboard</Link>
      </div>
    </div>
  );
}
