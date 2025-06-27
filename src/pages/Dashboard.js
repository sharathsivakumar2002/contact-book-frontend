import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data);
    } catch (err) {
      setError('Failed to fetch contacts');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/contacts/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Contact updated');
      } else {
        await axios.post('http://localhost:5000/api/contacts', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSuccess('Contact added');
      }

      setFormData({ name: '', email: '', phone: '' });
      setEditId(null);
      fetchContacts();
    } catch (err) {
      setError('Failed to save contact');
    }
  };

  const handleEdit = (contact) => {
    setFormData({ name: contact.name, email: contact.email, phone: contact.phone });
    setEditId(contact._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchContacts();
    } catch (err) {
      setError('Failed to delete contact');
    }
  };

  return (
    <div>
      <h2>My Contacts</h2>
      <button onClick={logout}>Logout</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleAddOrUpdate}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <button type="submit">{editId ? 'Update' : 'Add'} Contact</button>
      </form>

      <ul>
        {contacts.map(contact => (
          <li key={contact._id}>
            {contact.name} - {contact.email} - {contact.phone}
            <button onClick={() => handleEdit(contact)}>Edit</button>
            <button onClick={() => handleDelete(contact._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
