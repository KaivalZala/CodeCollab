import mongoose from "mongoose";

    // new comment added
const CommentSchema = new mongoose.Schema({
    text: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

    // new comment endded


const issueSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    uploadedFile: { type: String }, // ✅ Stores uploaded file URL/path
    codeSnippet: { type: String }, // ✅ Stores pasted code
    language: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    upvotedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
    // new comment added
    comments: [CommentSchema]
    // new comment endded
});

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;