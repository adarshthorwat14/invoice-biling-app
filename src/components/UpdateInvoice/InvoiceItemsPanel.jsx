import React, { useEffect, useState } from 'react';
import styles from './InvoiceItemsPanel.module.css';
import axios from 'axios';

const InvoiceItemsPanel = ({ invoiceItems, setInvoiceItems, totalAmount, setTotalAmount, onCreateInvoice }) => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);

  const selectedProduct = products.find(p => p.productId === selectedProductId);

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Error fetching products", err));
  }, []);

  useEffect(() => {
    const total = invoiceItems.reduce((sum, item) => sum + item.subtotal, 0);
    setTotalAmount(total);
  }, [invoiceItems]);

  const handleAddItem = () => {
    if (!selectedProduct) return alert("Select a product");
    if (quantity < 1) return alert("Quantity must be at least 1");

    const price = selectedProduct.price;
    const subtotal = (price * quantity) - ((discount / 100) * price * quantity);

    const newItem = {
      productId: selectedProduct.productId,
      productName: selectedProduct.name,
      description: selectedProduct.description,
      quantity,
      discount,
      price,
      subtotal,
    };

    setInvoiceItems([...invoiceItems, newItem]);
    setSelectedProductId('');
    setQuantity(1);
    setDiscount(0);
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Invoice Items</h2>

      <div className={styles.inputRow}>
        <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
          <option value="">-- Select Product --</option>
          {products.map(p => (
            <option key={p.productId} value={p.productId}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Qty"
          min="1"
          value={quantity}
          onChange={e => setQuantity(Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Discount %"
          value={discount}
          onChange={e => setDiscount(Number(e.target.value))}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      <table className={styles.itemTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Discount</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.productName}</td>
              <td>{item.quantity}</td>
              <td>{item.discount}%</td>
              <td>₹{item.price}</td>
              <td>₹{item.subtotal.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.totalDisplay}>
        <strong>Total Amount: ₹{totalAmount.toFixed(2)}</strong>
        <button onClick={onCreateInvoice}>Create Invoice</button>
      </div>
    </div>
  );
};

export default InvoiceItemsPanel;
