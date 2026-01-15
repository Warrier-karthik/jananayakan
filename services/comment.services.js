const Comment = require("../models/Comment.js");
exports.addComment = async (commentData) => {
    const comment = new Comment(commentData);
    return await comment.save();
}

exports.getCommentsByDiscussion = async (discussionId) => {
    return await Comment.find({ discussionId: discussionId })
        .sort({ createdAt: 1 })
        .lean();
}