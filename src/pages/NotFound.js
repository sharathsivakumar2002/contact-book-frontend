import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      textAlign: 'center',
      marginTop: '100px',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', color: '#ff4d4f' }}>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn’t exist or has been moved.</p>
      <Link to="/login" style={{
        display: 'inline-block',
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#1890ff',
        color: '#fff',
        borderRadius: '4px',
        textDecoration: 'none'
      }}>
        Go to Login
      </Link>
    </div>
  );
};

export default NotFound;
