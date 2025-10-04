import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 font-bold text-xl border-b">StudyBuddy</div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/dashboard"
            className="block p-2 hover:bg-gray-200 rounded transition-colors"
          >
            📊 Dashboard
          </Link>
          <Link
            to="/dashboard/upload"
            className="block p-2 hover:bg-gray-200 rounded transition-colors"
          >
            ⬆️ Upload
          </Link>
          <Link
            to="/dashboard/files"
            className="block p-2 hover:bg-gray-200 rounded transition-colors"
          >
            📂 Files
          </Link>
          <Link
            to="/dashboard/subjects"
            className="block p-2 hover:bg-gray-200 rounded transition-colors"
          >
            📘 Subjects
          </Link>
          <Link
            to="/dashboard/profile"
            className="block p-2 hover:bg-gray-200 rounded transition-colors"
          >
            👤 Profile
          </Link>
        </nav>
        <button
          onClick={logout}
          className="m-4 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-white shadow">
          <h1 className="text-xl font-semibold">Hello EveryOne!</h1>
          <div className="font-medium text-gray-700">{user?.name || "User"}</div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
