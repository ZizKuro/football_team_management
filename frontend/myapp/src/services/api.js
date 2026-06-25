import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://football-team-management-tl20.onrender.com/api' 
      : 'http://localhost:5000/api'),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    
    // Handle common error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('🔒 Unauthorized access');
    } else if (error.response?.status === 404) {
      console.log('🔍 Resource not found');
    } else if (error.response?.status >= 500) {
      console.log('🔥 Server error');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const teamAPI = {
  // Get all teams with pagination
  getTeams: (page = 1, limit = 10) => 
    api.get(`/teams?page=${page}&limit=${limit}`),
  
  // Get team by ID
  getTeam: (id) => 
    api.get(`/teams/${id}`),
  
  // Create new team
  createTeam: (teamData) => 
    api.post('/teams', teamData),
  
  // Update team
  updateTeam: (id, teamData) => 
    api.put(`/teams/${id}`, teamData),
  
  // Delete team
  deleteTeam: (id) => 
    api.delete(`/teams/${id}`),
  
  // Get top teams by minimum wins
  getTopTeams: (minWins) => 
    api.get(`/teams/top/${minWins}`),
};

export const statsAPI = {
  // Get team statistics for a year
  getTeamStats: (year) => 
    api.get(`/stats/${year}`),
  
  // Get average goals for a year
  getAverageGoals: (year) => 
    api.get(`/goals/average/${year}`),
};

export const healthAPI = {
  // Health check
  checkHealth: () => 
    api.get('/health'),
};

export default api;
