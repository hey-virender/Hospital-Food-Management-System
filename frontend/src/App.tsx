import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthWrapper from "./components/auth/AuthWrapper";
import Home from "./components/Home";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./components/dashboard/Dashboard";
import StaffDashboard from "./components/dashboard/StaffDashboard";
import PatientDetails from "./components/patients/PatientDetails";
import Analytics from "./components/analytics/Analytics";
import Profile from "./components/auth/Profile";
import { Alert } from "@mui/material";

const App = () => {
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const { error, message } = useSelector((state: any) => state.ui);

  return (
    <Router>
      {(error || message) && (
        <Alert severity={error ? "error" : "success"}>
          {error ? error : message}
        </Alert>
      )}
      <AuthWrapper>
        <Routes>
          <Route path="/profile" element={<Profile />} />
          {user?.role == "Admin" ? (
            <>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/patient/:patientId" element={<PatientDetails />} />
            </>
          ) : (
            <Route path="/" element={<StaffDashboard />} />
          )}
        </Routes>
      </AuthWrapper>
    </Router>
  );
};

export default App;
