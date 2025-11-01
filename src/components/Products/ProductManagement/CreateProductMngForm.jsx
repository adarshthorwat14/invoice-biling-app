import React, { useState } from 'react';
import styles from './CreateProductMngForm.module.css';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import api from '../../../api/axiosConfig';

const CreateProductMngForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    role: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/productMng', formData);
      Swal.fire({
        icon: 'success',
        title: 'Employee Created!',
        text: '✅ Employee created successfully!',
        timer: 2000,
        showConfirmButton: false,
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: '',
        username:'',
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
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={styles.heading}>Create Product Manager</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.column}>
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className={styles.column}>
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <label>Phone Number</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />

          <label>Role</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} required />
        </div>

        <div className={styles.buttonWrapper}>
          <motion.button
            type="submit"
            className={styles.submitBtn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateProductMngForm;
