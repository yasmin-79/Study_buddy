import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/upload";
import { AuthProvider, AuthContext } from "./context/AuthContext";

function AppRoutes() {
  const { token } = useContext(AuthContext);

  return (
    <Routes>
      {/* Redirect logged-in users to dashboard */}
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" /> : <Register />}
      />
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" /> : <Login />}
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/upload"
        element={token ? <Upload /> : <Navigate to="/login" />}
      />

      {/* If route doesn't exist */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
