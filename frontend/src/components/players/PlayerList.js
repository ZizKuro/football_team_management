import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Table, Form, Row, Col, Button, Pagination, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { playerService, teamService } from '../../services/services';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const POSITIONS = ['', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

const PlayerList = () => {
  const { isAdmin } = useAuth();
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [position, setPosition] = useState('');
  const [team, setTeam] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    teamService.getAll({ limit: 100 }).then((res) => setTeams(res.data.teams));
  }, []);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await playerService.getAll({ page, limit: 8, search, position, team });
      setPlayers(res.data.players);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load players');
    } finally {
      setLoading(false);
    }
  }, [page, search, position, team]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from player registry?`)) return;
    try {
      await playerService.delete(id);
      toast.success('Player deleted');
      fetchPlayers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center page-header">
        <h2 className="mb-0">GFF Registered Players</h2>
        {isAdmin && (
          <Button as={Link} to="/players/new" variant="success">
            + Add Player
          </Button>
        )}
      </div>

      <Row className="g-2 mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search player name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </Col>
        <Col md={3}>
          <Form.Select value={position} onChange={(e) => { setPosition(e.target.value); setPage(1); }}>
            <option value="">All positions</option>
            {POSITIONS.filter(Boolean).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={team} onChange={(e) => { setTeam(e.target.value); setPage(1); }}>
            <option value="">All clubs</option>
            {teams.map((t) => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <LoadingSpinner />
      ) : players.length === 0 ? (
        <Alert variant="secondary">No players found.</Alert>
      ) : (
        <div className="table-responsive shadow-sm">
          <Table hover className="mb-0 bg-white">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Club</th>
                <th>Position</th>
                <th>#</th>
                <th>Goals</th>
                <th>Assists</th>
                <th>Apps</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p) => (
                <tr key={p._id}>
                  <td><Link to={`/players/${p._id}`}>{p.fullName}</Link></td>
                  <td>{p.team?.name || '—'}</td>
                  <td>{p.position}</td>
                  <td>{p.jerseyNumber}</td>
                  <td>{p.goals}</td>
                  <td>{p.assists}</td>
                  <td>{p.appearances}</td>
                  <td>
                    <Button as={Link} to={`/players/${p._id}`} size="sm" variant="outline-primary" className="me-1">View</Button>
                    {isAdmin && (
                      <>
                        <Button as={Link} to={`/players/${p._id}/edit`} size="sm" variant="outline-warning" className="me-1">Edit</Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(p._id, p.fullName)}>Delete</Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Pagination className="mt-3 justify-content-center">
          <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
          {[...Array(pagination.totalPages)].map((_, i) => (
            <Pagination.Item key={i + 1} active={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</Pagination.Item>
          ))}
          <Pagination.Next disabled={page === pagination.totalPages} onClick={() => setPage(page + 1)} />
        </Pagination>
      )}
    </div>
  );
};

export default PlayerList;
