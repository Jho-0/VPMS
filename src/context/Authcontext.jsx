import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Persist user on refresh (optional, but helps with browser navigation)
  useEffect(() => {
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const access = localStorage.getItem("accessToken");
    if (username && role && access) {
      setUser({ username, role });
    } else {
      setUser(null);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post("http://localhost:8000/api/login/", credentials);
      const { access, refresh, username, role } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);

      setUser({ username, role });
      setError(null);
      return true;
    } catch (err) {
      console.error(err);
      setError("Invalid username or password");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("access_token");
    // Force a reload to clear any cached state
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);