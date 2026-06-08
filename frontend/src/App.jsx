import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import FormBuilder from './pages/FormBuilder'
import FormDetails from './pages/FormDetails'
import TokenForm from './pages/TokenForm'
import ResultsViewer from './pages/ResultsViewer'
import Layout from './components/Layout'

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'))

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuth(!!token)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/token/:tokenCode" element={<TokenForm />} />
        
        {isAuth ? (
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/formular/create" element={<FormBuilder />} />
            <Route path="/formular/:id" element={<FormDetails />} />
            <Route path="/rezultate/:id" element={<ResultsViewer />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>
        ) : (
          <Route path="/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default App
