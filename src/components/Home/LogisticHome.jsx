import React from 'react';
import styles from './LogisticHome.module.css';

const LogisticHome = () => {
  const logistic = JSON.parse(localStorage.getItem('logistic')) || {};

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to the Logistic Dashboard</h1>
        <p className={styles.subtitle}>Hello, <strong>{logistic.name || 'Logistic Head'}</strong></p>
      </div>
    </div>
  );
};

export default LogisticHome;
