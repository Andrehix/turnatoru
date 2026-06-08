import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  login: (username, password) => api.post('/auth/login/', { username, password }),
  register: (username, email, password) => api.post('/auth/register/', { username, email, password }),
  logout: () => api.post('/auth/logout/'),
}

export const formularAPI = {
  list: () => api.get('/formulare/'),
  create: (data) => api.post('/formulare/', data),
  get: (id) => api.get(`/formulare/${id}/`),
  update: (id, data) => api.patch(`/formulare/${id}/`, data),
  delete: (id) => api.delete(`/formulare/${id}/`),
}

export const persoane = {
  list: () => api.get('/persoane/'),
  create: (data) => api.post('/persoane/', data),
  delete: (id) => api.delete(`/persoane/${id}/`),
}

export const campuriAPI = {
  list: () => api.get('/campuri/'),
  create: (data) => api.post('/campuri/', data),
  update: (id, data) => api.patch(`/campuri/${id}/`, data),
  delete: (id) => api.delete(`/campuri/${id}/`),
}

export const tokenAPI = {
  list: (formulatId) => api.get(`/formulare/${formulatId}/tokeni/`),
  generate: (formulatId, count) => api.post(`/formulare/${formulatId}/genereaza-tokeni/`, { count }),
}

export const turnatoriiAPI = {
  list: (formulatId) => api.get(`/formulare/${formulatId}/turnatorii/`),
  submit: (tokenCode, data) => api.post(`/token/${tokenCode}/submit/`, data),
}

export default api
