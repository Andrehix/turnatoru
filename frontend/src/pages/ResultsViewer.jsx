import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { formularAPI, campuriAPI, turnatoriiAPI } from '../services/api'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function ResultsViewer() {
  const { id } = useParams()
  const contentRef = useRef()
  const [form, setForm] = useState(null)
  const [campuri, setCampuri] = useState([])
  const [turnatorii, setTurnatorii] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      const formRes = await formularAPI.get(id)
      setForm(formRes.data)
      const campRes = await campuriAPI.list()
      const filtered = campRes.data.filter(c => c.formular === id)
      setCampuri(filtered)
      const turnRes = await turnatoriiAPI.list(id)
      setTurnatorii(turnRes.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const exportPDF = async () => {
    try {
      const element = contentRef.current
      const canvas = await html2canvas(element)
      const pdf = new jsPDF()
      const imgData = canvas.toDataURL('image/png')
      const imgWidth = 190
      const pageHeight = 277
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      pdf.save(`${form.titlu}-results.pdf`)
    } catch (err) {
      alert('PDF export failed')
    }
  }

  if (loading) return <p>Loading...</p>

  const groupedByPersoana = {}
  turnatorii.forEach(turnatorie => {
    campuri.forEach(camp => {
      if (!groupedByPersoana[camp.persoana]) {
        groupedByPersoana[camp.persoana] = {}
      }
      if (!groupedByPersoana[camp.persoana][camp.id]) {
        groupedByPersoana[camp.persoana][camp.id] = {
          intrebare: camp.intrebare,
          raspunsuri: []
        }
      }
    })
  })

  turnatorii.forEach(turnatorie => {
    turnatorie.raspunsuri?.forEach(resp => {
      const camp = campuri.find(c => c.id === resp.camp)
      if (camp && groupedByPersoana[camp.persoana]) {
        groupedByPersoana[camp.persoana][resp.camp].raspunsuri.push(resp.valoare)
      }
    })
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📊 Results: {form?.titlu}</h1>
        <button onClick={exportPDF} className="btn-secondary">
          📥 Export PDF
        </button>
      </div>

      <div ref={contentRef} className="space-y-6 bg-white p-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">{form?.titlu}</h2>
          <p className="text-gray-600">{form?.mesaj}</p>
          <p className="text-sm text-gray-500 mt-2">Total responses: {turnatorii.length}</p>
        </div>

        {Object.entries(groupedByPersoana).map(([persoanaId, questions]) => (
          <div key={persoanaId} className="border-l-4 border-primary pl-6 py-4">
            <h3 className="text-xl font-bold mb-4">Person: {campuri.find(c => c.persoana === parseInt(persoanaId))?.persoana_nume || 'Unknown'}</h3>
            {Object.entries(questions).map(([campId, data]) => (
              <div key={campId} className="mb-4">
                <p className="font-semibold text-gray-700 mb-2">Q: {data.intrebare}</p>
                <div className="bg-gray-50 p-3 rounded space-y-2">
                  {data.raspunsuri.length > 0 ? (
                    data.raspunsuri.map((r, idx) => (
                      <p key={idx} className="text-sm text-gray-700">• {r}</p>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">No responses</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
