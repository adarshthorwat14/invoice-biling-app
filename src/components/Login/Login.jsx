import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setEmail('');
    setId('');
    setPassword('');
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('admin', JSON.stringify(data));
      navigate('/admin/home');
    } catch (error) {
      alert('Admin login failed: ' + error.message);
    }
  };

  const handleProductLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/productMng/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('productMng', JSON.stringify(data));
      navigate('/productMng/home');
    } catch (error) {
      alert('Product Manager login failed: ' + error.message);
    }
  };

  const handleDistributorLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/distributors/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('distributor', JSON.stringify(data));
      navigate('/distributor/home');
    } catch (error) {
      alert('Distributor login failed: ' + error.message);
    }
  };

  const handleClientLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/clients/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('client', JSON.stringify(data));
      navigate('/home');
    } catch (error) {
      alert('Client login failed: ' + error.message);
    }
  };

  const handleLogisticLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/logistics/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('logistic', JSON.stringify(data));
      navigate('/logistic/home');
    } catch (error) {
      alert('Logistic login failed: ' + error.message);
    }
  };

  const handlePlantEmployeeLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('http://localhost:8080/api/plant-employees/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Invalid credentials');
    
    const data = await res.json();
    localStorage.setItem('plantEmployee', JSON.stringify(data));
    navigate('/plant/home');
  } catch (error) {
    alert('Plant Employee login failed: ' + error.message);
  }
};

const handleSalesPersonLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8080/api/salespersons/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('sales', JSON.stringify(data));
      navigate('/sales/home');
    } catch (error) {
      alert('login failed: ' + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Billing System</h1>
      <p className={styles.subtitle}>Please select your role to continue</p>

      <div className={styles.circleWrapper}>
        {['admin', 'client', 'product', 'distributor', 'logistic','plant Emp','sales'].map((role) => (
          <div
            key={role}
            className={`${styles.circle} ${selectedRole === role ? styles.selected : ''}`}
            onClick={() => handleRoleClick(role)}
          >
            {role === 'product' ? 'Product MNG' : role.charAt(0).toUpperCase() + role.slice(1)}
          </div>
        ))}
      </div>

      {selectedRole === 'admin' && (
        <form className={styles.form} onSubmit={handleAdminLogin}>
          <input type="email" placeholder="Admin Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login as Admin</button>
        </form>
      )}

      {selectedRole === 'product' && (
        <form className={styles.form} onSubmit={handleProductLogin}>
          <input type="text" placeholder="Username" value={email} required onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      )}

      {selectedRole === 'distributor' && (
        <form className={styles.form} onSubmit={handleDistributorLogin}>
          <input type="email" placeholder="Distributor Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      )}

      {selectedRole === 'client' && (
        <form className={styles.form} onSubmit={handleClientLogin}>
          <input type="text" placeholder="Client ID" value={id} required onChange={(e) => setId(e.target.value)} />
          <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      )}

      {selectedRole === 'logistic' && (
        <form className={styles.form} onSubmit={handleLogisticLogin}>
          <input type="text" placeholder="Logistic ID" value={id} required onChange={(e) => setId(e.target.value)} />
          <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      )}

      {selectedRole === 'plant Emp' && (
        <form className={styles.form} onSubmit={handlePlantEmployeeLogin}>
          <input type="email" placeholder="Enter Email" value={email} required onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      )}
      {selectedRole === 'sales' && (
        <form className={styles.form} onSubmit={handleSalesPersonLogin}>
          <input type="text" placeholder="Enter ID" value={id} required onChange={(e) => setId(e.target.value)} />
          <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
};

export default Login;
