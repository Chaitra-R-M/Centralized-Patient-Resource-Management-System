import { useState } from "react";
import { io } from "socket.io-client";
import './header.css'
const socket=io("http://127.0.0.1:5000");
const GenerateToken = () => {
  const [formData, setFormData] = useState({ patientName: "", department: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.department) {
      setMessage("Please fill in all fields!");
      return;
    }
    try{
      const response = await fetch("http://localhost:5000/token",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          dept_id:formData.department,
          patient_name:formData.patientName,
        }),
      });
      await response.json();
      if(response.ok){
        setMessage(`Token generated for ${formData.patientName}`);
        socket.emit("new_token_generated");
      }else{
        setMessage(`Token generation failed`);
      }
    }catch(error){
      console.error("Error:",error);
      setMessage(`An error occured while generating the token`);
    }
  };

  return (
    <div className="fullpatientview">
      <section className="generate-token">
      <h2>Generate New Token</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Patient Name:</label>
          <input className="patient" type="text" onChange={(e) => setFormData({ ...formData, patientName: e.target.value })} />
        </div>
        <div>
          <label>Department:</label>
          <select className="dept" onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
            <option value="">Select a department</option>
            <option value="D001">Cardiology</option>
            <option value="D002">Orthopedics</option>
            <option value="D003">OT</option>
            <option value="D004">General Medicine</option>
          </select>
        </div>
        <div>
          <button type="submit">Generate Token</button>
        </div>
      </form>
      {message && <p className="success-message">{message}</p>}
    </section>
    </div>
    
  );
};

export default GenerateToken;

