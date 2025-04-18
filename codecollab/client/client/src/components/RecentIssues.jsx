import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getRecentIssues, upvoteIssue } from "../api"; 
import { AppContent } from "../context/AppContext.jsx"; 
import { toast } from "react-toastify";

const RecentIssues = () => {
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedin } = useContext(AppContent);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentIssues = async () => {
      try {
        setLoading(true);
        const response = await getRecentIssues();

        if (response.success) {
          const upvotedIssues = JSON.parse(localStorage.getItem("upvotedIssues")) || [];

          const updatedIssues = response.issues.map(issue => ({
            ...issue,
            hasUpvoted: upvotedIssues.includes(issue._id),
            username: issue.user?.name || "Unknown User",
          }));

          setRecentIssues(updatedIssues);
        } else {
          setError("Failed to load recent issues.");
        }
      } catch (err) {
        setError(err.message || "Error fetching recent issues.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentIssues();
  }, []);

  const handleUpvote = async (event, issueId) => {
    event.stopPropagation();

    const token = localStorage.getItem("token");
    if (!isLoggedin || !token) {
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
        setRecentIssues((prevIssues) =>
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
    <section className="container mx-auto p-8 bg-white text-black">
      <h2 className="text-3xl font-bold text-center">🚀 Recent Issues</h2>
      <p className="text-center mb-6">Explore the latest issues reported by the community.</p>

      {loading ? (
        <p className="text-center text-lg font-semibold">⏳ Loading recent issues...</p>
      ) : error ? (
        <p className="text-center text-lg font-semibold text-red-500">❌ {error}</p>
      ) : recentIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentIssues.map((issue) => (
            <motion.div
              key={issue._id}
              className="bg-white text-gray-900 shadow-lg rounded-xl p-6 border-l-4 border-blue-600 transition-all duration-300 hover:shadow-xl cursor-pointer"
              whileHover={{ scale: 1.03 }}
              onClick={() => navigate(`/issue/${issue._id}`)}
            >
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm font-semibold text-gray-800 flex items-center">
                  <span className="mr-2 text-purple-700">👤</span> {issue.username}
                </p>
                <p className="text-xs text-gray-500">{new Date(issue.createdAt).toDateString()}</p>
              </div>

              <h3 className="text-lg font-semibold mt-2 text-gray-900">{issue.title}</h3>

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
        <div className="text-center text-lg font-semibold bg-white text-gray-900 p-6 rounded-lg shadow-md">
          🚀 No recent issues found.
        </div>
      )}

      <div className="flex justify-center mt-8">
        <a
          href="/all-issues"
          className="text-white font-semibold px-4 py-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-all"
        >
          View All Issues →
        </a>
      </div>
    </section>
  );
};

export default RecentIssues;
