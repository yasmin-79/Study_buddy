import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import BACKEND_URL from "../config"; // ✅ import this

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login`, form); // ✅ use live URL
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error while logging in");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-400/20 to-purple-600/20">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
