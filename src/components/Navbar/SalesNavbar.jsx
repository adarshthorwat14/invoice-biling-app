// SalesNavbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import dropdownIcon from '../assets/down-arrow.png';
import userIcon from '../assets/man.png';
import styles from './SalesNavbar.module.css';

const SalesNavbar = () => {
  const navigate = useNavigate();
  const [salesName, setSalesName] = useState('');
  const [salesDetails, setSalesDetails] = useState({ name: '', phoneNumber: '', position: '', region: '', state: '' });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const stored = localStorage.getItem('sales');
    if (stored) {
      const sp = JSON.parse(stored);
      setSalesName(sp.name);
      setSalesDetails({
        name: sp.name || 'Salesperson',
        phoneNumber: sp.phoneNumber || 'N/A',
        position: sp.position || 'Sales Rep',
        region: sp.region || 'N/A',
        state: sp.state || 'N/A',
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach(ref => {
        if (ref && !ref.contains(event.target)) {
          setOpenDropdown(null);
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    { to: '/sales/home', label: 'Home' },
    {
      title: 'Orders',
      key: 'orders',
      links: [
        { to: '/sales/create-order', label: 'Create Order' },
        { to: '/sales/my-orders', label: 'My Orders' },
        { to: '/sales/distributors-orders', label: 'Distributors Orders' },
        
      ]
    },
    {
      title: 'Sales Management',
      key: 'sales',
      links: [
        { to: '/sales/customers', label: 'Customers' },
        { to: '/sales/reports', label: 'Reports' },
        { to: '/sales/performance', label: 'Performance' },
      ]
    },
  ];

  return (
    <nav className={styles.adminNavbar}>
      <div className={styles.adminNavbarLeft}>
        <span className={styles.adminLogo}>Sales Panel</span>
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

      <div
        className={styles.adminNavbarRight}
        onMouseEnter={() => setShowProfileDropdown(true)}
        onMouseLeave={() => setShowProfileDropdown(false)}
      >
        <div className={styles.welcomeText}>
          <img src={userIcon} alt="User" style={{ width: '28px', height: '28px', marginRight: '8px', borderRadius: '50%' }} />
          Welcome, {salesName}
        </div>
        <div className={`${styles.profileDropdownPanel} ${showProfileDropdown ? styles.show : ''}`}>
          <div className={styles.dropdownButtons}>
            <p><strong>Name:</strong> {salesDetails.name}</p>
            <p><strong>Phone:</strong> {salesDetails.phoneNumber}</p>
            <p><strong>Position:</strong> {salesDetails.position}</p>
            <p><strong>Region:</strong> {salesDetails.region}</p>
            <p><strong>State:</strong> {salesDetails.state}</p>
            <button className={styles.dropdownBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SalesNavbar;
