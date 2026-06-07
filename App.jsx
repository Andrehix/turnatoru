import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Dashboard from './Dashboard';
import CreateForm from './CreateForm';
import TokenLogin from './TokenLogin';
import TokenFormular from './TokenFormular';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
                <header className="bg-red-600 text-white p-4 shadow-md flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold hover:text-gray-200">Turnatoru 🐀</Link>
                    <div className="flex gap-4">
                        <Link to="/create" className="bg-blue-500 text-white px-4 py-2 rounded font-bold shadow hover:bg-blue-600">Fă Formular 📝</Link>
                        <Link to="/token" className="bg-white text-red-600 px-4 py-2 rounded font-bold shadow hover:bg-gray-100">Intră cu Token 🔑</Link>
                    </div>
                </header>
                <main className="p-6 max-w-4xl mx-auto">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/create" element={<CreateForm />} />
                        <Route path="/token" element={<TokenLogin />} />
                        <Route path="/token/:token" element={<TokenFormular />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;