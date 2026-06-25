import React from 'react';
import { Container, Navbar, Nav, Button, Badge } from 'react-bootstrap';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AppNavbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="gff-flag-bar" />
      <Navbar expand="lg" className="gff-navbar shadow-sm" variant="light">
        <Container>
          <Navbar.Brand as={Link} to="/" className="gff-brand">
            GFF League Manager
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="gff-nav" />
          <Navbar.Collapse id="gff-nav">
            {isAuthenticated && (
              <Nav className="me-auto">
                <Nav.Link as={NavLink} to="/dashboard" end>
                  Dashboard
                </Nav.Link>
                <Nav.Link as={NavLink} to="/teams">
                  Clubs
                </Nav.Link>
                <Nav.Link as={NavLink} to="/players">
                  Players
                </Nav.Link>
                {isAdmin && (
                  <>
                    <Nav.Link as={NavLink} to="/teams/new">
                      Add Club
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/players/new">
                      Add Player
                    </Nav.Link>
                  </>
                )}
              </Nav>
            )}
            <Nav className="ms-auto align-items-lg-center gap-2">
              {isAuthenticated ? (
                <>
                  <span className="text-muted small">
                    {user?.name}{' '}
                    <Badge bg={isAdmin ? 'danger' : 'secondary'}>{user?.role}</Badge>
                  </span>
                  <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/register">
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default AppNavbar;
