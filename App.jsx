import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import TokenLogin from './pages/TokenLogin';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
                <header className="bg-red-600 text-white p-4 shadow-md flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold hover:text-gray-200">Turnatoru 🐀</Link>
                    <Link to="/token" className="bg-white text-red-600 px-4 py-2 rounded font-bold shadow hover:bg-gray-100">Intră cu Token 🔑</Link>
                </header>
                <main className="p-6 max-w-4xl mx-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/create" element={<CreateForm />} />
                        <Route path="/token" element={<TokenLogin />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;