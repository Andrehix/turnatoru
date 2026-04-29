import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreateForm() {
    const [titlu, setTitlu] = useState('');
    const [mesaj, setMesaj] = useState('');
    const [campuri, setCampuri] = useState([]);
    const navigate = useNavigate();

    const adaugaCamp = () => {
        setCampuri([...campuri, { tip: 'text', intrebare: '', optiuni: '', persoana: 1 }]);
    };

    const handleCampChange = (index, field, value) => {
        const noiCampuri = [...campuri];
        noiCampuri[index][field] = value;
        setCampuri(noiCampuri);
    };

    const salveazaFormular = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('formulare/', { titlu, mesaj, creator: 1 });
            const formularId = response.data.id;

            await Promise.all(campuri.map((camp, index) =>
                api.post('campuriformular/', { ...camp, formular: formularId, ordine: index })
            ));

            navigate('/');
        } catch (error) {
            alert('A crăpat ceva. Probabil șobolanii au ros cablul de net.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow border border-red-200">
            <h2 className="text-3xl font-bold text-red-600 mb-6">Fă o Turnătorie Nouă 📝</h2>
            <form onSubmit={salveazaFormular} className="space-y-5">
                <input type="text" placeholder="Titlu Formular" className="w-full border p-3 rounded" value={titlu} onChange={(e) => setTitlu(e.target.value)} required />
                <textarea placeholder="Mesaj de întâmpinare hazliu" className="w-full border p-3 rounded h-24" value={mesaj} onChange={(e) => setMesaj(e.target.value)} required />

                <div className="border-t pt-4 mt-6">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">Câmpuri (Aici se adună bârfa)</h3>
                    {campuri.map((camp, index) => (
                        <div key={index} className="bg-gray-50 p-4 mb-4 rounded border border-gray-200 shadow-sm relative">
                            <select className="border p-2 mb-3 w-full rounded font-semibold" value={camp.tip} onChange={(e) => handleCampChange(index, 'tip', e.target.value)}>
                                <option value="text">Text Liber</option>
                                <option value="optiuni">Alegere Multiplă</option>
                            </select>
                            <input type="text" placeholder="Întrebarea ta indiscretă..." className="border p-3 w-full mb-3 rounded" value={camp.intrebare} onChange={(e) => handleCampChange(index, 'intrebare', e.target.value)} required />
                            {camp.tip === 'optiuni' && (
                                <input type="text" placeholder="Opțiuni separate prin virgulă (ex: Da, Nu, Niciodată)" className="border p-3 w-full rounded" value={camp.optiuni} onChange={(e) => handleCampChange(index, 'optiuni', e.target.value)} required />
                            )}
                        </div>
                    ))}
                    <button type="button" onClick={adaugaCamp} className="bg-blue-100 text-blue-700 font-bold px-4 py-2 rounded hover:bg-blue-200 border border-blue-300">+ Adaugă Întrebare</button>
                </div>

                <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 rounded-lg hover:bg-red-700 mt-8 text-lg">Salvează și Așteaptă Bârfele 🚀</button>
            </form>
        </div>
    );
}