import React from 'react';
import styles from './TotalAmount.module.css';

const TotalAmount = ({ totalAmount, onSubmit }) => {
  return (
    <div className={styles.totalContainer}>
      <h3>Total Amount: ₹{totalAmount}</h3>
      <button className={styles.submitBtn} onClick={onSubmit}>
        Create Invoice
      </button>
    </div>
  );
};

export default TotalAmount;
