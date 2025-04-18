import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { upvoteIssue, getAllIssues } from "../api";
import { toast } from "react-toastify";

const AllIssues = () => {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Unauthorized: Please log in.");
          setLoading(false);
          return;
        }

        const filters = {
          search: search.trim(),
          sort: sortBy,
          date: selectedDate,
          language: selectedLanguage,
        };

        const response = await getAllIssues(token, filters);

        if (response.success) {
          const upvotedIssues = JSON.parse(localStorage.getItem("upvotedIssues")) || [];

          const updatedIssues = response.issues.map(issue => ({
            ...issue,
            hasUpvoted: upvotedIssues.includes(issue._id),
            username: issue.user?.name || "Unknown User",
          }));

          setIssues(updatedIssues);
        } else {
          setError("Failed to fetch issues.");
        }
      } catch (err) {
        setError(err.message || "Error fetching issues.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [search, sortBy, selectedDate, selectedLanguage]);

  const handleUpvote = async (event, issueId) => {
    event.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("⚠️ You must be logged in to upvote!");
      return;
    }

    const upvotedIssues = JSON.parse(localStorage.getItem("upvotedIssues")) || [];

    if (upvotedIssues.includes(issueId)) {
      toast.warning("⚠️ You have already upvoted this issue!");
      return;
    }

    try {
      const response = await upvoteIssue(issueId, token);

      if (response.success) {
        setIssues((prevIssues) =>
          prevIssues.map((issue) =>
            issue._id === issueId
              ? { ...issue, upvotes: response.upvotes, hasUpvoted: true }
              : issue
          )
        );

        upvotedIssues.push(issueId);
        localStorage.setItem("upvotedIssues", JSON.stringify(upvotedIssues));

        toast.success("✅ Upvote added!");
      } else {
        toast.warning(response.message);
      }
    } catch (error) {
      console.error("Upvote Error:", error);
      toast.error("❌ Unexpected error while upvoting.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <UserNavbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-extrabold text-center mb-8 tracking-wide">🌎 All Issues</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-gray-900 shadow-md"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-gray-900 shadow-md"
          >
            <option value="latest">📅 Sort by Latest</option>
            <option value="oldest">⏳ Sort by Oldest</option>
            <option value="upvotes">👍 Sort by Upvotes</option>
          </select>

          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full p-3 rounded-lg bg-white text-gray-900 shadow-md"
          >
            <option value="">🌐 Filter by Language</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Python">Python</option>
            <option value="React">React</option>
          </select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            onDoubleClick={() => setSelectedDate("")}
            className="w-full p-3 rounded-lg bg-white text-gray-900 shadow-md"
          />
        </div>

        {/* Issues List */}
        {loading ? (
          <p className="text-center text-lg font-semibold">⏳ Loading issues...</p>
        ) : error ? (
          <p className="text-center text-lg font-semibold text-red-500">❌ {error}</p>
        ) : issues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <motion.div
                key={issue._id}
                className="bg-white text-gray-900 shadow-lg rounded-xl p-6 border-l-4 border-blue-600 transition-all duration-300 hover:shadow-xl cursor-pointer"
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/issue/${issue._id}`)}
              >
                {/* User Info */}
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-semibold text-gray-800 flex items-center">
                    <span className="mr-2 text-purple-700">🧑‍💻</span> {issue.username}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(issue.createdAt).toDateString()}</p>
                </div>

                {/* Issue Title */}
                <h3 className="text-lg font-semibold mt-2 text-gray-900">{issue.title}</h3>

                {/* Language Badge & Upvote */}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-900">
                    {issue.language}
                  </span>
                  <button
                    className="px-4 py-2 rounded-full flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 shadow-md transition"
                    onClick={(event) => handleUpvote(event, issue._id)}
                  >
                    <span className="text-lg">👍</span>
                    <span className="font-semibold">{issue.upvotes}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center text-lg font-semibold bg-white text-gray-900 p-6 rounded-lg shadow-md">
            🚀 No issues found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default AllIssues;
