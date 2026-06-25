import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { teamService } from '../../services/services';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const TeamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    teamService
      .getById(id)
      .then((res) => setTeam(res.data.data))
      .catch(() => toast.error('Club not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${team.name}?`)) return;
    try {
      await teamService.delete(id);
      toast.success('Club deleted');
      navigate('/teams');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!team) return <Alert variant="warning">Club not found.</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center page-header">
        <h2 className="mb-0">{team.name}</h2>
        <div>
          <Button as={Link} to="/teams" variant="outline-secondary" className="me-2">
            Back
          </Button>
          {isAdmin && (
            <>
              <Button as={Link} to={`/teams/${id}/edit`} variant="warning" className="me-2">
                Edit
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>Club Information</Card.Header>
            <Card.Body>
              <p><strong>City:</strong> {team.city}</p>
              <p><strong>Stadium:</strong> {team.stadium}</p>
              <p><strong>Founded:</strong> {team.founded || 'N/A'}</p>
              <p><strong>Season:</strong> {team.season}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Season Statistics</Card.Header>
            <Card.Body>
              <Row>
                <Col xs={4} className="text-center">
                  <h4>{team.gamesPlayed}</h4>
                  <small className="text-muted">Played</small>
                </Col>
                <Col xs={4} className="text-center">
                  <h4 className="text-success">{team.wins}</h4>
                  <small className="text-muted">Wins</small>
                </Col>
                <Col xs={4} className="text-center">
                  <h4 className="text-primary">{team.points}</h4>
                  <small className="text-muted">Points</small>
                </Col>
              </Row>
              <hr />
              <p className="mb-1">Goals For: <strong>{team.goalsFor}</strong></p>
              <p className="mb-1">Goals Against: <strong>{team.goalsAgainst}</strong></p>
              <p className="mb-0">Goal Difference: <strong>{team.goalDifference ?? team.goalsFor - team.goalsAgainst}</strong></p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeamDetail;
