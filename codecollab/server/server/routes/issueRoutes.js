import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Issue from "../models/issueModel.js"; // ✅ Ensure Issue model is imported
import {
    createIssue, 
    getAllIssues, 
    getMyIssues, 
    getIssueById, 
    deleteIssue, 
    getRecentIssues, 
    upvoteIssue ,addComment, getComments
} from "../controllers/issueController.js";
import userAuth from "../middleware/userAuth.js";  

const router = express.Router();

// new comment added
router.post('/:issueId/comments', userAuth, addComment);
router.get('/:issueId/comments', getComments);
// new comment endded

// Like/Dislike comment endpoints
import { likeComment, dislikeComment } from "../controllers/issueController.js";
router.post('/:issueId/comments/:commentId/like', userAuth, likeComment);
router.post('/:issueId/comments/:commentId/dislike', userAuth, dislikeComment);

// ✅ Ensure "uploads" folder exists
const uploadFolder = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
}

// 🔹 Configure Multer (use diskStorage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")); 
    }
});

const upload = multer({
    storage: storage, // ✅ Fixed to use diskStorage
    fileFilter: (req, file, cb) => cb(null, true),
    limits: { fileSize: 10 * 1024 * 1024 } 
});

// ✅ POST issue (with authentication & file upload)
router.post("/post", userAuth, upload.single("uploadedFile"), async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        console.log("Uploaded File:", req.file); // Debugging

        if (!req.body.title || !req.body.description) {
            return res.status(400).json({ success: false, message: "Title and description are required" });
        }

        const uploadedFileName = req.file ? req.file.filename : null; 



        const newIssue = new Issue({
            title: req.body.title,
            subject: req.body.subject,
            description: req.body.description,
            codeSnippet: req.body.codeSnippet,
            language: req.body.language,
            uploadedFile: uploadedFileName, // ✅ Stores the saved file
            user: req.user.id, // ✅ Ensures user is authenticated
        });

        await newIssue.save();
        res.json({ success: true, message: "Issue posted successfully", issue: newIssue });
    } catch (error) {
        console.error("Error posting issue:", error);
        res.status(500).json({ success: false, message: "Error posting issue", error: error.message });
    }
});

// ✅ GET routes
router.get("/all", getAllIssues);
router.get("/my", userAuth, getMyIssues);
router.get("/recent", getRecentIssues);
router.get("/:id", getIssueById);

// ✅ DELETE issue
router.delete("/:id", userAuth, deleteIssue);

// ✅ UPVOTE issue
router.post("/:id/upvote", userAuth, upvoteIssue);

export default router;
