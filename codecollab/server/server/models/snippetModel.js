import mongoose from "mongoose";

const snippetSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    upvotes: { type: Number, default: 0 },
    upvotedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now }
});

const Snippet = mongoose.model("Snippet", snippetSchema);
export default Snippet;