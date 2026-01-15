const discussionService = require("../services/discussion.services.js");
const jwt = require("jsonwebtoken");
exports.createDiscussion = async (req, res) => {
    try {
        const number = req.user.phoneNumber;
        const { title, content, party } = req.body;
        
        if (!title || !content || !party) {
            return res.status(400).json({ message: 'Title, content, and party are required' });
        }
        
        const newDiscussion = await discussionService.createDiscussion({
            title: title,
            content: content,
            author: number,
            party: party
        });
        res.status(201).json(newDiscussion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllDiscussions = async (req, res) => {
    try {
        const discussions = await discussionService.getAllDiscussions();
        res.status(200).json(discussions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserDiscussions = async (req, res) => {
    try {
        const phoneNumber = req.user.phoneNumber;
        const discussions = await discussionService.getUserDiscussions(phoneNumber);
        res.status(200).json(discussions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addVote = async (req, res) => {
    try {
        const discussionId = req.params.discussionId;
        const userId = req.user.phoneNumber;
        const { voteType, reason } = req.body;

        if (!voteType || !['up', 'down'].includes(voteType)) {
            return res.status(400).json({ message: 'Invalid vote type. Must be "up" or "down"' });
        }

        const updatedDiscussion = await discussionService.addVote(discussionId, userId, voteType, reason);
        res.status(200).json(updatedDiscussion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getUserVote = async (req, res) => {
    try {
        const discussionId = req.params.discussionId;
        const userId = req.user.phoneNumber;
        const voteType = await discussionService.getUserVote(discussionId, userId);
        res.status(200).json({ voteType });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPartyLeaderboard = async (req, res) => {
    try {
        const leaderboard = await discussionService.getPartyLeaderboard();
        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};