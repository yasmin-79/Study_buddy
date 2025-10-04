import React, { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

function Files() {
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFiles(res.data))
      .catch((err) => console.error("Error fetching files:", err));
  }, [token]);

  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="text-lg font-semibold mb-4">All Files</h2>
      <div className="grid grid-cols-3 gap-4">
        {files.length > 0 ? (
          files.map((f) => (
            <div key={f.id} className="p-3 border rounded shadow-sm">
              <p className="font-medium">{f.title}</p>
              <p className="text-sm text-gray-500">{f.subject}</p>
              <div className="flex space-x-4 mt-2">
                <a
                  href={`${BACKEND_URL}/uploads/${f.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500"
                >
                  View
                </a>
                <a
                  href={`${BACKEND_URL}/files/download/${f.filename}`}
                  className="text-green-500"
                >
                  Download
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default Files;
