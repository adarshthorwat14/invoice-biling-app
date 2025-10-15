import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UpdateProduct.css';

const UpdateProduct = () => {
  const [productId, setProductId] = useState('');
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    mrp: '',
    rdp: '',
    description: '',
    stockQuantity: '',
    unitOfMeasure: '',
    batchNumber: '',
    mfgDate: '',
    expiryDate: '',
    barcode: '',
    plant: { plantId: '' },
    hsn: { hsnCode: '' },
    img: ''
  });

  const [productFound, setProductFound] = useState(false);
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [plants, setPlants] = useState([]);
  const [hsns, setHsns] = useState([]);

  // Fetch all plants and hsn codes on mount
  useEffect(() => {
    axios.get('http://localhost:8080/api/plants')
      .then(res => setPlants(res.data))
      .catch(err => console.error('Error fetching plants:', err));

    axios.get('http://localhost:8080/api/hsn')
      .then(res => setHsns(res.data))
      .catch(err => console.error('Error fetching HSNs:', err));
  }, []);

  const handleSearch = async () => {
    if (!productId.trim()) {
      setMessage('Please enter a valid Product ID');
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/products/${productId}`);
      const product = res.data;

      setProductData({
        ...product,
        plant: product.plant || { plantId: '' },
        hsn: product.hsn || { hsnCode: '' }
      });

      setImagePreview(product.img || '');
      setProductFound(true);
      setMessage('');
    } catch (error) {
      setMessage('Product not found!');
      setProductFound(false);
      setProductData({
        name: '',
        price: '',
        mrp: '',
        rdp: '',
        description: '',
        stockQuantity: '',
        unitOfMeasure: '',
        batchNumber: '',
        mfgDate: '',
        expiryDate: '',
        barcode: '',
        plant: { plantId: '' },
        hsn: { hsnCode: '' },
        img: ''
      });
      setImagePreview('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'plantId') {
      setProductData(prev => ({ ...prev, plant: { plantId: value } }));
    } else if (name === 'hsnCode') {
      setProductData(prev => ({ ...prev, hsn: { hsnCode: value } }));
    } else {
      setProductData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8080/api/products/upload', formData);
      setProductData(prev => ({ ...prev, img: res.data }));
      setMessage('Image uploaded successfully!');
    } catch (error) {
      console.error('Image upload failed', error);
      setMessage('Failed to upload image');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/products/update/${productId}`, productData);
      setMessage('Product updated successfully!');
      setProductFound(false);
      setProductId('');
    } catch (error) {
      console.error(error);
      setMessage('Failed to update product.');
    }
  };

  return (
    <div className="update-product-container">
      <h2>Update Product</h2>

      {!productFound && (
        <div className="search-section">
          <label>Enter Product ID:</label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="e.g., PR00001"
          />
          <button onClick={handleSearch} className="btn primary">Search</button>
        </div>
      )}

      {productFound && (
        <div className="update-content">
          <div className="form-container">
            <div className="form-group">
              <label>Name:</label>
              <input name="name" value={productData.name} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Price:</label>
              <input type="number" name="price" value={productData.price} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>MRP:</label>
              <input type="number" name="mrp" value={productData.mrp} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>RDP:</label>
              <input type="number" name="rdp" value={productData.rdp} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <input name="description" value={productData.description} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Stock Quantity:</label>
              <input type="number" name="stockQuantity" value={productData.stockQuantity} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Unit of Measure:</label>
              <input name="unitOfMeasure" value={productData.unitOfMeasure} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Batch Number:</label>
              <input name="batchNumber" value={productData.batchNumber} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>MFG Date:</label>
              <input type="date" name="mfgDate" value={productData.mfgDate} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Expiry Date:</label>
              <input type="date" name="expiryDate" value={productData.expiryDate} onChange={handleChange} />
            </div>

            
            <div className="form-group">
              <label>Barcode:</label>
              <input name="barcode" value={productData.barcode} readOnly />
            </div>

            <div className="form-group">
              <label>Plant:</label>
              <select name="plantId" value={productData.plant.plantId} onChange={handleChange}>
                <option value="">-- Select Plant --</option>
                {plants.map(p => (
                  <option key={p.plantId} value={p.plantId}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>HSN Code:</label>
              <select name="hsnCode" value={productData.hsn.code} onChange={handleChange}>
                <option value="">-- Select HSN --</option>
                {hsns.map(h => (
                  <option key={h.code} value={h.code}>{h.code} - {h.description}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Upload Image:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <button onClick={handleUpdate} className="btn primary">Update Product</button>
          </div>

          <div className="image-container">
            <p>Product Image:</p>
            {imagePreview ? (
              <img src={imagePreview} alt="Product" />
            ) : (
              <div className="image-placeholder">No image</div>
            )}
          </div>
        </div>
      )}

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default UpdateProduct;
