import React, { useState } from 'react';
import styles from './CreateAdmin.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import api from '../../api/axiosConfig';

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/admins', formData);
      Swal.fire({
        icon: 'success',
        title: 'Admin Created!',
        text: '✅ Admin created successfully!',
        timer: 2000,
        showConfirmButton: false,
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: '',
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Creation Failed!',
        text: '❌ Something went wrong while creating admin.',
      });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>Create New Admin</h2>

        <div className={styles.inputGrid}>
          <div className={styles.leftColumn}>
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.rightColumn}>
            <input
              className={styles.input}
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              className={styles.input}
              type="text"
              name="role"
              placeholder="Role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button className={styles.button} type="submit">
          Create Admin
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;
