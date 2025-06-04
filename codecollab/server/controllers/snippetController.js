import Snippet from "../models/snippetModel.js";
import User from "../models/userModel.js";

// Create a new snippet
export const createSnippet = async (req, res) => {
    try {
        const { title, description, code, language } = req.body;
        
        // Validate required fields
        if (!title || !description || !code || !language) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Create new snippet
        const newSnippet = new Snippet({
            user: req.user.id,
            title,
            description,
            code,
            language
        });

        await newSnippet.save();

        return res.status(201).json({
            success: true,
            message: "Snippet created successfully",
            snippet: newSnippet
        });
    } catch (error) {
        console.error("Error creating snippet:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get all snippets
export const getAllSnippets = async (req, res) => {
    try {
        const snippets = await Snippet.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            snippets
        });
    } catch (error) {
        console.error("Error fetching snippets:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Get snippets by user
export const getMySnippets = async (req, res) => {
    try {
        const snippets = await Snippet.find({ user: req.user.id })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            snippets
        });
    } catch (error) {
        console.error("Error fetching user snippets:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Upvote a snippet
export const upvoteSnippet = async (req, res) => {
    try {
        const snippet = await Snippet.findById(req.params.id);
        
        if (!snippet) {
            return res.status(404).json({
                success: false,
                message: "Snippet not found"
            });
        }

        // Check if user already upvoted
        if (snippet.upvotedUsers.includes(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "You have already upvoted this snippet"
            });
        }

        // Add user to upvoted users and increment upvote count
        snippet.upvotedUsers.push(req.user.id);
        snippet.upvotes += 1;
        await snippet.save();

        return res.status(200).json({
            success: true,
            message: "Snippet upvoted successfully",
            upvotes: snippet.upvotes
        });
    } catch (error) {
        console.error("Error upvoting snippet:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// Delete a snippet
export const deleteSnippet = async (req, res) => {
    try {
        const snippet = await Snippet.findById(req.params.id);
        
        if (!snippet) {
            return res.status(404).json({
                success: false,
                message: "Snippet not found"
            });
        }

        // Check if user is the owner
        if (snippet.user.toString() !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized to delete this snippet"
            });
        }

        await Snippet.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Snippet deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting snippet:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};