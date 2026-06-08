import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { formularAPI, persoane, campuriAPI } from '../services/api'

export default function FormBuilder() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ titlu: '', mesaj: 'Spune-ne ce crezi, fără frică.' })
  const [campuri, setCampuri] = useState([])
  const [persoaneList, setPersoaneList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPersoaneList()
  }, [])

  const loadPersoaneList = async () => {
    try {
      const res = await persoane.list()
      setPersoaneList(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const addField = () => {
    setCampuri([...campuri, {
      tip: 'text',
      intrebare: '',
      optiuni: '',
      persoana: null,
      ordine: campuri.length
    }])
  }

  const updateField = (idx, field, value) => {
    const updated = [...campuri]
    updated[idx][field] = value
    setCampuri(updated)
  }

  const removeField = (idx) => {
    setCampuri(campuri.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.titlu || campuri.length === 0) {
      setError('Title and at least one field required')
      return
    }

    setLoading(true)
    try {
      const formRes = await formularAPI.create(form)
      for (const camp of campuri) {
        if (camp.persoana) {
          await campuriAPI.create({
            formular: formRes.data.id,
            persoana: camp.persoana,
            tip: camp.tip,
            intrebare: camp.intrebare,
            optiuni: camp.optiuni,
            ordine: camp.ordine
          })
        }
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">📝 Create New Form</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg">{error}</div>}

        <div className="card space-y-4">
          <label className="block">
            <span className="font-semibold">Title *</span>
            <input
              type="text"
              value={form.titlu}
              onChange={(e) => setForm({...form, titlu: e.target.value})}
              className="input-base mt-1"
              placeholder="e.g., Feedback on Team Lead John"
            />
          </label>

          <label className="block">
            <span className="font-semibold">Intro Message</span>
            <textarea
              value={form.mesaj}
              onChange={(e) => setForm({...form, mesaj: e.target.value})}
              className="input-base mt-1 min-h-24"
              placeholder="Welcome message for respondents"
            />
          </label>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Questions</h2>
            <button
              type="button"
              onClick={addField}
              className="btn-secondary text-sm px-3 py-1"
            >
              + Add Question
            </button>
          </div>

          {campuri.map((campo, idx) => (
            <div key={idx} className="card space-y-3 p-4 bg-gray-50 border-l-4 border-primary">
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold text-gray-600">Q{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => removeField(idx)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>

              <select
                value={campo.tip}
                onChange={(e) => updateField(idx, 'tip', e.target.value)}
                className="input-base text-sm"
              >
                <option value="text">Text Answer</option>
                <option value="optiuni">Multiple Choice</option>
              </select>

              <input
                type="text"
                value={campo.intrebare}
                onChange={(e) => updateField(idx, 'intrebare', e.target.value)}
                placeholder="Question text"
                className="input-base text-sm"
              />

              {campo.tip === 'optiuni' && (
                <input
                  type="text"
                  value={campo.optiuni}
                  onChange={(e) => updateField(idx, 'optiuni', e.target.value)}
                  placeholder="Options (comma-separated)"
                  className="input-base text-sm"
                />
              )}

              <select
                value={campo.persoana || ''}
                onChange={(e) => updateField(idx, 'persoana', e.target.value ? parseInt(e.target.value) : null)}
                className="input-base text-sm"
              >
                <option value="">Select target (optional)</option>
                {persoaneList.map(p => (
                  <option key={p.id} value={p.id}>{p.nume}</option>
                ))}
              </select>
            </div>
          ))}

          {campuri.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No questions yet. Add one to get started!
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Form'}
        </button>
      </form>
    </div>
  )
}
