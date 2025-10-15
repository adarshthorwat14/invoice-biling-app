import React, { useEffect, useState } from 'react';
import styles from './CreatePlantEmployee.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const CreatePlantEmployee = () => {
  const [plants, setPlants] = useState([]);
  const [form, setForm] = useState({
    employeeName: '',
    plantId: '',
    plantName: '',
    email: '',
    password: '',
    position: ''
  });

  useEffect(() => {
    axios.get("http://localhost:8080/api/plants")
      .then(res => setPlants(res.data))
      .catch(err => console.error("Error fetching plants", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'plantId') {
      const selected = plants.find(p => p.plantId === value);
      setForm(prev => ({ ...prev, plantName: selected ? selected.name : '' }));
    }

    if (name === 'employeeName') {
      const parts = value.trim().split(" ");
      if (parts.length >= 2) {
        setForm(prev => ({ ...prev, email: `${parts[1].toLowerCase()}.${parts[0].toLowerCase()}@beunique.com` }));
      } else {
        setForm(prev => ({ ...prev, email: `${parts[0].toLowerCase()}@beunique.com` }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/plant-employees", form);
      Swal.fire("Success", "Employee added successfully", "success");
      setForm({ employeeName: '', plantId: '', plantName: '', email: '',password : '', position: '' });
    } catch (err) {
      console.error("Error saving employee", err);
      Swal.fire("Error", "Failed to add employee", "error");
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Plant Employee</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <label>Employee Name</label>
          <input name="employeeName" value={form.employeeName} onChange={handleChange} required />
        </div>

        <div className={styles.row}>
          <label>Plant ID</label>
          <select name="plantId" value={form.plantId} onChange={handleChange} required>
            <option value="">-- Select Plant --</option>
            {plants.map(p => (
              <option key={p.plantId} value={p.plantId}>{p.plantId}</option>
            ))}
          </select>

          <label>Plant Name</label>
          <input name="plantName" value={form.plantName} readOnly />
        </div>

        <div className={styles.row}>
          <label>Email</label>
          <input name="email" value={form.email} readOnly />
        </div>

        <div className={styles.row}>
          <label>Password</label>
          <input name="password" value={form.password} onChange={handleChange} required />
        </div>


        <div className={styles.row}>
          <label>Position</label>
          <input name="position" value={form.position} onChange={handleChange} required />
        </div>

        <div className={styles.footer}>
          <button type="submit" className={styles.submitBtn}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlantEmployee;
