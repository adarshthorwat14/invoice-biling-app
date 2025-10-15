import React, { useState } from 'react';
import styles from './CreateLogisticHead.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreateLogisticHead = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    status: true,
    role: '',
    plantName: '',
    region: '',
    city: '',
    address: '',
  });

  const [plantCode, setPlantCode] = useState('');

  const plantPrefixMap = {
    PUNE: 'PUN',
    KOLHAPUR: 'KOL',
    SANGLI: 'SAN',
    SATARA: 'SAT'
  };

  const generatePlantCode = (plantName) => {
    const prefix = plantPrefixMap[plantName.toUpperCase()] || 'PLT';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}X${randomNum}`;
  };

  const handlePlantChange = (e) => {
    const selectedPlant = e.target.value;
    setFormData({ ...formData, plantName: selectedPlant });
    const generatedCode = generatePlantCode(selectedPlant);
    setPlantCode(generatedCode);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      plantCode,
    };

    try {
      await axios.post('http://localhost:8080/api/logistics/create', payload);
      Swal.fire('Success!', 'Logistic Head Created', 'success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        status: true,
        role: '',
        plantName: '',
        region: '',
        city: '',
        address: ''
      });
      setPlantCode('');
    } catch (err) {
      Swal.fire('Error', 'Failed to create logistic head', 'error');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Create Logistic Department</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} required>
              <option value="">-- Select Role --</option>
              <option value="Head">Head</option>
              <option value="Manager">Manager</option>
              <option value="Senior Manager">Senior Manager</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Plant Name</label>
            <select name="plantName" value={formData.plantName} onChange={handlePlantChange} required>
              <option value="">-- Select Plant --</option>
              <option value="PUNE">PUNE</option>
              <option value="KOLHAPUR">KOLHAPUR</option>
              <option value="SANGLI">SANGLI</option>
              <option value="SATARA">SATARA</option>
            </select>
          </div>
          <div className={styles.field}>
            <label>Plant Code</label>
            <input type="text" value={plantCode} readOnly />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label>Region</label>
            <input type="text" name="region" value={formData.region} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label>City</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.field}>
          <label>Address</label>
          <textarea name="address" value={formData.address} onChange={handleChange} required />
        </div>

        <button type="submit" className={styles.submitBtn}>Create</button>
      </form>
    </div>
  );
};

export default CreateLogisticHead;
