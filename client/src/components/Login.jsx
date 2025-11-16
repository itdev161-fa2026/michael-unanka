import { useContext, useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';
import { loginUser } from '../services/api';

const LoginPage = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      toast.success("You're already logged in!");
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Call backend login
      const result = await loginUser(email, password);

      if (result.token) {
        // Save token + user
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Update global context
        login(result.user);

        toast.success("Logged in successfully!");
        navigate('/');
      } else {
        toast.error("Invalid email or password.");
      }

    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please try again.");
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
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">
          Login
        </button>

      </form>
    </div>
  );
};

export default LoginPage;


