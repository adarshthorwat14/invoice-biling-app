import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './ViewProducts.module.css';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchedProduct, setSearchedProduct] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(res => {
        const sorted = res.data.sort((a, b) => a.productId.localeCompare(b.productId));
        setProducts(sorted);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const handleSearch = () => {
    if (searchId.trim() === '') return;

    axios.get(`http://localhost:8080/api/products/${searchId}`)
      .then(res => setSearchedProduct(res.data))
      .catch(err => {
        console.error('Product not found:', err);
        setSearchedProduct(null);
        alert('Product not found');
      });
  };

  const handleViewImage = (imgUrl) => {
    window.open(imgUrl, '_blank');
  };

  return (
    <div className={styles.productContainer}>
      <h2 className={styles.title}>View Products</h2>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Enter Product ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.button}>Search</button>
      </div>

      {searchedProduct && (
        <div className={styles.searchedProduct}>
          <h3>Searched Product</h3>
          <img src={searchedProduct.img} alt={searchedProduct.name} />
          <p><strong>ID:</strong> {searchedProduct.productId}</p>
          <p><strong>Name:</strong> {searchedProduct.name}</p>
          <p><strong>Price:</strong> ₹{searchedProduct.price}</p>
          <p><strong>Stock:</strong> {searchedProduct.stockQuantity}</p>
        </div>
      )}

      <h3 className={styles.allProductsTitle}>All Products</h3>
      <div className={styles.tableFrame}>
        <table className={styles.productTable}>
          <thead>
            <tr>
              <th>Sr No.</th>
              <th>Product ID</th>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, index) => (
              <tr key={prod.productId}>
                <td>{index + 1}</td>
                <td>{prod.productId}</td>
                <td>{prod.name}</td>
                <td>{prod.price}</td>
                <td>{prod.stockQuantity}</td>
                <td>
                  <button
                    className={styles.viewButton}
                    onClick={() => handleViewImage(prod.img)}
                    title="View Image"
                  >
                    👁️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewProducts;
