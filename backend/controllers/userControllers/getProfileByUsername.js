import User from "../../models/user.model.js";
import Post from "../../models/post.model.js";

// Get user profile by username
export const getProfileByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        
        // Find user by username
        const user = await User.findOne({ username })
            .select('-password -__v -createdAt -updatedAt');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find all posts by this user
        const posts = await Post.find({ user_id: user._id })
            .select('_id title content image likes_count comments_count createdAt')
            .sort({ createdAt: -1 });

        // Format the response
        const userProfile = {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            title: user.title,
            bio: user.bio,
            avatar: user.avatar,
            accountType: user.accountType,
            followers_count: user.followers_count,
            following_count: user.following_count,
            posts: posts || [],
            createdAt: user.createdAt
        };

        return res.status(200).json({
            success: true,
            data: userProfile
        });
    } catch (error) {
        console.error('Error fetching user profile by username:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while fetching user profile',
            error: error.message
        });
    }
};
