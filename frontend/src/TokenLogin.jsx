import { useState } from 'react';
import api from '../api';

export default function TokenLogin() {
    const [token, setToken] = useState('');
    const [eroare, setEroare] = useState('');
    const [formular, setFormular] = useState(null);

    const verificaToken = async (e) => {
        e.preventDefault();
        setEroare('');
        try {
            const response = await api.get('tokeniturnator/');
            const tokens = response.data;
            const tokenGasit = tokens.find(t => t.cod === token.toUpperCase());

            if (!tokenGasit) {
                setEroare('❌ Tokenul ăsta nu există. L-ai inventat? Sau ai scris cu piciorul?');
                return;
            }
            if (tokenGasit.folosit) {
                setEroare('😤 Token deja utilizat! Altcineva te-a luat pe dinainte și a pârât deja.');
                return;
            }

            const formularResponse = await api.get(`formulare/${tokenGasit.formular}/`);
            setFormular(formularResponse.data);
        } catch (error) {
            setEroare('Eroare de conexiune. Au căzut serverele sub greutatea secretelor.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-lg shadow-xl border border-gray-200">
            {!formular ? (
                <form onSubmit={verificaToken} className="space-y-5">
                    <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Intră la Turnat 🕵️‍♂️</h2>
                    {eroare && <div className="bg-red-100 text-red-700 p-4 rounded font-bold text-center">{eroare}</div>}
                    <input type="text" placeholder="Bagă codul secret aici..." className="w-full border-2 border-gray-300 p-4 rounded text-center font-mono text-2xl uppercase tracking-widest focus:border-red-500 focus:outline-none" value={token} onChange={(e) => setToken(e.target.value)} required />
                    <button type="submit" className="w-full bg-gray-900 text-white font-bold py-4 rounded-lg hover:bg-gray-800 text-lg shadow-lg">Validează Tokenul 🔑</button>
                </form>
            ) : (
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-green-600">Token Valid! ✅</h2>
                    <p className="text-lg">Ești pregătit să pârăști la formularul:<br /><strong className="text-xl mt-2 block">{formular.titlu}</strong></p>
                    <button className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 mt-4 text-lg">Începe Turnătoria 🗣️</button>
                </div>
            )}
        </div>
    );
}
