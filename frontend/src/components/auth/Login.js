import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! Waa Gambia!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card style={{ width: '100%', maxWidth: 420 }} className="shadow">
        <Card.Body className="p-4">
          <h3 className="text-center mb-1">GFF League Manager</h3>
          <p className="text-center text-muted small mb-4">The Gambia Football Federation</p>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </Form.Group>
            <Button type="submit" variant="danger" className="w-100" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </Form>
          <p className="text-center mt-3 mb-0 small">
            No account? <Link to="/register">Register here</Link>
          </p>
          <p className="text-center mt-2 mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
            Demo admin: admin@gff.gm / admin123
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
