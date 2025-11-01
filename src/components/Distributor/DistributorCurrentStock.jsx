import React, { useEffect, useState } from 'react';
import styles from './DistributorCurrentStock.module.css';
import api from '../../api/axiosConfig';
const DistributorCurrentStock = () => {
 
  const [stockItems, setStockItems] = useState([]);
  const distributor = JSON.parse(localStorage.getItem('distributor')); // assuming full object is stored
  const distributorId = distributor?.id;

  useEffect(() => {
    if (distributorId) {
      api.get( `/api/distributors/stock/${distributorId}`)
        .then(res => setStockItems(res.data))
        .catch(err => console.error('Failed to load stock:', err));
    }
  }, [distributorId]);
    console.log("Using distributor ID:", distributorId);
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Current Allocated Stock</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Allocated Quantity</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {stockItems.length > 0 ? (
            stockItems.map((item, index) => (
              <tr key={index}>
                <td>{item.productId}</td>
                <td>{item.productName}</td>
                <td>{item.totalAllocated}</td>
                <td>{item.unit}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">No allocated stock available.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DistributorCurrentStock;
