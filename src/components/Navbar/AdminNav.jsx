import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './AdminNav.module.css';
import downArrow from './assets/down-arrow.png';
import profile from './assets/man-profile.png';

const AdminNav = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [adminDetails, setAdminDetails] = useState({ name: '', email: '', role: '' });
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      setAdminId(admin.adminId);
      setAdminDetails({
        name: admin.name || 'Admin',
        email: admin.email || 'admin@example.com',
        role: admin.role || 'Administrator',
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
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/');
        Swal.fire('Logged out!', '', 'success');
      }
    });
  };

  const menuConfig = [
    {
      title: 'Admin Management',
      key: 'admin',
      links: [
        { to: '/admin/create', label: 'Create Admin' },
        { to: '/productMng/create', label: 'Create Product Emp' },
        { to: '/distributor/create', label: 'Create Distributor' },
        { to: '/clients/add', label: 'Create Client' },
        { to: '/logistic/create', label: 'Create Logistic Emp' },
        { to: '/plant/employee/create', label: 'Create Plant Emp' },
        { to: '/salesperson/create', label: 'Create SalesPerson' },
      ]
    },
    {
      title: 'User Management',
      key: 'user',
      links: [
        
        { to: '/admin/user', label: 'User Management' },
        { to: '/clients', label: 'View Clients' },
        { to: '/admin/distributors', label: 'View Distributors' },
      ]
    },
    {
      title: 'Products',
      key: 'products',
      links: [{ to: '/products', label: 'View Products' }]
    },
    {
      title: 'Invoices',
      key: 'invoices',
      links: [
        { to: '/admin/invoice/list', label: 'Invoice List' }
      ]
    }
  ];

  const bottomMenuConfig = [

    {
      title: 'Client Management',
      key: 'clients',
      links: [
        
        { to: '/clients/update', label: 'Update Client' },
        { to: '/clients', label: 'View Clients' },
      ]
    },

    {
      title: 'Stock Management',
      key: 'stock',
      links: [
        { to: '/admin/distributor/stock', label: 'Distributor Stock' },
        { to: '/stock/status', label: 'Request Status' },
        { to: '/stock/current', label: 'Current Stock' },
      ]
    },
    {
      title: 'Reports',
      key: 'reports',
      links: [
        { to: '/reports/sales', label: 'Sales Report' },
        { to: '/reports/distributor', label: 'Distributor Report' },
      ]
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.adminNavbar}>
        {/* Left */}
        <div className={styles.adminNavbarLeft}>
          <span className={styles.adminLogo}>Admin Panel</span>
        </div>

        {/* Center */}
        <div className={styles.navbarCenterWrapper}>
          <div className={styles.navbarCenter}>
            <ul className={styles.middleNavItems}>
              {menuConfig.map(menu => (
                <li
                  key={menu.key}
                  className={styles.dropdown}
                  ref={(el) => dropdownRefs.current[menu.key] = el}
                  onMouseEnter={() => setOpenDropdown(menu.key)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className={styles.dropbtn}>
                    {menu.title}
                    <img
                      src={downArrow}
                      alt="▼"
                      className={`${styles.dropdownIcon} ${openDropdown === menu.key ? styles.rotate : ''}`}
                    />
                  </button>
                  <div className={`${styles.dropdownContentWrapper} ${openDropdown === menu.key ? styles.show : ''}`}>
                    <div className={styles.dropdownContent}>
                      {menu.links.map(link => (
                        <NavLink key={link.to} to={link.to} className={styles.dropdownLink}>
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right */}
        <div
          className={styles.adminNavbarRight}
          onMouseEnter={() => setShowProfileDropdown(true)}
          onMouseLeave={() => setShowProfileDropdown(false)}
        >
          <div className={styles.welcomeText}>
            <img src={profile} className={styles.profile} alt="" />
            Welcome, {adminId}
          </div>
          <div className={`${styles.profileDropdownPanel} ${showProfileDropdown ? styles.show : ''}`}>
            <div className={styles.dropdownButtons}>
              <p><strong>Name:</strong> {adminDetails.name}</p>
              <p><strong>Email:</strong> {adminDetails.email}</p>
              <p><strong>Role:</strong> {adminDetails.role}</p>
              <button className={styles.dropdownBtn} onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>

      {/* ▼ Arrow + Bottom Nav Hover Area */}
      <div
        className={styles.bottomNavHoverArea}
        onMouseEnter={() => setShowBottomNav(true)}
        onMouseLeave={() => setTimeout(() => setShowBottomNav(false), 200)}
      >
        <div className={styles.centerArrows}>
          <span className={styles.arrowIcon}>▼</span>
        </div>

        <div className={`${styles.bottomNavbar} ${showBottomNav ? styles.show : ''}`}>
          <ul className={styles.bottomNavItems}>
            {bottomMenuConfig.map(menu => (
              <li
                key={menu.key}
                className={styles.dropdown}
                ref={(el) => dropdownRefs.current[menu.key] = el}
                onMouseEnter={() => setOpenDropdown(menu.key)}
                onMouseLeave={() => setTimeout(() => setOpenDropdown(null), 200)}
              >
                <button className={styles.bottomNavButton}>
                  {menu.title}
                  <img
                    src={downArrow}
                    alt="▼"
                    className={`${styles.dropdownIcon} ${openDropdown === menu.key ? styles.rotate : ''}`}
                  />
                </button>
                <div className={`${styles.bottomDropdownContentWrapper} ${openDropdown === menu.key ? styles.show : ''}`}>
                  <div className={styles.dropdownContent}>
                    {menu.links.map(link => (
                      <NavLink key={link.to} to={link.to} className={styles.dropdownLink}>
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
