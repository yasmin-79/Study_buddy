import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import BACKEND_URL from "../config"; // ✅ import the backend URL

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleRegister = async () => {
    try {
      await axios.post(`${BACKEND_URL}/auth/register`, form); // ✅ use BACKEND_URL
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message === "Email already registered") {
        alert("Email already registered. Please login.");
      } else {
        alert("Error while registering");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-400/20 to-cyan-600/20">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Register</h1>

        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded mb-3"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
        >
          Register
        </button>

        <div className="text-center mt-4">
          <p className="text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
