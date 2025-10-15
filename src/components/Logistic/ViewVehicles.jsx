import React, { useEffect, useState } from 'react';
import styles from './ViewVehicles.module.css';
import axios from 'axios';

const ViewVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8080/api/logistics/vehicles')
      .then(res => {
        setVehicles(res.data);
        setFilteredVehicles(res.data);
      })
      .catch(err => console.error('Error fetching vehicles:', err));
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (term === '') {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter((v) =>
        v.vehicleId?.toLowerCase().includes(term) ||
        v.vehicleType?.toLowerCase().includes(term)
      );
      setFilteredVehicles(filtered);
    }
  }, [searchTerm, vehicles]);

  const renderStatus = (status) => {
    if (status === 'ACTIVE') return <span className={styles.statusActive}>Available ✅</span>;
    if (status === 'INACTIVE') return <span className={styles.statusInactive}>Not Available ❌</span>;
    if (status === 'ON_ROUTE') return <span className={styles.statusOnRoute}>On Route 🚚</span>;
    return <span>-</span>;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>All Registered Vehicles</h2>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by Vehicle ID or Type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Vehicle ID</th>
              <th>Vehicle No.</th>
              <th>Type</th>
              <th>Driver</th>
              <th>Phone</th>
              <th>Capacity</th>
              <th>Assigned Plant</th>
              <th>Last Maintenance</th>
              <th>Registered Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((v, index) => (
                <tr key={index}>
                  <td>{v.vehicleId}</td>
                  <td>{v.vehicleNumber}</td>
                  <td>{v.vehicleType || '-'}</td>
                  <td>{v.driverName || '-'}</td>
                  <td>{v.driverPhone || '-'}</td>
                  <td>{v.capacity || '-'}</td>
                  <td>{v.assignedPlant || '-'}</td>
                  <td>{v.lastMaintenanceDate || '-'}</td>
                  <td>{v.registerDate || '-'}</td>
                  <td>{renderStatus(v.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center' }}>No vehicles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewVehicles;
