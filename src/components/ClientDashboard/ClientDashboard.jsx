// src/pages/client/ClientDashboard.jsx
import React from 'react';
import Navbar from '../Navbar/Navbar';

const ClientDashboard = ({ children }) => (
  <>
    <Navbar />
    <div style={{ padding: '30px' }}>{children}</div>
  </>
);

export default ClientDashboard;
