import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BACKEND_URL from "../config";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [studyStats, setStudyStats] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch files and calculate subject-wise progress
  const fetchProgress = async () => {
    setLoading(true); // start loading
    try {
      const res = await axios.get(`${BACKEND_URL}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Group files by subject
      const grouped = res.data.reduce((acc, f) => {
        acc[f.subject] = acc[f.subject] ? acc[f.subject] + 1 : 1;
        return acc;
      }, {});

      // Calculate progress (target 5 files per subject)
      const stats = Object.keys(grouped).map((subject) => ({
        subject,
        progress: Math.min((grouped[subject] / 5) * 100, 100),
      }));

      setStudyStats(stats);
    } catch (err) {
      console.error("Fetch progress error:", err);
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    fetchProgress();

    // Listen for uploads to update progress
    window.addEventListener("fileUploaded", fetchProgress);
    return () => window.removeEventListener("fileUploaded", fetchProgress);
  }, []);

  const cards = [
    { title: "Upload Notes", desc: "Upload and manage your study materials", icon: "⬆️", path: "/dashboard/upload" },
    { title: "View Files", desc: "Access uploaded PDFs and files", icon: "📁", path: "/dashboard/files" },
    { title: "Subjects", desc: "Organize your subjects and topics", icon: "📘", path: "/dashboard/subjects" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-slate-800">
          Welcome to <span className="text-blue-600">StudyBuddy</span>
        </h1>
      </div>

      {/* Study Progress */}
      <div className="bg-white shadow-lg rounded-2xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">Study Progress</h2>
        {loading ? (
          <p className="text-blue-500 font-semibold">Loading progress... ⏳</p>
        ) : studyStats.length > 0 ? (
          <div className="space-y-4">
            {studyStats.map((stat) => (
              <div key={stat.subject}>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-700 font-medium">{stat.subject}</span>
                  <span className="text-gray-500 text-sm">{Math.round(stat.progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No progress yet. Upload some files!</p>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {cards.map((item) => (
          <div
            key={item.title}
            onClick={() => navigate(item.path)}
            className="bg-white shadow-md hover:shadow-xl transition rounded-2xl border border-slate-200 cursor-pointer p-6 text-center"
          >
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-slate-700">{item.title}</h3>
            <p className="text-gray-500 text-sm mt-2">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
