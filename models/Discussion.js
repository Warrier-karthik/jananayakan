const mongoose = require("mongoose");

const voteReasonSchema = new mongoose.Schema({
    reason: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const discussionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    upvoteReasons: [voteReasonSchema],
    downvoteReasons: [voteReasonSchema],
    userVotes: [{
        userId: {
            type: String,
            required: true
        },
        voteType: {
            type: String,
            enum: ['up', 'down'],
            required: true
        }
    }]
}, {
    timestamps: true
});
module.exports = mongoose.model("Discussion", discussionSchema);