import React, { useEffect, useState } from "react";
import styles from "./ClientStockHistory.module.css"; // Create a new CSS module
import api from '../../api/axiosConfig';
const ClientStockHistory = () => {
  const distributor = JSON.parse(localStorage.getItem("distributor"));
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (distributor?.id) {
      api.get(`/api/invoices/distributor/${distributor.id}`)
        .then((res) => setInvoices(res.data))
        .catch((err) => console.error("Error loading invoice history", err));
    }
  }, [distributor]);

  return (
    <div className={styles.container}>
     <h2>Client Stock History</h2>
{invoices.length === 0 ? (
  <p>No stock delivered to any client yet.</p>
) : (
 <div className={styles.tableWrapper}>
  <table className={styles.historyTable}>
    <thead>
      <tr>
        <th>Invoice ID</th>
        <th>Client ID</th>
        <th>Client Name</th>
        <th>Invoice Date</th>
        <th>Product Name</th>
        <th>Invoice Quantity</th>
        <th>Price(₹)</th>
        <th>Material Value (₹)</th>
        <th>Total Amount (₹)</th>
        <th>Total Payable (₹)</th>
        <th>Global Tax (%)</th>
        <th>Global Discount (%)</th>
        <th>Payment Status</th>
      </tr>
    </thead>
    <tbody>
      {invoices.map((item, index) =>
        item.products.map((p, i) => (
          <tr key={`${index}-${i}`}>
            {i === 0 && (
              <>
                <td rowSpan={item.products.length}>{item.invoiceId}</td>
                <td rowSpan={item.products.length}>{item.clientId}</td>
                <td rowSpan={item.products.length}>{item.clientName}</td>
                <td rowSpan={item.products.length}>{item.invoiceDate}</td>
              </>
            )}
            <td>{p.productName}</td>
            <td>{p.quantity}</td>
            <td>₹{p.price?.toFixed(2) ?? "0.00"}</td>
            <td>₹{p.subtotal?.toFixed(2) ?? "0.00"}</td>
            {i === 0 && (
              <>
                <td rowSpan={item.products.length}>₹{item.totalAmount?.toFixed(2) ?? "0.00"}</td>
                <td rowSpan={item.products.length}>₹{item.totalPay?.toFixed(2) ?? "0.00"}</td>
                <td rowSpan={item.products.length}>{item.globalTax ?? 0}%</td>
                <td rowSpan={item.products.length}>{item.globalDiscount ?? 0}%</td>
                <td rowSpan={item.products.length}>{item.paymentStatus}</td>
              </>
            )}
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
)}
    </div>
  );
};

export default ClientStockHistory;
