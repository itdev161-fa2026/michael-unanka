// client/src/pages/LoginPage.jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { loginUser } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(email, password);

      if (!res.token) {
        toast.error("Invalid email or password");
        return;
      }

      // ⭐ Send both to context
      login(res.user, res.token);

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
