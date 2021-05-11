const User = require("../models/user");
//Import module for password encryption
const bcrypt = require("bcryptjs");


exports.getLogin = (req, res, next) => {

    res.render("auth/login", {
        pageTitle: "LogIn-webTRON Shop",
        path: "/login",
    });
}


exports.postLogin = (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const email = body.email;
    const password = body.password;
    User.findOne({ email: email }).then(user => {
        if (!user) {
            req.flash("err-message", "Invalid Credentials!");
            res.redirect("/login");
        } else {
            bcrypt.compare(password, user.password).then(doMatch => {
                if (doMatch) {
                    req.session.isLoggedIn = true;
                    req.session.user = user;
                    req.session.save(err => {
                        res.redirect("/")
                    })
                } else {
                    req.flash("err-message", "Invalid Credentials!");
                    res.redirect("/login");
                }

            }).catch(err => {
                console.log(err);
            })
        }
    }).catch(err => console.log(err));

}

exports.postSignOut = (req, res, next) => {
    req.session.destroy();
    res.redirect("/");
}

exports.getSignup = (req, res, next) => {

    res.render("auth/signup.ejs", {
        pageTitle: "Sign Up-webTRON Shop",
        path: "/signup",
    })
}

exports.postSignup = (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const email = body.email;
    const password = body.password;
    const confirmPassword = body.confirmPassword;

    User.findOne({ email: email }).then(existingUser => {
        if (existingUser) {
            req.flash("err-message", "Email already exits!");
            return res.redirect("/signup");
        }
        bcrypt.hash(password, 12).then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            })
            return user.save();

        }).then(() => {
            res.redirect("/login");
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => console.log(err))
}