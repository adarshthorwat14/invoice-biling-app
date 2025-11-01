import React, { useEffect, useState } from 'react';
import styles from './PlantManagement.module.css';
import api from '../../api/axiosConfig';

const PlantManagement = () => {
  const [plantList, setPlantList] = useState([]);
  const [plant, setPlant] = useState({ name: '', location: '',description : '' });

  const fetchPlants = async () => {
    try {
      const res = await api.get(' /api/plants');
      setPlantList(res.data);
    } catch (err) {
      console.error('Error fetching plants:', err);
      alert('Failed to load plant data.');
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  const handleChange = (e) => {
    setPlant({ ...plant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(' /api/plants', plant);
      alert('✅ Plant added successfully!');
      setPlant({ name: '', location: '',description : '' });
      fetchPlants();
    } catch (err) {
      console.error('Error adding plant:', err);
      alert('❌ Failed to add plant.');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Plant Management</h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <label>
            Plant Name
            <input
              type="text"
              name="name"
              value={plant.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Location
            <input
              type="text"
              name="location"
              value={plant.location}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description
            <input
              type="text"
              name="description"
              value={plant.description}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit" className={styles.submitBtn}>Add Plant</button>
      </form>

      <div className={styles.tableContainer}>
        <h3>All Plants</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Plant ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {plantList.map(p => (
              <tr key={p.plantId}>
                <td>{p.plantId}</td>
                <td>{p.name}</td>
                <td>{p.location}</td>
                <td>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantManagement;
