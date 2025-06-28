import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <h3 style={{ display: 'inline', marginRight: '20px' }}>📖 ContactBook</h3>

      {token ? (
        <>
          <Link to="/" style={{ marginRight: '10px' }}>Dashboard</Link>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
