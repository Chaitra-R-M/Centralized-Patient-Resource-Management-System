import { Link } from "react-router-dom";
import './header.css'
const Home = () => {
  return (
    <div className="intro">
      <div className="banner">
        <h1>Welcome to Wenlock Hospital!!</h1>
        <div className="hospitalbanner"></div>
      </div>
        <div className="home">
          <h2>Dashboard</h2>
          <div className="links">
            <div className="patientview">
              <Link to="/patient">Go to Patient View</Link>
            </div>
            <div className="staffview">
              <Link to="/staff">Go to Staff View</Link>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Home;
