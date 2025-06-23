import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState('');

  const fetchContacts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Not logged in');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/contacts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setContacts(res.data);
    } catch (err) {
      setError('Failed to fetch contacts. Maybe your token is invalid.');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div>
      <h2>My Contacts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {contacts.length === 0 && !error ? (
        <p>No contacts found.</p>
      ) : (
        <ul>
          {contacts.map(contact => (
            <li key={contact._id}>
              {contact.name} - {contact.email} - {contact.phone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
