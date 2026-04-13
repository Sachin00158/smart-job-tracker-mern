import {
  FaHome,
  FaChartBar,
  FaSignOutAlt,
  FaUser,
  FaColumns,
  FaRobot
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition ${isActive
      ? "bg-white/20 text-white"
      : "text-white/80 hover:bg-white/20 hover:pl-4"
    }`;

  return (
    <>
      {/* BACKDROP (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed md:static z-50 w-64 min-h-screen
        bg-gradient-to-b from-blue-600 to-cyan-500 
        text-white p-4 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <h1 className="text-2xl font-bold mb-8 hidden md:block">
          Smart Job Tracker
        </h1>

        <ul className="space-y-2">
          <li><NavLink to="/" className={linkStyle}><FaHome />Dashboard</NavLink></li>
          <li><NavLink to="/profile" className={linkStyle}><FaUser />Profile</NavLink></li>
          <li><NavLink to="/analytics" className={linkStyle}><FaChartBar />Analytics</NavLink></li>
          <li><NavLink to="/board" className={linkStyle}><FaColumns />Board</NavLink></li>
          <li><NavLink to="/ai" className={linkStyle}><FaRobot />AI Match</NavLink></li>
        </ul>

        <div className="bg-white/20 p-2 rounded-xl flex justify-between items-center mt-6">
          <span className="text-sm flex items-center gap-2">
            <FaUser /> Logout
          </span>
          <button
            onClick={logout}
            className="bg-red-500 px-2 py-1 rounded hover:bg-red-600"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </>
  );
}