import React, { useEffect, useState } from "react";

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
  fetch("http://localhost:5000/get_emergency_alerts", { method: "GET" })  // Ensure method matches Flask
    .then(response => response.json())
    .then(data => {
      console.log("Fetched alerts:", data);  // Debugging output
      setAlerts(data);
    })
    .catch(error => console.error("Error fetching alerts:", error));
  }, []);
  return (
    <div className="table alertstable">
      <h2>🚨 Emergency Alerts 🚨</h2>
      <table>
        <thead>
          <tr>
            <th>Alert_ID</th>
            <th>Type</th>
            <th>Department</th>
            <th>Timestamp</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, index) => (
            <tr key={index}>
              <td>{alert.alert_id}</td>
              <td>{alert.code_type}</td>
              <td>{alert.department}</td>
              <td>{new Date(alert.timestamp).toLocaleString()}</td>
              <td>{alert.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Alerts;


