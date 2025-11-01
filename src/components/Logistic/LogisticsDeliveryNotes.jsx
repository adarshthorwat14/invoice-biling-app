import React, { useEffect, useState } from 'react';
import styles from './LogisticsDeliveryNotes.module.css';
import api from '../../api/axiosConfig';

const LogisticsDeliveryNotes = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleRequestData, setVehicleRequestData] = useState({});
  const [vehicleSectionVisible, setVehicleSectionVisible] = useState(null);

  useEffect(() => {
    fetchPlants();
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (selectedPlant) {
      fetchDeliveryNotesByPlant(selectedPlant);
    }
  }, [selectedPlant]);

  const fetchPlants = async () => {
    try {
      const res = await api.get('/api/plants');
      setPlants(res.data);
    } catch (err) {
      console.error('Failed to fetch plants:', err);
    }
  };

  const fetchDeliveryNotesByPlant = async (plantName) => {
    try {
      const res = await api.get(
        `/api/plants/${encodeURIComponent(plantName)}/delivery-notes`
      );
      const sortedNotes = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setDeliveryNotes(sortedNotes.slice(0, 10));
    } catch (err) {
      console.error('Failed to fetch delivery notes by plant:', err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await api.get('/api/logistics/vehicles/available');
      setVehicles(res.data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    }
  };

  const handleVehicleChange = (deliveryNoteId, vehicleNumber) => {
    const selectedVehicle = vehicles.find(v => v.vehicleNumber === vehicleNumber);
    if (selectedVehicle) {
      setVehicleRequestData(prev => ({
        ...prev,
        [deliveryNoteId]: {
          ...prev[deliveryNoteId],
          vehicleNumber: selectedVehicle.vehicleNumber,
          driverName: selectedVehicle.driverName,
          fromLocation: selectedVehicle.from,
          toLocation: selectedVehicle.to,
          capacity: selectedVehicle.capacity,
          status: selectedVehicle.status,
          vehicleType: selectedVehicle.vehicleType
        }
      }));
    }
  };

  const handleInputChange = (deliveryNoteId, field, value) => {
    setVehicleRequestData(prev => {
      const current = prev[deliveryNoteId] || {};
      const updated = {
        ...current,
        [field]: value
      };

      const km = parseFloat(updated.km || 0);
      const rate = parseFloat(updated.perKmRate || 0);
      updated.totalAmount = km * rate;

      return {
        ...prev,
        [deliveryNoteId]: updated
      };
    });
  };

  const handleRequestVehicle = async (note) => {
    const data = vehicleRequestData[note.deliveryNoteId];
    if (!data) return;

    try {
      await api.post('/api/vehicle/vehicle-requests/create', {
        requestId: note.requestId,
        transportId: data.transportId,
        vehicleNumber: data.vehicleNumber,
        driverName: data.driverName,
        fromLocation: `BEUNIQUE PLANT - ${note.plantName}`, // ✅ updated
        toLocation: note.toLocation,
        km: data.km,
        perKmRate: data.perKmRate,
        totalAmount: data.totalAmount,
        status: "FORWARDED"
      });

      alert('Vehicle requested successfully!');
      setVehicleSectionVisible(null);
    } catch (err) {
      console.error('Vehicle request failed:', err);
      alert('Failed to request vehicle.');
    }
  };

  // ✅ Split notes by status
  const createdNotes = deliveryNotes.filter(n => n.status === 'DELIVERY_CREATED');
  const processNotes = deliveryNotes.filter(n => n.status === 'PROCESS');
  const dispatchNotes = deliveryNotes.filter(n => n.status === 'DISPATCHED');

  const renderTable = (notes, title, showActions = false) => (
  <div className={styles.tableWrapper}>
    <h3>{title}</h3>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Date</th>
          <th>Delivery Note ID</th>
          <th>Request ID</th>
          <th>Distributor ID</th>
          <th>Distributor Name</th>
          <th>Status</th>
          {showActions && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {notes.map((note, index) => (
          <React.Fragment key={note.deliveryNoteId}>
            <tr>
              <td>{note.date}</td>
              <td>{note.deliveryNoteId}</td>
              <td>{note.requestId}</td>
              <td>{note.distributorId}</td>
              <td>{note.distributorName}</td>
              <td>{note.status}</td>
              {showActions && (
                <td>
                  <button onClick={() => setExpandedRow(expandedRow === index ? null : index)}>
                    {expandedRow === index ? 'Hide' : 'Check'}
                  </button>
                </td>
              )}
            </tr>

              {showActions && expandedRow === index && (
              <tr className={styles.detailsRow}>
                <td colSpan="7">
                    <div className={styles.detailsWrapper}>
                      <div className={styles.tableSection}>
                        <h4>Delivery Note Details</h4>
                        <table>
                          <tbody>
                            <tr><td>Delivery Note ID:</td><td>{note.deliveryNoteId}</td></tr>
                            <tr><td>Request ID:</td><td>{note.requestId}</td></tr>
                            <tr><td>Distributor ID:</td><td>{note.distributorId}</td></tr>
                            <tr><td>Distributor Name:</td><td>{note.distributorName}</td></tr>
                            <tr><td>Plant Name:</td><td>{note.plantName}</td></tr>
                          </tbody>
                        </table>
                      </div>

                      <div className={styles.tableSection}>
                        <h4>Product Details</h4>
                        <table>
                          <tbody>
                            <tr><td>Product ID:</td><td>{note.productId}</td></tr>
                            <tr><td>Product Name:</td><td>{note.productName}</td></tr>
                            <tr><td>Quantity:</td><td>{note.quantity}</td></tr>
                            <tr><td>Unit:</td><td>{note.unit}</td></tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className={styles.locationTable}>
                      <h4>Delivery</h4>
                      <p>
                        <strong>From:</strong> BEUNIQUE PLANT - {note.plantName} ➡ <strong>To:</strong> {note.toLocation}
                      </p>
                    </div>

                    <div className={styles.actionButtons}>
                      <button className={styles.hold}>⏸ Hold Order</button>
                      <button
                        className={styles.dispatch}
                        onClick={() => setVehicleSectionVisible(vehicleSectionVisible === index ? null : index)}
                      >
                        🚚 Arrange Vehicle
                      </button>
                    </div>

                    {vehicleSectionVisible === index && (
                      <div className={styles.vehicleForm}>
                        <h4>Arrange Vehicle</h4>

                        <select
                          onChange={(e) => handleVehicleChange(note.deliveryNoteId, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Select Vehicle</option>
                          {vehicles.map(vehicle => (
                            <option key={vehicle.vehicleNumber} value={vehicle.vehicleNumber}>
                              {vehicle.vehicleNumber} - {vehicle.driverName}
                            </option>
                          ))}
                        </select>

                        <div className={styles.vehicleInputs}>
                          <div className={styles.inputGroup}>
                            <label>Vehicle Status</label>
                            <input
                              type="text"
                              readOnly
                              value={vehicleRequestData[note.deliveryNoteId]?.status || ''}
                            />
                            <label>Vehicle Type</label>
                            <input
                              type="text"
                              readOnly
                              value={vehicleRequestData[note.deliveryNoteId]?.vehicleType || ''}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label>Weight (kg)</label>
                            <input
                              type="number"
                              onChange={(e) => handleInputChange(note.deliveryNoteId, 'weight', e.target.value)}
                            />
                            <label>Capacity (kg)</label>
                            <input
                              type="text"
                              readOnly
                              value={vehicleRequestData[note.deliveryNoteId]?.capacity ? `${vehicleRequestData[note.deliveryNoteId].capacity} Tonne` : ''}
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label>Distance (Km)</label>
                            <input
                              type="number"
                              onChange={(e) => handleInputChange(note.deliveryNoteId, 'km', e.target.value)}
                            />
                            <label>Rate per Km</label>
                            <input
                              type="number"
                              onChange={(e) => handleInputChange(note.deliveryNoteId, 'perKmRate', e.target.value)}
                            />
                          </div>
                        </div>

                        <p>
                          Total Amount: ₹{(
                            (vehicleRequestData[note.deliveryNoteId]?.km || 0) *
                            (vehicleRequestData[note.deliveryNoteId]?.perKmRate || 0)
                          ).toFixed(2)}
                        </p>

                        <button className={styles.requestBtn} onClick={() => handleRequestVehicle(note)}>
                          Request Vehicle
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Logistics - Delivery Notes</h2>

      <div className={styles.dropdownWrapper}>
        <label htmlFor="plantSelect">Select Plant:</label>
        <select
          id="plantSelect"
          value={selectedPlant}
          onChange={(e) => setSelectedPlant(e.target.value)}
        >
          <option value="">-- Choose Plant --</option>
          {plants.map(plant => (
            <option key={plant.plantId} value={plant.name}>
              {plant.name}
            </option>
          ))}
        </select>
      </div>

      {selectedPlant && (
          <>
            {renderTable(createdNotes, '🚀 Delivery Created', true)}
            {renderTable(processNotes, '⚙️ In Process', false)}
            {renderTable(dispatchNotes, '🚗 Dispatched', false)}
          </>
        )}
    </div>
  );
};

export default LogisticsDeliveryNotes;
