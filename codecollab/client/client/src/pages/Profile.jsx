// import { useContext, useEffect } from "react";
// import { AppContent } from "../context/AppContext";
// import { useNavigate } from "react-router-dom";
// import { LogOut } from "lucide-react";
// import UserNavbar from "../components/Usernavbar";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ProfilePage = () => {
//   const {
//     userData,
//     backendUrl,
//     setUserData,
//     setIsLoggedin,
//     getUserData,
//   } = useContext(AppContent);

//   const navigate = useNavigate();

//   useEffect(() => {
//     getUserData();
//   }, []);

//   const logout = async () => {
//     try {
//       axios.defaults.withCredentials = true;
//       const { data } = await axios.put(`${backendUrl}/api/auth/logout`);
//       if (data.success) {
//         setIsLoggedin(false);
//         setUserData(null);
//         navigate("/login");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const firstLetter = userData?.name?.[0]?.toUpperCase() || "U";

//   return (
//     <>
//       <div className="relative min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white overflow-hidden">
//         <UserNavbar />

//         {/* Abstract background circles */}
//         <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
//         <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-2xl opacity-20 animate-ping"></div>

//         {/* Centered Glass Card */}
//         <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4 z-10 relative">
//           <div className="backdrop-blur-md bg-white/10 border border-white/30 rounded-3xl p-10 w-full max-w-xl shadow-2xl text-center">
//             {/* Profile Picture */}
//             <div className="w-32 h-32 rounded-full bg-white/20 text-white flex items-center justify-center text-5xl font-extrabold mx-auto shadow-md ring-4 ring-white/30">
//               {firstLetter}
//             </div>

//             {/* User Info */}
//             <h1 className="mt-6 text-3xl font-bold tracking-wide">
//               {userData?.name || "Your Name"}
//             </h1>
//             <p className="text-white/80 text-lg mt-1">{userData?.email}</p>

//             {/* Logout */}
//             <button
//               onClick={logout}
//               className="mt-8 bg-red-500 hover:bg-red-600 transition-all duration-200 text-white px-6 py-3 rounded-full font-medium text-lg shadow-md flex items-center justify-center mx-auto"
//             >
//               <LogOut className="w-5 h-5 mr-2" /> Logout
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProfilePage;






// option 2

// import { useContext, useEffect } from "react";
// import { AppContent } from "../context/AppContext";
// import { useNavigate } from "react-router-dom";
// import { LogOut, Mail } from "lucide-react";
// import UserNavbar from "../components/Usernavbar";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ProfilePage = () => {
//   const {
//     userData,
//     backendUrl,
//     setUserData,
//     setIsLoggedin,
//     getUserData,
//   } = useContext(AppContent);

//   const navigate = useNavigate();

//   useEffect(() => {
//     getUserData();
//   }, []);

//   const logout = async () => {
//     try {
//       axios.defaults.withCredentials = true;
//       const { data } = await axios.put(`${backendUrl}/api/auth/logout`);
//       if (data.success) {
//         setIsLoggedin(false);
//         setUserData(null);
//         navigate("/login");
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const firstLetter = userData?.name?.[0]?.toUpperCase() || "U";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-800 text-white">
//       <UserNavbar />

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center px-8 py-20 max-w-6xl mx-auto">
//         {/* Left Panel */}
//         <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-2xl">
//           <div className="flex flex-col items-center space-y-6">
//             <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold text-white shadow-lg ring-4 ring-white/30">
//               {firstLetter}
//             </div>
//             <div className="text-center">
//               <h1 className="text-3xl font-bold">{userData?.name}</h1>
//               <p className="flex items-center justify-center gap-2 mt-2 text-white/80">
//                 <Mail className="w-5 h-5" />
//                 {userData?.email}
//               </p>
//             </div>
//             <button
//               onClick={logout}
//               className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-md flex items-center gap-2"
//             >
//               <LogOut className="w-5 h-5" /> Logout
//             </button>
//           </div>
//         </div>

//         {/* Right Panel: Visual Fill + Quote or Dev Info */}
//         <div className="text-white px-6 space-y-6">
//           <h2 className="text-4xl font-extrabold leading-snug tracking-tight">
//             Welcome back, <span className="text-yellow-300">{userData?.name?.split(" ")[0]}</span> 👋
//           </h2>
//           <p className="text-lg text-white/80">
//             Your journey starts here. Explore your skills, join coding sessions, or contribute to live projects. You have the power to create amazing things.
//           </p>

//           <div className="mt-8 bg-white/5 p-6 rounded-xl border border-white/10 shadow-inner">
//             <p className="text-sm text-white/70 italic">
//               “Code is like humor. When you have to explain it, it’s bad.” — Cory House
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


// option 3

import { useContext, useEffect, useState } from "react";
import { AppContent } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail } from "lucide-react";
import UserNavbar from "../components/Usernavbar";
import axios from "axios";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const {
    userData,
    backendUrl,
    setUserData,
    setIsLoggedin,
    getUserData,
  } = useContext(AppContent);

  const navigate = useNavigate();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    getUserData();
  }, []);

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const firstLetter = userData?.name?.[0]?.toUpperCase() || "U";

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white"
    >
      <UserNavbar />

      {/* Cursor-following glow */}
      <div
        className="pointer-events-none fixed top-0 left-0 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl z-0 transition-all duration-300 ease-out"
        style={{
          transform: `translate(${cursorPosition.x - 120}px, ${cursorPosition.y - 120}px)`,
        }}
      />

      <div className="flex flex-col items-center justify-center text-center pt-28 pb-12 px-6 max-w-4xl mx-auto relative z-10 space-y-10">

        {/* Profile card */}
        <div className="relative group bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl w-full max-w-2xl transition-all hover:scale-[1.02] hover:shadow-indigo-500/30">
          <div className="flex items-center gap-6 sm:gap-10">
            {/* Profile Icon */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-extrabold text-white shadow-md ring-4 ring-white/10 animate-floating3D">
              {firstLetter}
            </div>

            {/* Name & Email */}
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {userData?.name}
              </h1>
              <p className="flex items-center text-white/70 text-sm sm:text-base">
                <Mail className="w-5 h-5 mr-2" />
                {userData?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-4">
          <button
            onClick={logout}
            className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white px-8 py-3 rounded-full shadow-lg font-semibold tracking-wide text-base sm:text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-pink-500/50 animate-glow"
          >
            <span className="inline-flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Logout
            </span>
          </button>
        </div>

        {/* Hero-style Message */}
        <div className="mt-12 w-full max-w-3xl bg-white/5 p-10 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Welcome to Your Developer Hub 🧑‍💻
          </h2>
          <p className="text-white/70 text-base leading-7">
            Got a bug or stuck on a tricky piece of code? <br />
            Post your issues and let the community jump in to help.
          </p>
          <p className="text-white/70 text-base leading-7 mt-4">
            Collaborate live, debug together, and never code alone again. <br />
            This is your space to grow, solve, and build — together.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
