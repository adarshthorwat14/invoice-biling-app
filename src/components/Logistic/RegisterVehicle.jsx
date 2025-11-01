import React, { useState } from 'react';
import styles from './RegisterVehicle.module.css';
import api from '../../api/axiosConfig';

const RegisterVehicle = () => {
  const [formData, setFormData] = useState({
        vehicleNumber: '',
        vehicleType: '',
        driverName: '',
        driverPhone : '',
        capacity: '',
        status: 'Active',
        assignedPlant: '',
        registerDate: '',
        lastMaintenanceDate : '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(' /api/logistics/vehicles', formData);
      alert('Vehicle Registered Successfully');
      setFormData({
        vehicleNumber: '',
        vehicleType: '',
        driverName: '',
        driverPhone : '',
        capacity: '',
        status: 'ACTIVE',
        assignedPlant: '',
        registerDate: '',
        lastMaintenanceDate : '',
      });
    } catch (err) {
      alert('Error registering vehicle');
      console.error(err);
      console.error("Status:", err.response?.status);
      console.error("Data:", err.response?.data);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Register New Vehicle</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Vehicle Number</label>
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Vehicle Type</label>
          <select name="vehicleType" value={formData.vehicleType} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Tempo">Tempo</option>
            <option value="Container">Container</option>
          </select>
        </div>
        <div className={styles.inputGroup}>
          <label>Assigned Driver</label>
          <input
            type="text"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            placeholder="Driver name"
          />
        </div>
         <div className={styles.inputGroup}>
          <label>Phone Number</label>
          <input
            type="text"
            name="driverPhone"
            value={formData.driverPhone}
            onChange={handleChange}
            placeholder="e.g. 7938993596"
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label>Capacity</label>
          <input
            type="text"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="e.g. 10 Tons"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ON_ROUTE">ON_ROUTE</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Plant Name</label>
           <select name="assignedPlant" value={formData.assignedPlant} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="SANGLI">Sangli</option>
            <option value="SATARA">Satara</option>
            <option value="KOLHAPUR">Kolhapur</option>
            <option value="PUNE">Pune</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>Registration Date</label>
          <input
            type="date"
            name="registerDate"
            value={formData.registerDate}
            onChange={handleChange}
          />
        </div>
         <div className={styles.inputGroup}>
          <label>Last Maintenance Date</label>
          <input
            type="date"
            name="lastMaintenanceDate"
            value={formData.lastMaintenanceDate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={styles.submitBtn}>
          Register Vehicle
        </button>
      </form>
    </div>
  );
};

export default RegisterVehicle;
