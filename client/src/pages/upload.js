import React, { useState, useEffect } from "react";
import axios from "axios";
import BACKEND_URL from "../config"; // Use the config

function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem("token");

  const fetchFiles = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Fetch files error:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const [loading, setLoading] = useState(false);

const handleUpload = async (e) => {
  e.preventDefault();
  if (!file) return alert("Please select a file");

  setLoading(true);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("subject", subject);

  try {
    const res = await axios.post(`${BACKEND_URL}/upload`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });

    alert(res.data.message);
    window.dispatchEvent(new Event("fileUploaded")); // trigger dashboard update
    setFile(null);
    setTitle("");
    setSubject("");
    fetchFiles();
  } catch (err) {
    console.error("Upload error:", err);
    alert(err.response?.data?.message || "Upload failed");
  } finally {
    setLoading(false);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await axios.delete(`${BACKEND_URL}/files/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(res.data.message);
      window.dispatchEvent(new Event("fileUploaded"));
      fetchFiles();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
<div className="bg-white shadow rounded p-6">
      {loading && <p className="text-blue-500 font-semibold">Uploading... Please wait ⏳</p>}

      <h2 className="text-lg font-semibold mb-4">Upload PDF</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
        <input
          type="text"
          placeholder="Enter Title"
          className="border rounded p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select className="border rounded p-2 w-full" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Select Subject</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="DBMS">DBMS</option>
          <option value="OOPS">OOPS</option>
          <option value="NoSQL">NoSQL</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Machine Learning">Machine Learning</option>
        </select>
        <button type    ="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
      </form>

      <h3 className="mt-6 font-semibold">Uploaded Files</h3>
      <div className="mt-3 grid grid-cols-3 gap-4">
        {files.map((f) => (
          <div key={f.id} className="p-3 border rounded shadow-sm">
            <p className="font-medium">{f.title}</p>
            <p className="text-sm text-gray-500">{f.subject}</p>
            <div className="flex space-x-4 mt-2">
              <a href={`${BACKEND_URL}/uploads/${f.filename}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">View</a>
              <a href={`${BACKEND_URL}/files/download/${f.filename}`} className="text-green-500">Download</a>
              <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Upload;
