import React, { useEffect, useState } from 'react';
import './VehicleRequestApprovals.css';
import api from '../../api/axiosConfig';

const VehicleRequestApprovals = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const requestsPerPage = 10;
  const[vehicleRequest,setVehicleRequests] = useState();
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/api/vehicle/pending/request');
      setRequests(res.data);
      console.log
    } catch (err) {
      console.error('Failed to fetch vehicle requests:', err);
    }
  };

const approveRequest = async (transportId) => {
  try {
    await api.post(
      `/api/vehicle/vehicle-requests/approve?transportId=${encodeURIComponent(transportId)}`
    );

    // ✅ Remove the approved request from the UI
    setVehicleRequests(prev =>
      prev.filter(request => request.transportId !== transportId)
    );

    alert("Request approved and removed from the list!");
  } catch (err) {
    console.error("Approval failed:", err);
    alert("Failed to approve request.");
  }
};



  const indexOfLast = currentPage * requestsPerPage;
  const indexOfFirst = indexOfLast - requestsPerPage;
  const currentRequests = requests.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(requests.length / requestsPerPage);

  return (
    <div className="vehicle-request-container">
      <h2 className="title">Vehicle Requests Approval</h2>

      <table className="animated-table">
        <thead>
          <tr>
            <th>Transport ID</th>
            <th>Request ID</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>From</th>
            <th>To</th>
            <th>Km</th>
            <th>Rate/Km</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.map(req => (
            <tr key={req.transportId}>
              <td>{req.transportId}</td>
              <td>{req.requestId}</td>
              <td>{req.vehicleNumber}</td>
              <td>{req.driverName}</td>
              <td>{req.fromLocation}</td>
              <td>{req.toLocation}</td>
              <td>{req.km}</td>
              <td>{req.perKmRate}</td>
              <td>{req.totalAmount}</td>
              <td>{req.status}</td>
              <td>
                {req.status === 'FORWARDED' && (
                  <button onClick={() => approveRequest(req.transportId)}>
                    Approve
                    </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          ⬅ Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default VehicleRequestApprovals;
