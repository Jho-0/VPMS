//App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/Authcontext";
import DashboardPage from "./pages/DashboardPage";
import LogsPage from "./pages/LogsPage";
import ReportPage from "./pages/ReportPage";
import ManageUser from "./pages/ManageUser";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import AppointmentPage from "./pages/AppointmentPage";
import ReceptionistDashboard from "./pages/ReceptionistDashboard";
import ScanningModule from "./components/ScanningModule";

const PrivateRoute = ({ element }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      logout();
      navigate("/", { replace: true });
    }
    if (user && location.pathname === "/") {
      logout();
      navigate("/", { replace: true });
    }
  }, [user, location, navigate, logout]);

  return user ? element : null;
};


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard-admin" element={<PrivateRoute element={<DashboardPage />} />} />
          <Route path="/monitor-visitor-logs" element={<PrivateRoute element={<LogsPage />} />} />
          {/* <Route path="/generate-report" element={<PrivateRoute element={<ReportPage />} />} /> */}
          <Route path="/manageuser-admin" element={<PrivateRoute element={<ManageUser />} />} />
          <Route path="/receptionist-user" element={<PrivateRoute element={<ReceptionistDashboard />} />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/scan-visitor" element={<ScanningModule />} />
        </Routes>
      </Router>
      <ToastContainer />
      {/* External/Public Link Example (for demo, add to sidebar or homepage as needed) */}

    </>
  );
}

export default App;