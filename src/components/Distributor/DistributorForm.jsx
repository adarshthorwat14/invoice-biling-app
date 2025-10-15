// DistributorForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './DistributorForm.css';

const DistributorForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '',password: '', phone: '', address: '', city: '', state: '',
    region: '', pincode: '', district: '', productType: [],
    bankAccountNumber: '', bankName: '', ifscCode: ''
  });

  const productOptions = ['Fan', 'Speaker Cable', 'Iron', 'Optical Fiber Cable (OFC)', 'Switch Gear', 'Switches'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductTypeChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => {
      if (prev.productType.includes(value)) {
        return {
          ...prev,
          productType: prev.productType.filter((item) => item !== value),
        };
      } else {
        return {
          ...prev,
          productType: [...prev.productType, value],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      status: true // hardcoded true for backend
    };
    try {
      const response = await axios.post('http://localhost:8080/api/distributors', payload);
      const createdId = response.data.id;
      Swal.fire({
        title: 'Success!',
        text: `Distributor created successfully! Id: ${createdId}`,
        icon: 'success',
        confirmButtonText: 'OK'
      });
      setFormData({
        name: '', email: '', password: '', phone: '', address: '', city: '', state: '',
        region: '', pincode: '', district: '', productType: [],
        bankAccountNumber: '', bankName: '', ifscCode: ''
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Error creating distributor!',
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    }
  };

  return (
    <div className="distributor-form-container">
      <form className="distributor-form animate-slide" onSubmit={handleSubmit}>
        <h2>Create Distributor</h2>

        <div className="form-grid">
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <input name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
          <input name="region" placeholder="Region" value={formData.region} onChange={handleChange} required />
          <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />
          <input name="district" placeholder="District" value={formData.district} onChange={handleChange} required />
          <input name="bankAccountNumber" placeholder="Bank Account Number" value={formData.bankAccountNumber} onChange={handleChange} required />
          <input name="bankName" placeholder="Bank Name" value={formData.bankName} onChange={handleChange} required />
          <input name="ifscCode" placeholder="IFSC Code" value={formData.ifscCode} onChange={handleChange} required />
        </div>

        <div className="form-section">
          <label><strong>Distribute Product :</strong></label>
          <div className="checkbox-group styled-checkboxes">
            {productOptions.map(product => (
              <label key={product} className="checkbox-item">
                <input
                  type="checkbox"
                  name="productType"
                  value={product}
                  checked={formData.productType.includes(product)}
                  onChange={handleProductTypeChange}
                />
                <span>{product}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="submit-btn" type="submit">Create Distributor</button>
      </form>
    </div>
  );
};

export default DistributorForm;
