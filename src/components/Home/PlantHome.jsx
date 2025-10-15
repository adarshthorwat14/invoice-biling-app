import React from 'react';
import styles from './PlantHome.module.css';

const PlantHome = () => {
  const employee = JSON.parse(localStorage.getItem('plantEmployee')) || {};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to the Plant Dashboard</h1>
        <p className={styles.subtitle}>Hello, <strong>{employee.name || 'Plant Employee'}</strong></p>
        <p className={styles.info}>
          <strong>Plant:</strong> {employee.plantName || 'N/A'}
        </p>
        <p className={styles.info}>
          <strong>Position:</strong> {employee.position || 'N/A'}
        </p>
      </div>
    </div>
  );
};

export default PlantHome;
