import axios from "axios";

// Define backend base URL
const backendUrl = "http://localhost:4000/api"; // Update when deploying

// ✅ Post a new issue (Includes uploaded file & code snippet)
export const postIssue = async (formData, token) => {
  try {
    console.log("📌 FormData before sending:");
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]); // Log all form data fields
    }

    const response = await axios.post(`${backendUrl}/issues/post`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("❌ Upload Error:", error.response?.data || error.message);
    throw error.response ? error.response.data : error.message;
  }
};










// ✅ Get all issues with optional filters
export const getAllIssues = async (token, filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const response = await axios.get(`${backendUrl}/issues/all?${query}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Get Issues API Error:", error);
    return { success: false, message: error.message };
  }
};


// ✅ Get issues posted by the logged-in user
export const getMyIssues = async (token) => {
  try {
    const response = await axios.get(`${backendUrl}/issues/my`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// ✅ Get a single issue by ID (Fixing file path)
export const getIssueById = async (id, token) => {
  try {
    const response = await fetch(`http://localhost:4000/api/issues/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching issue details:", error);
    return { success: false, message: error.message };
  }
};


// ✅ Delete an issue by ID
export const deleteIssue = async (issueId, token) => {
  try {
    const response = await axios.delete(`${backendUrl}/issues/${issueId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// ✅ Get recent issues
export const getRecentIssues = async () => {
  try {
    const response = await axios.get(`${backendUrl}/issues/recent`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

// ✅ Upvote an issue
// export const upvoteIssue = async (issueId, token) => {
//   try {
//     const response = await axios.post(
//       `${backendUrl}/issues/${issueId}/upvote`,
//       {},
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Upvote API Error:", error.response?.data || error.message);
//     return { success: false, message: error.response?.data?.message || "❌ Failed to upvote issue." };
//   }
// };


// Only showing the upvoteIssue function, as the rest of your API.js file remains unchanged
export const upvoteIssue = async (issueId, token) => {
  try {
    console.log(`Upvoting issue with ID: ${issueId}`);
    console.log(`Backend URL: ${backendUrl}/issues/${issueId}/upvote`);
    
    // Add more specific error handling with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
    
    const response = await fetch(`${backendUrl}/issues/${issueId}/upvote`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId); // Clear the timeout

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Server responded with ${response.status}: ${errorText}`);
      return { 
        success: false, 
        message: `Server error (${response.status}): ${errorText || 'Unknown error'}` 
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Upvote API Error Details:", error);
    
    // Specific error handling for different types of errors
    if (error.name === 'AbortError') {
      return { success: false, message: "Request timed out. Please try again." };
    }
    
    return { 
      success: false, 
      message: error.message || "Failed to upvote issue. Network error." 
    };
  }
};


// Fetch comments for an issue
export const getComments = async (issueId, token) => {
  try {
    const response = await fetch(`http://localhost:4000/api/issues/${issueId}/comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Post a new comment to an issue
export const addComment = async (issueId, commentText, token) => {
  try {
    const response = await fetch(`http://localhost:4000/api/issues/${issueId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: commentText }),
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Like a comment
export const likeComment = async (issueId, commentId, token) => {
  try {
    const response = await fetch(`http://localhost:4000/api/issues/${issueId}/comments/${commentId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// Dislike a comment
export const dislikeComment = async (issueId, commentId, token) => {
  try {
    const response = await fetch(`http://localhost:4000/api/issues/${issueId}/comments/${commentId}/dislike`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};


// Snippet API Functions

// Create a new snippet
export const createSnippet = async (snippetData, token) => {
  try {
    const response = await axios.post(`${backendUrl}/snippets/create`, snippetData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Create Snippet Error:", error.response?.data || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

// Get all snippets
export const getAllSnippets = async () => {
  try {
    const response = await axios.get(`${backendUrl}/snippets/all`);
    return response.data;
  } catch (error) {
    console.error("Get All Snippets Error:", error.response?.data || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

// Get user's snippets
export const getMySnippets = async (token) => {
  try {
    const response = await axios.get(`${backendUrl}/snippets/my`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Get My Snippets Error:", error.response?.data || error.message);
    throw error.response ? error.response.data : error.message;
  }
};

// Upvote a snippet
export const upvoteSnippet = async (snippetId, token) => {
  try {
    const response = await axios.post(
      `${backendUrl}/snippets/${snippetId}/upvote`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Upvote Snippet Error:", error.response?.data || error.message);
    return { success: false, message: error.response?.data?.message || "Failed to upvote snippet." };
  }
};

// Delete a snippet
export const deleteSnippet = async (snippetId, token) => {
  try {
    const response = await axios.delete(`${backendUrl}/snippets/${snippetId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Delete Snippet Error:", error.response?.data || error.message);
    throw error.response ? error.response.data : error.message;
  }
};