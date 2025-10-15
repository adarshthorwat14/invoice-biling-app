      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Your Cart</h3>
            <div className={styles.cartInfo}>
              <div className={styles.inputGroup}>
                <label>Client ID</label>
                <input value={orderDetails.clientId} readOnly />
              </div>
              <div className={styles.inputGroup}>
                <label>Client Name</label>
                <input value={clientName} readOnly />
              </div>
              <div className={styles.inputGroup}>
                <label>Invoice Date:</label>
                <input
                  type="date"
                  name="invoiceDate"
                  value={orderDetails.invoiceDate}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Due Date:</label>
                <input
                  type="date"
                  name="dueDate"
                  value={orderDetails.dueDate}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Global Discount (%)</label>
                <input
                  type="number"
                  name="globalDiscount"
                  value={orderDetails.globalDiscount}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Global Tax (%)</label>
                <input
                  type="number"
                  name="globalTax"
                  value={orderDetails.globalTax}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Notes:</label>
                <textarea
                  name="notes"
                  value={orderDetails.notes}
                  onChange={handleChange}
                  rows="2"
                />
              </div>
            </div>

            <table className={styles.invoiceTable}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Disc %</th>
                  <th>Tax %</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceItems.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.discount}
                        onChange={(e) =>
                          updateItemField(
                            item.productId,
                            "discount",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        value={item.taxRate}
                        onChange={(e) =>
                          updateItemField(
                            item.productId,
                            "taxRate",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>₹{item.total.toFixed(2)}</td>
                    <td>
                      <button onClick={() => removeItem(item.productId)}>
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.modalFooter}>
              <div className={styles.totalRow}>
                <label>
                  <b>Subtotal:</b>
                </label>
                <span>₹{subtotal}</span>
              </div>

              <div className={styles.totalRow}>
                <label>
                  <b>After Discount:</b>
                </label>
                <span>₹{afterDiscount.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <label>
                  <b>Total Payable:</b>
                </label>
                <span> ₹{totalPay.toFixed(2)}</span>
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.modalButtons}>
                  <button onClick={submitOrder} className={styles.submitBtn}>
                    ✅ Create Invoice
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className={styles.closeBtn}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}