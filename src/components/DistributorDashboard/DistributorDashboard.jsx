import React from 'react';
import DistributorNavbar from '../Navbar/DistributorNavbar';

const DistributorDashboard = ({ children }) => (
  <>
    <DistributorNavbar />
    <div style={{ padding: '30px' }}>{children}</div>
  </>
);

export default DistributorDashboard;