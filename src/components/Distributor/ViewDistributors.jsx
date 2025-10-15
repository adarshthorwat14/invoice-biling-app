import React, { useEffect, useState } from 'react';
import styles from './ViewDistributors.module.css';
import axios from 'axios';

const ViewDistributors = () => {
  const [distributors, setDistributors] = useState([]);
  const [filteredDistributors, setFilteredDistributors] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/distributors')
      .then(res => {
        setDistributors(res.data);
        setFilteredDistributors(res.data); // ✅ important: set filtered initially
      })
      .catch(err => console.error('Error fetching distributors:', err));
  }, []);

  const formatDate = (isoDate) => {
    if (!isoDate) return '-';
    const date = new Date(isoDate);
    if (isNaN(date)) return '-';
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  useEffect(() => {
    const term = search.toLowerCase().trim();
    if (term === '') {
      setFilteredDistributors(distributors);
    } else {
      const filtered = distributors.filter((distributor) => {
        const id = distributor.id?.toLowerCase() || '';
        const name = distributor.name?.toLowerCase() || '';
        const email = distributor.email?.toLowerCase() || '';
        const phone = distributor.phone?.toLowerCase() || '';

        return (
          id.includes(term) ||
          name.includes(term) ||
          email.includes(term) ||
          phone.includes(term)
        );
      });
      setFilteredDistributors(filtered);
    }
  }, [search, distributors]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>All Distributors</h2>

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
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Active</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Password</th>
              <th>Address</th>
              <th>City</th>
              <th>District</th>
              <th>State</th>
              <th>Region</th>
              <th>Pincode</th>
              <th>Bank Name</th>
              <th>Account Number</th>
              <th>IFSC Code</th>
              <th>Product Type</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredDistributors.length > 0 ? (
              filteredDistributors.map((d, index) => (
                <tr key={index}>
                  <td>{d.id}</td>
                  <td className={d.active ? styles.active : styles.inactive}>
                    {d.active ? 'Active' : 'Inactive'}
                  </td>
                  <td>{d.name}</td>
                  <td>{d.phone}</td>
                  <td>{d.email}</td>
                  <td>{d.password}</td>
                  <td>{d.address}</td>
                  <td>{d.city}</td>
                  <td>{d.district}</td>
                  <td>{d.state}</td>
                  <td>{d.region}</td>
                  <td>{d.pincode}</td>
                  <td>{d.bank_name}</td>
                  <td>{d.bank_account_number}</td>
                  <td>{d.ifsc_code}</td>
                  <td>{d.product_type}</td>
                  <td>{formatDate(d.createdDate)}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="17">No distributors found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewDistributors;
