import React, { useState } from 'react';
import styles from './UserManagement.module.css';
import axios from 'axios';

const UserManagement = () => {
  const [form, setForm] = useState({ id: '', userType: 'client' });
  const [userInfo, setUserInfo] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [newStatus, setNewStatus] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = () => {
    if (!form.id.trim()) {
      setError('Please enter a valid ID');
      return;
    }

    axios.get(`http://localhost:8080/api/users/get-user`, {
      params: { id: form.id, type: form.userType }
    })
    .then(res => {
      setUserInfo(res.data);
      setNewPassword('');
      setNewStatus(res.data.status);
      setError('');
    })
    .catch(() => {
      setUserInfo(null);
      setError('User not found');
    });
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:8080/api/users/update-status`, {
      id: form.id,
      userType: form.userType,
      status: newStatus,
      password: newPassword
    })
    .then(() => alert("User updated successfully"))
    .catch(() => alert("Update failed"));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>User Management</h2>

      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Enter User ID"
          value={form.id}
          onChange={(e) => setForm({ ...form, id: e.target.value })}
        />
        <select
          value={form.userType}
          onChange={(e) => setForm({ ...form, userType: e.target.value })}
        >
          <option value="client">Client</option>
          <option value="distributor">Distributor</option>
          <option value="productManager">Product Manager</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {userInfo && (
        <div className={styles.userCard}>
          <h3>User Information</h3>
          <table className={styles.infoTable}>
            <tbody>
              <tr>
                <td><strong>Name:</strong></td>
                <td>{userInfo.name}</td>
              </tr>
              <tr>
                <td><strong>Email:</strong></td>
                <td>{userInfo.email}</td>
              </tr>
              <tr>
                <td><strong>Phone:</strong></td>
                <td>{userInfo.phone}</td>
              </tr>
              <tr>
                <td><strong>Password:</strong></td>
                <td><input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" /></td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>
                  <label className={styles.switch}>
                    <input type="checkbox" checked={newStatus} onChange={() => setNewStatus(!newStatus)} />
                    <span className={styles.slider}></span>
                  </label>
                  <span className={styles.statusText}>{newStatus ? 'Active' : 'Inactive'}</span>
                </td>
              </tr>
            </tbody>
          </table>
          <button className={styles.updateBtn} onClick={handleUpdate}>Update</button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
