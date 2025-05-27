import { NavLink } from "react-router-dom";
import { FaHome, FaEye, FaUser, FaClipboardList, FaCalendarAlt, FaCog } from "react-icons/fa";
import { BsEye } from "react-icons/bs";

const SideNav = () => {
  return (
    <div className="w-64 h-screen  text-black flex flex-col p-5 fixed border border-gray-300">
        <div className="flex items-center text-xl font-bold text-center mb-6 gap-2 ml-3">
        <BsEye size={20}/>
      <h2 className="">Vision AI</h2>
      </div>
      
      <nav>
        <ul className="space-y-4">
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive ? "bg-blue-300 text-black" : "hover:bg-blue-200"
                }`
              }
            >
              <FaHome className="text-lg" /> Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/eye-test" 
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive ? "bg-blue-300 text-black" : "hover:bg-blue-200"
                }`
              }
            >
              <FaEye className="text-lg" /> Eye Test
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/reports" 
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive ? "bg-blue-300 text-black" : "hover:bg-blue-200"
                }`
              }
            >
              <FaClipboardList className="text-lg" /> Reports
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/appointments" 
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition ${
                  isActive ? "bg-blue-300 text-black" : "hover:bg-blue-200"
                }`
              }
            >
              <FaCalendarAlt className="text-lg" /> Appointments
            </NavLink>
          </li>
          {/* <li>
            <NavLink 
              to="/profile" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-300 transition"
            >
              <FaUser className="text-lg" /> Profile
            </NavLink>
          </li> */}
          {/* <li>
            <NavLink 
              to="/settings" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-300 transition"
            >
              <FaCog className="text-lg" /> Settings
            </NavLink>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;

