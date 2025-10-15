import React from 'react'
import ProductMngNavbar from '../Navbar/ProductMngNavbar'

const ProductMngDashboard = ({ children }) => {
  return (
   <>
    <ProductMngNavbar />
    <div style={{ padding: '30px' }}>{children}</div>
  </>
  )
}

export default ProductMngDashboard
