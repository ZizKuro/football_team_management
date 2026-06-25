import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="loading-overlay flex-column gap-2">
    <Spinner animation="border" variant="danger" />
    <span className="text-muted">{message}</span>
  </div>
);

export default LoadingSpinner;
