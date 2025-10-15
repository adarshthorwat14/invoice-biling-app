import React from 'react'
import PlantNavbar from '../Navbar/PlantNavbar';

const PlantDashboard = ({ children }) => (
  <>
    <PlantNavbar/>
    <div style={{ padding: '30px' }}>{children}</div>
  </>
);

export default PlantDashboard;