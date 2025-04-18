import express from "express";
import {
    createSnippet,
    getAllSnippets,
    getMySnippets,
    upvoteSnippet,
    deleteSnippet
} from "../controllers/snippetController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

// Create a new snippet
router.post("/create", userAuth, createSnippet);

// Get all snippets
router.get("/all", getAllSnippets);

// Get user's snippets
router.get("/my", userAuth, getMySnippets);

// Upvote a snippet
router.post("/:id/upvote", userAuth, upvoteSnippet);

// Delete a snippet
router.delete("/:id", userAuth, deleteSnippet);

export default router;