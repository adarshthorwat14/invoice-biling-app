import React, { useEffect, useState } from 'react';
import styles from './DistributorDeliveryNote.module.css';
import api from '../../api/axiosConfig';
const DistributorDeliveryNote = () => {
  const [distributorId, setDistributorId] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    // Fetch distributor ID from local storage or auth
    const currentUser = JSON.parse(localStorage.getItem('distributor'));
    if (currentUser) {
      setDistributorId(currentUser.id);
      fetchDeliveryNotes(currentUser.id);
    }
  }, []);

  const fetchDeliveryNotes = async (id) => {
    try {
      const res = await api.get(`/api/delivery/${id}/delivery-notes`);
      setDeliveryNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch delivery notes:', err);
    }
  };

  const handleView = async (noteId) => {
    try {
      const res = await api.get(`/api/delivery/${distributorId}/delivery-notes/${noteId}`);
      setSelectedNote(res.data);
    } catch (err) {
      console.error('Failed to fetch note details:', err);
    }
  };

  const handleDownload = async (noteId) => {
    try {
      const res = await api.get(`/api/delivery/${distributorId}/delivery-notes/${noteId}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `DeliveryNote_${noteId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download PDF:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Your Delivery Notes</h2>

      {/* Scrollable table of all delivery notes */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Delivery Note ID</th>
              <th>Request ID</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {deliveryNotes.map(note => (
              <tr key={note.deliveryNoteId}>
                <td>{note.date}</td>
                <td>{note.deliveryNoteId}</td>
                <td>{note.requestId}</td>
                <td>{note.status}</td>
                <td>
                  <button className={styles.viewBtn} onClick={() => handleView(note.deliveryNoteId)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal / detail view */}
      {selectedNote && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>✅ Order Created Successfully</h3>
            <p><strong>Distributor:</strong> {selectedNote.distributorName}</p>

            <h4>Products Ordered</h4>
            <div className={styles.scrollableTable}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedNote.productId}</td>
                    <td>{selectedNote.productName}</td>
                    <td>{selectedNote.quantity}</td>
                    <td>{selectedNote.unit}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className={styles.modalButtons}>
              <button className={styles.downloadBtn} onClick={() => handleDownload(selectedNote.deliveryNoteId)}>
                📥 Download PDF
              </button>
              <button className={styles.closeBtn} onClick={() => setSelectedNote(null)}>
                ❌ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorDeliveryNote;
