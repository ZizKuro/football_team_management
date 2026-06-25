import axios from 'axios';
import api from './api';

const getHealthBase = () => {
  const base = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  return base.replace(/\/api\/?$/, '');
};

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const teamService = {
  getAll: (params) => api.get('/teams', { params }),
  getById: (id) => api.get(`/teams/${id}`),
  create: (data) => api.post('/teams', data),
  update: (id, data) => api.put(`/teams/${id}`, data),
  delete: (id) => api.delete(`/teams/${id}`),
  getTop: (minWins) => api.get(`/teams/top/${minWins}`),
  getSeasonStats: (season) => api.get(`/teams/stats/${season}`),
};

export const playerService = {
  getAll: (params) => api.get('/players', { params }),
  getById: (id) => api.get(`/players/${id}`),
  create: (data) => api.post('/players', data),
  update: (id, data) => api.put(`/players/${id}`, data),
  delete: (id) => api.delete(`/players/${id}`),
  getTopScorers: (limit = 10) => api.get('/players/scorers/top', { params: { limit } }),
};

export const checkHealth = () => axios.get(`${getHealthBase()}/health`);
