import Inventory from "./Inventory";
import PatientQueue from "./PatientQueue";
import HospitalDepartments from "./HospitalDepartments";
import Alerts from "./Alerts";
const StaffView = () => {
  return (
    <div className="staffdash">
      <h2>Staff Dashboard</h2>
      <PatientQueue />
      <Inventory />
      <HospitalDepartments />
      <Alerts />
    </div>
  );
};

export default StaffView;
