import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreateForm() {
    const [titlu, setTitlu] = useState('');
    const [mesaj, setMesaj] = useState('');
    const [campuri, setCampuri] = useState([]);
    const [persoane, setPersone] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPersone = async () => {
            try {
                const response = await api.get('persoane/');
                setPersone(response.data);
            } catch (error) {
                console.error('Nu am putut aduce persoanele:', error);
                setError('Nu am putut aduce lista de persoane.');
            }
        };
        fetchPersone();
    }, []);

    const adaugaCamp = () => {
        setCampuri([...campuri, { 
            tip: 'text', 
            intrebare: '', 
            optiuni: '', 
            persoana: persoane.length > 0 ? persoane[0].id : 1 
        }]);
    };

    const handleCampChange = (index, field, value) => {
        const noiCampuri = [...campuri];
        noiCampuri[index][field] = value;
        setCampuri(noiCampuri);
    };

    const stergeCamp = (index) => {
        setCampuri(campuri.filter((_, i) => i !== index));
    };

    const salveazaFormular = async (e) => {
        e.preventDefault();
        
        if (!titlu.trim()) {
            setError('Titlul e obligatoriu! Nu mă juca în glume. 📝');
            return;
        }
        if (!mesaj.trim()) {
            setError('Mesajul e obligatoriu! Trebuie să fii sociabil. 💬');
            return;
        }
        if (campuri.length === 0) {
            setError('Adaugă cel puțin un câmp! Nu-mi da formularele goale. 🚫');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('formulare/', { 
                titlu: titlu.trim(), 
                mesaj: mesaj.trim()
            });
            const formularId = response.data.id;

            await Promise.all(campuri.map((camp, index) =>
                api.post('campuri/', { 
                    titlu: camp.intrebare,
                    tip: camp.tip,
                    optiuni: camp.optiuni || null,
                    formular: formularId, 
                    ordine: index,
                    persoana: camp.persoana || null
                })
            ));

            navigate('/');
        } catch (error) {
            if (error.response?.status === 400) {
                setError('Date invalide. Verifică ce ai scris. 🤔');
            } else if (error.response?.status === 500) {
                setError('Serverul s-a străduit dar a căzut. Șobolanii au ros cablul de net. 🐭');
            } else {
                setError('A crăpat ceva. Probabil conexiunea la internet. 🌐');
            }
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow border border-red-200">
            <h2 className="text-3xl font-bold text-red-600 mb-6">Fă o Turnătorie Nouă 📝</h2>
            
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded font-bold mb-6 border border-red-300">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={salveazaFormular} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Titlu Formular *</label>
                    <input 
                        type="text" 
                        placeholder="De ex: 'Cine-i mai mare șebo?' 🐀" 
                        className="w-full border-2 border-gray-300 p-3 rounded focus:border-red-500 focus:outline-none" 
                        value={titlu} 
                        onChange={(e) => setTitlu(e.target.value)} 
                        required 
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-700">Mesaj de Întâmpinare (hazliu!) *</label>
                    <textarea 
                        placeholder="Bagă ceva hazliu aici. De ex: 'Hei, vino să pârăști cu noi!' 😏" 
                        className="w-full border-2 border-gray-300 p-3 rounded h-24 focus:border-red-500 focus:outline-none" 
                        value={mesaj} 
                        onChange={(e) => setMesaj(e.target.value)} 
                        required 
                        disabled={loading}
                    />
                </div>

                <div className="border-t pt-4 mt-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Câmpuri (Aici se adună bârfa) *</h3>
                    
                    {campuri.length === 0 ? (
                        <p className="text-gray-500 italic mb-4">Niciun câmp adăugat. Apasă butonul de mai jos.</p>
                    ) : (
                        campuri.map((camp, index) => (
                            <div key={index} className="bg-gray-50 p-4 mb-4 rounded border border-gray-200 shadow-sm relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className="block text-xs font-bold mb-1 text-gray-700">Tip Câmp</label>
                                        <select 
                                            className="border-2 border-gray-300 p-2 w-full rounded font-semibold focus:border-red-500 focus:outline-none" 
                                            value={camp.tip} 
                                            onChange={(e) => handleCampChange(index, 'tip', e.target.value)}
                                            disabled={loading}
                                        >
                                            <option value="text">Text Liber</option>
                                            <option value="optiuni">Alegere Multiplă</option>
                                            <option value="numar">Număr</option>
                                        </select>
                                    </div>

                                    {persoane.length > 0 && (
                                        <div>
                                            <label className="block text-xs font-bold mb-1 text-gray-700">Destinație Persoană</label>
                                            <select 
                                                className="border-2 border-gray-300 p-2 w-full rounded focus:border-red-500 focus:outline-none" 
                                                value={camp.persoana || ''} 
                                                onChange={(e) => handleCampChange(index, 'persoana', e.target.value ? parseInt(e.target.value) : '')}
                                                disabled={loading}
                                            >
                                                <option value="">-- Toată lumea --</option>
                                                {persoane.map(p => (
                                                    <option key={p.id} value={p.id}>{p.nume}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <input 
                                    type="text" 
                                    placeholder="Întrebarea ta indiscretă..." 
                                    className="border-2 border-gray-300 p-3 w-full mb-3 rounded focus:border-red-500 focus:outline-none" 
                                    value={camp.intrebare} 
                                    onChange={(e) => handleCampChange(index, 'intrebare', e.target.value)} 
                                    required 
                                    disabled={loading}
                                />

                                {camp.tip === 'optiuni' && (
                                    <input 
                                        type="text" 
                                        placeholder="Opțiuni separate prin virgulă (ex: Da, Nu, Niciodată)" 
                                        className="border-2 border-gray-300 p-3 w-full rounded focus:border-red-500 focus:outline-none" 
                                        value={camp.optiuni} 
                                        onChange={(e) => handleCampChange(index, 'optiuni', e.target.value)} 
                                        required 
                                        disabled={loading}
                                    />
                                )}

                                <button 
                                    type="button" 
                                    onClick={() => stergeCamp(index)}
                                    className="absolute top-2 right-2 bg-red-400 text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-500"
                                    disabled={loading}
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}

                    <button 
                        type="button" 
                        onClick={adaugaCamp} 
                        className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded hover:bg-blue-200 border border-blue-300 disabled:opacity-50"
                        disabled={loading}
                    >
                        + Adaugă Întrebare
                    </button>
                </div>

                <button 
                    type="submit" 
                    className={`w-full ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-4 rounded-lg mt-8 text-lg transition disabled:opacity-50`}
                    disabled={loading}
                >
                    {loading ? 'Se salvează...' : 'Salvează și Așteaptă Bârfele 🚀'}
                </button>
            </form>
        </div>
    );
}