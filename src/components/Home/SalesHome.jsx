// SalesHome.jsx
import React from 'react';
import styles from './PlantHome.module.css'; // reuse same CSS

const SalesHome = () => {
  const salesperson = JSON.parse(localStorage.getItem('salesperson')) || {};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to the Sales Dashboard</h1>
        <p className={styles.subtitle}>Hello, <strong>{salesperson.name || 'Salesperson'}</strong></p>
        <p className={styles.info}>
          <strong>Region:</strong> {salesperson.region || 'N/A'}
        </p>
        <p className={styles.info}>
          <strong>State:</strong> {salesperson.state || 'N/A'}
        </p>
        <p className={styles.info}>
          <strong>Position:</strong> {salesperson.position || 'N/A'}
        </p>
        <p className={styles.info}>
          <strong>Phone:</strong> {salesperson.phone || 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default SalesHome;
