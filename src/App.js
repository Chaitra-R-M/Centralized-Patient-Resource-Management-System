import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import PatientView from "./components/PatientView";
import StaffView from "./components/StaffView";

function App() {
  console.log("App is rendering..."); // Debug log
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient" element={<PatientView />} />
        <Route path="/staff" element={<StaffView />} />
      </Routes>
    </Router>
  );
}
fetch("http://localhost:5000/data")
  .then(response => response.json())
  .then(data => console.log(data));

export default App;
