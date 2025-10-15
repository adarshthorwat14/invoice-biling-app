import React from 'react'
import LogisticNavbar from '../Navbar/LogisticNavbar';

const LogisticDashboard = ({ children }) => (
  <>
    <LogisticNavbar/>
    <div style={{ padding: '30px' }}>{children}</div>
  </>
);

export default LogisticDashboard;
