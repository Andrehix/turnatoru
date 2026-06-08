import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreateForm() {
  const navigate = useNavigate();
  const [titlu, setTitlu] = useState('');
  const [mesaj, setMesaj] = useState('');
  const [campuri, setCampuri] = useState([]);
  const [persoane, setPersoane] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/persoane/').then(({ data }) => setPersoane(data)).catch(() => setError('Nu s-au putut încărca persoanele.')).finally(() => setLoading(false));
  }, []);

  const adaugaCamp = () => setCampuri(prev => [...prev, { id: Date.now(), persoana_id: '', tip: 'text', intrebare: '', optiuni: '' }]);
  const update = (id, f, v) => setCampuri(prev => prev.map(c => c.id === id ? { ...c, [f]: v } : c));
  const stergeCamp = (id) => setCampuri(prev => prev.filter(c => c.id !== id));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!titlu.trim()) return setError('Titlu gol? Serios? Până și șobolanii noștri au standarde.');
    if (!mesaj.trim()) return setError('Pune un mesaj hazliu pentru turnători.');
    if (campuri.length === 0) return setError('Adaugă măcar o întrebare. Un formular gol e ca o pizza fără blat.');
    for (const c of campuri) { if (!c.persoana_id) return setError('Alege o persoană pentru fiecare întrebare.'); if (!c.intrebare.trim()) return setError('Completează întrebarea.'); if (c.tip === 'optiuni' && !c.optiuni.trim()) return setError('Adaugă opțiuni pentru câmpurile de tip alegere.'); }
    try {
      setSubmitting(true);
      const { data: form } = await api.post('/formulare/', { titlu, mesaj });
      for (const c of campuri) { await api.post('/campuri/', { formular: form.id, persoana: parseInt(c.persoana_id), tip: c.tip, intrebare: c.intrebare, optiuni: c.tip === 'optiuni' ? c.optiuni : '', ordine: 0 }); }
      navigate('/dashboard');
    } catch (err) { setError('Eroare la salvare.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="text-center py-20"><div className="text-5xl animate-spin">🐀</div><p className="text-rat-text-muted mt-4">Se încarcă...</p></div>;

  return (
    <div className="max-w-3xl mx-auto animate-slideUp">
      <h1 className="text-4xl font-black text-rat-red text-center mb-2">🛠️ Creează Formular Nou</h1>
      <p className="text-rat-text-dim text-center mb-10 text-lg">Construiește formularul perfect pentru a afla adevăruri pe care nu le-ai cerut.</p>

      {persoane.length === 0 && !loading && (
        <div className="text-center rounded-2xl p-10 mb-8" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
          <h3 className="text-xl font-bold text-rat-red mb-3">⚠️ Nu ai nicio persoană adăugată!</h3>
          <p className="text-rat-text-dim mb-5">Mai întâi adaugă persoane în lista ta, apoi revino aici să creezi formularul.</p>
          <a href="/persoane" className="inline-block bg-rat-amber hover:bg-rat-amber-hover text-rat-bg px-8 py-3 rounded-xl font-black text-lg transition-all">Adaugă Persoane 👥</a>
        </div>
      )}

      {error && <div className="text-rat-red text-sm font-bold bg-rat-red/10 border border-rat-red/30 rounded-xl px-4 py-3 mb-6">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
          <FormField label="Titlu formular">
            <DarkInput value={titlu} onChange={setTitlu} placeholder="Ex: Feedback despre profesorii de la facultate" />
          </FormField>
          <FormField label="Mesaj hazliu pentru turnători">
            <DarkTextarea value={mesaj} onChange={setMesaj} placeholder="Ex: Spune tot ce ai pe suflet, nimeni nu te judecă (sau ba)" rows={2} />
          </FormField>
        </div>

        <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(233,69,96,0.2)' }}>
          <h3 className="text-rat-red font-bold text-lg">📝 Întrebări / Câmpuri</h3>
          <p className="text-rat-text-muted text-sm">Adaugă întrebări și asociază-le cu persoane. Alege între text liber și opțiuni multiple.</p>

          {campuri.map((camp, idx) => (
            <div key={camp.id} className="rounded-xl p-5 space-y-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(233,69,96,0.15)' }}>
              <div className="flex justify-between items-center">
                <span className="text-rat-amber font-bold">Întrebare #{idx + 1}</span>
                <button type="button" onClick={() => stergeCamp(camp.id)} className="border border-rat-red text-rat-red hover:bg-rat-red hover:text-white px-3 py-1 rounded-lg text-sm font-bold transition-colors">🗑️ Șterge</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <FormField label="👤 Persoana">
                  <select value={camp.persoana_id} onChange={e => update(camp.id, 'persoana_id', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg focus:outline-none focus:border-rat-red transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(233,69,96,0.3)', color: '#fff' }}>
                    <option value="">-- Alege persoana --</option>
                    {persoane.map(p => <option key={p.id} value={p.id} style={{ background: '#1a1a2e', color: '#fff' }}>{p.nume}</option>)}
                  </select>
                </FormField>
                <FormField label="Tip răspuns">
                  <select value={camp.tip} onChange={e => update(camp.id, 'tip', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg focus:outline-none focus:border-rat-red transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(233,69,96,0.3)', color: '#fff' }}>
                    <option value="text" style={{ background: '#1a1a2e', color: '#fff' }}>Text liber</option>
                    <option value="optiuni" style={{ background: '#1a1a2e', color: '#fff' }}>Alegere multiplă</option>
                  </select>
                </FormField>
              </div>
              <FormField label="Întrebare">
                <DarkInput value={camp.intrebare} onChange={v => update(camp.id, 'intrebare', v)} placeholder="Ce părere ai despre...?" />
              </FormField>
              {camp.tip === 'optiuni' && (
                <FormField label="Opțiuni (separate prin virgulă)">
                  <DarkInput value={camp.optiuni} onChange={v => update(camp.id, 'optiuni', v)} placeholder="Excelent, Bun, Mediu, Slab" />
                </FormField>
              )}
            </div>
          ))}

          <button type="button" onClick={adaugaCamp}
            className="w-full bg-rat-amber hover:bg-rat-amber-hover text-rat-bg py-3 rounded-xl font-black transition-all">
            ➕ Adaugă Întrebare / Câmp
          </button>
        </div>

        <button type="submit" disabled={submitting}
          className="w-full bg-rat-green hover:bg-rat-green-hover disabled:opacity-50 text-rat-bg py-4 rounded-xl font-black text-lg shadow hover:shadow-[0_5px_15px_rgba(46,213,115,0.4)] transition-all">
          {submitting ? '🐀 Se creează...' : 'Creează Formularul 🐀'}
        </button>
      </form>
    </div>
  );
}

function FormField({ label, children }) { return <div><label className="block text-rat-red font-bold mb-1 text-sm">{label}</label>{children}</div>; }
function DarkInput({ value, onChange, placeholder }) { return <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl focus:outline-none focus:border-rat-red focus:shadow-[0_0_10px_rgba(233,69,96,0.2)] transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(233,69,96,0.3)', color: '#fff' }} />; }
function DarkTextarea({ value, onChange, placeholder, rows }) { return <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className="w-full px-4 py-3 rounded-xl resize-none focus:outline-none focus:border-rat-red transition-all" style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(233,69,96,0.3)', color: '#fff' }} />; }
