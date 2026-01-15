const express = require("express");
const router = express.Router();
const discussionController = require("../controllers/discussion.controller.js");
const authMiddleware = require("../middlewares/auth.middleware.js");
router.post("/creatediscussions", authMiddleware.authMiddleware, discussionController.createDiscussion);
router.get("/all", discussionController.getAllDiscussions);
router.get("/my-posts", authMiddleware.authMiddleware, discussionController.getUserDiscussions);
router.get("/leaderboard", discussionController.getPartyLeaderboard);
router.post("/:discussionId/vote", authMiddleware.authMiddleware, discussionController.addVote);
router.get("/:discussionId/vote", authMiddleware.authMiddleware, discussionController.getUserVote);

module.exports = router;
