import React, { useState, useEffect } from 'react';
import styles from './CreateProductRequest.module.css';
import Swal from 'sweetalert2';
import api from '../../api/axiosConfig';
const CreateProductRequest = () => {
  const [products, setProducts] = useState([]);
  const [plants, setPlants] = useState([]);
  const [distributor, setDistributor] = useState({ id: '', name: '', address: '' });

  const [form, setForm] = useState({
    distributorId: '',
    requestDate: new Date().toISOString().split('T')[0],
    billingDate: new Date().toISOString().split('T')[0],
    priority: '',
    notes: '',
    requestedBy: '',
    salesPerson :'',
    branch : '',
    region:'',
    status:'ORDER_CREATED',
    deliveryTo: '',
    cgst: 0,
    sgst: 0,
    igst: 0,
    subTotal: 0,
    productValue: 0,
    finalValue: 0,
    requestItems: [
      {
        productId: '',
        productName: '',
        quantityRequested: '',
        unit: '',
        status: 'PENDING',
        description: '',
        price: 0
      }
    ]
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("distributor"));
    if (stored) {
      setDistributor(stored);
      setForm(prev => ({
        ...prev,
        distributorId: stored.id,
        deliveryTo: stored.address || ''
      }));
    }

    api.get("/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Failed to fetch products", err));
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [form.requestItems]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...form.requestItems];

    if (name === 'productName') {
      const product = products.find(p => p.name === value);
      if (product) {
        updatedItems[index].productName = product.name;
        updatedItems[index].productId = product.productId;
        updatedItems[index].price = product.price || 0;
      }
    } else {
      updatedItems[index][name] = value;
    }

    setForm({ ...form, requestItems: updatedItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      requestItems: [
        ...form.requestItems,
        {
          productId: '',
          productName: '',
          quantityRequested: '',
          unit: '',
          status: 'PENDING',
          description: '',
          price: 0
        }
      ]
    });
  };

  const removeItem = (index) => {
    const updatedItems = form.requestItems.filter((_, i) => i !== index);
    setForm({ ...form, requestItems: updatedItems });
  };

  
  const calculateTotals = () => {
    const subTotal = form.requestItems.reduce(
      (sum, item) => sum + (Number(item.price || 0) * Number(item.quantityRequested || 0)),
      0
    );

    const cgst = +(subTotal * 0.09).toFixed(2);
    const sgst = +(subTotal * 0.09).toFixed(2);
    const igst = +(subTotal * 0.18).toFixed(2);
    const finalValue = +(subTotal + cgst + sgst + igst).toFixed(2);

    setForm(prev => ({
      ...prev,
      subTotal,
      productValue: subTotal,
      cgst,
      sgst,
      igst,
      finalValue
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalQuantity = form.requestItems.reduce(
      (sum, item) => sum + Number(item.quantityRequested || 0),
      0
    );
    const totalItems = form.requestItems.length;

    const payload = {
      ...form,
      totalQuantity,
      totalItems
    };

    try {
      await api.post('/api/distributors/request', payload);
      Swal.fire('Success', 'Product request submitted successfully!', 'success');

       setForm({
      distributorId: distributor.id || '',
      requestDate: new Date().toISOString().split('T')[0],
      billingDate: new Date().toISOString().split('T')[0],
      priority: '',
      notes: '',
      requestedBy: '',
      salesPerson :'',
      branch : '',
      region:'',
      status:'ORDER_CREATED',
      deliveryTo: distributor.address || '',
      cgst: 0,
      sgst: 0,
      igst: 0,
      subTotal: 0,
      productValue: 0,
      finalValue: 0,
      requestItems: [
        {
          productId: '',
          productName: '',
          quantityRequested: '',
          unit: '',
          status: 'PENDING',
          description: '',
          price: 0
        }
      ]
    });

    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      Swal.fire('Error', 'Failed to submit product request.', 'error');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Create Product Request</h2>
      <form className={styles.form} onSubmit={handleSubmit}>

        {/* Distributor Info */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Distributor Information</h3>
          <div className={styles.grid}>
            <label>Distributor ID</label>
            <input type="text" value={distributor.id} readOnly />
            <label>Distributor Name</label>
            <input type="text" value={distributor.name} readOnly />
            <label>Region</label>
            <input type="text" placeholder="Enter the Region" name="region" value={form.region} onChange={handleChange} required />

            <label>Branch</label>
            <input type="text" placeholder="Enter the branch" name="branch" value={form.branch} onChange={handleChange} required />

          </div>
        </div>

        {/* Request Details */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Request Details</h3>
          <div className={styles.grid}>
            <label>Request Date</label>
            <input type="date" name="requestDate" value={form.requestDate} onChange={handleChange} required />
            <label>Billing Date</label>
            <input type="date" name="billingDate" value={form.billingDate} onChange={handleChange} required />
            
            <label>Sales Person</label>
            <input type="text" placeholder="Enter Sales Person Id" name="salesPerson" value={form.salesPerson} onChange={handleChange} required />

             <label>Requested By</label>
            <input type="text" name="requestedBy" value={form.requestedBy} onChange={handleChange} required />

            <label>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} required>
              <option value="">-- Select --</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
        </div>

        {/* Delivery */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Delivery Information</h3>
          <div className={styles.grid}>
            <label>Delivery Address</label>
            <input type="text" name="deliveryTo" value={form.deliveryTo} readOnly />
          </div>
        </div>

        {/* Notes */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Notes</h3>
          <textarea className={styles.textarea} name="notes" value={form.notes} onChange={handleChange} rows="2" placeholder="Add any notes..." />
        </div>

        {/* Items */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Request Items</h3>
          {form.requestItems.map((item, index) => (
            <div key={index} className={styles.itemRow}>
              <select name="productName" value={item.productName} onChange={(e) => handleItemChange(index, e)} required>
                <option value="">-- Select Product --</option>
                {products.map((p) => (
                  <option key={p.productId} value={p.name}>{p.name}</option>
                ))}
              </select>
              <input type="text" name="productId" placeholder="Product ID" value={item.productId} readOnly />
              <input type="number" name="quantityRequested" placeholder="Qty" value={item.quantityRequested} onChange={(e) => handleItemChange(index, e)} required />
              <input type="text" name="unit" placeholder="Unit" value={item.unit} onChange={(e) => handleItemChange(index, e)} />
              <input type="number" name="price" placeholder="Price" value={item.price} readOnly />
              <input type="text" name="description" placeholder="Description" value={item.description} onChange={(e) => handleItemChange(index, e)} />
              <button type="button" onClick={() => removeItem(index)} className={styles.removeBtn}>❌</button>
            </div>
          ))}
          <button type="button" className={styles.addBtn} onClick={addItem}>➕ Add Product</button>
        </div>

        {/* Totals */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Totals</h3>
          <div className={styles.totals}>
            <p><strong>Subtotal:</strong> ₹{form.subTotal.toFixed(2)}</p>
            <p><strong>CGST (9%):</strong> ₹{form.cgst.toFixed(2)}</p>
            <p><strong>SGST (9%):</strong> ₹{form.sgst.toFixed(2)}</p>
            <p><strong>IGST (18%):</strong> ₹{form.igst.toFixed(2)}</p>
            <p className={styles.finalTotal}><strong>Final Total:</strong> ₹{form.finalValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Submit */}
        <div className={styles.footer}>
          <button type="submit" className={styles.submitBtn}>Submit Request</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductRequest;
