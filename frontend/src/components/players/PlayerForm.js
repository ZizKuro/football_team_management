import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { playerService, teamService } from '../../services/services';
import LoadingSpinner from '../common/LoadingSpinner';

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

const emptyForm = {
  fullName: '',
  position: 'Midfielder',
  jerseyNumber: 1,
  nationality: 'Gambian',
  dateOfBirth: '',
  goals: 0,
  assists: 0,
  appearances: 0,
  team: '',
};

const PlayerForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const teamsRes = await teamService.getAll({ limit: 100 });
        setTeams(teamsRes.data.teams);
        if (isEdit) {
          const res = await playerService.getById(id);
          const p = res.data.data;
          setForm({
            fullName: p.fullName,
            position: p.position,
            jerseyNumber: p.jerseyNumber,
            nationality: p.nationality,
            dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
            goals: p.goals,
            assists: p.assists,
            appearances: p.appearances,
            team: p.team?._id || p.team,
          });
        } else if (teamsRes.data.teams.length) {
          setForm((prev) => ({ ...prev, team: teamsRes.data.teams[0]._id }));
        }
      } catch {
        toast.error('Failed to load form data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['jerseyNumber', 'goals', 'assists', 'appearances'].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.fullName.trim() || !form.team) {
      setError('Player name and club are required');
      return;
    }

    const payload = { ...form };
    if (!payload.dateOfBirth) delete payload.dateOfBirth;

    setSaving(true);
    try {
      if (isEdit) {
        await playerService.update(id, payload);
        toast.success('Player updated');
        navigate(`/players/${id}`);
      } else {
        const res = await playerService.create(payload);
        toast.success('Player registered with GFF');
        navigate(`/players/${res.data.data._id}`);
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
      <h2 className="page-header">{isEdit ? 'Edit Player' : 'Register GFF Player'}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {teams.length === 0 && (
        <Alert variant="warning">Register a club first before adding players.</Alert>
      )}
      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control name="fullName" value={form.fullName} onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Club *</Form.Label>
                  <Form.Select name="team" value={form.team} onChange={handleChange} required>
                    <option value="">Select club</option>
                    {teams.map((t) => (
                      <option key={t._id} value={t._id}>{t.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Position *</Form.Label>
                  <Form.Select name="position" value={form.position} onChange={handleChange}>
                    {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Jersey Number *</Form.Label>
                  <Form.Control type="number" name="jerseyNumber" value={form.jerseyNumber} onChange={handleChange} min={1} max={99} required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Nationality</Form.Label>
                  <Form.Control name="nationality" value={form.nationality} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Goals</Form.Label>
                  <Form.Control type="number" name="goals" value={form.goals} onChange={handleChange} min={0} />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Assists</Form.Label>
                  <Form.Control type="number" name="assists" value={form.assists} onChange={handleChange} min={0} />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Appearances</Form.Label>
              <Form.Control type="number" name="appearances" value={form.appearances} onChange={handleChange} min={0} style={{ maxWidth: 200 }} />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button type="submit" variant="success" disabled={saving || teams.length === 0}>
                {saving ? 'Saving...' : isEdit ? 'Update Player' : 'Register Player'}
              </Button>
              <Button variant="outline-secondary" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PlayerForm;
