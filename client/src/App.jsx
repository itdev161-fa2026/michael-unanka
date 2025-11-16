// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";  
import { AuthProvider } from "./context/AuthProvider";

import Header from "./components/Header";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">

          {/* ======= Navigation Header ======= */}
          <Header />

          {/* ======= GLOBAL TOAST NOTIFICATION SYSTEM ======= */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2600,

              // Base Toast Styling
              style: {
                background: "#ffffff",
                color: "#1f2937",
                border: "1px solid #e5e7eb",
                padding: "12px 16px",
                borderRadius: "10px",
                fontSize: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },

              // Success Toast
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#ffffff",
                },
                style: {
                  borderLeft: "6px solid #22c55e",
                },
              },

              // Error Toast
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
                style: {
                  borderLeft: "6px solid #ef4444",
                },
              },
            }}
          />

          {/* ======= APP ROUTES ======= */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Create */}
            <Route path="/create-post" element={<CreatePost />} />

            {/* Edit */}
            <Route path="/posts/:id/edit" element={<EditPost />} />
          </Routes>

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
