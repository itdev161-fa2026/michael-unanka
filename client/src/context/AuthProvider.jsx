// client/src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "./authContext";
import { registerUser as registerAPI, loginUser as loginAPI } from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);         // { _id, name, email }
  const [token, setToken] = useState(null);       // auth token
  const [loading, setLoading] = useState(true);

  // Load local token on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);

        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
        } else {
          setToken(storedToken);
          setUser(decoded.user);
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // REGISTER
  const register = async (name, email, password) => {
    const data = await registerAPI(name, email, password);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  // LOGIN
  const login = (userObj, tokenStr) => {
    localStorage.setItem("token", tokenStr);
    localStorage.setItem("user", JSON.stringify(userObj));

    setToken(tokenStr);
    setUser(userObj);
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
