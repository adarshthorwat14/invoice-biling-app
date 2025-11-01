import React, { useEffect, useState } from 'react';
import styles from './ProductRequest.module.css';
import Swal from 'sweetalert2';
import api from '../../../api/axiosConfig';

const ProductRequest = () => {
  const [requests, setRequests] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [productStockMap, setProductStockMap] = useState({});

  useEffect(() => {
    fetchRequests();
    fetchAllProductStocks();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/api/distributors/all');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const fetchAllProductStocks = async () => {
    try {
      const res = await api.get('/api/products');
      const stockMap = {};
      res.data.forEach(product => {
        stockMap[product.productId] = product.stockQuantity;
      });
      setProductStockMap(stockMap);
    } catch (err) {
      console.error('Failed to fetch product stock:', err);
    }
  };

  const toggleExpand = (requestId) => {
    setExpandedRow(prev => (prev === requestId ? null : requestId));
  };

  const handleRemarkChange = (id, value) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/api/distributors/request/${id}/status`, {
        status,
        remark: remarks[id] || ''
      });
      Swal.fire('Success', `Request ${status}`, 'success');
      fetchRequests();
      setExpandedRow(null);
    } catch (err) {
      console.error('Error updating status:', err);
      Swal.fire('Error', 'Failed to update status', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Product Stock Requests</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Distributor ID</th>
            <th>Distributor Name</th>
            <th>Total Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <React.Fragment key={req.requestId}>
              <tr>
                <td>{req.requestId}</td>
                <td>{req.distributorId}</td>
                <td>{req.distributorName}</td>
                <td>{req.totalQuantity}</td>
                <td>
                  {req.status === 'APPROVED' ? (
                    <span className={`${styles.statusBadge} ${styles.approved}`}>Approved</span>
                  ) : req.status === 'REJECTED' ? (
                    <span className={`${styles.statusBadge} ${styles.rejected}`}>Rejected</span>
                  ) : (
                    <button className={styles.checkBtn} onClick={() => toggleExpand(req.requestId)}>
                      {expandedRow === req.requestId ? 'Hide' : 'Check'}
                    </button>
                  )}
                </td>
              </tr>

              {expandedRow === req.requestId && (
                <tr className={styles.expandedRow}>
                  <td colSpan="5">
                    <div className={styles.flexContainer}>
                      {/* Left: Request Table */}
                      <div className={styles.leftSection}>
                        <h4>Request Details</h4>
                        <table className={styles.detailTable}>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Qty Requested</th>
                              <th>Unit</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {req.requestItems.map((item, index) => (
                              <tr key={index}>
                                <td>{item.productName}</td>
                                <td>{item.quantityRequested}</td>
                                <td>{item.unit}</td>
                                <td>{item.status}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p><strong>Requested By:</strong> {req.requestedBy}</p>
                        <p><strong>Priority:</strong> {req.priority}</p>
                        <p><strong>Notes:</strong> {req.notes}</p>
                        <textarea
                          placeholder="Add remark (optional)..."
                          value={remarks[req.requestId] || ''}
                          onChange={(e) => handleRemarkChange(req.requestId, e.target.value)}
                          className={styles.remarkBox}
                        />
                        <div className={styles.actionButtons}>
                          <button onClick={() => updateStatus(req.requestId, 'APPROVED')} className={styles.approve}>
                            ✅ Approve
                          </button>
                          <button onClick={() => updateStatus(req.requestId, 'REJECTED')} className={styles.reject}>
                            ❌ Reject
                          </button>
                        </div>
                      </div>

                      {/* Right: Current Stock */}
                      <div className={styles.rightSection}>
                        <h4>Current Stock</h4>
                        <table className={styles.stockTable}>
                          <thead>
                            <tr>
                              <th>Product</th>
                              <th>Stock Qty</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {req.requestItems.map((item, index) => {
                              const stock = productStockMap[item.productId];
                              return (
                                <tr key={index}>
                                  <td>{item.productName}</td>
                                  <td>{stock ?? 'N/A'}</td>
                                  <td className={stock > 0 ? styles.inStock : styles.outOfStock}>
                                    {stock > 0 ? 'Available' : 'Out of Stock'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductRequest;
