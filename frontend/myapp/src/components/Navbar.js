import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/addteam', label: 'Add Team', icon: '⚽' },
    { path: '/updateteam', label: 'Update Team', icon: '✏️' },
    { path: '/deleteteam', label: 'Delete Team', icon: '🗑️' },
    { path: '/teamstats', label: 'Team Stats', icon: '📊' },
    { path: '/topteams', label: 'Top Teams', icon: '🏆' },
    { path: '/averagegoals', label: 'Avg Goals', icon: '🎯' }
  ];

  return (
    <nav className="navbar">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={location.pathname === item.path ? 'active' : ''}
          title={item.label}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
