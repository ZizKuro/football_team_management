import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { teamService, playerService } from '../../services/services';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [seasonRes, scorersRes] = await Promise.all([
          teamService.getSeasonStats(2025).catch(() => null),
          playerService.getTopScorers(5),
        ]);
        if (seasonRes) setStats(seasonRes.data.data);
        setTopScorers(scorersRes.data.data || []);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Loading GFF dashboard..." />;

  return (
    <div>
      <div className="gff-hero">
        <h2 className="mb-2">Welcome, {user?.name}!</h2>
        <p className="mb-0">
          Gambia Football Federation League Manager — track clubs, players, and league standings across The
          Gambia.
        </p>
      </div>

      {!isAdmin && (
        <Alert variant="info">
          You are logged in as a <strong>fan/user</strong>. Browse clubs and players. GFF admins can manage
          records.
        </Alert>
      )}

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="stat-card h-100">
            <Card.Body>
              <Card.Title className="text-muted small">Clubs (2025)</Card.Title>
              <h3>{stats?.totalClubs ?? '—'}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card h-100">
            <Card.Body>
              <Card.Title className="text-muted small">Total Goals</Card.Title>
              <h3>{stats?.totalGoalsFor ?? '—'}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card h-100">
            <Card.Body>
              <Card.Title className="text-muted small">Matches Played</Card.Title>
              <h3>{stats?.totalGames ?? '—'}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card h-100">
            <Card.Body>
              <Card.Title className="text-muted small">League Points</Card.Title>
              <h3>{stats?.totalPoints ?? '—'}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header className="fw-bold">Top Scorers</Card.Header>
            <Card.Body>
              {topScorers.length === 0 ? (
                <p className="text-muted mb-0">No scorer data yet.</p>
              ) : (
                <ul className="list-unstyled mb-0">
                  {topScorers.map((p) => (
                    <li key={p._id} className="d-flex justify-content-between py-1 border-bottom">
                      <span>
                        <Link to={`/players/${p._id}`}>{p.fullName}</Link>
                        <small className="text-muted ms-2">({p.team?.name})</small>
                      </span>
                      <strong>{p.goals} goals</strong>
                    </li>
                  ))}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header className="fw-bold">Quick Links</Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Link to="/teams" className="btn btn-outline-primary">
                  View All Clubs
                </Link>
                <Link to="/players" className="btn btn-outline-success">
                  View All Players
                </Link>
                {isAdmin && (
                  <>
                    <Link to="/teams/new" className="btn btn-danger">
                      Register New Club
                    </Link>
                    <Link to="/players/new" className="btn btn-success">
                      Register New Player
                    </Link>
                  </>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
