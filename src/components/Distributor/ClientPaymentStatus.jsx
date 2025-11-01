import React, { useEffect, useState } from 'react';

import styles from './ClientPaymentStatus.module.css';
import api from '../../api/axiosConfig';

const ClientPaymentStatus = () => {
  const [records, setRecords] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get('/api/invoices/payment-status')
      .then(res => setRecords(res.data))
      .catch(err => console.error('Error loading payment status', err));
  };

  const handleUpdate = (invoiceId) => {
    api.put(`/api/invoices/${invoiceId}/update-payment-status`, {
      paymentStatus: newStatus
    }).then(() => {
      setUpdatingId(null);
      fetchData();
    });
  };

  return (
    <div className={styles.container}>
      <h2>Client Payment Status</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Client ID</th>
            <th>Client</th>
            <th>Payment Method</th>
            <th>Current Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => (
            <tr key={rec.invoiceId}>
              <td>{rec.invoiceId}</td>
              <td>{rec.clientId}</td>
              <td>{rec.clientName}</td>
              <td>{rec.paymentMethod}</td>
              <td>{rec.paymentStatus}</td>
              <td>
                {updatingId === rec.invoiceId ? (
                  <>
                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                      <option value="">Select</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                    <button onClick={() => handleUpdate(rec.invoiceId)}>Save</button>
                    <button onClick={() => setUpdatingId(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => { setUpdatingId(rec.invoiceId); setNewStatus(rec.paymentStatus); }}>
                    Update
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientPaymentStatus;
