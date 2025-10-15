import React, { useEffect, useState } from 'react';
import styles from './PlantProductRequests.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const PlantProductRequests = () => {
  const [requests, setRequests] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [plantStocks, setPlantStocks] = useState({}); // store stock by productId
  const [allocating, setAllocating] = useState({}); // temp inputs keyed by productId_plantId
  const [plantApprovals, setPlantApprovals] = useState({}); // approvals keyed by requestId -> array

  const navigate = useNavigate();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/distributors/all');
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  // Fetch plant stock for a specific product
  const fetchPlantStockByProduct = async (productId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/plants/plant-stock/by-product/${productId}`);
      setPlantStocks(prev => ({ ...prev, [productId]: res.data }));
    } catch (err) {
      console.error('Failed to fetch plant stock:', err);
    }
  };

  const handleRemarkChange = (requestId, value) => {
    setRemarks(prev => ({ ...prev, [requestId]: value }));
  };

  // allocation input handler
  const handleAllocationChange = (productId, plantId, value) => {
    const key = `${productId}_${plantId}`;
    setAllocating(prev => ({ ...prev, [key]: value }));
  };

  // Confirm allocation for a specific request, product & plant
  const confirmAllocation = (requestId, productId, productName, plantId, plantName, unit) => {
    const key = `${productId}_${plantId}`;
    const raw = allocating[key];
    const qty = parseInt(raw || '0', 10);

    // validate qty
    if (!qty || qty <= 0) {
      Swal.fire('Invalid', 'Please enter a valid quantity to allocate.', 'warning');
      return;
    }

    // check available stock from plantStocks for that product
    const stocks = plantStocks[productId] || [];
    const stockObj = stocks.find(s => s.plantId === plantId);

    const available = stockObj ? (stockObj.availableStock || 0) : 0;
    if (qty > available) {
      Swal.fire('Insufficient stock', `Only ${available} available at ${plantName}`, 'warning');
      return;
    }

    setPlantApprovals(prev => {
      const current = prev[requestId] ? [...prev[requestId]] : [];

      // if same product+plant exists, increment approvedQuantity
      const idx = current.findIndex(a => a.productId === productId && a.plantId === plantId);
      if (idx >= 0) {
        // update existing (sum quantities)
        const updated = { ...current[idx], approvedQuantity: current[idx].approvedQuantity + qty };
        current[idx] = updated;
      } else {
        // push new allocation
        current.push({
          productId,
          productName,
          unit,
          plantId,
          plantName,
          approvedQuantity: qty
        });
      }

      return { ...prev, [requestId]: current };
    });

    // clear the input for that product+plant
    setAllocating(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    Swal.fire('Added', `${qty} ${unit} of ${productName} from ${plantName} added.`, 'success');
  };

  // Remove an allocation from summary
  const removeAllocation = (requestId, index) => {
    setPlantApprovals(prev => {
      const copy = { ...prev };
      const arr = copy[requestId] ? [...copy[requestId]] : [];
      arr.splice(index, 1);
      if (arr.length === 0) delete copy[requestId];
      else copy[requestId] = arr;
      return copy;
    });
  };

  const handleApprove = async (req) => {
    try {
      const approvalsForReq = plantApprovals[req.requestId] || [];

      // Optional: warn if no allocations exist (you can allow or force allocations)
      if (approvalsForReq.length === 0) {
        const cont = await Swal.fire({
          title: 'No allocations made',
          text: 'You have not allocated any stock from plants. Do you want to approve anyway?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Approve anyway',
          cancelButtonText: 'Cancel'
        });
        if (!cont.isConfirmed) return;
      }

      const payload = {
        status: 'APPROVED',
        remark: remarks[req.requestId] || '',
        plantApprovals: approvalsForReq
      };

      // Use the controller path you created
      const url = `http://localhost:8080/api/distributors/request/${req.requestId}/status`;

      const res = await axios.put(url, payload);

      // clear allocations for this request and corresponding inputs
      setPlantApprovals(prev => {
        const copy = { ...prev };
        delete copy[req.requestId];
        return copy;
      });

      // clear allocating inputs related to this request's products
      setAllocating(prev => {
        const copy = { ...prev };
        (req.requestItems || []).forEach(item => {
          const prefix = item.productId + '_';
          Object.keys(copy).forEach(k => {
            if (k.startsWith(prefix)) delete copy[k];
          });
        });
        return copy;
      });

      // refresh requests and plant stocks for the products in this request
      await fetchRequests();
      (req.requestItems || []).forEach(item => fetchPlantStockByProduct(item.productId));

      // show delivery note if any
      const deliveryRes = await axios.get(
        `http://localhost:8080/api/delivery/delivery-notes/by-request/${req.requestId}`
      );
      const notes = deliveryRes.data || [];

      if (notes.length > 0) {
        Swal.fire({
          title: 'Request Approved ✅',
          html: `
            <p>Delivery Note ID: <strong>${notes[0].deliveryNoteId}</strong></p>
            <p>Delivery note successfully created.</p>
          `,
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Go to Delivery Notes',
          cancelButtonText: 'OK'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/delivery-notes');
          }
        });
      } else {
        Swal.fire('Approved', 'No delivery note found', 'success');
      }

    } catch (error) {
      console.error('Approval failed:', error);
      Swal.fire('Error', error.response?.data?.message || 'Approval process failed', 'error');
    }
  };

  const toggleRow = (index, req) => {
    if (expandedRow === index) {
      setExpandedRow(null);
    } else {
      setExpandedRow(index);
      // Fetch plant stock for each requested product
      req.requestItems.forEach(item => {
        if (!plantStocks[item.productId]) {
          fetchPlantStockByProduct(item.productId);
        }
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Incoming Product Requests</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Distributor ID</th>
              <th>Distributor Name</th>
              <th>Sales Person Name</th>
              <th>Sales Person Id</th>
            </tr>
          </thead>
          <tbody>
            {requests
              .filter(req => req.status !== 'APPROVED')
              .map((req, index) => (
                <React.Fragment key={req.requestId}>
                  <tr className={styles.mainRow}>
                    <td>{req.requestId}</td>
                    <td>{req.distributorId}</td>
                    <td>{req.distributorName}</td>
                    <td>{req.requestedBy}</td>
                    <td>{req.salesPerson}</td>
                    <td>
                      <button
                        className={styles.checkBtn}
                        onClick={() => toggleRow(index, req)}
                      >
                        {expandedRow === index ? 'Hide' : 'Check'}
                      </button>
                    </td>
                  </tr>

                  {expandedRow === index && (
                    <tr className={styles.expandedRow}>
                      <td colSpan="6">
                        <div className={styles.flexWrapper}>
                          {/* LEFT: Request Items */}
                          <div className={styles.leftSection}>
                            <h4>Request Items</h4>
                            <table className={styles.subTable}>
                              <thead>
                                <tr>
                                  <th>Product ID</th>
                                  <th>Name</th>
                                  <th>Qty</th>
                                </tr>
                              </thead>
                              <tbody>
                                {req.requestItems.map((item, i) => (
                                  <tr key={i}>
                                    <td>{item.productId}</td>
                                    <td>{item.productName}</td>
                                    <td>{item.quantityRequested}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* RIGHT: Plant Stock Table with allocation input */}
                          <div className={styles.rightSection}>
                            <h4>Available in Plants</h4>
                            {req.requestItems.map((item, i) => (
                              <div key={i} className={styles.productStockBlock}>
                                <h5>{item.productName} ({item.productId})</h5>
                                <table className={styles.subTable}>
                                  <thead>
                                    <tr>
                                      <th>Plant ID</th>
                                      <th>Plant Name</th>
                                      <th>Available Stock</th>
                                      <th>Allocate</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(plantStocks[item.productId] || []).map((stock, j) => {
                                      const inputKey = `${item.productId}_${stock.plantId}`;
                                      return (
                                        <tr key={j}>
                                          <td>{stock.plantId}</td>
                                          <td>{stock.plantName}</td>
                                          <td>{stock.availableStock}</td>
                                          <td>
                                            <input
                                              type="number"
                                              min="0"
                                              className={styles.allocateInput}
                                              value={allocating[inputKey] || ''}
                                              onChange={(e) =>
                                                handleAllocationChange(item.productId, stock.plantId, e.target.value)
                                              }
                                            />
                                            <button
                                              className={styles.allocateBtn}
                                              onClick={() =>
                                                confirmAllocation(
                                                  req.requestId,
                                                  item.productId,
                                                  item.productName,
                                                  stock.plantId,
                                                  stock.plantName,
                                                  item.unit || ''
                                                )
                                              }
                                            >
                                              Add
                                            </button>
                                          </td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* APPROVE SECTION */}
                        <div className={styles.approveSection}>
                          <textarea
                            className={styles.remarkBox}
                            placeholder="Enter remark (optional)..."
                            value={remarks[req.requestId] || ''}
                            onChange={(e) => handleRemarkChange(req.requestId, e.target.value)}
                          />
                          <button onClick={() => handleApprove(req)} className={styles.approveBtn}>
                            ✅ Approve
                          </button>
                        </div>

                        {/* ALLOCATION SUMMARY */}
                        {(plantApprovals[req.requestId] || []).length > 0 && (
                          <div className={styles.allocationSummary}>
                            <h4>Allocations Selected</h4>
                            <ul>
                              {plantApprovals[req.requestId].map((a, idx) => (
                                <li key={idx}>
                                  {a.approvedQuantity} {a.unit} of <b>{a.productName}</b> from {a.plantName}
                                  <button
                                    className={styles.removeAllocBtn}
                                    onClick={() => removeAllocation(req.requestId, idx)}
                                  >
                                    Remove
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantProductRequests;
