import React, { useEffect, useState } from 'react';

import styles from './ViewClients.module.css';
import api from '../../api/axiosConfig';

const ViewClients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/clients')
      .then(res => {
        setClients(res.data);
        setFilteredClients(res.data);
      })
      .catch(err => console.error('Error fetching clients:', err));
  }, []);

useEffect(() => {
  const term = search.toLowerCase().trim();
  if (term === '') {
    setFilteredClients(clients);
  } else {
    const filtered = clients.filter((client) => {
      const id = client.id?.toLowerCase() || '';
      const name = client.name?.toLowerCase() || '';
      const email = client.email?.toLowerCase() || '';
      const phone = client.phone?.toLowerCase() || '';

      return (
        id.includes(term) ||
        name.includes(term) ||
        email.includes(term) ||
        phone.includes(term)
      );
    });
    setFilteredClients(filtered);
  }
}, [search, clients]);

  return (
    <div className={styles.container}>
      <h2>All Clients</h2>

      <div className={styles.searchBox}>
      <input
        type="text"
        placeholder="Search by ID, name, email, phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.clientTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Adhar Card No.</th>
              <th>Pan Card</th>
              <th>GST No.</th>
              <th>Address</th>
              <th>City</th>
              <th>District</th>
              <th>Pincode</th>
              <th>State</th>
              <th>Status</th>

            </tr>
          </thead>
          <tbody>
            {filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.name}</td>
                  <td>{client.phone}</td>
                  <td>{client.email}</td>
                  <td>{client.adharCard}</td>
                  <td>{client.pancard}</td>
                  <td>{client.gst}</td>
                  <td>{client.address}</td>
                  <td>{client.city}</td>
                  <td>{client.district}</td>
                  <td>{client.pincode}</td>
                  <td>{client.state}</td>
                  <td>
                    <span className={client.status ? styles.active : styles.inactive}>
                      {client.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                </tr>
              ))
            ) : (
              <tr><td colSpan="8">No clients found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewClients;
