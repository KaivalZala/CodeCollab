import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../components/Usernavbar";
import { getIssueById, getComments, addComment, likeComment, dislikeComment } from "../api";

const IssueDetails = () => {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    const fetchIssue = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: Please log in.");
          setLoading(false);
          return;
        }
        const response = await getIssueById(id, token);
        if (response.success) {
          setIssue(response.issue);
        } else {
          setError(response.message || "Failed to fetch issue details.");
        }
      } catch (err) {
        setError(err.message || "Error fetching issue details.");
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setCommentLoading(true);
      setCommentError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setCommentError("Unauthorized: Please log in.");
          setCommentLoading(false);
          return;
        }
        const response = await getComments(id, token);
        if (response.success) {
          setComments(response.comments || []);
        } else {
          setCommentError(response.message || "Failed to fetch comments.");
        }
      } catch (err) {
        setCommentError(err.message || "Error fetching comments.");
      } finally {
        setCommentLoading(false);
      }
    };
    if (id) fetchComments();
  }, [id]);

  // Handle comment submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentLoading(true);
    setCommentError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCommentError("Unauthorized: Please log in.");
        setCommentLoading(false);
        return;
      }
      if (!commentText.trim()) {
        setCommentError("Comment cannot be empty.");
        setCommentLoading(false);
        return;
      }
      const response = await addComment(id, commentText, token);
      if (response.success) {
        setComments(response.comments || []);
        setCommentText("");
      } else {
        setCommentError(response.message || "Failed to add comment.");
      }
    } catch (err) {
      setCommentError(err.message || "Error adding comment.");
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle like/dislike on comment
  const handleLikeDislike = async (commentId, action) => {
    setCommentLoading(true);
    setCommentError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCommentError("Unauthorized: Please log in.");
        setCommentLoading(false);
        return;
      }
      let response;
      if (action === "like") {
        response = await likeComment(id, commentId, token);
      } else {
        response = await dislikeComment(id, commentId, token);
      }
      if (response.success) {
        // Update the comment's like/dislike count in state
        setComments(prev => prev.map(c => c._id === commentId ? { ...c, likes: response.likes, dislikes: response.dislikes, likedBy: action === "like" ? [...(c.likedBy || []), "me"] : (c.likedBy || []).filter(u => u !== "me"), dislikedBy: action === "dislike" ? [...(c.dislikedBy || []), "me"] : (c.dislikedBy || []).filter(u => u !== "me") } : c));
      } else {
        setCommentError(response.message || `Failed to ${action} comment.`);
      }
    } catch (err) {
      setCommentError(err.message || `Error trying to ${action} comment.`);
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
      <UserNavbar />
      <div className="container mx-auto px-6 py-12">
        <h2 className="text-4xl font-extrabold text-center mb-8 tracking-wide">🐞 Issue Details</h2>
        {loading ? (
          <p className="text-center text-lg font-semibold">⏳ Loading issue details...</p>
        ) : error ? (
          <p className="text-center text-lg font-semibold text-red-500">❌ {error}</p>
        ) : issue ? (
          <div className="max-w-5xl mx-auto bg-white text-gray-900 rounded-2xl shadow-2xl p-10 border-l-8 border-blue-600">
            <div className="flex items-center mb-6">
              {issue.profilePic && (
                <img src={issue.profilePic} alt="Profile" className="w-14 h-14 rounded-full mr-6 border-2 border-indigo-400" />
              )}
              <div>
                <p className="font-semibold text-xl">{issue.username}</p>
                <p className="text-xs text-gray-500">{new Date(issue.date).toLocaleString()}</p>
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-3">{issue.title}</h3>
            <span className="inline-block mb-3 px-4 py-1 rounded-full bg-blue-100 text-blue-900 text-sm font-semibold">
              {issue.language}
            </span>
            <p className="mt-5 mb-2 text-gray-700 text-lg"><span className="font-semibold">Subject:</span> {issue.subject}</p>
            <p className="mb-6 text-gray-700 text-lg"><span className="font-semibold">Description:</span> {issue.description}</p>
            {issue.uploadedFile && (
              <div className="mb-4">
                <span className="font-semibold">Uploaded File:</span> <a href={issue.uploadedFile} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">Download/View</a>
              </div>
            )}
            {issue.codeSnippet && (
              <div className="mb-4">
                <span className="font-semibold">Code Snippet:</span>
                <pre className="bg-gray-100 rounded-xl p-5 mt-2 overflow-x-auto text-base"><code>{issue.codeSnippet}</code></pre>
              </div>
            )}
            <div className="flex items-center mt-8">
              <span className="text-xl mr-2">👍</span>
              <span className="font-semibold text-lg">{issue.upvotes} Upvotes</span>
            </div>
          </div>
        ) : null}
        {/* Comment Section */}
        <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-br from-purple-100 to-indigo-100/80 text-gray-900 rounded-3xl shadow-2xl p-0 border-l-8 border-purple-600">
          <div className="px-10 pt-10 pb-4">
            <h4 className="text-2xl font-bold mb-6 text-purple-700 flex items-center gap-2"><span className="text-3xl">💬</span> Comments</h4>
            {/* Add Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8 flex flex-col gap-4 bg-gradient-to-r from-purple-200/80 to-indigo-100/80 rounded-2xl p-6 shadow-inner border border-purple-200">
              <textarea
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-white/90 resize-none shadow"
                rows={3}
                placeholder="Add a comment..."
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                disabled={commentLoading}
              />
              <button
                type="submit"
                className="self-end px-8 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-60 text-base"
                disabled={commentLoading}
              >
                {commentLoading ? "Posting..." : "Post Comment"}
              </button>
            </form>
          </div>
          <div className="px-8 pb-8">
            {commentLoading ? (
              <p className="text-center text-gray-700">Loading comments...</p>
            ) : commentError ? (
              <p className="text-center text-red-500">{commentError}</p>
            ) : comments.length > 0 ? (
              <div className="grid gap-6">
                {[...comments].reverse().map((c, idx) => (
                  <div key={idx} className="relative bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-4 border border-purple-200 hover:shadow-xl transition">
                    <div className="flex-shrink-0 flex flex-col items-center md:items-start">
                      {c.author?.profilePic ? (
                        <img src={c.author.profilePic} alt="Profile" className="w-12 h-12 rounded-full border-2 border-indigo-400 shadow" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center text-xl font-bold text-purple-700 border-2 border-indigo-400 shadow">{(c.author?.name || "A").charAt(0)}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <span className="font-semibold text-indigo-700 text-base">{c.author?.name || "Anonymous"}</span>
                        <span className="text-xs text-gray-500">{c.date ? new Date(c.date).toLocaleString() : ""}</span>
                      </div>
                      <p className="mt-2 text-gray-800 text-base leading-relaxed">{c.text}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <button
                          type="button"
                          className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold transition border border-green-200 shadow-sm hover:bg-green-100 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-300 ${Array.isArray(c.likedBy) && c.likedBy.includes("me") ? "bg-green-200 text-green-800" : "bg-white text-green-700"}`}
                          disabled={commentLoading}
                          onClick={() => handleLikeDislike(c._id, "like")}
                          aria-label="Like comment"
                        >
                          <span className="text-lg">👍</span> <span>{c.likes || 0}</span>
                        </button>
                        <button
                          type="button"
                          className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold transition border border-red-200 shadow-sm hover:bg-red-100 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-300 ${Array.isArray(c.dislikedBy) && c.dislikedBy.includes("me") ? "bg-red-200 text-red-800" : "bg-white text-red-700"}`}
                          disabled={commentLoading}
                          onClick={() => handleLikeDislike(c._id, "dislike")}
                          aria-label="Dislike comment"
                        >
                          <span className="text-lg">👎</span> <span>{c.dislikes || 0}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
