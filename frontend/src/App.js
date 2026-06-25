import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import AppNavbar from './components/layout/AppNavbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import TeamList from './components/teams/TeamList';
import TeamDetail from './components/teams/TeamDetail';
import TeamForm from './components/teams/TeamForm';
import PlayerList from './components/players/PlayerList';
import PlayerDetail from './components/players/PlayerDetail';
import PlayerForm from './components/players/PlayerForm';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppNavbar />
      <Container className="py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/teams" element={<ProtectedRoute><TeamList /></ProtectedRoute>} />
          <Route path="/teams/new" element={<AdminRoute><TeamForm /></AdminRoute>} />
          <Route path="/teams/:id" element={<ProtectedRoute><TeamDetail /></ProtectedRoute>} />
          <Route path="/teams/:id/edit" element={<AdminRoute><TeamForm /></AdminRoute>} />

          <Route path="/players" element={<ProtectedRoute><PlayerList /></ProtectedRoute>} />
          <Route path="/players/new" element={<AdminRoute><PlayerForm /></AdminRoute>} />
          <Route path="/players/:id" element={<ProtectedRoute><PlayerDetail /></ProtectedRoute>} />
          <Route path="/players/:id/edit" element={<AdminRoute><PlayerForm /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Container>
      <ToastContainer position="top-right" autoClose={4000} theme="colored" />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
