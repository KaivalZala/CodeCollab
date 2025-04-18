import Issue from "../models/issueModel.js";
import User from "../models/userModel.js";  // ✅ Import User model


// export const createIssue = async (req, res) => {
//     try {
//         const { title, subject, description, uploadedFile, codeSnippet, language } = req.body;
//         const userId = req.user.id; // ✅ Now req.user.id should be accessible

//         if (!userId) {
//             return res.status(401).json({ success: false, message: "User not authenticated" });
//         }

//         const newIssue = new Issue({ user: userId, title, subject, description, uploadedFile, codeSnippet, language });
//         await newIssue.save();

//         res.status(201).json({ success: true, message: "Issue posted successfully", issue: newIssue });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Error posting issue", error: error.message });
//     }
// };


//29.3.2025
export const createIssue = async (req, res) => {
    try {
        const { title, subject, description, codeSnippet, language} = req.body;
        const userId = req.user.id;

        // ✅ Check authentication
        if (!userId) {
            return res.status(401).json({ success: false, message: "User not authenticated" });
        }

        // ✅ Validate required fields
        if (!title || !subject || !description) {
            return res.status(400).json({ success: false, message: "Title, subject, and description are required." });
        }

        // ✅ Ensure file path uses consistent formatting
        const uploadedFile = req.file ? req.file.path.replace(/\\/g, "/") : null;

        


        // ✅ Create issue document
        const newIssue = new Issue({
            user: userId,
            title,
            subject,
            description,
            codeSnippet,
            language,
            uploadedFile,
        });

        await newIssue.save();

        res.status(201).json({
            success: true,
            message: "Issue posted successfully",
            issue: newIssue,
        });

    } catch (error) {
        console.error("❌ Error posting issue:", error);
        res.status(500).json({
            success: false,
            message: "Error posting issue",
            error: error.message,
        });
    }
};







export const getAllIssues = async (req, res) => {
    try {
        const { search, date, language, sort } = req.query;
        console.log("🔍 Received Query Params:", req.query); // ✅ Debug log

        let filter = {};

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } }
            ];
        }

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        if (language) {
            filter.language = { $regex: `^${language}$`, $options: "i" };
        }

        let sortOption = { createdAt: -1 }; // Default: latest first
        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        } else if (sort === "upvotes") {
            sortOption = { upvotes: -1 }; // Sort by most upvotes
        }

        console.log("🛠 Final Query Filter:", filter);
        console.log("📌 Sorting Option:", sortOption); // ✅ Debugging log

        const issues = await Issue.find(filter)
            .populate("user", "name profilePic")
            .sort(sortOption);

        res.json({ success: true, issues });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching issues", error: error.message });
    }
};



// new start mmmm
export const getMyIssues = async (req, res) => {
    try {
        console.log("User ID from Token:", req.user?.id); // ✅ Check if user ID is being received

        const { search, date, language, sort } = req.query;
        let filter = { user: req.user.id }; // Ensure this is matching your DB field

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } }
            ];
        }

        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        if (language) {
            filter.language = language;
        }

        let sortOption = { createdAt: -1 };
        if (sort === "oldest") {
            sortOption = { createdAt: 1 };
        }

        const myIssues = await Issue.find(filter);
        console.log("My Issues from DB:", myIssues); // ✅ Check if issues are returned

        res.json({ success: true, myIssues });
    } catch (error) {
        console.error("Error fetching my issues:", error);
        res.status(500).json({ success: false, message: "Error fetching your issues", error: error.message });
    }
};




export const getIssueById = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id).populate("user", "name profilePic");

        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        console.log("🔍 Fetched Issue Data:", issue);

        res.json({
            success: true,
            issue: {
                title: issue.title,
                subject: issue.subject,
                description: issue.description,
                uploadedFile: issue.uploadedFile 
                    ? `http://localhost:4000/uploads/${issue.uploadedFile}` 
                    : null, // ✅ Ensure correct URL
                codeSnippet: issue.codeSnippet || "", // ✅ Include code snippet
                language: issue.language,
                upvotes: issue.upvotes,
                username: issue.user.name,
                profilePic: issue.user.profilePic,
                date: issue.createdAt,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching issue", error: error.message });
    }
};









// 📌 Delete an issue (Only owner)
export const deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) return res.status(404).json({ success: false, message: "Issue not found" });

        if (issue.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized action" });
        }

        await Issue.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Issue deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting issue", error: error.message });
    }
};

// 📌 Get recent issues (latest 5)
export const getRecentIssues = async (req, res) => {
    try {
        const recentIssues = await Issue.find()
            .populate("user", "name profilePic")
            .sort({ createdAt: -1 }) // Sort by latest first
            .limit(5); // Only get the latest 5

        res.json({ success: true, issues: recentIssues });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching recent issues", error: error.message });
    }
};


export const upvoteIssue = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        console.log("🔹 Upvote request received for issue:", id, "by user:", userId);

        const issue = await Issue.findById(id);
        if (!issue) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }

        // Prevent multiple upvotes
        if (issue.upvotedUsers.includes(userId)) {
            return res.status(400).json({ success: false, message: "You have already upvoted this issue" });
        }

        issue.upvotedUsers.push(userId);
        issue.upvotes += 1;
        await issue.save();

        res.status(200).json({ success: true, upvotes: issue.upvotes });
    } catch (error) {
        console.error("🔥 Server error in upvoteIssue:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


    // new comment added
    // export const addComment = async (req, res) => {
    //     try {
    //         const { text } = req.body;
    //         const { issueId } = req.params;
    
    //         if (!text) {
    //             return res.status(400).json({ success: false, message: "Comment text is required." });
    //         }
    
    //         const issue = await Issue.findById(issueId);
    //         if (!issue) {
    //             return res.status(404).json({ success: false, message: "Issue not found." });
    //         }
    
    //         if (!req.user) {
    //             return res.status(401).json({ success: false, message: "Unauthorized" });
    //         }
    
    //         const newComment = {
    //             text,
    //             author: req.user.username,
    //             createdAt: new Date()
    //         };
    
    //         issue.comments.push(newComment);
    //         await issue.save();
    
    //         // ✅ Return updated comments list
    //         res.json({ success: true, comments: issue.comments });
    //     } catch (error) {
    //         console.error("Error adding comment:", error);
    //         res.status(500).json({ success: false, message: "Error adding comment", error: error.message });
    //     }
    // };



    export const addComment = async (req, res) => {
        try {
            const { text } = req.body;
            const { issueId } = req.params;
    
            if (!text) {
                return res.status(400).json({ success: false, message: "Comment text is required." });
            }
    
            const issue = await Issue.findById(issueId);
            if (!issue) {
                return res.status(404).json({ success: false, message: "Issue not found." });
            }
    
            if (!req.user || !req.user.id) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }
    
            console.log("Adding comment by user:", req.user.id); // ✅ Debugging
    
            const newComment = {
                text,
                author: req.user.id, // ✅ Store user ID
                createdAt: new Date()
            };
    
            issue.comments.push(newComment);
            await issue.save();
    
            // ✅ Populate the author's name before sending response
            const updatedIssue = await Issue.findById(issueId).populate("comments.author", "name profilePic");
    
            res.json({ success: true, comments: updatedIssue.comments });
        } catch (error) {
            console.error("Error adding comment:", error);
            res.status(500).json({ success: false, message: "Error adding comment", error: error.message });
        }
    };
    
    
    
    
    
    
    
    
    
    
    // export const getComments = async (req, res) => {
    //     try {
    //         const { issueId } = req.params;
    //         const issue = await Issue.findById(issueId);
    //         if (!issue) return res.status(404).json({ message: 'Issue not found' });
            
    //         res.json(issue.comments);
    //     } catch (error) {
    //         res.status(500).json({ message: 'Server error', error });
    //     }
    // };




    export const getComments = async (req, res) => {
        try {
            const { issueId } = req.params;
            const issue = await Issue.findById(issueId).populate("comments.author", "name profilePic");
    
            if (!issue) {
                return res.status(404).json({ message: "Issue not found" });
            }
    
            res.json({ success: true, comments: issue.comments });
        } catch (error) {
            console.error("Error fetching comments:", error);
            res.status(500).json({ message: "Server error", error });
        }
    };
    
    
    
    
    



    // new comment endded

// Like a comment
export const likeComment = async (req, res) => {
    try {
        const { issueId, commentId } = req.params;
        const userId = req.user.id;
        const issue = await Issue.findById(issueId);
        if (!issue) return res.status(404).json({ success: false, message: "Issue not found." });
        const comment = issue.comments.id(commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found." });
        if (comment.likedBy.includes(userId)) {
            return res.status(400).json({ success: false, message: "You have already liked this comment." });
        }
        comment.likes += 1;
        comment.likedBy.push(userId);
        // Remove dislike if present
        if (comment.dislikedBy.includes(userId)) {
            comment.dislikes -= 1;
            comment.dislikedBy.pull(userId);
        }
        await issue.save();
        return res.json({ success: true, likes: comment.likes, dislikes: comment.dislikes });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error liking comment", error: error.message });
    }
};

// Dislike a comment
export const dislikeComment = async (req, res) => {
    try {
        const { issueId, commentId } = req.params;
        const userId = req.user.id;
        const issue = await Issue.findById(issueId);
        if (!issue) return res.status(404).json({ success: false, message: "Issue not found." });
        const comment = issue.comments.id(commentId);
        if (!comment) return res.status(404).json({ success: false, message: "Comment not found." });
        if (comment.dislikedBy.includes(userId)) {
            return res.status(400).json({ success: false, message: "You have already disliked this comment." });
        }
        comment.dislikes += 1;
        comment.dislikedBy.push(userId);
        // Remove like if present
        if (comment.likedBy.includes(userId)) {
            comment.likes -= 1;
            comment.likedBy.pull(userId);
        }
        await issue.save();
        return res.json({ success: true, likes: comment.likes, dislikes: comment.dislikes });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error disliking comment", error: error.message });
    }
};