const Discussion = require("../models/Discussion.js");

// Calculate ranking score: (upvotes - downvotes) / log(total_votes + 1)
function calculateRankingScore(upvotes, downvotes) {
    const totalVotes = upvotes + downvotes;
    if (totalVotes === 0) return 0;
    const score = (upvotes - downvotes) / Math.log(totalVotes + 1);
    return score;
}

exports.createDiscussion = async (discussionData) => {
    const discussion = new Discussion(discussionData);
    return await discussion.save();
}

exports.getAllDiscussions = async () => {
    const discussions = await Discussion.find();
    
    // Calculate ranking score for each discussion and sort by it
    const discussionsWithScore = discussions.map(discussion => {
        const score = calculateRankingScore(discussion.upvotes || 0, discussion.downvotes || 0);
        return {
            ...discussion.toObject(),
            rankingScore: score
        };
    });
    
    // Sort by ranking score (descending), then by creation date (descending) as tiebreaker
    discussionsWithScore.sort((a, b) => {
        if (b.rankingScore !== a.rankingScore) {
            return b.rankingScore - a.rankingScore;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    return discussionsWithScore;
}

exports.getUserDiscussions = async (phoneNumber) => {
    const discussions = await Discussion.find({ author: phoneNumber });
    
    // Calculate ranking score for each discussion and sort by it
    const discussionsWithScore = discussions.map(discussion => {
        const score = calculateRankingScore(discussion.upvotes || 0, discussion.downvotes || 0);
        return {
            ...discussion.toObject(),
            rankingScore: score
        };
    });
    
    // Sort by ranking score (descending), then by creation date (descending) as tiebreaker
    discussionsWithScore.sort((a, b) => {
        if (b.rankingScore !== a.rankingScore) {
            return b.rankingScore - a.rankingScore;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    return discussionsWithScore;
}

exports.addVote = async (discussionId, userId, voteType, reason) => {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
        throw new Error('Discussion not found');
    }

    // Check if user already voted
    const existingVoteIndex = discussion.userVotes.findIndex(v => v.userId === userId);
    const existingVote = existingVoteIndex !== -1 ? discussion.userVotes[existingVoteIndex] : null;

    // If clicking the same vote type, remove it
    if (existingVote && existingVote.voteType === voteType) {
        // Remove vote
        discussion.userVotes.splice(existingVoteIndex, 1);
        if (voteType === 'up') {
            discussion.upvotes = Math.max(0, discussion.upvotes - 1);
            // Remove reason if exists
            discussion.upvoteReasons = discussion.upvoteReasons.filter(r => r.author !== userId);
        } else {
            discussion.downvotes = Math.max(0, discussion.downvotes - 1);
            // Remove reason if exists
            discussion.downvoteReasons = discussion.downvoteReasons.filter(r => r.author !== userId);
        }
    } else {
        // Remove previous vote if exists
        if (existingVote) {
            if (existingVote.voteType === 'up') {
                discussion.upvotes = Math.max(0, discussion.upvotes - 1);
                discussion.upvoteReasons = discussion.upvoteReasons.filter(r => r.author !== userId);
            } else {
                discussion.downvotes = Math.max(0, discussion.downvotes - 1);
                discussion.downvoteReasons = discussion.downvoteReasons.filter(r => r.author !== userId);
            }
            discussion.userVotes.splice(existingVoteIndex, 1);
        }

        // Add new vote
        discussion.userVotes.push({ userId, voteType });
        if (voteType === 'up') {
            discussion.upvotes += 1;
            if (reason) {
                discussion.upvoteReasons.push({ reason, author: userId });
            }
        } else {
            discussion.downvotes += 1;
            if (reason) {
                discussion.downvoteReasons.push({ reason, author: userId });
            }
        }
    }

    return await discussion.save();
}

exports.getUserVote = async (discussionId, userId) => {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
        return null;
    }
    const userVote = discussion.userVotes.find(v => v.userId === userId);
    return userVote ? userVote.voteType : null;
}

exports.getPartyLeaderboard = async () => {
    const discussions = await Discussion.find();
    
    // Aggregate votes by party
    const partyStats = {};
    
    discussions.forEach(discussion => {
        const party = discussion.party || 'Other';
        if (!partyStats[party]) {
            partyStats[party] = {
                party: party,
                totalUpvotes: 0,
                totalDownvotes: 0,
                totalPosts: 0,
                totalVotes: 0
            };
        }
        
        partyStats[party].totalUpvotes += discussion.upvotes || 0;
        partyStats[party].totalDownvotes += discussion.downvotes || 0;
        partyStats[party].totalPosts += 1;
        partyStats[party].totalVotes += (discussion.upvotes || 0) + (discussion.downvotes || 0);
    });
    
    // Calculate ranking score for each party
    const leaderboard = Object.values(partyStats).map(party => {
        const score = calculateRankingScore(party.totalUpvotes, party.totalDownvotes);
        return {
            ...party,
            rankingScore: score
        };
    });
    
    // Sort by ranking score (descending)
    leaderboard.sort((a, b) => {
        if (b.rankingScore !== a.rankingScore) {
            return b.rankingScore - a.rankingScore;
        }
        // Tiebreaker: more posts
        return b.totalPosts - a.totalPosts;
    });
    
    // Add rank position
    return leaderboard.map((party, index) => ({
        ...party,
        rank: index + 1
    }));
}