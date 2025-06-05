import { useState, useEffect, useContext } from "react";
import UserNavbar from "../components/Usernavbar";
import { FaUpload, FaCode, FaTrash } from "react-icons/fa";
import { FiCopy, FiPlus } from "react-icons/fi";
import { BiCodeAlt } from "react-icons/bi";
import Editor from "@monaco-editor/react";
import { createSnippet, getMySnippets, deleteSnippet } from "../api";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";

const MySnippets = () => {
  const { userToken } = useContext(AppContent);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const [loadingSnippets, setLoadingSnippets] = useState(true);

  useEffect(() => {
    fetchMySnippets();
  }, []);

  const fetchMySnippets = async () => {
    try {
      setLoadingSnippets(true);
      const token = userToken || localStorage.getItem("token");

      if (!token) {
        toast.error("Unauthorized! Please login again.");
        return;
      }

      const response = await getMySnippets(token);
      if (response.success) {
        setSnippets(response.snippets);
      } else {
        toast.error("Failed to fetch snippets");
      }
    } catch (error) {
      console.error("Error fetching snippets:", error);
      toast.error("Failed to fetch snippets");
    } finally {
      setLoadingSnippets(false);
    }
  };

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  const handleSubmit = async () => {
    if (!title || !description || !code || !language) {
      toast.error("All fields are required!");
      return;
    }

    const token = userToken || localStorage.getItem("token");

    if (!token) {
      toast.error("Unauthorized! Please login again.");
      return;
    }

    try {
      setLoading(true);
      const snippetData = {
        title,
        description,
        code,
        language,
      };

      const data = await createSnippet(snippetData, token);

      if (data.success) {
        toast.success("Snippet created successfully!");
        setTitle("");
        setDescription("");
        setCode("");
        setLanguage("");
        fetchMySnippets();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error creating snippet:", error);
      toast.error("Failed to create snippet. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSnippet = async (snippetId) => {
    try {
      const token = userToken || localStorage.getItem("token");

      if (!token) {
        toast.error("Unauthorized! Please login again.");
        return;
      }

      const data = await deleteSnippet(snippetId, token);

      if (data.success) {
        toast.success("Snippet deleted successfully!");
        fetchMySnippets();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting snippet:", error);
      toast.error("Failed to delete snippet. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <UserNavbar />
      <div className="w-full max-w-6xl px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BiCodeAlt className="text-4xl text-white" />
            <h1 className="text-4xl font-bold text-white">My Code Snippets</h1>
            <span className="text-yellow-300 text-2xl">✨</span>
          </div>
          <p className="text-white text-opacity-90 max-w-2xl mx-auto">
            Create and manage your personal collection of code snippets. Save useful code for future reference.
          </p>
        </div>

        {/* Create Snippet Card */}
        <div className="bg-white bg-opacity-90 rounded-lg shadow-md p-6 mb-8 border border-indigo-200">
          <div className="flex items-center gap-2 mb-4">
            <FiPlus className="text-indigo-600" />
            <h2 className="text-xl font-semibold text-indigo-800">Create New Snippet</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-black">
            <div>
              <input
                type="text"
                placeholder="Snippet Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              />
              <textarea
                placeholder="Description (what does this code do?)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                rows="3"
              />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="" disabled>
                  Select Language
                </option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c++">C++</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="typescript">TypeScript</option>
                <option value="php">PHP</option>
                <option value="ruby">Ruby</option>
                <option value="go">Go</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
              </select>
            </div>
            <div>
              <button
                onClick={handleOpenPopup}
                className="w-full h-full p-4 bg-blue-50 border border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <FaCode className="text-3xl text-blue-500 mb-2" />
                <span className="text-blue-700">{code ? "Edit Code" : "Paste your code here..."}</span>
                <span className="text-xs text-blue-500 mt-1">Click to open editor</span>
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Snippet"}
          </button>
        </div>

        {isPopupOpen && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/50 z-50">
            <div className="w-11/12 md:w-3/5 h-4/5 p-6 rounded-lg bg-white text-gray-900 relative shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">Code Editor</h3>
                <button
                  onClick={handleClosePopup}
                  className="text-indigo-500 hover:text-red-500 p-1 rounded-full hover:bg-indigo-100"
                >
                  ✖
                </button>
              </div>
              <div className="bg-indigo-50 p-2 rounded-md mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaCode className="text-indigo-500" />
                  <span className="text-sm text-indigo-700">{language || "Select a language"}</span>
                </div>
                <button 
                  className="text-xs bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 transition-colors"
                  onClick={() => {
                    if (code) {
                      navigator.clipboard.writeText(code);
                      toast.success("Code copied to clipboard!");
                    }
                  }}
                  disabled={!code}
                >
                  Copy Code
                </button>
              </div>
              <Editor
                height="65vh"
                language={language || "javascript"}
                theme="vs-dark"
                value={code}
                onChange={setCode}
                options={{ 
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* My Snippets Section */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">My Snippets Collection</h2>
          <div className="text-sm text-white text-opacity-90">
            {snippets.length} {snippets.length === 1 ? 'snippet' : 'snippets'}
          </div>
        </div>

        {loadingSnippets ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : snippets.length === 0 ? (
          <div className="text-center py-16 bg-white bg-opacity-90 rounded-lg shadow-md">
            <FaCode className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No snippets yet</h3>
            <p className="text-gray-500">Create your first code snippet using the form above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map((snippet) => (
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
                    {snippet.code.length > 150 ? `${snippet.code.substring(0, 150)}...` : snippet.code}
                  </SyntaxHighlighter>
                </div>
                
                {/* Footer */}
                <div className="p-3 bg-indigo-50 border-t border-indigo-100 flex justify-between items-center">
                  <span className="text-xs text-indigo-600">
                    Created: {new Date(snippet.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-200 text-green-800 text-xs rounded-full">
                      {snippet.upvotes} upvotes
                    </span>
                    <button
                      onClick={() => handleDeleteSnippet(snippet._id)}
                      className="p-1 text-red-400 hover:text-red-600 transition-colors"
                      title="Delete snippet"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySnippets;
