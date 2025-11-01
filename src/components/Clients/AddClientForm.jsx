import React, { useState,useEffect } from "react";
import styles from "./AddClientForm.module.css";
import axios from "axios";
import api from "../../api/axiosConfig";

const AddClientForm = () => {

  const [distributorId, setDistributorId] = useState(["", "", ""]);
  const [distributorNames, setDistributorNames] = useState(["", "", ""]);

  const handleDistributorIdChange = async (index, id) => {
  const newId = [...distributorId];
  newCodes[index] = id;
  setDistributorId(newCodes);

  // Fetch distributor name
  if (id.trim() !== "") {
    try {
      const res = await api.get(`/api/distributors/${id}`);
      const newNames = [...distributorNames];
      newNames[index] = res.data.name || "Not Found";
      setDistributorNames(newNames);
    } catch (error) {
      const newNames = [...distributorNames];
      newNames[index] = "Invalid Code";
      setDistributorNames(newNames);
    }
  } else {
    const newNames = [...distributorNames];
    newNames[index] = "";
    setDistributorNames(newNames);
  }
};
  const [client, setClient] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    district: "",
    state: "",
    pancard: "",
    gst: "",
    adharCard: "",
    productDeal: [],
    distributorId: [],
    status: true, // changed from active: true to status: 'active'
  });

  const [distributors, setDistributors] = useState([]);

useEffect(() => {
  const fetchDistributors = async () => {
    try {
      const res = await api.get("/api/distributors"); // Adjust your URL if needed
      setDistributors(res.data); // Assuming array of distributor objects with `id` or `code`
    } catch (err) {
      console.error("Error fetching distributors", err);
    }
  };

  fetchDistributors();
}, []);

  const productOptions = [
    "Fan",
    "Speaker Cable",
    "Iron",
    "Optical Fiber Cable (OFC)",
    "Switch Gear",
    "Switches",
  ];

const handleProductDealChange = (e) => {
  const value = e.target.value;
  setClient((prev) => {
    if (prev.productDeal.includes(value)) {
      return {
        ...prev,
        productDeal: prev.productDeal.filter((item) => item !== value),
      };
    } else {
      return {
        ...prev,
        productDeal: [...prev.productDeal, value],
      };
    }
  });
};

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setClient((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     const distributorIdList = client.distributorId.filter(id => id.trim() !== "");
  const clientData = {
    ...client,
    distributorId: distributorIdList,
  };
    try {
      const res = await api.post("/api/clients", clientData);
      alert("Client added: " + res.data.id);
      setClient({
        name: "",
        password: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        district: "",
        state: "",
        pancard: "",
        gst: "",
        adharCard: "",
        productDeal: [],
        distributorId: [],
        status: true, // reset with status: active
      });
    } catch (err) {
      console.error(err);
      alert("Error adding client");
    }
  };

      const handleDistributorChange = (e) => {
      const { value, checked } = e.target;
      setClient((prev) => {
        const updatedList = checked
          ? [...prev.distributorId, value]
          : prev.distributorId.filter((id) => id !== value);
        return { ...prev, distributorId: updatedList };
      });
    };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Add New Client</h2>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            value={client.name}
            onChange={handleChange}
            placeholder="Enter full name"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={client.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className={styles.input}
            required
          />
        </div>

         <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={client.password}
            onChange={handleChange}
            placeholder="Enter the password"
            className={styles.input}
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Phone</label>
          <input
            type="tel"
            name="phone"
            value={client.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Address</label>
          <textarea
            name="address"
            value={client.address}
            onChange={handleChange}
            placeholder="Enter address"
            className={styles.textarea}
            required
          />
        </div>
      </div>

      {/* New fields section */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>City</label>
          <input
            type="text"
            name="city"
            value={client.city}
            onChange={handleChange}
            placeholder="Enter city"
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={client.pincode}
            onChange={handleChange}
            placeholder="Enter pincode"
            className={styles.input}
            maxLength={6}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>District</label>
          <input
            type="text"
            name="district"
            value={client.district}
            onChange={handleChange}
            placeholder="Enter district"
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>State</label>
          <input
            type="text"
            name="state"
            value={client.state}
            onChange={handleChange}
            placeholder="Enter state"
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>PAN Card</label>
          <input
            type="text"
            name="pancard"
            value={client.pancard}
            onChange={handleChange}
            placeholder="Enter PAN card"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>GST</label>
          <input
            type="text"
            name="gst"
            value={client.gst}
            onChange={handleChange}
            placeholder="Enter GST number"
            className={styles.input}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Aadhar Card</label>
          <input
            type="text"
            name="adharCard"
            value={client.adharCard}
            onChange={handleChange}
            placeholder="Enter Aadhar card number"
            className={styles.input}
            maxLength={12}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select
            name="status"
            value={client.status ? "true" : "false"} // convert boolean to string for select
            onChange={(e) =>
              setClient((prev) => ({
                ...prev,
                status: e.target.value === "true", // convert string to boolean on change
              }))
            }
            className={styles.input}
            required
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      <div className={styles.section}>
  <label className={styles.label}><strong>Distribute Product:</strong></label>
  <div className={styles.checkboxGroup}>
    {productOptions.map((product) => (
      <label key={product} className={styles.checkboxItem}>
        <input
          type="checkbox"
          name="productDeal"
          value={product}
          checked={client.productDeal.includes(product)}
          onChange={handleProductDealChange}
          className={styles.checkboxInput}
        />
        <span className={styles.checkboxLabel}>{product}</span>
      </label>
    ))}
  </div>
</div>

<div className={styles.row}>
  <label className={styles.label}>Distributors (Enter Code)*</label>
  {[0, 1, 2].map((i) => (
    <div className={styles.distributorRow} key={i}>
      <input
        type="text"
        name={`distributorId-${i}`}
        placeholder={`Distributor Code ${i + 1}`}
        value={client.distributorId[i] || ""}
        onChange={(e) => {
          const updated = [...client.distributorId];
          updated[i] = e.target.value.toUpperCase(); // Convert to uppercase
          setClient({ ...client, distributorId: updated });
        }}
        className={`${styles.input} ${i === 0 ? styles.required : ""}`}
        required={i === 0}
      />
      <input
        type="text"
        readOnly
        className={styles.readOnlyInput}
        placeholder="Distributor Name"
        value={
          distributors.find((d) => d.id === client.distributorId[i])
            ?.name || ""
        }
      />
    </div>
  ))}
</div>

      <button type="submit" className={styles.button}>
        Add Client
      </button>
    </form>
  );
};

export default AddClientForm;
