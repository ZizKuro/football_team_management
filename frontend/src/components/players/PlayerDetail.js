import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { playerService } from '../../services/services';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const PlayerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playerService
      .getById(id)
      .then((res) => setPlayer(res.data.data))
      .catch(() => toast.error('Player not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${player.fullName}?`)) return;
    try {
      await playerService.delete(id);
      toast.success('Player removed');
      navigate('/players');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!player) return <Alert variant="warning">Player not found.</Alert>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center page-header">
        <h2 className="mb-0">{player.fullName}</h2>
        <div>
          <Button as={Link} to="/players" variant="outline-secondary" className="me-2">Back</Button>
          {isAdmin && (
            <>
              <Button as={Link} to={`/players/${id}/edit`} variant="warning" className="me-2">Edit</Button>
              <Button variant="danger" onClick={handleDelete}>Delete</Button>
            </>
          )}
        </div>
      </div>

      <Row>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Header>Player Profile</Card.Header>
            <Card.Body>
              <p><strong>Club:</strong> {player.team ? <Link to={`/teams/${player.team._id}`}>{player.team.name}</Link> : '—'}</p>
              <p><strong>Position:</strong> {player.position}</p>
              <p><strong>Jersey #:</strong> {player.jerseyNumber}</p>
              <p><strong>Nationality:</strong> {player.nationality}</p>
              <p><strong>Date of Birth:</strong> {player.dateOfBirth ? new Date(player.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>Season Stats</Card.Header>
            <Card.Body>
              <Row className="text-center">
                <Col><h3>{player.goals}</h3><small>Goals</small></Col>
                <Col><h3>{player.assists}</h3><small>Assists</small></Col>
                <Col><h3>{player.appearances}</h3><small>Appearances</small></Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PlayerDetail;
