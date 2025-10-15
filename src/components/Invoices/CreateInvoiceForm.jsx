import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./CreateInvoiceForm.module.css";

const CreateInvoiceForm = () => {
  const [distributors, setDistributors] = useState([]);
  const [selectedDistributor, setSelectedDistributor] = useState("");
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [stockMap, setStockMap] = useState({});
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [plantId, setPlantId] = useState('');
  const [plantName, setPlantName] = useState('');
  const [plantList, setPlantList] = useState([]);

  const [orderDetails, setOrderDetails] = useState({
    clientId: "",
    distributorId: "",
    invoiceDate: "",
    dueDate: "",
    notes: "",
    paymentStatus: "UNPAID",
    paymentMethod: "CARD",
    generatedBy: "Admin",
    globalDiscount: 0,
    globalTax: 0,
    plantId : "",
  });
  const [clientName, setClientName] = useState("");

      useEffect(() => {
      axios.get('http://localhost:8080/api/plants')
        .then(res => setPlantList(res.data))
        .catch(err => console.error('Failed to fetch plants', err));
    }, []);  

  useEffect(() => {
    axios.get("http://localhost:8080/api/distributors")
      .then(res => setDistributors(res.data))
      .catch(err => console.error("Error loading distributors", err));
  }, []);

  useEffect(() => {
    if (selectedDistributor) {
      setOrderDetails((prev) => ({ ...prev, distributorId: selectedDistributor }));

      axios.get("http://localhost:8080/api/clients")
        .then((res) => setClients(res.data));

      axios.get("http://localhost:8080/api/products")
        .then((res) => setProducts(res.data));

      axios.get(`http://localhost:8080/api/distributors/stock/${selectedDistributor}`)
        .then((res) => {
          const map = {};
          res.data.forEach(item => {
            map[item.productId] = item.totalAllocated;
          });
          setStockMap(map);
        })
        .catch(err => console.error("Error loading distributor stock", err));
    }

    const stored = localStorage.getItem("client");
    if (stored) {
      const c = JSON.parse(stored);
      setOrderDetails((d) => ({ ...d, clientId: c.id }));
      setClientName(c.name);
    }
  }, [selectedDistributor]);

  const calculateTotal = (price, qty, discount, tax) => {
    const base = price * qty;
    const afterDiscount = base * (1 - discount / 100);
    return afterDiscount * (1 + tax / 100);
  };

  const addToCart = (product) => {
    const existing = invoiceItems.find(
      (item) => item.productId === product.productId
    );
    if (existing) return;

    const availableStock = stockMap[product.productId] || 0;
    if (availableStock <= 0) {
      Swal.fire(
        "Out of Stock",
        "This product is not available in stock",
        "error"
      );
      return;
    }

    const newItem = {
      ...product,
      quantity: 1,
      discount: 0,
      taxRate: 0,
      total: calculateTotal(product.price, 1, 0, 0),
    };

    setInvoiceItems([...invoiceItems, newItem]);
    setStockMap(prev => ({
      ...prev,
      [product.productId]: prev[product.productId] - 1
    }));
  };

  const updateQuantity = (productId, amount) => {
    const updated = invoiceItems.map((item) => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + amount);
        const availableStock = (stockMap[productId] || 0) + item.quantity;

        if (newQty > availableStock) {
          Swal.fire("Oops", "Not enough stock available", "warning");
          return item;
        }

        const stockChange = newQty - item.quantity;
        setStockMap(prev => ({
          ...prev,
          [productId]: prev[productId] - stockChange
        }));

        return {
          ...item,
          quantity: newQty,
          total: calculateTotal(
            item.price,
            newQty,
            item.discount,
            item.taxRate
          ),
        };
      }
      return item;
    });

    setInvoiceItems(updated);
  };

  const updateItemField = (id, field, value) => {
    setInvoiceItems((prev) =>
      prev.map((item) => {
        if (item.productId === id) {
          const updated = {
            ...item,
            [field]: parseFloat(value),
          };
          updated.total = calculateTotal(
            updated.price,
            updated.quantity,
            updated.discount,
            updated.taxRate
          );
          return updated;
        }
        return item;
      })
    );
  };

  const handlePlantChange = (e) => {
  const selectedId = e.target.value;
  setPlantId(selectedId);
  const selectedPlant = plantList.find(p => p.plantId === selectedId);
  setPlantName(selectedPlant?.plantName || '');
};

  const removeItem = (productId) => {
    const item = invoiceItems.find((i) => i.productId === productId);
    if (!item) return;

    setStockMap(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + item.quantity
    }));

    setInvoiceItems(invoiceItems.filter((i) => i.productId !== productId));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((d) => ({ ...d, [name]: value }));
  };

  const subtotal = invoiceItems.reduce((sum, i) => sum + i.total, 0);
  const globalDiscAmount = subtotal * (orderDetails.globalDiscount / 100);
  const afterDiscount = subtotal - globalDiscAmount;
  const globalTaxAmount = afterDiscount * (orderDetails.globalTax / 100);
  const totalPay = afterDiscount + globalTaxAmount;

  const submitOrder = async () => {
    if (!orderDetails.distributorId || !orderDetails.clientId || invoiceItems.length === 0) {
      Swal.fire("Error", "Distributor, client not selected or cart empty", "error");
      return;
    }

    const payload = {
      distributorId: orderDetails.distributorId,
      clientId: orderDetails.clientId,
      invoiceDate:
        orderDetails.invoiceDate || new Date().toISOString().split("T")[0],
      dueDate: orderDetails.dueDate,
      paymentStatus: orderDetails.paymentStatus,
      paymentMethod: orderDetails.paymentMethod,
      notes: orderDetails.notes,
      generatedBy: orderDetails.generatedBy,
      globalDiscount: orderDetails.globalDiscount,
      globalTax: orderDetails.globalTax,
      plantId: orderDetails.plantId,
      invoiceItems: invoiceItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        taxRate: item.taxRate,
        description: item.description || null,
      })),
    };

    try {
      await axios.post("http://localhost:8080/api/invoices", payload);
      Swal.fire("Success", "Invoice created", "success");
      setInvoiceItems([]);
      setOrderDetails({
        clientId: "",
        distributorId: "",
        invoiceDate: "",
        dueDate: "",
        notes: "",
        plantId : "",
        paymentStatus: "UNPAID",
        paymentMethod: "CARD",
        generatedBy: "Admin",
        globalDiscount: 0,
        globalTax: 0,
      });
      setModalOpen(false);
      setSelectedDistributor("");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to create invoice", "error");
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Create Order</h2>
        <div className={styles.distributorSelectBox}>
          <label>Select Distributor:</label>
          <select
            value={selectedDistributor}
            onChange={(e) => setSelectedDistributor(e.target.value)}
          >
            <option value="">-- Choose Distributor --</option>
            {distributors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id}
              </option>
            ))}
          </select>
        </div>
        {selectedDistributor && (
          <button
            className={styles.viewCartBtn}
            onClick={() => setModalOpen(true)}
          >
            🛒 View Cart ({invoiceItems.length})
          </button>
        )}
      </div>

      {selectedDistributor && (
        <div className={styles.productList}>
          {products.map((product) => {
            const item = invoiceItems.find(
              (i) => i.productId === product.productId
            );
            const availableStock = stockMap[product.productId] || 0;

            return (
              <div key={product.productId} className={styles.productCard}>
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p>Price: ₹{product.price}</p>
                  {availableStock === 0 ? (
                    <p className={styles.outOfStock}>Stock: Out of Stock</p>
                  ) : (
                    <p>Stock: {availableStock}</p>
                  )}
                </div>
                <div className={styles.productImage}>
                  <img src={product.img} alt={product.name} />
                </div>
                {availableStock === 0 ? (
                  <div className={styles.outOfStock}>
                    ❌ Cannot Add — Out of Stock
                  </div>
                ) : item ? (
                  <div className={styles.qtyControl}>
                    <button onClick={() => updateQuantity(product.productId, -1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.productId, 1)}
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className={styles.addBtn}
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CODE REMAINS UNCHANGED */}

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
              <label>Select Plant:</label>
              <select
                name="plantId"
                value={orderDetails.plantId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setOrderDetails((prev) => ({ ...prev, plantId: selectedId }));
                  const selectedPlant = plantList.find(p => p.plantId === selectedId);
                  setPlantName(selectedPlant?.name || '');
                }}
              >
                <option value="">-- Select Plant --</option>
                {plantList.map((plant) => (
                  <option key={plant.plantId} value={plant.plantId}>
                    {plant.plantId}
                  </option>
                ))}
              </select>
            </div>
              <div className={styles.inputGroup}>
                <label>Plant Name:</label>
                <input type="text" value={plantName} readOnly />
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
    </div>
  );
};

export default CreateInvoiceForm;
