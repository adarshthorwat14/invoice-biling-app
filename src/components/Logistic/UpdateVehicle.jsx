import React, { useState } from 'react';
import styles from './UpdateVehicle.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const UpdateVehicle = () => {
  const [vehicleId, setVehicleId] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [message, setMessage] = useState('');

  const handleFetch = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/logistics/vehicles/${vehicleId}`);
      setVehicle(res.data);
      setMessage('');
    } catch (err) {
      setMessage('Vehicle not found.');
      setVehicle(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

 const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.put(`http://localhost:8080/api/logistics/vehicles/update/${vehicleId}`, vehicle);
    
    if (response.status === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Vehicle details updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      setVehicle(null)
      setVehicleId(null)
    }
  } catch (error) {
    console.error('Update failed:', error);
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: error.response?.data?.message || 'Something went wrong!'
    });
  }
};


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Update Vehicle Information</h2>

      <div className={styles.fetchSection}>
        <input
          type="text"
          placeholder="Enter Vehicle ID (e.g. VHL1001)"
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          className={styles.input}
        />
        <button className={styles.fetchBtn} onClick={handleFetch}>Fetch</button>
      </div>

      {message && <p className={styles.message}>{message}</p>}

      {vehicle && (
        <form className={styles.form} onSubmit={handleUpdate}>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label>Vehicle Number</label>
              <input name="vehicleNumber" value={vehicle.vehicleNumber || ''} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Vehicle Type</label>
              <input name="vehicleType" value={vehicle.vehicleType || ''} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Driver Name</label>
              <input name="driverName" value={vehicle.driverName || ''} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Driver Phone</label>
              <input name="driverPhone" value={vehicle.driverPhone || ''} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Capacity</label>
              <input name="capacity" value={vehicle.capacity || ''} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Assigned Plant</label>
              <select name="assignedPlant" value={vehicle.assignedPlant || ''} onChange={handleChange}>
                <option value="">Select Plant</option>
                <option value="PUNE">PUNE</option>
                <option value="KOLHAPUR">KOLHAPUR</option>
                <option value="SANGLI">SANGLI</option>
                <option value="SATARA">SATARA</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Status</label>
              <select name="status" value={vehicle.status || ''} onChange={handleChange}>
                <option value="">Select Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="ON_ROUTE">ON_ROUTE</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Last Maintenance Date</label>
              <input name="lastMaintenanceDate" type="date" value={vehicle.lastMaintenanceDate || ''} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Register Date</label>
              <input name="registerDate" type="date" value={vehicle.registerDate || ''} onChange={handleChange} />
            </div>
          </div>
          <button type="submit" className={styles.updateBtn}>Update Vehicle</button>
        </form>
      )}
    </div>
  );
};

export default UpdateVehicle;
