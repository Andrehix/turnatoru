import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
    const [formulare, setFormulare] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFormulare = async () => {
            try {
                setLoading(true);
                const response = await api.get('formulare/');
                setFormulare(response.data);
                setError('');
            } catch (error) {
                if (error.response?.status === 404) {
                    setError('Nu am găsit niciun formular.');
                } else if (error.response?.status === 500) {
                    setError('Serverul a căzut. Probabil șobolanii au ros cablul de net.');
                } else {
                    setError('Nu am putut aduce formularele. Verifică conexiunea internet.');
                }
                setFormulare([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFormulare();
    }, []);

    const stergeFormular = async (id) => {
        if (!window.confirm('Sigur vrei să ștergi asta? Nu mai ai cale de întoarcere! 💀')) {
            return;
        }
        try {
            await api.delete(`formulare/${id}/`);
            setFormulare(formulare.filter(f => f.id !== id));
            setError('');
        } catch (error) {
            setError('A crăpat ceva la ștergere. Probabil serverul s-a simțit ofensat.');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Panoul Creatorului Suprem 👑</h2>
                <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 shadow">
                    + Formular Nou
                </Link>
            </div>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded font-bold mb-6 border border-red-300">
                    ⚠️ {error}
                </div>
            )}

            {loading ? (
                <div className="text-center text-gray-600 py-12">
                    <p className="text-lg font-bold">Se încarcă formularele... 🐁</p>
                </div>
            ) : formulare.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-lg border border-gray-200 text-center">
                    <p className="text-lg text-gray-600 mb-4">Nu ai niciun formular inca. Creează-ți pe ăla de cotă! 📝</p>
                    <Link to="/create" className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700 inline-block">
                        Fă Formular Nou
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formulare.map((f) => (
                        <div key={f.id} className="bg-white p-5 rounded-lg shadow border border-gray-200 hover:shadow-md transition">
                            <h3 className="text-xl font-bold text-red-600 mb-2">{f.titlu}</h3>
                            <p className="text-gray-600 mb-4">{f.mesaj}</p>
                            <span className="text-sm bg-gray-100 px-2 py-1 rounded border">ID: {f.id}</span>
                            
                            <div className="mt-4 flex gap-2 flex-wrap">
                                <a
                                    href={`/dashboard/formular/${f.id}/export-pdf/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-500 text-white px-3 py-1 rounded font-bold hover:bg-green-600 text-sm"
                                >
                                    📥 Export PDF
                                </a>
                                <button
                                    onClick={() => stergeFormular(f.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded font-bold hover:bg-red-600 text-sm"
                                >
                                    🗑️ Șterge
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}