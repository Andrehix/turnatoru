import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api, { turnatoriiAPI, campuriAPI } from '../services/api'
import { parseOptions } from '../utils/helpers'

export default function TokenForm() {
  const { tokenCode } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [campuri, setCampuri] = useState([])
  const [raspunsuri, setRaspunsuri] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadForm()
  }, [tokenCode])

  const loadForm = async () => {
    try {
      const res = await api.get(`/token/${tokenCode}/`)
      if (res.data.folosit) {
        setError('🔴 Token already used! Each token can only be used once.')
        setLoading(false)
        return
      }
      setForm(res.data.formular)
      const campRes = await campuriAPI.list()
      const filtered = campRes.data.filter(c => c.formular === res.data.formular.id)
      setCampuri(filtered)
      setRaspunsuri({})
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired token')
    }
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const raspunsuriList = campuri.map(camp => ({
      camp: camp.id,
      valoare: raspunsuri[camp.id] || ''
    }))

    try {
      await api.post(`/token/${tokenCode}/submit/`, {
        raspunsuri: raspunsuriList
      })
      setSuccess(true)
      setTimeout(() => navigate('/'), 3000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit')
    }
    setSubmitting(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading form...</p></div>

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="card max-w-md">
          <p className="text-lg text-red-700 font-semibold text-center">{error}</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <span className="text-5xl">✅</span>
          <h2 className="text-2xl font-bold mt-4 text-green-700">Thank you!</h2>
          <p className="text-gray-600 mt-2">Your feedback has been recorded.</p>
          <p className="text-xs text-gray-500 mt-4">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="card mb-6">
          <h1 className="text-3xl font-bold">{form?.titlu}</h1>
          <p className="text-gray-600 mt-2">{form?.mesaj}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {campuri.map((camp, idx) => (
            <div key={camp.id} className="card space-y-3">
              <label className="block">
                <span className="font-semibold">
                  Q{idx + 1}: {camp.intrebare}
                </span>
                {camp.tip === 'text' && (
                  <textarea
                    value={raspunsuri[camp.id] || ''}
                    onChange={(e) => setRaspunsuri({...raspunsuri, [camp.id]: e.target.value})}
                    className="input-base mt-2 min-h-24"
                    placeholder="Your answer..."
                  />
                )}
                {camp.tip === 'optiuni' && (
                  <div className="mt-2 space-y-2">
                    {parseOptions(camp.optiuni).map((opt, i) => (
                      <label key={i} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name={`optiune-${camp.id}`}
                          value={opt}
                          checked={raspunsuri[camp.id] === opt}
                          onChange={(e) => setRaspunsuri({...raspunsuri, [camp.id]: e.target.value})}
                          className="mr-2"
                        />
                        <span className="hover:text-primary">{opt}</span>
                      </label>
                    ))}
                  </div>
                )}
              </label>
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-primary py-3 disabled:opacity-50 text-lg font-semibold"
          >
            {submitting ? '⏳ Submitting...' : '✉️ Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  )
}
