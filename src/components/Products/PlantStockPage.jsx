import React, { useEffect, useState } from "react";
import styles from "./PlantStockPage.module.css";

const PlantStockPage = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [stockData, setStockData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/plants")
      .then((res) => res.json())
      .then((data) => setPlants(data))
      .catch((err) => console.error("Failed to fetch plants", err));
  }, []);

  const handleFetchStock = () => {
    if (!selectedPlant) return;
    fetch(`http://localhost:8080/api/plants/plant?plantId=${selectedPlant}`)

      .then((res) => res.json())
      .then((data) => setStockData(data))
      .catch((err) => console.error("Failed to fetch stock", err));
  };

  const filteredStock = stockData.filter(
    (item) =>
      item.productId.toLowerCase().includes(search.toLowerCase()) ||
      item.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🏭 Plant-wise Stock</h2>

      <div className={styles.controls}>
        <select
          className={styles.dropdown}
          value={selectedPlant}
          onChange={(e) => setSelectedPlant(e.target.value)}
        >
          <option value="">Select Plant</option>
          {plants.map((p) => (
            <option key={p.plantId} value={p.plantId}>
              {p.name}
            </option>
          ))}
        </select>
        <button className={styles.fetchBtn} onClick={handleFetchStock}>
          Fetch Stock
        </button>
      </div>

      {stockData.length > 0 && (
        <>
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search by Product ID or Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button>Search</button>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.stockTable}>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Stock Quantity</th>
                  <th>Added Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredStock.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.productId}</td>
                    <td>{item.productName}</td>
                    <td>{item.stockQuantity}</td>
                    <td>{item.mfgDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PlantStockPage;
