import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'

export default function Login({ setIsAuth }) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.login(username, password)
      localStorage.setItem('token', res.data.token)
      setIsAuth(true)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="card max-w-md w-full relative z-10 backdrop-blur-xl border border-purple-500/20">
        <div className="text-center mb-8">
          <span className="text-6xl inline-block animate-float">🐀</span>
          <h1 className="text-4xl font-bold mt-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Turnatoru</h1>
          <p className="text-gray-400 text-sm mt-2">🗣️ Anonymous Feedback Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg text-sm animate-slide-in">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-gray-300">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 text-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Logging in...' : '🔓 Login'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            No account yet? <Link to="/register" className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text font-bold hover:opacity-80 transition">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
