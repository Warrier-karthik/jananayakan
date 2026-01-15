const express = require("express")
const router = express.Router();
const usersController = require("../controllers/users.controller.js");

router.get("/", (req, res) => {
    res.send("Hello, World!");
})
router.get("/users", usersController.getUsers);
router.post("/users", usersController.createUser);
module.exports = router;
