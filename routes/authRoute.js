//Import express module
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

//Register routes
router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.post("/signout", authController.postSignOut);

module.exports = router;