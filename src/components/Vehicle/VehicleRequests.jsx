import React, { useEffect, useState, useRef } from "react";
import styles from "./VehicleRequestsPage.module.css";
import { FaEnvelope } from "react-icons/fa";

const VehicleRequests = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [forwardedRequests, setForwardedRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // ✅ Approved
    fetch("http://localhost:8080/api/vehicle/status/approved")
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => (b.requestId > a.requestId ? 1 : -1));
        setApprovedRequests(sorted);
      })
      .catch((err) => console.error("Error fetching approved:", err));

    // ✅ Forwarded
    fetch("http://localhost:8080/api/vehicle/pending/request")
      .then((res) => res.json())
      .then((data) => {
        const sorted = [...data].sort((a, b) => (b.requestId > a.requestId ? 1 : -1));
        setForwardedRequests(sorted);
      })
      .catch((err) => console.error("Error fetching forwarded:", err));

    // ✅ Notifications unread list
    fetch("http://localhost:8080/api/notifications/vehicle/approve/unread")
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Error fetching notifications:", err));

    // ✅ Unread count
    fetch("http://localhost:8080/api/notifications/vehicle/approve/count")
      .then((res) => res.json())
      .then((count) => setUnreadCount(count))
      .catch((err) => console.error("Error fetching unread count:", err));
  }, []);

  const markAsRead = (id) => {
    fetch(`http://localhost:8080/api/notifications/vehicle/approve/mark-read/${id}`, {
      method: "PUT",
    })
      .then(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      })
      .catch((err) => console.error("Error marking as read:", err));
  };



   useEffect(() => {
      const handleOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setOpenDropdown(false);
        }
      };
      document.addEventListener('mousedown', handleOutside);
      return () => document.removeEventListener('mousedown', handleOutside);
    }, []);
  // When opening, fetch the latest notifications
  const openAndLoad = () => {
    setOpenDropdown(true);
    fetchAllNotifications();
  };
  const toggleDropdown = () => {
    setOpenDropdown((prev) => {
      const next = !prev;
      if (next) fetchAllNotifications();
      return next;
    });
  };

  

  const renderTable = (title, requests, styleClass, emptyMsg) => (
    <div className={styles.tableWrapper}>
      <h3 className={`${styles.subHeading} ${styleClass}`}>{title}</h3>
      <div className={styles.scrollableTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Transport Id</th>
              <th>Request ID</th>
              <th>Vehicle Number</th>
              <th>Driver Name</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.noData}>
                  {emptyMsg}
                </td>
              </tr>
            ) : (
              requests.map((req, idx) => (
                <tr
                  key={req.requestId}
                  className={`${styles.rowHover} ${styles.rowFadeIn}`}
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <td>{req.transportId}</td>
                  <td>{req.requestId}</td>
                  <td>{req.vehicleNumber}</td>
                  <td>{req.driverName}</td>
                  <td>{req.fromLocation}</td>
                  <td>{req.toLocation}</td>
                  <td
                    className={
                      styleClass === styles.approvedHeading
                        ? styles.approved
                        : styles.forwarded
                    }
                  >
                    {req.status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* ===== Header with message icon ===== */}
      <div className={styles.headerRow} ref={dropdownRef}>
              <h2 className={styles.heading}>All Vehicle Requests Status</h2>
              <div
                className={styles.messageWrapper}
                onMouseEnter={openAndLoad}   // open on hover
              >
                <button
                  type="button"
                  className={styles.messageIconBtn}
                  onClick={toggleDropdown}   // open/close on click
                  aria-label="Messages"
                >
                  <FaEnvelope className={styles.messageIcon} />
                  {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
                </button>
      
                {/* Dropdown (stays open for interaction; closes on outside click) */}
                <div className={`${styles.messageDropdown} ${openDropdown ? styles.show : ''}`} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.dropdownHeader}>Messages</div>
      
                  <div className={styles.dropdownTableWrap}>
                    <table className={styles.dropdownTable}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Message</th>
                          <th>Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {notifications.length === 0 ? (
                          <tr>
                            <td colSpan="4" className={styles.noMessage}>No new messages</td>
                          </tr>
                        ) : (
                          notifications.map((n, idx) => (
                            <tr key={n.id} className={styles.unreadRow}>
                              <td>{idx + 1}</td>
                              <td className={styles.messageCell}>{n.message}</td>
                              <td className={styles.timeCell}>
                                {n.timestamp ? new Date(n.timestamp).toLocaleString() : '-'}
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className={styles.okButton}
                                  onClick={() => markAsRead(n.id)}
                                >
                                  OK
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
     

      {/* Tables */}
      {renderTable(
        "✅ Approved Requests",
        approvedRequests,
        styles.approvedHeading,
        "No Approved Requests"
      )}
      {renderTable(
        "📌 Pending Requests",
        forwardedRequests,
        styles.pendingHeading,
        "No Pending Requests"
      )}
    </div>
  );
};

export default VehicleRequests;
