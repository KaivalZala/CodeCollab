
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <nav className="p-4 shadow-lg relative w-full top-0 z-50 flex justify-between items-center text-white bg-gradient-to-r from-blue-500 to-indigo-600">
        {/* Logo */}
        <div className="text-2xl font-bold">CodeCollab</div>
        
        {/* Hamburger Icon for Mobile */}
        <button className="md:hidden flex items-center px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/userdashboard" className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">Home</Link>
          <Link to="/my-issues" className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">My Issues</Link>
          <Link to="/all-snippets" className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">All Snippets</Link>
          <Link to="/my-snippets" className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">My Snippets</Link>
          <Link to="/live" className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">Live Coding</Link>
          <Link to="/post-issues" className="relative transition-all duration-300 hover:text-purple-300 hover:scale-110 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-300 after:left-0 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">Post Issues</Link>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-slate-900 flex flex-col items-center space-y-4 py-4 shadow-lg md:hidden animate-fade-in z-40">
            <Link to="/userdashboard" className="w-full text-center py-2 hover:bg-blue-800" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/my-issues" className="w-full text-center py-2 hover:bg-blue-800" onClick={() => setMobileMenuOpen(false)}>My Issues</Link>
            <Link to="/all-snippets" className="w-full text-center py-2 hover:bg-blue-800" onClick={() => setMobileMenuOpen(false)}>All Snippets</Link>
            <Link to="/my-snippets" className="w-full text-center py-2 hover:bg-blue-800" onClick={() => setMobileMenuOpen(false)}>My Snippets</Link>
            <Link to="/live" className="w-full text-center py-2 hover:bg-blue-800" onClick={() => setMobileMenuOpen(false)}>Live Coding</Link>
            <Link to="/post-issues" className="w-full text-center py-2 hover:bg-blue-800" onClick={() => setMobileMenuOpen(false)}>Post Issues</Link>
          </div>
        )}

        {/* Icons & User Actions */}
        <div className="flex items-center space-x-6">
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

