import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { teamService } from '../../services/services';
import LoadingSpinner from '../common/LoadingSpinner';

const CITIES = ['Banjul', 'Serrekunda', 'Bakau', 'Brikama', 'Farafenni', 'Basse', 'Soma', 'Georgetown'];

const emptyForm = {
  name: '',
  city: 'Banjul',
  stadium: 'Independence Stadium',
  founded: '',
  season: new Date().getFullYear(),
  gamesPlayed: 0,
  wins: 0,
  draws: 0,
  losses: 0,
  goalsFor: 0,
  goalsAgainst: 0,
  points: 0,
};

const TeamForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    teamService
      .getById(id)
      .then((res) => setForm({ ...emptyForm, ...res.data.data }))
      .catch(() => toast.error('Club not found'))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['founded', 'season', 'gamesPlayed', 'wins', 'draws', 'losses', 'goalsFor', 'goalsAgainst', 'points'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim()) {
      setError('Club name is required');
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        await teamService.update(id, form);
        toast.success('Club updated');
        navigate(`/teams/${id}`);
      } else {
        const res = await teamService.create(form);
        toast.success('Club registered with GFF');
        navigate(`/teams/${res.data.data._id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Save failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="page-header">{isEdit ? 'Edit Club' : 'Register New GFF Club'}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Club Name *</Form.Label>
                  <Form.Control name="name" value={form.name} onChange={handleChange} placeholder="e.g. Real de Banjul FC" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City *</Form.Label>
                  <Form.Select name="city" value={form.city} onChange={handleChange} required>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stadium</Form.Label>
                  <Form.Control name="stadium" value={form.stadium} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Founded</Form.Label>
                  <Form.Control type="number" name="founded" value={form.founded} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Season *</Form.Label>
                  <Form.Control type="number" name="season" value={form.season} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {['gamesPlayed', 'wins', 'draws', 'losses', 'goalsFor', 'goalsAgainst', 'points'].map((field) => (
                <Col md={3} key={field}>
                  <Form.Group className="mb-3">
                    <Form.Label>{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
                    <Form.Control type="number" name={field} value={form[field]} onChange={handleChange} min={0} />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <div className="d-flex gap-2">
              <Button type="submit" variant="danger" disabled={saving}>
                {saving ? 'Saving...' : isEdit ? 'Update Club' : 'Register Club'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TeamForm;
