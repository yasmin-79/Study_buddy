import React, { useEffect, useState } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

function Subjects() {
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

  // Group files by subject
  const grouped = files.reduce((acc, f) => {
    acc[f.subject] = acc[f.subject] ? [...acc[f.subject], f] : [f];
    return acc;
  }, {});

  return (
    <div className="bg-white shadow rounded p-6">
      <h2 className="text-lg font-semibold mb-4">Subjects</h2>
      {Object.keys(grouped).length > 0 ? (
        Object.keys(grouped).map((subj) => (
          <div key={subj} className="mb-6">
            <h3 className="font-semibold text-purple-600">{subj}</h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {grouped[subj].map((f) => (
                <div key={f.id} className="p-3 border rounded shadow-sm">
                  <p className="font-medium">{f.title}</p>
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
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No files grouped yet.</p>
      )}
    </div>
  );
}

export default Subjects;
