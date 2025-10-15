/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

import dropdownIcon from '../assets/down-arrow.png';
import userIcon from '../assets/man.png';
import bellIcon from './assets/bell.png';
import styles from './DistributorNav.module.css';

const DistributorNavbar = () => {
  const navigate = useNavigate();
  const [distributorId, setDistributorId] = useState('');
  const [distributorDetails, setDistributorDetails] = useState({ name: '', email: '' });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const notificationRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const userRole = 'DISTRIBUTOR';

  useEffect(() => {
    const storedDistributor = localStorage.getItem('distributor');
    if (storedDistributor) {
      const distributor = JSON.parse(storedDistributor);
      setDistributorId(distributor.id);
      setDistributorDetails({
        name: distributor.name || 'Distributor',
        email: distributor.email || 'example@distributor.com',
      });
    }
  }, []);

  useEffect(() => {
    if (distributorId) {
      fetchNotificationCount();
    }
  }, [distributorId]);

  const fetchNotificationCount = async () => {
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
    try {
      const res = await axios.get('http://localhost:8080/api/notifications/all', {
        params: { recipientId: distributorId, userRole },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/mark-read/${id}`);
      fetchNotificationCount();
      fetchAllNotifications();
    } catch (err) {
      console.error('Error marking as read:', err);
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
    { to: '/distributor/home', label: 'Home' },
    { to: '/distributor/products/view', label: 'Check Products' },
    {
      title: 'Client Management',
      key: 'client',
      links: [
        { to: '/distributor/client/add', label: 'Create Client' },
        { to: '/distributor/clients', label: 'View Clients' },
        { to: '/distributor/client/payment-status', label: 'Payment Status' },
        { to: '/distributor/client/history', label: 'Client History' },
      ]
    },
    {
      title: 'Stock Management',
      key: 'stock',
      links: [
        { to: '/distributor/productRequest', label: 'Product Request' },
        { to: '/distributor/requestStatus', label: 'Request Status' },
        {to: '/distributor/delivery_note', label: 'Delivery Notes'},
        { to: '/distributor/currentStock', label: 'Current Stock' },
      ]
    }
  ];

  return (
    <nav className={styles.adminNavbar}>
      <div className={styles.adminNavbarLeft}>
        <span className={styles.adminLogo}>Distributor Panel</span>
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
                  <div className={`${styles.dropdownContentWrapper} ${openDropdown === item.key ? styles.show : ''}`}>
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
        {/* ✅ Notification Icon with Hover */}
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
            Welcome, {distributorId}
          </div>
          <div className={`${styles.profileDropdownPanel} ${showProfileDropdown ? styles.show : ''}`}>
            <div className={styles.dropdownButtons}>
              <p><strong>Name:</strong> {distributorDetails.name}</p>
              <p><strong>Email:</strong> {distributorDetails.email}</p>
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

export default DistributorNavbar;
