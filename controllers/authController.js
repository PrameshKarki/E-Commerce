const User = require("../models/user");

exports.getLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "LogIn-webTRON Shop",
        path: "/",
        isAuthenticated: false
    });
}


exports.postLogin = (req, res, next) => {
    User.findById("609790feb5af9d9496b3a024").then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(err => {
            console.log(err);
            res.redirect("/")
        })
    }).catch(err => {
        console.log(err);
    })
}

exports.postSignOut = (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
}