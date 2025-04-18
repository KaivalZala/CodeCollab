
import React, { useContext, useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContent } from '../context/AppContext';
import ProfileDropdown from "../pages/profile/ProfileDropdown"; 

const UserNavbar = () => {
    const navigate = useNavigate();
    const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);
    const [showDropdown, setShowDropdown] = useState(false);

    // Send verification OTP
    const sendVerificationOtp = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendUrl + "/api/auth/send-verify-otp");
  
        if (data.success) {
          navigate("/email-verify");
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
          setUserData(JSON.parse(storedUser));
        }
    }, []);

    // Logout function
    const logout = async () => {
      try {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(backendUrl + "/api/auth/logout");
        if (data.success) {
          setIsLoggedin(false);
          setUserData(null);
          navigate("/login");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    return (
      <nav className="p-4 shadow-lg relative w-full top-0 z-50 flex justify-between items-center text-white">
        {/* Logo */}
        <div className="text-2xl font-bold">CodeCollab</div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/userdashboard" className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">Home</Link>
          <Link to="/my-issues" className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">My Issues</Link>
          <Link to="/all-snippets" className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">All Snippets</Link>
          <Link to="/my-snippets" className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">My Snippets</Link>
          <Link 
  to="/live"
  className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 
  after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 
  after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
>
  Live Coding
</Link>

          <Link to="/post-issues
          " className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">Post Issues</Link>
        </div>

        {/* Icons & User Actions */}
        <div className="flex items-center space-x-6">
          {/* Notification Icon with Hover Effect */}
          <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-in-out transform hover:scale-110 shadow-md">
            <Bell className="w-6 h-6 text-gray-600" />
          </button>

          {/* Verify Email Button */}
          {userData && !userData.isAccountVerified && (
            <button 
              onClick={sendVerificationOtp} 
              className="bg-yellow-500 px-4 py-2 rounded-md text-black font-semibold shadow-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105"
            >
              Verify Email
            </button>
          )}

          {/* Profile Dropdown with Clickable Image */}
          {userData && (
            <ProfileDropdown
              userData={userData}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
            />
          )}
        </div>
      </nav>
    );
};

export default UserNavbar;

