//Import express module
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

//Register routes
router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", authController.postLogin);

router.post("/signup", authController.postSignup);

router.post("/signout", authController.postSignOut);

router.get("/forget-password", authController.getForgetPassword);

router.post("/forget-password", authController.postForgetPassword);

router.get("/reset-password/:token", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);



module.exports = router;