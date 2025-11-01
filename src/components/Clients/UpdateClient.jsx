import React, { useState } from "react";

import "./UpdateClient.css";
import Swal from "sweetalert2";
import api from "../../api/axiosConfig";

const UpdateClient = () => {
  const [clientId, setClientId] = useState("");
  const [client, setClient] = useState(null);
  const [message, setMessage] = useState("");

  const fetchClient = async () => {
    try {
      const res = await api.get(
        `/api/clients/${clientId}`
      );
      setClient(res.data);
      setMessage("");
    } catch {
      setClient(null);
      setMessage("Client not found");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/clients/${clientId}`, client);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Client updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
      setClientId("");
      setClient(null);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Update failed. Please try again.",
      });
    }
  };

  return (
    <div className="update-client-container">
      <h2>Update Client</h2>

      <div className="search-bar form-row">
        <input
          type="text"
          placeholder="Enter Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
        <button onClick={fetchClient}>Search</button>
      </div>

      {message && <p className="message">{message}</p>}

      {client && (
        <form className="update-form" onSubmit={handleUpdate}>
          <div className="form-row">
            <div>
              <label>Name</label>
              <input
                name="name"
                value={client.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Email</label>
              <input
                name="email"
                value={client.email}
                onChange={handleChange}
                required
              />
            </div>
              <div>
              <label>Password</label>
              <input
                name="password"
                value={client.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Phone</label>
              <input
                name="phone"
                value={client.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Address</label>
              <input
                name="address"
                value={client.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>City</label>
              <input
                name="city"
                value={client.city || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Pincode</label>
              <input
                name="pincode"
                value={client.pincode || ""}
                onChange={handleChange}
                maxLength={6}
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>District</label>
              <input
                name="district"
                value={client.district || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>State</label>
              <input
                name="state"
                value={client.state || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>PAN Card</label>
              <input
                name="pancard"
                value={client.pancard || ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>GST</label>
              <input
                name="gst"
                value={client.gst || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label>Aadhar Card</label>
              <input
                name="adharCard"
                value={client.adharCard || ""}
                onChange={handleChange}
                maxLength={12}
              />
            </div>
            <div>
              <label>Status</label>
              <select
                name="status"
                value={client.status ? "true" : "false"}
                onChange={(e) =>
                  setClient({ ...client, status: e.target.value === "true" })
                }
                required
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>

          <button type="submit" className="update-btn">
            Update Client
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdateClient;
