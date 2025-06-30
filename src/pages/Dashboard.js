import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contacts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch {
      toast.error('Failed to fetch contacts');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/contacts/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Contact updated');
      } else {
        await axios.post('http://localhost:5000/api/contacts', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success('Contact added');
      }

      setFormData({ name: '', email: '', phone: '' });
      setEditId(null);
      fetchContacts();
    } catch {
      toast.error('Failed to save contact');
    }
  };

  const handleEdit = (contact) => {
    setFormData({ name: contact.name, email: contact.email, phone: contact.phone });
    setEditId(contact._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Contact deleted');
      fetchContacts();
    } catch {
      toast.error('Failed to delete contact');
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>{editId ? 'Edit Contact' : 'Add New Contact'}</h3>
        <form onSubmit={handleAddOrUpdate}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <button type="submit">{editId ? 'Update Contact' : 'Add Contact'}</button>
        </form>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Your Contacts</h3>
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '15px', padding: '8px', width: '100%' }}
        />
        <ul>
          {contacts
            .filter((c) =>
              c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              c.email.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((contact) => (
              <li key={contact._id} style={{ marginBottom: '10px' }}>
                {contact.name} - {contact.email} - {contact.phone}
                <div style={{ marginTop: '5px' }}>
                  <button onClick={() => handleEdit(contact)}>Edit</button>
                  <button onClick={() => handleDelete(contact._id)}>Delete</button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
