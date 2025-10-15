import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import dropdownIcon from '../assets/down-arrow.png';
import userIcon from '../assets/man.png';
import bellIcon from './assets/bell.png';
import styles from './LogisticNavbar.module.css';
import { FaBell } from "react-icons/fa";

const LogisticNavbar = () => {
  const navigate = useNavigate();
  const [logisticId, setLogisticId] = useState('');
  const [logisticDetails, setLogisticDetails] = useState({ name: '', email: '', role: '' });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  // ✅ Notifications state
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

   const [notificationsVeAppr, setNotificationsVeAppr] = useState([]);
  const [unreadCountVeAppr, setUnreadCountVeAppr] = useState(0);

  // Hardcoded role = PLANT for Logistic
  const userRole = "PLANT";

  
// useEffect(() => {
//   fetch('/api/notifications?userRole=PLANT')
//     .then(res => res.json())
//     .then(data => {
//       setNotifications(data);
//       setUnreadCount(data.filter(n => !n.read).length);
//     });
// }, []);

  useEffect(() => {
    const storedLogistic = localStorage.getItem('logistic');
    if (storedLogistic) {
      const logistic = JSON.parse(storedLogistic);
      setLogisticId(logistic.id);
      setLogisticDetails({
        name: logistic.name || 'Logistic',
        email: logistic.email || 'example@logistic.com',
        role: logistic.role || 'manager',
      });
    }
  }, []);

  // Fetch unread count
  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/notifications/plant/count");
      const res1 = await axios.get("http://localhost:8080/api/notifications/vehicle/approve/count");
      setUnreadCount(res.data);
      setUnreadCountVeAppr(res1.data);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const fetchNotificationCountVehicle = async () => {
    try {
      const res1 = await axios.get("http://localhost:8080/api/notifications/vehicle/approve/count");
      setUnreadCountVeAppr(res1.data);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const fetchAllNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/notifications/plant");
      const res1 = await axios.get("http://localhost:8080/api/notifications/vehicle/approve");
      setNotifications(res.data);
      setNotificationsVeAppr(res1.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

    const fetchAllNotificationsVehicle = async () => {
    try {
      const res1 = await axios.get("http://localhost:8080/api/notifications/vehicle/approve");
      setNotificationsVeAppr(res1.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/mark-read/${id}`);
      fetchNotificationCount();
      fetchAllNotifications();
      fetchNotificationCountVehicle();
      fetchAllNotificationsVehicle();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/');
        Swal.fire('Logged out!', '', 'success');
      }
    });
  };

  const menuConfig = [
    { to: '/logistic/home', label: 'Home' },
    {
      title: 'Manage Logistics',
      key: 'logistic',
      links: [
        { to: '/logistic/register-vehicle', label: 'Register Vehicle ' },
        { to: '/logistic/view-vehicles', label: 'View Vehicles' },
        { to: '/logistic/update-vehicles', label: 'Update Vehicle' },

// inside your nav items
{
  to: "/vehicle/vehicle/request",
  label: (
    <div
      className={styles.vehicleRequestWrapper}
      onClick={() => {
        setUnreadCount(0);      // mark as read
        setNotifications([]);   // optional clear
      }}
    >
      <span>Vehicle Request</span>
      <div className={styles.vehicleRequestBell}>
        <img
          src={bellIcon}
          alt="Notifications"
          className={styles.vehicleRequestIcon}
        />
        {unreadCount > 0 && (
          <span className={styles.vehicleRequestCount}>
            {unreadCount}
          </span>
        )}
      </div>
    </div>
  ),
},

        { to: '/vehicle/vehicle/dispatch', label: 'Dispatch Order' },
        { to: '/logistic/gate-pass', label: 'Gate Passes' },
      ]
    },
    {
      title: 'Plant Operations',
      key: 'plant',
      links: [
        { to: '/logistic/add/plant', label: 'Add Plant' },
        { to: '/logistic/plants', label: 'View Plants' },
        { to: '/logistic/delivery/request', label: 'Delivery Request' },

        {
  to: "/logistic/vehicle_requests/status",
  label: (
    <div
      className={styles.vehicleRequestWrapper}
      onClick={() => {
        setUnreadCountVeAppr(0);      // mark as read
        setNotificationsVeAppr([]);   // optional clear
      }}
    >
      <span>Vehicle Request Status</span>
      <div className={styles.vehicleRequestBell}>
        <img
          src={bellIcon}
          alt="notificationsVeAppr"
          className={styles.vehicleRequestIcon}
        />
        {unreadCountVeAppr > 0 && (
          <span className={styles.vehicleRequestCount}>
            {unreadCountVeAppr}
          </span>
        )}
      </div>
    </div>
  ),
},



        { to: '/logistic/vehicles', label: 'Vehicles' },
        { to: '/logistic/transport', label: 'Transport Management' }
      ]
    },
    { to: '/logistic/warehouse/stock', label: 'WareHouse Stock' },
  ];

  return (
    <nav className={styles.adminNavbar}>
      <div className={styles.adminNavbarLeft}>
        <span className={styles.adminLogo}>Logistic Panel</span>
      </div>

      <div className={styles.navbarCenter}>
        <ul className={styles.navLinks}>
          {menuConfig.map((item) => {
            if (item.links) {
              return (
                <li
                  key={item.key}
                  className={styles.dropdown}
                  ref={(el) => (dropdownRefs.current[item.key] = el)}
                  onMouseEnter={() => setOpenDropdown(item.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className={styles.dropbtn}>
                    {item.title}
                    <img
                      src={dropdownIcon}
                      alt="▼"
                      className={`${styles.dropdownIcon} ${openDropdown === item.key ? styles.rotate : ''}`}
                    />
                  </button>
                  <div
                    className={`${styles.dropdownContentWrapper} ${openDropdown === item.key ? styles.show : ''}`}
                  >
                    <div className={styles.dropdownContent}>
                      {item.links.map(link => (
                        <NavLink to={link.to} className={styles.dropdownLink} key={link.to}>
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </li>
              );
            } else {
              return (
                <li key={item.to}>
                  <NavLink to={item.to} className={styles.dropdownLink}>
                    {item.label}
                  </NavLink>
                </li>
              );
            }
          })}
        </ul>
      </div>

      <div className={styles.adminNavbarRight}>
        {/* ✅ Notifications */}
        <div
          className={styles.notificationWrapper}
          onMouseEnter={() => {
            setShowNotificationDropdown(true);
            fetchAllNotifications();
          }}
          onMouseLeave={() => setShowNotificationDropdown(false)}
        >
          <div className={styles.notificationIcon}>
            <img src={bellIcon} alt="Notifications" />
            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
          </div>

          <div className={`${styles.notificationDropdown} ${showNotificationDropdown ? styles.show : ''}`}>
            {notifications.length === 0 ? (
              <div className={styles.noNotification}>No notifications</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`${styles.notificationItem} ${!n.read ? styles.unread : ''}`}
                  onClick={() => markAsRead(n.id)}
                >
                  {n.message}
                  <div className={styles.timestamp}>
                    {new Date(n.timestamp).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ✅ Profile */}
        <div
          onMouseEnter={() => setShowProfileDropdown(true)}
          onMouseLeave={() => setShowProfileDropdown(false)}
        >
          <div className={styles.welcomeText}>
            <img src={userIcon} alt="User" style={{ width: '28px', height: '28px', marginRight: '8px', borderRadius: '50%' }} />
            Welcome, {logisticId}
          </div>
          <div className={`${styles.profileDropdownPanel} ${showProfileDropdown ? styles.show : ''}`}>
            <div className={styles.dropdownButtons}>
              <p><strong>Name:</strong> {logisticDetails.name}</p>
              <p><strong>Email:</strong> {logisticDetails.email}</p>
              <p><strong>Role:</strong> {logisticDetails.role}</p>
              <button className={styles.dropdownBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LogisticNavbar;
