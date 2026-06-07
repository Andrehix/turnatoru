import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function TokenFormular() {
    const { token } = useParams();
    const [formular, setFormular] = useState(null);
    const [campuri, setCampuri] = useState([]);
    const [raspunsuri, setRaspunsuri] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [succes, setSucces] = useState(false);
    const [tokenId, setTokenId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFormular = async () => {
            try {
                setLoading(true);
                
                const tokenResponse = await api.get(`tokeni/?cod=${token.toUpperCase()}`);
                if (!tokenResponse.data || tokenResponse.data.length === 0) {
                    setError('❌ Tokenul nu există sau a expirat.');
                    setLoading(false);
                    return;
                }

                const tokenData = tokenResponse.data[0];
                if (tokenData.folosit) {
                    setError('😤 Token deja utilizat! Ai fost copt. 🔥');
                    setLoading(false);
                    return;
                }

                setTokenId(tokenData.id);

                const formularResponse = await api.get(`formulare/${tokenData.formular}/`);
                setFormular(formularResponse.data);

                const campuriResponse = await api.get(`campuri/?formular=${tokenData.formular}`);
                setCampuri(campuriResponse.data);

                const initialRaspunsuri = {};
                campuriResponse.data.forEach(camp => {
                    initialRaspunsuri[camp.id] = camp.tip === 'optiuni' ? '' : '';
                });
                setRaspunsuri(initialRaspunsuri);

                setError('');
            } catch (error) {
                if (error.response?.status === 404) {
                    setError('❌ Tokenul nu există.');
                } else if (error.response?.status === 500) {
                    setError('Serverul a căzut. Șobolanii au ros cablul de net.');
                } else {
                    setError('Nu am putut încărca formularul. Verifică conexiunea.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchFormular();
        }
    }, [token]);

    const handleRaspunsChange = (campId, value) => {
        setRaspunsuri({
            ...raspunsuri,
            [campId]: value
        });
    };

    const trimiteRaspunsuri = async (e) => {
        e.preventDefault();

        const raspunsuriGoale = campuri.filter(
            camp => !raspunsuri[camp.id] || raspunsuri[camp.id].toString().trim() === ''
        );

        if (raspunsuriGoale.length > 0) {
            setError('⚠️ Completeaza toate câmpurile, șobolane! Nicio scapare! 🚫');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await Promise.all(
                campuri.map(camp =>
                    api.post('raspunsuri/', {
                        camp: camp.id,
                        valoare: raspunsuri[camp.id].toString(),
                        token: token.toUpperCase()
                    })
                )
            );

            await api.patch(`tokeni/${tokenId}/`, { folosit: true });

            setSucces(true);
            setTimeout(() => {
                navigate('/token');
            }, 3000);
        } catch (error) {
            if (error.response?.status === 400) {
                setError('⚠️ Date invalide. Verifică ce ai scris.');
            } else if (error.response?.status === 500) {
                setError('Serverul s-a străduit dar a căzut. Probabil prea multă bârfă.');
            } else {
                setError('Nu am putut trimite răspunsurile. Verifică conexiunea.');
            }
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-lg font-bold text-gray-600">Se încarcă formularul... 🐁</p>
            </div>
        );
    }

    if (!formular) {
        return (
            <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow-xl border border-gray-200">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">❌ Eroare</h2>
                    <p className="text-gray-700 mb-6">{error || 'Nu am putut încărca formularul.'}</p>
                    <button
                        onClick={() => navigate('/token')}
                        className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700"
                    >
                        Încearcă Alt Token
                    </button>
                </div>
            </div>
        );
    }

    if (succes) {
        return (
            <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow-xl border border-green-200">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-green-600">Mulțumim! ✅</h2>
                    <p className="text-lg text-gray-700">
                        Bârfele tale au fost primite cu succes! 🎉
                    </p>
                    <p className="text-sm text-gray-500">
                        Te redirecționez înapoi...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow border border-red-200 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-red-600 mb-2">{formular.titlu} 🕵️‍♂️</h2>
            <p className="text-gray-600 mb-6">{formular.mesaj}</p>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded font-bold mb-6 border border-red-300">
                    {error}
                </div>
            )}

            <form onSubmit={trimiteRaspunsuri} className="space-y-6">
                {campuri.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">Niciun câmp în formular. Straniu... 🤔</p>
                ) : (
                    campuri.map((camp) => (
                        <div key={camp.id} className="border-b pb-6 last:border-b-0">
                            <label className="block text-lg font-bold text-gray-800 mb-3">
                                {camp.titlu}
                            </label>

                            {camp.tip === 'text' && (
                                <textarea
                                    className="w-full border-2 border-gray-300 p-3 rounded focus:border-red-500 focus:outline-none h-24"
                                    placeholder="Spune-mi tot... 🗣️"
                                    value={raspunsuri[camp.id] || ''}
                                    onChange={(e) => handleRaspunsChange(camp.id, e.target.value)}
                                    disabled={submitting}
                                />
                            )}

                            {camp.tip === 'numar' && (
                                <input
                                    type="number"
                                    className="w-full border-2 border-gray-300 p-3 rounded focus:border-red-500 focus:outline-none"
                                    placeholder="0"
                                    value={raspunsuri[camp.id] || ''}
                                    onChange={(e) => handleRaspunsChange(camp.id, e.target.value)}
                                    disabled={submitting}
                                />
                            )}

                            {camp.tip === 'optiuni' && camp.optiuni && (
                                <select
                                    className="w-full border-2 border-gray-300 p-3 rounded focus:border-red-500 focus:outline-none font-semibold"
                                    value={raspunsuri[camp.id] || ''}
                                    onChange={(e) => handleRaspunsChange(camp.id, e.target.value)}
                                    disabled={submitting}
                                >
                                    <option value="">-- Alege o opțiune --</option>
                                    {camp.optiuni.split(',').map((opt, idx) => {
                                        const optTrim = opt.trim();
                                        return (
                                            <option key={idx} value={optTrim}>
                                                {optTrim}
                                            </option>
                                        );
                                    })}
                                </select>
                            )}
                        </div>
                    ))
                )}

                <button
                    type="submit"
                    className={`w-full ${submitting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} text-white font-bold py-4 rounded-lg mt-8 text-lg transition disabled:opacity-50`}
                    disabled={submitting || campuri.length === 0}
                >
                    {submitting ? 'Se trimite...' : 'Trimite Bârfele 🚀'}
                </button>
            </form>
        </div>
    );
}
