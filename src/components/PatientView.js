import GenerateToken from "./GenerateToken";
import PatientQueue from "./PatientQueue";
import HospitalDepartments from "./HospitalDepartments";

const PatientView = () => {
  return (
    <div className="patdash">
      <h2>Patient Dashboard</h2>
      <GenerateToken />
      <PatientQueue />
      <HospitalDepartments />
    </div>
  );
};

export default PatientView;
