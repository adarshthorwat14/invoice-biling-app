import React from 'react';
import styles from './HomePagePM.module.css';
import { motion } from 'framer-motion';

const HomePagePM = () => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <h1 className={styles.title}>Welcome to Our Product Management System</h1>
      <p className={styles.subtitle}>
        Manage your product managers efficiently and securely.
      </p>

      <div className={styles.infoCards}>
        <motion.div
          className={styles.card}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
        >
          <h2>Easy Management</h2>
          <p>Quickly add, update, and track your product managers.</p>
        </motion.div>

        <motion.div
          className={styles.card}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
          transition={{ delay: 0.1 }}
        >
          <h2>Secure Access</h2>
          <p>Role-based login to keep your data safe and organized.</p>
        </motion.div>

        <motion.div
          className={styles.card}
          whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}
          transition={{ delay: 0.2 }}
        >
          <h2>Real-time Updates</h2>
          <p>Always stay updated with the latest information.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HomePagePM;
