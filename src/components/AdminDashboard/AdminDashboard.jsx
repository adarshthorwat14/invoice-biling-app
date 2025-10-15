import React from 'react';
import CreateAdmin from '../Admin/CreateAdmin';
import AdminNav from '../Navbar/AdminNav';


const AdminDashboard = ({ children }) => (
  <>
    <AdminNav />
    <div style={{ padding: '30px' }}>{children}</div>
  </>
);

export default AdminDashboard;
