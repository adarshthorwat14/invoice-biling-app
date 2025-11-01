import React, { useEffect, useState } from 'react';
import styles from './DeliveryNotes.module.css';
import api from '../../api/axiosConfig';

const DeliveryNotes = () => {
  const [notes, setNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10;

  useEffect(() => {
    fetchDeliveryNotes();
  }, []);

  const fetchDeliveryNotes = async () => {
    try {
      const res = await api.get('/api/delivery/delivery-notes/all');
      setNotes(res.data.reverse()); // latest first
    } catch (error) {
      console.error('Error fetching delivery notes:', error);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(notes.length / notesPerPage);
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>All Delivery Notes</h2>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Delivery Note ID</th>
              <th>Date</th>
              <th>Request ID</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Plant Name</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Distributor Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentNotes.map((note, index) => (
              <tr key={index}>
                <td>{note.deliveryNoteId}</td>
                <td>{note.date}</td>
                <td>{note.requestId}</td>
                <td>{note.productId}</td>
                <td>{note.productName}</td>
                <td>{note.plantName}</td>
                <td>{note.quantity}</td>
                <td>{note.unit}</td>
                <td>{note.distributorName}</td>
                <td className={styles[note.status.toLowerCase().replace(/_/g, '')]}>
                  {note.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className={styles.pagination}>
          <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            ‹
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={currentPage === i + 1 ? styles.activePage : ''}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryNotes;
