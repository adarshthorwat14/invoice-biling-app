import React, { useEffect, useState } from 'react';
import styles from './DistributorStock.module.css';
import axios from 'axios';
import api from '../../api/axiosConfig';

const DistributorStock = () => {
  const [inputId, setInputId] = useState('');
  const [stockItems, setStockItems] = useState([]);
  const [distributorInfo, setDistributorInfo] = useState(null);

  const handleSearch = () => {
    if (!inputId.trim()) return;

    api.get(`/api/distributors/${inputId}`)
      .then(res => setDistributorInfo(res.data))
      .catch(err => {
        console.error('Distributor not found:', err);
        setDistributorInfo(null);
        alert('Distributor not found');
      });

    api.get(`/api/distributors/stock/${inputId}`)
      .then(res => setStockItems(res.data))
      .catch(err => {
        console.error('Stock not found:', err);
        setStockItems([]);
      });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Distributor Stock Lookup</h2>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Enter Distributor ID (e.g., DIST001)"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
      </div>

      {distributorInfo && (
            <div className={styles.distributorTableContainer}>
                <h3 className={styles.sectionTitle}>Distributor Details</h3>
                <table className={styles.distributorTable}>
                <thead>
                    <tr>
                    <th>Distributor ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>{distributorInfo.id}</td>
                    <td>{distributorInfo.name}</td>
                    <td>{distributorInfo.email}</td>
                    <td>{distributorInfo.phone}</td>
                    <td>{distributorInfo.city}</td>
                    </tr>
                </tbody>
                </table>
            </div>
            )}


      <h3 className={styles.sectionTitle}>Allocated Stock</h3>
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
            <tr><td colSpan="4">No stock data available.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DistributorStock;
