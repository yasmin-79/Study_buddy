import React, { useState } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [password, setPassword] = useState("");

  const handleChangePassword = async () => {
    if (!password) return alert("Enter a new password");
    try {
      await axios.post(
        `${BACKEND_URL}/auth/change-password`,
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Password updated successfully");
      setPassword("");
    } catch (err) {
      console.error("Password update error:", err);
      alert("Failed to update password");
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 max-w-lg">
      <h2 className="text-lg font-semibold mb-4">Profile</h2>
      <p><strong>Name:</strong> {user?.name}</p>
      <p><strong>Email:</strong> {user?.email}</p>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Change Password</h3>
        <input
          type="password"
          placeholder="New Password"
          className="border rounded p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleChangePassword}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

export default Profile;
