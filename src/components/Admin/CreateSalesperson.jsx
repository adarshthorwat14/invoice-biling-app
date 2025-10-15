import React, { useState } from "react";
import axios from "axios";
import styles from "./CreateSalesperson.module.css";

const CreateSalesperson = () => {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    position: "",
    state: "",
    region: "",
    territory: "",
    target: "",
    achieved: "",
    branch : "",
    password : "",
    status: "Active",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/salespersons", form);
      setMessage("✅ Salesperson created successfully!");
      setForm({
        name: "",
        phoneNumber: "",
        email: "",
        position: "",
        state: "",
        region: "",
        territory: "",
        target: "",
        achieved: "",
        branch: "",
        password : "",
        status: "Active",
      });
    } catch (err) {
      setMessage("❌ Error creating salesperson");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Salesperson</h2>

      {message && <p className={styles.message}>{message}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Phone</label>
            <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Position</label>
            <input type="text" name="position" value={form.position} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>State</label>
            <input type="text" name="state" value={form.state} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Region</label>
            <input type="text" name="region" value={form.region} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Territory</label>
            <input type="text" name="territory" value={form.territory} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Branch</label>
            <input type="text" name="branch" value={form.branch} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.row}>

          <div className={styles.inputGroup}>
            <label>Target</label>
            <input type="number" name="target" value={form.target} onChange={handleChange} />
          </div>

          <div className={styles.inputGroup}>
            <label>Achieved</label>
            <input type="number" name="achieved" value={form.achieved} onChange={handleChange} />
          </div>

        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="text" name="password" value={form.password} onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className={styles.btn}>Create</button>
      </form>
    </div>
  );
};

export default CreateSalesperson;
