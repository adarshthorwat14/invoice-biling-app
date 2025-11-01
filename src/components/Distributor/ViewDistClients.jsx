import React, { useEffect, useState } from "react";

import styles from "./ViewClients.module.css";
import api from '../../api/axiosConfig';

const ViewDistClients = () => {
  const [clients, setClients] = useState([]);
  const [distributor, setDistributor] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem("distributor");
    if (storedData) {
      setDistributor(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (!distributor?.id) return;

    api
      .get(`/api/clients/by-distributor/${distributor.id}`)
      .then((res) => {
        setClients(res.data);
      })
      .catch((err) => console.error("Error fetching clients", err));
  }, [distributor]);

  return (
    <div className={styles.container}>
      <h2>Clients for Distributor: {distributor?.name}</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>City</th>
              <th>State</th>
               <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.name}</td>
                <td>{client.email}</td>
                <td>{client.phone}</td>
                <td>{client.city}</td>
                <td>{client.state}</td>
                <td style={{ color: client.status ? "green" : "red", fontWeight: "bold" }}>
                {client.status ? "Active" : "Inactive"}
               </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewDistClients;
