import React, { useEffect, useState } from 'react';

import styles from './ApprovedVehicleDispatch.module.css';
import api from '../../api/axiosConfig';

const ApprovedVehicleDispatch = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [dispatchSuccess, setDispatchSuccess] = useState(null);

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      const res = await api.get('/api/vehicle/approved');
      setApprovedRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch approved requests:', err);
    }
  };

  const handleDispatch = async (req) => {
    const currentUser = JSON.parse(localStorage.getItem("logistic"));
    const authorisedBy = currentUser?.name || "Unknown";

    const dispatchData = {
      requestId: req.requestId,
      deliveryNoteId: req.deliveryNoteId,
      driverName: req.driverName,
      driverPhoneNumber: req.driverPhoneNumber,
      vehicleNumber: req.vehicleNumber,
      fromLocation: req.fromLocation,
      toLocation: req.toLocation,
      authorisedBy: authorisedBy
    };

    try {
      const res = await api.post('/api/dispatches/create', dispatchData);
      setDispatchSuccess(res.data);
      setApprovedRequests(prev => prev.filter(r => r.requestId !== req.requestId));
      setExpandedRow(null);
    } catch (err) {
      console.error('Failed to dispatch:', err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Approved Vehicle Requests - Dispatch Panel</h2>

      <div className={styles.scrollTable}>
        <table className={styles.mainTable}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Delivery Note ID</th>
              <th>Vehicle Number</th>
              <th>Driver Name</th>
              <th>Driver Phone</th>
              <th>From</th>
              <th>To</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {approvedRequests.map((req, index) => (
              <React.Fragment key={req.requestId}>
                <tr className={styles.tableRow}>
                  <td>{req.requestId}</td>
                  <td>{req.deliveryNoteId}</td>
                  <td>{req.vehicleNumber}</td>
                  <td>{req.driverName}</td>
                  <td>{req.driverPhoneNumber}</td>
                  <td>{req.fromLocation}</td>
                  <td>{req.toLocation}</td>
                  <td>
                    <button
                      className={styles.checkBtn}
                      onClick={() => setExpandedRow(expandedRow === index ? null : index)}
                    >
                      {expandedRow === index ? 'Hide' : 'Check'}
                    </button>
                  </td>
                </tr>

                {expandedRow === index && (
                  <tr className={styles.detailsRow}>
                    <td colSpan="8">
                      <div className={styles.detailsWrapper}>
                        {/* Product Request Table */}
                        <div className={styles.detailsSection}>
                          <h4>Product Request Details</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Unit</th>
                              </tr>
                            </thead>
                            <tbody>
                              {req.requestItems?.map((item, i) => (
                                <tr key={i}>
                                  <td>{item.productId}</td>
                                  <td>{item.productName}</td>
                                  <td>{item.quantityRequested}</td>
                                  <td>{item.unit}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Delivery Note Table */}
                        <div className={styles.detailsSection}>
                          <h4>Delivery Note Details</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>Delivery Note ID</th>
                                <th>From</th>
                                <th>To</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{req.deliveryNoteId}</td>
                                <td>{req.fromLocation}</td>
                                <td>{req.toLocation}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Transport Table */}
                        <div className={styles.detailsSection}>
                          <h4>Transport Details</h4>
                          <table>
                            <thead>
                              <tr>
                                <th>Vehicle Number</th>
                                <th>Driver Name</th>
                                <th>Driver Phone</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{req.vehicleNumber}</td>
                                <td>{req.driverName}</td>
                                <td>{req.driverPhoneNumber}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className={styles.dispatchWrapper}>
                        <button
                          className={styles.dispatchBtn}
                          onClick={() => handleDispatch(req)}
                        >
                          📦 Dispatch Order
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {dispatchSuccess && (
        <div className={styles.successMessage}>
          ✅ Dispatched Successfully: {dispatchSuccess.dispatchId} <br />
          👤 Authorised By: {dispatchSuccess.authorisedBy} <br />
          🗓️ Dispatch Date: {dispatchSuccess.dispatchDate}
        </div>
      )}
    </div>
  );
};

export default ApprovedVehicleDispatch;
