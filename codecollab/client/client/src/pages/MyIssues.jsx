import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import { getMyIssues } from "../api"; // Import API function

const MyIssues = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token in MyIssues:", token); // ✅ Check if token exists
  
        if (!token) {
          setError("Unauthorized: Please log in.");
          setLoading(false);
          return;
        }
  
        const response = await getMyIssues(token);
        console.log("Response from Backend:", response); // ✅ Check if API returns data
  
        if (response.success) {
          const upvotedIssues = JSON.parse(localStorage.getItem("upvotedIssues")) || [];
  
          // ✅ Mark issues as upvoted if they exist in localStorage
          const updatedIssues = response.myIssues.map(issue => ({
            ...issue,
            hasUpvoted: upvotedIssues.includes(issue._id),
          }));
  
          setIssues(updatedIssues); // Update state with upvote info
        } else {
          setError("No issues found.");
        }
      } catch (err) {
        console.error("Error fetching My Issues:", err);
        setError(err.message || "Failed to fetch issues.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchMyIssues();
  }, []);
  

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <UserNavbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-extrabold text-center mb-8 tracking-wide">📝 My Issues</h2>

        {loading ? (
          <p className="text-center text-lg">⏳ Loading issues...</p>
        ) : error ? (
          <p className="text-center text-lg text-red-400">{error}</p>
        ) : issues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <div
                key={issue._id}
                className="bg-white text-gray-900 shadow-lg rounded-lg p-6 border-l-4 border-blue-600 transition-all duration-300 hover:shadow-xl cursor-pointer"
                onClick={() => navigate(`/issue/${issue._id}`)}
              >
                <h3 className="text-lg font-semibold">{issue.title}</h3>
                <p className="text-xs text-gray-500">{new Date(issue.createdAt).toDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-lg font-semibold bg-white text-gray-900 p-6 rounded-lg shadow-md">
            🚀 You haven't posted any issues yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;
