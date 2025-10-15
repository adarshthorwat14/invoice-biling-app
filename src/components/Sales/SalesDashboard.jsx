import React from 'react'
import SalesNavbar from '../Navbar/SalesNavbar'

const SalesDashboard = ({ children }) => {
  return (
   <>
    <SalesNavbar />
    <div style={{ padding: '30px' }}>{children}</div>
  </>
  )
}

export default SalesDashboard
