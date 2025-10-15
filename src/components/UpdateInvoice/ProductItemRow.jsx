import React from 'react';
import styles from './ProductItemRow.module.css';

const ProductItemRow = ({ item, index }) => {
  return (
    <tr className={styles.row}>
      <td>{index + 1}</td>
      <td>{item.productId}</td>
      <td>{item.description}</td>
      <td>₹{item.price}</td>
      <td>{item.quantity}</td>
      <td>{item.discount}%</td>
      <td>₹{item.subtotal}</td>
    </tr>
  );
};

export default ProductItemRow;
