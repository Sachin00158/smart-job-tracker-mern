import { FaHome, FaChartBar, FaBars, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaColumns } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
export default function Sidebar() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 p-2 rounded-md ${isActive
      ? "bg-indigo-600 text-white"
      : "text-gray-300 hover:text-indigo-400"
    }`;

  return (
    <>
      {/* Mobile Top Bar */}

      <div className="md:hidden flex justify-between items-center p-4 bg-slate-950 text-white">

        <h1 className="text-lg font-bold text-indigo-400">
          Smart Job Tracker
        </h1>

        <FaBars
          className="cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* Sidebar */}

      <div
        className={`bg-slate-950 text-white w-64 min-h-screen p-6 fixed md:relative z-50 transition-transform ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <h1 className="text-xl font-bold mb-10 text-indigo-400 hidden md:block">
          Smart Job Tracker
        </h1>

        <ul className="space-y-4">

          

          <li>
            <NavLink to="/" className={linkStyle}>
              <FaHome />
              Dashboard
            </NavLink>
          </li>

         <li className="flex items-center gap-3 hover:text-indigo-400 cursor-pointer ml-2">
  <FaUser />
  <Link to="/profile">Profile</Link>
</li>

          <li>
            <NavLink to="/analytics" className={linkStyle}>
              <FaChartBar />
              Analytics
            </NavLink>
          </li>
          <li>
            <NavLink to="/board" className={linkStyle}>
              <FaColumns />
              Board
            </NavLink>
          </li>
          <li>
  <NavLink to="/ai" className={linkStyle}>
    <FaRobot />
    AI Match
  </NavLink>
</li>


        </ul>

        
        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-400 hover:text-red-500 mt-5"
        >
          <FaSignOutAlt />
          Logout
        </button>



      </div>



    </>
  );
}