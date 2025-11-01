import React, { useEffect, useState } from 'react';
import styles from './GatePassView.module.css';
import api from '../../api/axiosConfig';

const GatePassView = () => {
  const [gatePasses, setGatePasses] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editGatePass, setEditGatePass] = useState(null);

  useEffect(() => {
    fetchGatePasses();
  }, []);

  const fetchGatePasses = async () => {
    try {
      const res = await api.get('/api/gate-passes/all');
      setGatePasses(res.data);
    } catch (err) {
      console.error('Failed to fetch gate passes:', err);
    }
  };

  const toggleExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

 const handleDelete = async (gatePassId) => {
  try {
    await api.delete(`/api/gate-passes/delete`, {
      params: { gatePassId: gatePassId },
    });

    setGatePasses(prev => prev.filter(gp => gp.gatePassId !== gatePassId));
    alert('Gate Pass deleted successfully.');
  } catch (err) {
    console.error('Delete failed:', err);
    alert('Failed to delete gate pass.');
  }
};


  const handleUpdate = (gp) => {
    setEditGatePass(gp);
  };

  const handleSaveUpdate = async () => {
    try {
    await api.put(
  `/api/gate-passes/update?gatePassId=${encodeURIComponent(editGatePass.gatePassId)}`,
  editGatePass
);


      fetchGatePasses();
      setEditGatePass(null);
      alert('Gate Pass updated successfully.');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update gate pass.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>📄 Gate Pass Records</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Gate Pass ID</th>
            <th>Request ID</th>
            <th>Delivery Note ID</th>
            <th>Vehicle Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gatePasses.map((gp, index) => (
            <React.Fragment key={index}>
              <tr>
                <td>{gp.gatePassId}</td>
                <td>{gp.requestId}</td>
                <td>{gp.deliveryNoteId}</td>
                <td>{gp.vehicleNumber}</td>
                <td>
                  <button className={styles.viewBtn} onClick={() => toggleExpand(index)}>
                    {expandedRow === index ? 'Hide' : 'View'}
                  </button>
                </td>
              </tr>

              {expandedRow === index && (
                <tr className={styles.expandedRow}>
                  <td colSpan="5">
                    <div className={styles.expandedContent}>
                      <h4>Gate Pass Full Details</h4>
                      <table className={styles.detailTable}>
                        <tbody>
                          <tr><td><strong>Driver Name:</strong></td><td>{gp.driverName}</td></tr>
                          <tr><td><strong>Driver Phone:</strong></td><td>{gp.driverPhoneNumber}</td></tr>
                          <tr><td><strong>From Location:</strong></td><td>{gp.fromLocation}</td></tr>
                          <tr><td><strong>To Location:</strong></td><td>{gp.toLocation}</td></tr>
                          <tr><td><strong>Authorized By:</strong></td><td>{gp.authorisedBy}</td></tr>
                          <tr><td><strong>Issued Date:</strong></td><td>{gp.gatePassDate}</td></tr>
                          <tr><td><strong>Status:</strong></td><td>{gp.status}</td></tr>
                        </tbody>
                      </table>

                      <div className={styles.buttonGroup}>
                        <button className={styles.updateBtn} onClick={() => handleUpdate(gp)}>✏️ Update</button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(gp.gatePassId)}>🗑️ Delete</button>
                        <button className={styles.closeBtn} onClick={() => toggleExpand(index)}>❌ Close</button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Update Form Modal */}
      {editGatePass && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Update Gate Pass</h3>
            <label>Driver Name:</label>
            <input value={editGatePass.driverName} onChange={(e) => setEditGatePass({ ...editGatePass, driverName: e.target.value })} />
            <label>Driver Phone:</label>
            <input value={editGatePass.driverPhoneNumber} onChange={(e) => setEditGatePass({ ...editGatePass, driverPhoneNumber: e.target.value })} />
            <label>Status:</label>
            <input value={editGatePass.status} onChange={(e) => setEditGatePass({ ...editGatePass, status: e.target.value })} />

            <div className={styles.modalButtons}>
              <button className={styles.saveBtn} onClick={handleSaveUpdate}>💾 Save</button>
              <button className={styles.cancelBtn} onClick={() => setEditGatePass(null)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GatePassView;
