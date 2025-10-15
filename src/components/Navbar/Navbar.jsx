import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import dropdownIcon from '../assets/down-arrow.png';
import userIcon from '../assets/man.png';
import Swal from 'sweetalert2';

const Navbar = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
   const [ClientId, setClientId] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [clientDetails, setClientDetails] = useState({ name: '', email: ''});
  const dropdownRefs = useRef({});
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  useEffect(() => {
      const storedAdmin = localStorage.getItem('client');
      if (storedAdmin) {
        const client = JSON.parse(storedAdmin);
        setClientId(client.id);
        setClientDetails({
          name: client.name || 'Client',
          email: client.email || 'client@example.com',
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

  return (
    <nav className={styles.navbar} ref={dropdownRef}>
      <NavLink to="/" className={styles.logoText}>
        YourLogo
      </NavLink>

      <ul className={styles.navLinks}>
        <li className={styles.home}>
          <NavLink to="/home" className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}>
               <button className={styles.dropbtn}>
            Home
          </button>
          </NavLink>
        </li>

        <li className={styles.dropdown}>
          <button className={styles.dropbtn} onClick={() => toggleDropdown('invoices')}>
            Invoices
            <img
              src={dropdownIcon}
              alt="▼"
              className={`${styles.icon} ${openDropdown === 'invoices' ? styles.rotate : ''}`}
            />
          </button>
          {openDropdown === 'invoices' && (
            <div className={styles.dropdownContent}>
              <NavLink to="/invoices/create" className={styles.dropdownLink}>Create Invoice</NavLink>
              <NavLink to="/client/invoices/list" className={styles.dropdownLink}>Invoice List</NavLink>
            </div>
          )}
        </li>
      </ul>

      {/* <div className={styles.userSection}>
        <img src={userIcon} alt="User" className={styles.userIcon} />
        <span className={styles.userName}>John Doe</span>
      </div> */}

            <div
              className={styles.adminNavbarRight}
              onMouseEnter={() => setShowProfileDropdown(true)}
              onMouseLeave={() => setShowProfileDropdown(false)}
            >
              <div className={styles.welcomeText}>
                Welcome, {ClientId}
              </div>
              <div className={`${styles.profileDropdownPanel} ${showProfileDropdown ? styles.show : ''}`}>
                <div className={styles.dropdownButtons}>
                  <p><strong>Name:</strong> {clientDetails.name}</p>
                  <p><strong>Email:</strong> {clientDetails.email}</p>
                  <button className={styles.dropdownBtn} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
            </div>
    </nav>
  );
};

export default Navbar;
