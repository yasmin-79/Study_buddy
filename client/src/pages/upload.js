import React, { useState } from "react";
import axios from "axios";
import BACKEND_URL from "../config";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Upload() {
  const { token } = useContext(AuthContext);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${BACKEND_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, 
        },
      });

      alert("✅ File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "❌ Upload failed. Please check your network or login again."
      );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-cyan-400/20 to-purple-600/20">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Upload Files</h1>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-4"
        />
        <button
          onClick={handleUpload}
          className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default Upload;
