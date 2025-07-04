import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddContact from '../components/AddContact';
import EditContact from '../components/EditContact';

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/contacts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(res.data);
      setLoading(false);
    } catch (err) {
      toast.error('Error fetching contacts');
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchContacts();
    }
  }, [navigate]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/contacts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(contacts.filter((contact) => contact._id !== id));
      toast.success('Contact deleted successfully');
    } catch (err) {
      toast.error('Failed to delete contact');
    }
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
  };

  const handleUpdate = (updatedContact) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact._id === updatedContact._id ? updatedContact : contact
      )
    );
    setSelectedContact(null);
  };

  const handleAdd = (newContact) => {
    setContacts([...contacts, newContact]);
  };

  return (
    <div style={styles.container}>
      <h2>Contact Book Dashboard</h2>
      {loading ? (
        <p>Loading contacts...</p>
      ) : (
        <>
          {selectedContact ? (
            <EditContact
              contact={selectedContact}
              onUpdate={handleUpdate}
              onCancel={() => setSelectedContact(null)}
            />
          ) : (
            <AddContact onAdd={handleAdd} />
          )}

          <ul style={styles.list}>
            {contacts.map((contact) => (
              <li key={contact._id} style={styles.card}>
                <div>
                  <strong>{contact.name}</strong>
                  <br />
                  {contact.email}
                  <br />
                  {contact.phone}
                </div>
                <div style={styles.actions}>
                  <button
                    onClick={() => handleEdit(contact)}
                    style={styles.editBtn}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: 'auto',
    padding: '20px',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  card: {
    background: '#f2f2f2',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
  },
};

export default Dashboard;
