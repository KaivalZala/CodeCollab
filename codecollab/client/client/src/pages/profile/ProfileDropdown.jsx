import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { FaUser, FaClipboardList, FaCode, FaBell, FaCogs, FaSignOutAlt } from "react-icons/fa";
import { useContext } from "react";
import { AppContent } from "../../context/AppContext";

const ProfileDropdown = ({ userData, showDropdown, setShowDropdown }) => {
  const { backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);
  const navigate = useNavigate();

  // Logout function
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Logged out successfully");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };
  console.log("userData:", userData);

  // Function to render the profile image or the first letter of the name
  const renderProfileImage = () => {
    if (userData?.profilePic) {
      return (
        <img
          src={userData?.profilePic}
          alt="Profile"
          className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
        />
      );
    } else {
      // Fallback to first letter of the name
      return (
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold">
          {userData?.name?.[0]?.toUpperCase()}
        </div>
      );
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Profile Image - Click to Toggle Dropdown */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center bg-gray-100 p-1 rounded-full hover:bg-gray-200 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-haspopup="true"
        aria-expanded={showDropdown}
      >
        {renderProfileImage()}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-3 w-64 max-w-[90vw] bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in">
          {/* Header */}
          <div className="p-4 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
            <p className="text-black font-semibold px-4 py-2 truncate">Hi, {userData?.name || "User"}</p>
            <button onClick={() => setShowDropdown(false)} aria-label="Close dropdown">
              <IoMdClose className="text-gray-500 hover:text-red-500 transition duration-200" />
            </button>
          </div>

          {/* Menu Items */}
          <ul className="py-2">
            <li className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer transition-all text-gray-700">
              <FaUser className="text-gray-500" /> <Link to="/profile">Profile</Link>
            </li>
            <li className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer transition-all text-gray-700">
              <FaClipboardList className="text-gray-500" /> <Link to="/my-issues">My Issues</Link>
            </li>
            <li className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer transition-all text-gray-700">
              <FaCode className="text-gray-500" /> <Link to="/live">Live Collaboration</Link>
            </li>
            <li className="px-4 py-3 hover:bg-gray-100 flex items-center gap-2 cursor-pointer transition-all text-gray-700">
              <FaClipboardList className="text-gray-500" /> <Link to="/all-snippets">Snippets</Link>
            </li>
          </ul>

          {/* Logout Button */}
          <div className="border-t border-gray-200 bg-gray-100">
            <button
              className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-100 flex items-center gap-2 transition-all"
              onClick={logout}
            >
              <FaSignOutAlt /> <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
