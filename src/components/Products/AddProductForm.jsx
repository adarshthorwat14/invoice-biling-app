import React, { useEffect, useState } from "react";
import styles from "./AddProductForm.module.css";
import api from "../../api/axiosConfig";

const AddProductForm = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    img: "",
    batchNumber: "",
    expiryDate: "",
    hsnCode: "",
    mfgDate: "",
    unitOfMeasure: "",
    rdp: "",
    mrp: "",
    plantId: "", // temp select
  });

  const [plants, setPlants] = useState([]);
  const [hsnList, setHsnList] = useState([]);
  const [selectedPlants, setSelectedPlants] = useState([]); // [{plantId, name, stockQuantity}]
  const [submittedProduct, setSubmittedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api
      .get("/api/plants")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        const cleanPlants = data.map((p) => ({
          plantId: p.plantId,
          name: p.name,
          location: p.location,
          description: p.description,
        }));
        setPlants(cleanPlants);
      })
      .catch((err) => {
        console.error("Failed to fetch plants", err);
        setToast({ type: "error", message: "Failed to load plants." });
      });

    api
      .get("/api/hsn")
      .then((res) => setHsnList(res.data || []))
      .catch((err) => {
        console.error("Failed to fetch HSN codes", err);
        setToast({ type: "error", message: "Failed to load HSN codes." });
      });
  }, []);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleAddPlant = () => {
    if (!product.plantId) return;

    setSelectedPlants((prev) => {
      if (prev.some((p) => p.plantId === product.plantId)) return prev;
      const found = plants.find((p) => p.plantId === product.plantId);
      if (!found) return prev;

      return [
        ...prev,
        { plantId: found.plantId, name: found.name, stockQuantity: "" },
      ];
    });

    setProduct((prev) => ({ ...prev, plantId: "" }));
  };

  const handleRemovePlant = (plantId) => {
    const found = selectedPlants.find((p) => p.plantId === plantId);
    setSelectedPlants((prev) => prev.filter((p) => p.plantId !== plantId));
    if (found) setToast({ type: "success", message: `Removed ${found.name}` });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await api.post(
        "/api/products/upload",
        formData
      );
      setProduct((prev) => ({ ...prev, img: res.data }));
      setToast({ type: "success", message: "Image uploaded." });
    } catch (err) {
      console.error("Image upload failed", err);
      setToast({ type: "error", message: "Image upload failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedPlants.length === 0) {
      setToast({ type: "error", message: "Select at least one plant." });
      return;
    }

    for (const p of selectedPlants) {
      if (
        p.stockQuantity === "" ||
        isNaN(p.stockQuantity) ||
        Number(p.stockQuantity) < 0
      ) {
        setToast({ type: "error", message: `Enter valid stock for ${p.name}` });
        return;
      }
    }

    const preparedProduct = {
      name: product.name,
      description: product.description,
      price: product.price ? Number(product.price) : null,
      img: product.img || null,
      batchNumber: product.batchNumber || null,
      expiryDate: product.expiryDate || null,
      mfgDate: product.mfgDate || null,
      unitOfMeasure: product.unitOfMeasure || null,
      rdp: product.rdp ? Number(product.rdp) : null,
      mrp: product.mrp ? Number(product.mrp) : null,
      hsnCode: product.hsnCode || null, // ✅ send plain string
      plantStocks: selectedPlants.map((p) => ({
        plantId: p.plantId,
        stockQuantity: Number(p.stockQuantity),
      })),
    };

    try {
      setLoading(true);
      const res = await api.post(
        "/api/products",
        preparedProduct
      );
      setSubmittedProduct(res.data);
      setToast({ type: "success", message: "Product created successfully!" });

      setProduct({
        name: "",
        description: "",
        price: "",
        img: "",
        batchNumber: "",
        expiryDate: "",
        hsnCode: "",
        mfgDate: "",
        unitOfMeasure: "",
        rdp: "",
        mrp: "",
        plantId: "",
      });
      setSelectedPlants([]);
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error creating product." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {toast && (
        <div
          className={`${styles.toast} ${
            toast.type === "error" ? styles.toastError : styles.toastSuccess
          }`}
          onAnimationEnd={() => setToast(null)}
        >
          {toast.message}
        </div>
      )}

      <div className={styles.header}>
        <h2 className={styles.title}>Add Product</h2>
        <p className={styles.subtitle}>
          Create a new product and associate it with one or more plants.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Product info */}
        <div className={styles.row}>
          <label>
            Product Name
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Base Price
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={product.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            MRP
            <input
              type="number"
              name="mrp"
              min="0"
              step="0.01"
              value={product.mrp}
              onChange={handleChange}
            />
          </label>
          <label>
            RDP
            <input
              type="number"
              name="rdp"
              min="0"
              step="0.01"
              value={product.rdp}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className={styles.row}>
          <label>
            Manufacturing Date
            <input
              type="date"
              name="mfgDate"
              value={product.mfgDate}
              onChange={handleChange}
            />
          </label>
          <label>
            Expiry Date
            <input
              type="date"
              name="expiryDate"
              value={product.expiryDate}
              onChange={handleChange}
            />
          </label>
          <label>
            Unit of Measure
            <input
              type="text"
              name="unitOfMeasure"
              value={product.unitOfMeasure}
              onChange={handleChange}
              placeholder="e.g. PCS, KG"
            />
          </label>
          <label>
            Batch Number
            <input
              type="text"
              name="batchNumber"
              value={product.batchNumber}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.col2}>
            Product Description
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <div className={styles.row}>
          <label>
            HSN Code
            <select
              name="hsnCode"
              value={product.hsnCode}
              onChange={handleChange}
              required
            >
              <option value="">Select HSN Code</option>
              {hsnList.map((hsn) => (
                <option key={hsn.code} value={hsn.code}>
                  {hsn.code} - {hsn.description}
                </option>
              ))}
            </select>
          </label>
          <label>
            Product Image
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
          {product.img && (
            <div className={styles.previewWrap}>
              <img
                src={`https://billing-system-backendkj.onrender.com/uploads/uploads/${product.img}`}
                alt="Preview"
                className={styles.imagePreview}
              />
            </div>
          )}
        </div>

        {/* Plant selection */}
        <div className={styles.row}>
          <label>
            Select Plant
            <select
              name="plantId"
              value={product.plantId}
              onChange={handleChange}
            >
              <option value="">Select Plant</option>
              {plants.map((plant) => (
                <option key={plant.plantId} value={plant.plantId}>
                  {plant.name} ({plant.plantId})
                </option>
              ))}
            </select>
          </label>
          <div className={styles.addPlantBox}>
            <button
              type="button"
              className={styles.addBtn}
              onClick={handleAddPlant}
              disabled={!product.plantId}
            >
              + Add Plant
            </button>
            <span className={styles.hint}>
              Add one plant at a time. Selected plants appear below.
            </span>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? "Saving..." : "Add Product"}
        </button>
      </form>

      {/* Selected Plants Table */}
      {selectedPlants.length > 0 && (
        <div className={styles.selectedPlants}>
          <h4 className={styles.tableTitle}>Selected Plants</h4>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: 120 }}>Plant ID</th>
                  <th>Plant Name</th>
                  <th>Stock Quantity</th>
                  <th style={{ width: 120 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedPlants.map((plant) => (
                  <tr key={plant.plantId} className={styles.fadeInRow}>
                    <td>{plant.plantId}</td>
                    <td>{plant.name}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        className={styles.stockInput}
                        value={plant.stockQuantity ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedPlants((prev) =>
                            prev.map((p) =>
                              p.plantId === plant.plantId
                                ? { ...p, stockQuantity: val }
                                : p
                            )
                          );
                        }}
                        placeholder="Enter stock"
                        required
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => handleRemovePlant(plant.plantId)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                <tr className={styles.spacerRow}>
                  <td colSpan="4" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {submittedProduct && (
        <div className={styles.result}>
          <h4>✅ Product Created</h4>
          <p>
            <strong>Product ID:</strong> {submittedProduct.productId}
          </p>
          <p>
            <strong>Barcode:</strong> {submittedProduct.barcode}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddProductForm;

