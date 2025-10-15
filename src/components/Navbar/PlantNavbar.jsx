import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import dropdownIcon from '../assets/down-arrow.png';
import userIcon from '../assets/man.png';
import styles from './PlantNavbar.module.css';

const PlantNavbar = () => {
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState('');
  const [employeeDetails, setEmployeeDetails] = useState({ name: '', email: '', position: '' });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const stored = localStorage.getItem('plantEmployee');
    if (stored) {
      const emp = JSON.parse(stored);
      setEmployeeName(emp.name);
      setEmployeeDetails({
        name: emp.name || 'Plant Employee',
        email: emp.email || 'example@beunique.com',
        position: emp.position || 'Operator'
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
    { to: '/plant/home', label: 'Home' },
    {
      title: 'My Tasks',
      key: 'tasks',
      links: [
        
        { to: '/plant/stock-in', label: 'Stock Inward' },
        { to: '/plant/stock-out', label: 'Stock Outward' },
        { to: '/plant/assign-delivery', label: 'Assign Delivery' },
      ]
    },
    {
      title: 'Plant Management',
      key: 'plant',
      links: [
        { to: '/plant/stock-view', label: 'Plant Stock' },
        { to: '/plant/distributor/product/request', label: 'Distributor Stock Request' },
         { to: '/delivery-notes', label: 'Delivery Notes' },
        { to: '/plant/employees', label: 'Plant Employees' },
        { to: '/plant/records', label: 'Activity Logs' }
      ]
    },
  ];

  return (
    <nav className={styles.adminNavbar}>
      <div className={styles.adminNavbarLeft}>
        <span className={styles.adminLogo}>Plant Panel</span>
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
          Welcome, {employeeName}
        </div>
        <div className={`${styles.profileDropdownPanel} ${showProfileDropdown ? styles.show : ''}`}>
          <div className={styles.dropdownButtons}>
            <p><strong>Name:</strong> {employeeDetails.name}</p>
            <p><strong>Email:</strong> {employeeDetails.email}</p>
            <p><strong>Position:</strong> {employeeDetails.position}</p>
            <button className={styles.dropdownBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default PlantNavbar;
