import { Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <nav className="bg-gradient-to-r from-gray-900/80 to-purple-900/80 backdrop-blur-lg shadow-2xl border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition" onClick={() => navigate('/dashboard')}>
              <span className="text-3xl animate-float">🐀</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Turnatoru</h1>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
