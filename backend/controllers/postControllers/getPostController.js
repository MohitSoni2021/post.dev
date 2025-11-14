import mongoose from "mongoose";
import Post from "../../models/post.model.js";

export const getPostById = async (req, res) => {
    try {
        const { postid } = req.params;

        // Validate post ID
        if (!mongoose.Types.ObjectId.isValid(postid)) {
            return res.status(400).json({
                success: false,
                message: "Invalid post ID format",
                timestamp: Date.now()
            });
        }

        // Find the post by ID
        const post = await Post.findById(postid);

        // Check if post exists
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
                timestamp: Date.now()
            });
        }

        res.status(200).json({
            success: true,
            message: "Post fetched successfully",
            data: post,
            timestamp: Date.now()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching post",
            error: error.message,
            timestamp: Date.now()
        });
    }
};
