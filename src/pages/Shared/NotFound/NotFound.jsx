import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '4rem', margin: 0 }}>404</h1>
      <p style={{ fontSize: '1.25rem', margin: '0.5rem 0' }}>Sorry — the page you are looking for does not exist.</p>
      <Link to="/" style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#0b5fff', color: '#fff', borderRadius: 6, textDecoration: 'none' }}>
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
