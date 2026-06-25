import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Table, Form, Row, Col, Button, Pagination, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { teamService } from '../../services/services';
import LoadingSpinner from '../common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

const CITIES = ['', 'Banjul', 'Serrekunda', 'Bakau', 'Brikama', 'Farafenni', 'Basse', 'Soma', 'Georgetown'];

const TeamList = () => {
  const { isAdmin } = useAuth();
  const [teams, setTeams] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [season, setSeason] = useState('');
  const [page, setPage] = useState(1);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const res = await teamService.getAll({ page, limit: 8, search, city, season });
      setTeams(res.data.teams);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  }, [page, search, city, season]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name} from league records?`)) return;
    try {
      await teamService.delete(id);
      toast.success('Club deleted');
      fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center page-header">
        <h2 className="mb-0">GFF League Clubs</h2>
        {isAdmin && (
          <Button as={Link} to="/teams/new" variant="danger">
            + Add Club
          </Button>
        )}
      </div>

      <Row className="g-2 mb-3">
        <Col md={4}>
          <Form.Control
            placeholder="Search club name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All cities</option>
            {CITIES.filter(Boolean).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Control
            type="number"
            placeholder="Season year"
            value={season}
            onChange={(e) => {
              setSeason(e.target.value);
              setPage(1);
            }}
          />
        </Col>
      </Row>

      {loading ? (
        <LoadingSpinner />
      ) : teams.length === 0 ? (
        <Alert variant="secondary">No clubs found. {isAdmin && 'Add the first Gambian club!'}</Alert>
      ) : (
        <div className="table-responsive shadow-sm">
          <Table hover className="mb-0 bg-white">
            <thead className="table-dark">
              <tr>
                <th>Club</th>
                <th>City</th>
                <th>Season</th>
                <th>P</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GF</th>
                <th>GA</th>
                <th>Pts</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((t) => (
                <tr key={t._id}>
                  <td>
                    <Link to={`/teams/${t._id}`}>{t.name}</Link>
                  </td>
                  <td>{t.city}</td>
                  <td>{t.season}</td>
                  <td>{t.gamesPlayed}</td>
                  <td>{t.wins}</td>
                  <td>{t.draws}</td>
                  <td>{t.losses}</td>
                  <td>{t.goalsFor}</td>
                  <td>{t.goalsAgainst}</td>
                  <td><strong>{t.points}</strong></td>
                  <td>
                    <Button as={Link} to={`/teams/${t._id}`} size="sm" variant="outline-primary" className="me-1">
                      View
                    </Button>
                    {isAdmin && (
                      <>
                        <Button as={Link} to={`/teams/${t._id}/edit`} size="sm" variant="outline-warning" className="me-1">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(t._id, t.name)}>
                          Delete
                        </Button>
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
            <Pagination.Item key={i + 1} active={page === i + 1} onClick={() => setPage(i + 1)}>
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next disabled={page === pagination.totalPages} onClick={() => setPage(page + 1)} />
        </Pagination>
      )}
      <p className="text-muted small text-center">{pagination.totalItems} clubs total</p>
    </div>
  );
};

export default TeamList;
