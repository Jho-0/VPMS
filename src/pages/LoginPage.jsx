//LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/Authcontext";
import bgPhoto from "../assets/HospitalPhoto_bg.jpg";
import logo from "../assets/LMCDC.png";
import { FaUser, FaLock } from "react-icons/fa";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(credentials);
    if (success) {
      const role = localStorage.getItem("role");
      if (role === "admin") {
        navigate("dashboard-admin", { replace: true });
      } else if (role === "receptionist") {
        navigate("/receptionist-user", { replace: true });
      } else if (role === "visitor") {
        navigate("/visitor-dashboard", { replace: true });
      } else {
        alert("Unknown role. Please contact admin.");
      }
    }
  };

  return (
    <div
      className="w-screen h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgPhoto})` }}
    >
      <div className="flex w-[750px] h-[400px] shadow-2xl rounded-xl overflow-hidden bg-white/90">
        <div className="w-1/2 bg-gradient-to-b from-green-700 to-green-600 flex flex-col items-center justify-center text-white p-6">
          <img src={logo} alt="Lacasandile Medical Clinic Logo" className="w-24 h-24 mb-4" />
          <h1 className="text-center text-lg font-semibold leading-tight">
            Visitor Pass<br />Management System
          </h1>
        </div>
        <form className="w-1/2 p-8 flex flex-col justify-center space-y-4 bg-white" onSubmit={handleSubmit}>
          <h1 className="text-center text-2xl font-bold text-gray-800 mb-2">Login Page</h1>

          {error && (
            <div className="bg-red-100 text-red-800 p-2 text-center border border-red-400 rounded text-sm">
              <i>{error}</i>
            </div>
          )}

          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm text-gray-700 font-medium mb-1">Username</label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" id="username" name="username" value={credentials.username} placeholder="Enter Here" onChange={handleChange}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm text-gray-700 font-medium mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" id="password" name="password" value={credentials.password} placeholder="Enter Here" onChange={handleChange}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          </div>



          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded shadow">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
