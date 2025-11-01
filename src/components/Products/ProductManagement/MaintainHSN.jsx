import React, { useEffect, useState } from 'react';

import styles from './MaintainHSN.module.css';
import api from '../../../api/axiosConfig';

const MaintainHSN = () => {
  const [hsn, setHsn] = useState({ code: '', description: '', gstRate: '' });
  const [hsnList, setHsnList] = useState([]);

  const fetchHSNList = () => {
    api.get('/api/hsn')
      .then(res => setHsnList(res.data))
      .catch(err => console.error('Failed to fetch HSN codes', err));
  };

  useEffect(() => {
    fetchHSNList();
  }, []);

  const handleChange = (e) => {
    setHsn({ ...hsn, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('/api/hsn', hsn)
      .then(() => {
        alert('HSN Code Added');
        setHsn({ code: '', description: '', gstRate: '' });
        fetchHSNList();
      })
      .catch(err => {
        console.error(err);
        alert('Error adding HSN');
      });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>HSN Code Management</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input type="text" name="code" value={hsn.code} onChange={handleChange} placeholder="HSN Code (e.g. 84145110)" required />
        <input type="text" name="description" value={hsn.description} onChange={handleChange} placeholder="Description" required />
        <input type="number" name="gstRate" value={hsn.gstRate} onChange={handleChange} placeholder="GST Rate (%)" required />
        <button type="submit" className={styles.submitBtn}>Add HSN</button>
      </form>

      <h3 className={styles.subtitle}>Existing HSN Codes</h3>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>HSN Code</th>
              <th>Description</th>
              <th>GST Rate (%)</th>
            </tr>
          </thead>
          <tbody>
            {hsnList.map((item) => (
              <tr key={item.code}>
                <td>{item.code}</td>
                <td>{item.description}</td>
                <td>{item.gstRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintainHSN;
