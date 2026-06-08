import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password2) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authAPI.register(form.username, form.email, form.password)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="card max-w-md w-full relative z-10 backdrop-blur-xl border border-red-500/20">
        <div className="text-center mb-8">
          <span className="text-6xl inline-block animate-float">🐀</span>
          <h1 className="text-3xl font-bold mt-4">Join Turnatoru</h1>
          <p className="text-gray-400 text-sm mt-2">Create your feedback campaigns</p>
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
              placeholder="Choose your username"
              value={form.username}
              onChange={(e) => setForm({...form, username: e.target.value})}
              className="input-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-300">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="input-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-300">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="input-base"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-300">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={form.password2}
              onChange={(e) => setForm({...form, password2: e.target.value})}
              className="input-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-secondary py-3 text-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Creating account...' : '✨ Sign Up'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-center text-gray-400 text-sm">
            Already have account? <Link to="/login" className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text font-bold hover:opacity-80 transition">Login</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
