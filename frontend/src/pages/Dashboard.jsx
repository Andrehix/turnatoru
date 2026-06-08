import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { formularAPI } from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [formulare, setFormulare] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFormulare()
  }, [])

  const loadFormulare = async () => {
    try {
      const res = await formularAPI.list()
      setFormulare(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this form?')) {
      try {
        await formularAPI.delete(id)
        setFormulare(formulare.filter(f => f.id !== id))
      } catch (err) {
        alert('Failed to delete')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📋 My Forms</h1>
        <Link to="/formular/create" className="btn-primary">+ New Form</Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : formulare.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">No forms yet. Create one to get started!</p>
          <Link to="/formular/create" className="btn-primary">Create Form</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {formulare.map(form => (
            <div key={form.id} className="card flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg">{form.titlu}</h3>
                <p className="text-gray-600 text-sm mt-1">{form.mesaj}</p>
                <p className="text-xs text-gray-500 mt-2">Created: {new Date(form.creat_la).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/formular/${form.id}`} className="btn-outline text-sm px-3 py-1">
                  Manage
                </Link>
                <Link to={`/rezultate/${form.id}`} className="btn-primary text-sm px-3 py-1">
                  Results
                </Link>
                <button
                  onClick={() => handleDelete(form.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
