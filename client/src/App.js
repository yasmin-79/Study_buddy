import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/upload";
import Files from "./pages/files";
import Subjects from "./pages/subjects";
import Profile from "./pages/profile";
import Layout from "./components/layout";

function App() {
  const token = localStorage.getItem("token");

  return (
    <AuthProvider>
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes nested under /dashboard */}
      <Route
        path="/dashboard"
        element={token ? <Layout /> : <Navigate to="/login" replace />}
      >
        {/* Dashboard home */}
        <Route index element={<Dashboard />} />

        {/* Nested routes */}
        <Route path="upload" element={<Upload />} />
        <Route path="files" element={<Files />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </AuthProvider>
  );
}

export default App;
