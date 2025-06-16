// export default PatientQueue;
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:3000");

const PatientQueue = () => {
  const [tokens, setTokens] = useState([]);

  const fetchTokenQueue = () => {
    fetch("http://localhost:5000/token_queue")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched Tokens:", data); // Debugging
        setTokens(data);
      })
      .catch(error => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchTokenQueue(); // Initial Fetch

    // socket.on("update_token_queue", fetchTokenQueue); newToken// Listen for real-time updates
    socket.on("new_token_generated",()=>{
      console.log("Recieved websockets event, fetching new tokens...");
      fetchTokenQueue();
      // setTokens((prevTokens)=>[...prevTokens,newToken]);
    });
    return () => {
      // socket.off("update_token_queue");
      socket.off("new_token_generated");
    };
  }, []);

  return (
    <div className="fullpatientview">
      <h2>Patient Token Queue</h2>
      <section className="patient-queue">
        <table>
          <thead>
            <tr>
              <th>Token ID</th>
              <th>Department</th>
              <th>Patient Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tokens.length > 0 ? (
              tokens.map((token) => (
                <tr key={token.token_id}>
                  <td>{token.token_id}</td>
                  <td>{token.dept_id}</td> {/* Avoid null values */}
                  <td>{token.patient_name}</td>
                  <td>{token.status || "Waiting"}</td> {/* Default status */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No tokens found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default PatientQueue;


