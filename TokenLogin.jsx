import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function TokenLogin() {
    const [token, setToken] = useState('');
    const [eroare, setEroare] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = eroare ? setTimeout(() => setEroare(''), 3000) : null;
        return () => clearTimeout(timer);
    }, [eroare]);

    const verificaToken = async (e) => {
        e.preventDefault();
        setEroare('');
        setLoading(true);

        try {
            const tokenCod = token.toUpperCase().trim();
            
            const response = await api.get(`tokeni/?cod=${tokenCod}`);
            const tokenGasit = response.data[0];

            if (!tokenGasit) {
                setEroare('❌ Tokenul ăsta nu există. L-ai inventat? Sau ai scris cu piciorul?');
                setLoading(false);
                return;
            }

            if (tokenGasit.folosit) {
                setEroare('😤 Token deja utilizat! Altcineva te-a luat pe dinainte și a pârât deja.');
                setLoading(false);
                return;
            }

            navigate(`/token/${tokenCod}`);
        } catch (error) {
            if (error.response?.status === 404) {
                setEroare('❌ Tokenul ăsta nu există. L-ai inventat?');
            } else if (error.response?.status === 500) {
                setEroare('Serverul a căzut. Au rămas datele în greutatea secretelor.');
            } else {
                setEroare('Eroare de conexiune. Verifică internetul.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            <form onSubmit={verificaToken} className="space-y-5">
                <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Intră la Turnat 🕵️‍♂️</h2>
                
                {eroare && (
                    <div className="bg-red-100 text-red-700 p-4 rounded font-bold text-center border border-red-300 animate-pulse">
                        {eroare}
                    </div>
                )}
                
                <input 
                    type="text" 
                    placeholder="Bagă codul secret aici..." 
                    className="w-full border-2 border-gray-300 p-4 rounded text-center font-mono text-2xl uppercase tracking-widest focus:border-red-500 focus:outline-none" 
                    value={token} 
                    onChange={(e) => setToken(e.target.value.toUpperCase())} 
                    required 
                    disabled={loading}
                />
                
                <button 
                    type="submit" 
                    className={`w-full ${loading ? 'bg-gray-400' : 'bg-gray-900 hover:bg-gray-800'} text-white font-bold py-4 rounded-lg text-lg shadow-lg transition`}
                    disabled={loading}
                >
                    {loading ? 'Se verifică...' : 'Validează Tokenul 🔑'}
                </button>
            </form>
        </div>
    );
}