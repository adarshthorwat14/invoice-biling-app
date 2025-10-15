// DistributorHome.jsx
import React, { useEffect, useState } from 'react';
import './DistributorHome.css';

const DistributorHome = () => {
  const [distributor, setDistributor] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('distributor');
    if (storedData) {
      setDistributor(JSON.parse(storedData));
    }
  }, []);

  if (!distributor) return <p>Loading...</p>;

  return (
    <div className="distributor-home-simple">
      <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Welcome, {distributor.name}</h1>
    </div>
  );
};

export default DistributorHome;
