import React, { useState } from "react";
import UserNavbar from "../components/Usernavbar";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Code, Users, MessageCircle, Sparkles, ShieldCheck, Search, Activity,GraduationCap,Briefcase,Globe, Lightbulb,Folder } from "lucide-react"; // Icons
import RecentIssues from "../components/RecentIssues";
import { Link } from "react-router-dom";



const userTypes = [
  {
    title: "👩‍💻 Developers",
    description: "Collaborate with peers, solve coding issues, and contribute to open-source projects.",
    icon: <Code size={40} className="text-blue-500" />,
  },
  {
    title: "🎓 Students",
    description: "Learn new technologies, participate in live coding sessions, and get mentorship from experts.",
    icon: <GraduationCap size={40} className="text-green-500" />,
  },
  {
    title: "🚀 Open-Source Contributors",
    description: "Work on exciting projects, submit pull requests, and enhance your coding portfolio.",
    icon: <Users size={40} className="text-purple-500" />,
  },
  {
    title: "🏢 Professionals",
    description: "Get support from the community, improve workflow efficiency, and debug projects faster.",
    icon: <Briefcase size={40} className="text-red-500" />,
  },
  {
    title: "🌎 Global Coding Community",
    description: "Connect with developers worldwide, participate in discussions, and improve your skills.",
    icon: <Globe size={40} className="text-yellow-500" />,
  },
  {
    title: "💡 Tech Enthusiasts",
    description: "Explore coding trends, experiment with new technologies, and stay ahead in the tech world.",
    icon: <Lightbulb size={40} className="text-orange-500" />,
  },
];

const features = [
  {
    id: 1,
    title: "💻 Live Code Collaboration",
    description: "Code in real-time with your team or friends. Our interactive editor allows multiple developers to work on the same codebase simultaneously, making collaboration seamless.",
    icon: <Code size={40} className="text-blue-500" />,
  },
  {
    id: 2,
    title: "🌍 Community Support",
    description: "Get instant help from the global developer community. Whether you're stuck on a bug or need optimization tips, experienced coders are here to assist.",
    icon: <Users size={40} className="text-green-500" />,
  },
  {
    id: 3,
    title: "🤖 AI-Powered Debugging",
    description: "Struggling with a bug? Our AI-powered debugging tool scans your code, detects potential errors, and suggests fixes, helping you debug faster and more efficiently.",
    icon: <Sparkles size={40} className="text-yellow-500" />,
  },
  {
    id: 4,
    title: "📢 Open-Source Friendly",
    description: "Contribute to open-source projects, collaborate with other developers, and grow your portfolio by solving real-world coding challenges.",
    icon: <MessageCircle size={40} className="text-purple-500" />,
  },
  {
    id: 5,
    title: "📂 Code Snippet Sharing",
    description: "Save and share reusable code snippets with the community to speed up development and solve common coding challenges.",
    icon: <Folder size={40} className="text-indigo-500" />,
  },  
  {
    id: 6,
    title: "🛡️ Secure & Reliable Platform",
    description: "Your code and discussions are safe with us. We implement security measures to ensure data privacy and provide a stable platform for developers worldwide.",
    icon: <ShieldCheck size={40} className="text-red-500" />,
  }
];










// Store image paths in an array
const welcomeImages = [
    "/src/assets/wel1.jpeg",
    "/src/assets/wel2.jpeg",
    "/src/assets/wel3.jpeg",
    "/src/assets/wel4.jpeg",
    "/src/assets/wel5.jpeg",
  ];



const Dashboard = () => {

  const [openFAQ, setOpenFAQ] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const faqs = [
    { 
      question: "How do I start collaborating?", 
      answer: "You can start by joining a live session or posting an issue." 
    },
    { 
      question: "Is this platform free to use?", 
      answer: "Yes, CodeCollab is free for all users." 
    },
    { 
      question: "Can I create private issues?", 
      answer: "Currently, all issues are public, but private issues are in development." 
    },
    { 
      question: "What programming languages does CodeCollab support?", 
      answer: "CodeCollab supports multiple programming languages, including JavaScript, Python, Java, C++, and more." 
    },
    { 
      question: "Can I fork and edit code snippets?", 
      answer: "Yes! You can fork, modify, and share code snippets with the community." 
    },
    { 
      question: "How do I get help with my coding issue?", 
      answer: "Post your issue with a detailed description and relevant tags. Community members will help you debug and find a solution." 
    },
    { 
      question: "Can I integrate CodeCollab with GitHub?", 
      answer: "GitHub integration is planned for future updates, allowing seamless issue tracking and collaboration." 
    },
    { 
      question: "Is CodeCollab suitable for teams and organizations?", 
      answer: "Yes! Teams can collaborate in real-time, share code, and work on projects together." 
    },
    { 
      question: "How do I report inappropriate content?", 
      answer: "You can report any inappropriate content using the 'Report' button on posts. Our moderation team will review it." 
    },
  ];
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
  {/* Navbar & Welcome Section Combined Background */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">

      <UserNavbar/>
        {/* Welcome Section */}
        <section className="shadow-lg rounded-lg p-4 sm:p-6 md:p-10 flex flex-col md:flex-row items-center md:h-[500px] h-auto transition-all duration-300 m-4 sm:m-8 md:m-[80px] gap-8 md:gap-0">
          {/* Left: Image Slider */}
          <div className="relative w-full md:w-1/2 mb-6 md:mb-0">
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="rounded-lg shadow-lg"
            >
              {welcomeImages.map((image, index) => (
                <SwiperSlide key={index} className="relative z-10">
                  <img src={image} alt={`Slide ${index + 1}`} className="rounded-lg w-full h-48 sm:h-64 md:h-[400px] object-cover" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right: Text and Buttons */}
          <motion.div 
            className="w-full md:w-1/2 text-center md:text-left p-2 sm:p-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Welcome to CodeCollab 🚀</h2>
            <p className="text-base sm:text-lg text-gray-200 mt-3">
              Join developers worldwide, solve coding issues, and collaborate in real-time.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold shadow-md"
              >
                <Link to="/live">Start Live Coding</Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold shadow-md"
              >
                <Link to="/post-issues">Post an Issue</Link>
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Recent Issues Section */}

{/* Recent Issues Section */}
<RecentIssues/>
{/*why use codecolllab */}

<section className="bg-gradient-to-br from-gray-50 to-gray-200 p-12 rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900">🚀 What Makes CodeCollab the Best Choice for Developers?</h2>
        <p className="text-gray-700 text-lg mt-3 max-w-2xl mx-auto">
          CodeCollab is a next-generation coding platform designed for seamless collaboration, debugging, and open-source contributions. Whether you're a beginner or an expert, our tools empower you to write, fix, and improve code with a supportive community.
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 text-black">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all"
          >
            {feature.icon}
            <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
            <p className="text-gray-600 text-sm mt-3">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>


{/*who use codecolllab */}

<section className="bg-white p-12 rounded-lg shadow-lg">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900">👥 CodeCollab: A Community for Everyone</h2>
        <p className="text-gray-700 text-lg mt-3 max-w-2xl mx-auto">
          CodeCollab is designed for developers, students, and professionals looking to collaborate, debug, and grow together.
        </p>
      </div>

      {/* User Type Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 text-black">
        {userTypes.map((user, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-100 p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all"
          >
            {user.icon}
            <h3 className="text-xl font-semibold mt-4">{user.title}</h3>
            <p className="text-gray-600 text-sm mt-3">{user.description}</p>
          </motion.div>
        ))}
      </div>
    </section>


{/* CTA Section */}
<section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg rounded-lg p-14 min-h-[450px] flex flex-col justify-center text-center relative overflow-hidden">
  
  {/* Background Glow Effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-40 blur-3xl"></div>
  
  {/* Main Title */}
  <motion.h2 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-4xl font-bold relative"
  >
    Join Us & Grow Your Coding Skills 🚀
  </motion.h2>
  
  <motion.p 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 0.3 }}
    className="mt-4 text-lg opacity-90 max-w-2xl mx-auto relative"
  >
    Collaborate with developers worldwide, solve problems, and improve your coding experience.
  </motion.p>

  {/* Key Features */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 relative">
    {/* Feature 1 */}
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 p-5 rounded-lg"
    >
      <h3 className="text-xl font-semibold">🛠️ Code & Debug</h3>
      <p className="text-sm opacity-80 mt-2">Solve coding challenges and debug with others.</p>
    </motion.div>
    
    {/* Feature 2 */}
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 p-5 rounded-lg"
    >
      <h3 className="text-xl font-semibold">🤝 Collaborate Live</h3>
      <p className="text-sm opacity-80 mt-2">Work on projects with real-time collaboration.</p>
    </motion.div>

    {/* Feature 3 */}
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="bg-white/10 p-5 rounded-lg"
    >
      <h3 className="text-xl font-semibold">📚 Learn & Share</h3>
      <p className="text-sm opacity-80 mt-2">Share your knowledge and learn from peers.</p>
    </motion.div>
  </div>

  {/* Call to Action Buttons */}
  <div className="flex justify-center gap-4 mt-6 relative">
    {/* Contact Us Button */}
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg transition-all hover:bg-indigo-100 shadow-md"
    >
      <span>Contact Us</span>
      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
      </svg>
    </motion.button>

  </div>

</section>



       {/* FAQ Section */}
       <section className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center">Frequently Asked Questions</h2>
      <p className="text-gray-600 text-center mb-4">Find answers to the most common questions below.</p>

      <div className="mt-6 space-y-4 text-black">
        {faqs.slice(0, showAll ? faqs.length : 3).map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-gray-100 p-5 rounded-lg cursor-pointer shadow-md border-l-4 transition-all duration-300 ease-in-out 
                       hover:bg-gray-200 hover:shadow-lg border-blue-500"
            onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
          >
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg">{faq.question}</p>
              {openFAQ === index ? <FaChevronUp className="text-blue-500" /> : <FaChevronDown className="text-blue-500" />}
            </div>
            {openFAQ === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-gray-700 leading-relaxed">{faq.answer}</p>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Show More / Show Less Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          {showAll ? "Show Less ▲" : "Show More ▼"}
        </button>
      </div>
    </section>



        </div>
        {/* Footer */}
        <footer className="w-full bg-gray-900 text-white text-center p-4 mt-auto">
      <p>© 2024 Website. All rights reserved.</p>
    </footer>
    </div>
  );
};

export default Dashboard;


