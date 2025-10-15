/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import styles from './RequestStockStatus.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEnvelope } from 'react-icons/fa';

const RequestStockStatus = () => {
  const distributor = JSON.parse(localStorage.getItem('distributor')); // assuming full object is stored
  const distributorId = distributor?.id;
  const userRole = 'DISTRIBUTOR';

  const [request, setRequest] = useState([]);

  // Notifications state (using same endpoints as DistributorNavbar)
  const [notifications, setNotifications] = useState([]); // we will show only unread in the dropdown
  const [unreadCount, setUnreadCount] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // ========= Fetch Requests (your original logic) =========
  useEffect(() => {
    if (distributorId) {
      axios
        .get(`http://localhost:8080/api/distributors/${distributorId}/requests`)
        .then((res) => {
          const sortedData = res.data.sort((a, b) =>
            b.requestId.localeCompare(a.requestId, undefined, { numeric: true })
          );
          setRequest(sortedData);
        })
        .catch((err) => {
          console.error('Failed to fetch requests:', err);
          Swal.fire('Error', 'Failed to fetch stock requests', 'error');
        });
    }
  }, [distributorId]);

  // ========= Notifications (same APIs as DistributorNavbar) =========
  const fetchUnreadCount = async () => {
    if (!distributorId) return;
    try {
      const res = await axios.get('http://localhost:8080/api/notifications/count', {
        params: { recipientId: distributorId, userRole },
      });
      setUnreadCount(res.data);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const fetchAllNotifications = async () => {
    if (!distributorId) return;
    try {
      const res = await axios.get('http://localhost:8080/api/notifications/all', {
        params: { recipientId: distributorId, userRole },
      });
      // Show only unread messages in the dropdown; latest first
      const unreadOnly = (res.data || [])
        .filter((n) => !n.read)
        .sort((a, b) => {
          const ta = new Date(a.timestamp || 0).getTime();
          const tb = new Date(b.timestamp || 0).getTime();
          if (tb !== ta) return tb - ta;
          return (b.id ?? 0) - (a.id ?? 0);
        });
      setNotifications(unreadOnly);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/mark-read/${id}`);
      // Optimistic UI updates
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  // Initial unread count
  useEffect(() => {
    fetchUnreadCount();
  }, [distributorId]);

  // Open on hover/click, close on outside click
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

  return (
    <div className={styles.container}>
      {/* ===== Header with message icon ===== */}
      <div className={styles.headerRow} ref={dropdownRef}>
        <h2 className={styles.heading}>Your Stock Request Status</h2>
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


      {/* ===== Requests table (your original table, now scrollable + animated) ===== */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Request Date</th>
              <th>Priority</th>
              <th>Requested By</th>
              <th>Total Items</th>
              <th>Total Quantity</th>
              <th>Status</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {request.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>No requests found.</td>
              </tr>
            ) : (
              request.map((req) => (
                <tr key={req.requestId} className={styles.rowFadeIn}>
                  <td>{req.requestId}</td>
                  <td>{req.requestDate}</td>
                  <td>{req.priority}</td>
                  <td>{req.requestedBy}</td>
                  <td>{req.totalItems}</td>
                  <td>{req.totalQuantity}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{req.remark}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestStockStatus;
