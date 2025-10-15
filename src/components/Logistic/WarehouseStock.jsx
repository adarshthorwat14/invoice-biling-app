import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './WarehouseStock.module.css';

const WarehouseStock = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')  // Adjust if endpoint differs
      .then(res => {
        setStockData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch stock data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.container}>
      <h2>Warehouse Stock</h2>
      {loading ? (
        <p>Loading stock data...</p>
      ) : (
        <table className={styles.stockTable}>
          <thead>
            <tr>
              <th>Plant ID</th>
              <th>Plant Name</th>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Current Stock</th>
            </tr>
          </thead>
          <tbody>
            {stockData.map((item, index) => (
              <tr key={index}>
                <td>{item.plant?.plantId}</td>
                <td>{item.plant?.name}</td>
                <td>{item.productId}</td>
                <td>{item.name}</td>
                <td>{item.stockQuantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default WarehouseStock;
