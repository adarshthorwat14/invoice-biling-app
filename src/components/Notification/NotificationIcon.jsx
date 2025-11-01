import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react'; // make sure lucide-react is installed
import styles from './DistributorNavbar.module.css';
import api from '../../api/axiosConfig';

const NotificationIcon = ({ recipientId, userRole }) => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await api.get(`/api/notifications/count`, {
        params: { recipientId, userRole }
      });
      setCount(res.data);
    } catch (err) {
      console.error('Failed to fetch notification count', err);
    }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.notificationWrapper}>
      <Bell className={styles.bellIcon} />
      {count > 0 && <span className={styles.notificationBadge}>{count}</span>}
    </div>
  );
};

export default NotificationIcon;
