import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
    const [formulare, setFormulare] = useState([]);

    useEffect(() => {
        const fetchFormulare = async () => {
            try {
                const response = await api.get('formulare/');
                setFormulare(response.data);
            } catch (error) {
                alert('Nu am putut aduce formularele. Backend-ul doarme.');
            }
        };
        fetchFormulare();
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Panoul Creatorului Suprem 👑</h2>
                <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 shadow">
                    + Formular Nou
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formulare.map((f) => (
                    <div key={f.id} className="bg-white p-5 rounded-lg shadow border border-gray-200 hover:shadow-md transition">
                        <h3 className="text-xl font-bold text-red-600 mb-2">{f.titlu}</h3>
                        <p className="text-gray-600 mb-4">{f.mesaj}</p>
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded border">ID Formular: {f.id}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}