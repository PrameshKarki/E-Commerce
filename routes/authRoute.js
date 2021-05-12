//Import express module
const express = require("express");
const router = express.Router();
const User = require("../models/user");

//Import validator
const { body } = require("express-validator/check");

const authController = require("../controllers/authController");

//Register routes
router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/login", [
    body("email", "Invalid email").isEmail().normalizeEmail(),
    body("password", "Invalid password").trim()
], authController.postLogin);

router.post("/signup", [
    body("email", "Invalid email").isEmail().custom((value, { req }) => {
        return User.findOne({ email: value }).then(existingUser => {
            if (existingUser) {
                return Promise.reject("Email already exists");
            }
            return true;
        })
    }).normalizeEmail(),
    body("password", "Weak Password!").isLength({ min: 6 }).trim(),
    body("confirmPassword").trim().custom((value, { req }) => {
        let reqBody = JSON.parse(JSON.stringify(req.body));
        if (value === reqBody.password) {
            return true;
        } else
            throw new Error("Password does not match");
    })
], authController.postSignup);

router.post("/signout", authController.postSignOut);

router.get("/forget-password", authController.getForgetPassword);

router.post("/forget-password", authController.postForgetPassword);

router.get("/reset-password/:token", authController.getResetPassword);

router.post("/reset-password", authController.postResetPassword);



module.exports = router;