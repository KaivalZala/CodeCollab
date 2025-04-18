import { useState, useEffect, useContext } from "react";
import UserNavbar from "../components/UserNavbar";
import { getAllSnippets, upvoteSnippet } from "../api";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiCopy } from "react-icons/fi";
import { FaCode } from "react-icons/fa";
import { BiCodeAlt } from "react-icons/bi";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const AllSnippets = () => {
  const { isLoggedin } = useContext(AppContent);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchAllSnippets();
  }, []);

  const fetchAllSnippets = async () => {
    try {
      setLoading(true);
      const response = await getAllSnippets();
      if (response.success) {
        // Check which snippets the user has already upvoted
        const upvotedSnippets = JSON.parse(localStorage.getItem("upvotedSnippets")) || [];

        const updatedSnippets = response.snippets.map(snippet => ({
          ...snippet,
          hasUpvoted: upvotedSnippets.includes(snippet._id),
          username: snippet.user?.name || "Unknown User",
        }));

        setSnippets(updatedSnippets);
      } else {
        toast.error("Failed to fetch snippets");
      }
    } catch (error) {
      console.error("Error fetching snippets:", error);
      toast.error("Failed to fetch snippets");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (event, snippetId) => {
    event.stopPropagation();

    const token = localStorage.getItem("token");
    if (!isLoggedin || !token) {
      toast.warning("⚠️ You must be logged in to upvote!");
      return;
    }

    try {
      const response = await upvoteSnippet(snippetId, token);

      if (response.success) {
        // Update local storage with upvoted snippets
        const upvotedSnippets = JSON.parse(localStorage.getItem("upvotedSnippets")) || [];
        if (!upvotedSnippets.includes(snippetId)) {
          upvotedSnippets.push(snippetId);
          localStorage.setItem("upvotedSnippets", JSON.stringify(upvotedSnippets));
        }

        // Update the snippets state
        setSnippets(prevSnippets =>
          prevSnippets.map(snippet =>
            snippet._id === snippetId
              ? { ...snippet, upvotes: response.upvotes, hasUpvoted: true }
              : snippet
          )
        );

        toast.success("Snippet upvoted!");
      } else {
        toast.error(response.message || "Failed to upvote snippet");
      }
    } catch (error) {
      console.error("Error upvoting snippet:", error);
      toast.error("Failed to upvote snippet");
    }
  };

  // Filter and sort snippets
  const filteredSnippets = snippets
    .filter(snippet => {
      const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          snippet.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLanguage = selectedLanguage === "" || snippet.language === selectedLanguage;
      return matchesSearch && matchesLanguage;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "upvotes") {
        return b.upvotes - a.upvotes;
      }
      return 0;
    });

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <UserNavbar />
      <div className="w-full max-w-6xl px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BiCodeAlt className="text-4xl text-white" />
            <h1 className="text-4xl font-bold text-white">Code Snippets Gallery</h1>
            <span className="text-yellow-300 text-2xl">✨</span>
          </div>
          <p className="text-white text-opacity-90 max-w-2xl mx-auto">
            Browse our collection of useful code snippets across various programming languages and
            frameworks. Search, filter, and copy the ones you need.
          </p>
        </div>

        {/* Language Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => setSelectedLanguage("")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${!selectedLanguage ? "bg-indigo-600 text-white" : "bg-white bg-opacity-80 text-indigo-700 hover:bg-white hover:bg-opacity-100"}`}
          >
            Reset
          </button>
          {["TypeScript", "JavaScript", "CSS", "HTML", "Python"].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLanguage(lang.toLowerCase())}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${selectedLanguage === lang.toLowerCase() ? "bg-indigo-600 text-white" : "bg-white bg-opacity-80 text-indigo-700 hover:bg-white hover:bg-opacity-100"}`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search snippets by title, description or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-indigo-300 rounded-lg bg-white bg-opacity-90 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <div className="absolute right-3 top-3 flex items-center gap-2">
            <button className="p-1 rounded-md hover:bg-gray-100">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-black">
            Found {filteredSnippets.length} snippets
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2  text-sm border border-indigo-300 text-grey-300 rounded-md  bg-opacity-90 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent "
          >
            <option className="text-black" value="latest">Latest First</option>
            <option className="text-black" value="oldest">Oldest First</option>
            <option className="text-black" value="upvotes">Most Upvotes</option>
          </select>
        </div>

        {/* Snippets Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : filteredSnippets.length === 0 ? (
          <div className="text-center py-16 bg-white bg-opacity-90 rounded-lg shadow-md">
            <FaCode className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No snippets found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedLanguage ? "Try adjusting your search or filter criteria." : "Be the first to add a code snippet!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSnippets.map((snippet) => (
              <motion.div
                key={snippet._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white bg-opacity-90 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-200 flex flex-col"
              >
                {/* Snippet Header */}
                <div className="p-4 border-b border-indigo-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-indigo-800 line-clamp-1">{snippet.title}</h3>
                    <span className="px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded-full font-medium">
                      {snippet.language}
                    </span>
                  </div>
                  <p className="text-indigo-700 text-sm line-clamp-2">{snippet.description}</p>
                </div>
                
                {/* Code Preview */}
                <div className="flex-grow relative">
                  <div className="absolute top-0 right-0 bg-gray-800 bg-opacity-70 rounded-bl-md p-1">
                    <button 
                      className="text-white hover:text-blue-300 transition-colors p-1"
                      onClick={() => {
                        navigator.clipboard.writeText(snippet.code);
                        toast.success("Code copied to clipboard!");
                      }}
                    >
                      <FiCopy size={16} />
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={snippet.language}
                    style={atomOneDark}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      height: '180px',
                      fontSize: '0.85rem',
                      borderRadius: 0
                    }}
                    wrapLines={true}
                    showLineNumbers={true}
                  >
                    {snippet.code.length > 200 ? `${snippet.code.substring(0, 200)}...` : snippet.code}
                  </SyntaxHighlighter>
                </div>
                
                {/* Footer */}
                <div className="p-3 bg-indigo-50 border-t border-indigo-100 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                      {snippet.username?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-xs text-indigo-700">{snippet.username}</span>
                  </div>
                  <button
                    onClick={(e) => handleUpvote(e, snippet._id)}
                    disabled={snippet.hasUpvoted}
                    className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm ${snippet.hasUpvoted
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"}`}
                  >
                    <span>{snippet.upvotes}</span>
                    <span>⬆️</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllSnippets;
