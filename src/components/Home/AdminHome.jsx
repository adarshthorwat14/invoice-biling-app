import React, { useEffect, useState } from 'react';
import styles from './AdminHome.module.css';
import api from '../../api/axiosConfig';

const AdminHome = () => {
  const [adminName, setAdminName] = useState('');
  const [counts, setCounts] = useState({
    admins: 0,
    clients: 0,
    products: 0,
    invoices: 0,
    distributors:0,
  });

  
  
    useEffect(() => {
      const storedAdmin = localStorage.getItem('admin');
      if (storedAdmin) {
        const admin = JSON.parse(storedAdmin);
        setAdminName(admin.name);  // Make sure `name` is returned in the login response
      }
    }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [adminRes, clientRes, productRes, invoiceRes,distributorRes] = await Promise.all([
          api.get('/api/admins/count'),
          api.get('/api/clients/count'),
          api.get('/api/products/count'),
          api.get('/api/invoices/count'),
          api.get('/api/distributors/count'),
        ]);

        setCounts({
          admins: adminRes.data.count,
          clients: clientRes.data.count,
          products: productRes.data.count,
          invoices: invoiceRes.data.count,
          distributors: distributorRes.data.count,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome, {adminName} 👋</h1>
        <p className={styles.subtitle}>Here’s a quick summary of your admin dashboard.</p>

        <div className={styles.cards}>
          <div className={styles.card}>
            <h2>Total Admins</h2>
            <p>{counts.admins}</p>
          </div>
          <div className={styles.card}>
            <h2>Clients Managed</h2>
            <p>{counts.clients}</p>
          </div>
          <div className={styles.card}>
            <h2>Products Added</h2>
            <p>{counts.products}</p>
          </div>
          <div className={styles.card}>
            <h2>Invoices Generated</h2>
            <p>{counts.invoices}</p>
          </div>
          <div className={styles.card}>
            <h2>Total Distributors</h2>
            <p>{counts.distributors}</p>
          </div>
        </div>
      </div>
   
  );
};

export default AdminHome;
