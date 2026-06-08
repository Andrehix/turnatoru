import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { formularAPI, tokenAPI, turnatoriiAPI } from '../services/api'

export default function FormDetails() {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [tokeni, setTokeni] = useState([])
  const [tokenCount, setTokenCount] = useState(10)
  const [loading, setLoading] = useState(true)
  const [generatingTokens, setGeneratingTokens] = useState(false)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const formRes = await formularAPI.get(id)
      setForm(formRes.data)
      const tokenRes = await tokenAPI.list(id)
      setTokeni(tokenRes.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const generateTokens = async () => {
    setGeneratingTokens(true)
    try {
      await tokenAPI.generate(id, tokenCount)
      loadData()
      setTokenCount(10)
    } catch (err) {
      alert('Failed to generate tokens')
    }
    setGeneratingTokens(false)
  }

  if (loading) return <p>Loading...</p>

  const usedTokens = tokeni.filter(t => t.folosit).length
  const unusedTokens = tokeni.filter(t => !t.folosit).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{form?.titlu}</h1>
        <p className="text-gray-600 mt-2">{form?.mesaj}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-4xl font-bold text-primary">{tokeni.length}</p>
          <p className="text-sm text-gray-600">Total Tokens</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-green-600">{unusedTokens}</p>
          <p className="text-sm text-gray-600">Available</p>
        </div>
        <div className="card text-center">
          <p className="text-4xl font-bold text-red-600">{usedTokens}</p>
          <p className="text-sm text-gray-600">Used</p>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-bold text-lg">🎫 Generate More Tokens</h2>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            value={tokenCount}
            onChange={(e) => setTokenCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="input-base"
            placeholder="Number of tokens"
          />
          <button
            onClick={generateTokens}
            disabled={generatingTokens}
            className="btn-secondary disabled:opacity-50"
          >
            {generatingTokens ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="card space-y-4">
        <h2 className="font-bold text-lg">Token List</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2">Code</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {tokeni.map(t => (
                <tr key={t.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-mono text-primary">{t.cod}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      t.folosit ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {t.folosit ? 'Used' : 'Available'}
                    </span>
                  </td>
                  <td className="py-2 text-gray-600">{new Date(t.creat_la).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
