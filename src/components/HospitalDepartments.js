import './header.css'
// src/components/HospitalDepartments.js
import { useEffect, useState } from "react";
import { fetchDepartments } from "../utils/api";

const HospitalDepartments = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadDepartments = async () => {
      try{
        const data = await fetchDepartments();
        setDepartments(data);
      }catch(error){
        console.error("Error fetching departments:",error);
      }
    };
    loadDepartments();
  }, []);

  return (
    <div className="fullpatientview">
    <section className='hospital-departments table'>
      <h2>Hospital Departments</h2>
      {departments.length === 0 ? <p>Loading departments...</p> : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr key={dept.dept_id}>
                <td>{dept.dept_id}</td>
                <td>{dept.department_name}</td>
                <td>{dept.location}</td>
              </tr>
            ))}
        </tbody>
      </table>
      )}
    </section>
    </div>
  );
};

export default HospitalDepartments;

