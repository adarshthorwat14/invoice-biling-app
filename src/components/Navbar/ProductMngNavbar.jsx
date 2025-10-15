import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import dropdownIcon from '../assets/down-arrow.png';
import userIcon from '../assets/man.png';
import styles from './ProductMngNavbar.module.css';

const ProductMngNavbar = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [userDetails, setUserDetails] = useState({ name: '', email: '', role: '' });
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const storedUser = localStorage.getItem('productMng');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setId(user.id);
      setUserDetails({
        name: user.name,
        email: user.email,
        role: user.role,
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
    { to: '/productMng/home', label: 'Home' },
    {
      title: 'Product Management',
      key: 'products',
      links: [
        { to: '/productMng/products/add', label: 'Add Product' },
        { to: '/productMng/products/update', label: 'Update Product' },
        { to: '/productMng/products/view', label: 'View Products' },
        { to: '/management/plant/stock-view', label: 'Plant Stock' },
      ]
    },
    {
      title: 'Requests',
      key: 'requests',
      links: [
        { to: '/productMng/products/request', label: 'Check Requests' },
        { to: '/productMng/distributor/stock', label: 'Distributor Stock' }
      ]
    },
    {
      title: 'Configuration',
      key: 'config',
      links: [
        { to: '/productMng/maintain/hsn', label: 'Maintain HSN Code' }
      ]
    }
  ];

  return (
    <nav className={styles.adminNavbar}>
      <div className={styles.adminNavbarLeft}>
        <span className={styles.adminLogo}>Product Manager Panel</span>
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

      <div
        className={styles.adminNavbarRight}
        onMouseEnter={() => setShowProfileDropdown(true)}
        onMouseLeave={() => setShowProfileDropdown(false)}
      >
        <div className={styles.welcomeText}>
          <img src={userIcon} alt="User" style={{ width: '28px', height: '28px', marginRight: '8px', borderRadius: '50%' }} />
          Welcome, {id}
        </div>
        <div className={`${styles.profileDropdownPanel} ${showProfileDropdown ? styles.show : ''}`}>
          <div className={styles.dropdownButtons}>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Role:</strong> {userDetails.role}</p>
            <button className={styles.dropdownBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ProductMngNavbar;
