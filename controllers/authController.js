const User = require("../models/user");
//Import module for password encryption
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


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

exports.getForgetPassword = (req, res, next) => {
    res.render("auth/forget-password.ejs", {
        pageTitle: "Reset password-webTRON Shop",
        path: "/forget-password",
    })
}

exports.postForgetPassword = (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const email = body.email;
    let token;
    User.findOne({ email: email }).then(user => {
        if (!user) {
            req.flash("err-message", "Invalid credentials!");
            return res.redirect("/forget-password");
        } else {
            //Send Email Here
            //Generate token here
            crypto.randomBytes(32, (err, buffer) => {
                token = buffer.toString("hex");
                //Store token to database
                user.resetPasswordToken = token;
                user.resetPasswordTokenExpiration = Date.now() + 360000;//i.e 1 hour
                user.save();


                const url = `http://localhost:3000/reset-password/${token}`;
                res.redirect(url);
            })
        }
    }).catch(err => {
        console.log(err);
    })
}

exports.getResetPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiration: { $gt: Date.now() } }).then(user => {
        if (user) {
            res.render("auth/reset-password", {
                pageTitle: "Reset Password",
                path: "/reset-password",
                token: token,
                _id: user._id
            })

        } else {
            req.flash("err-message", "Invalid URL! Please try again!!!");
            return res.redirect("/forget-password");
        }
    }).catch(err => {
        console.log(err);
    })

}

exports.postResetPassword = (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const password = body.password;
    const _id = body._id;
    const token = body.token;
    User.findOne({ _id: _id, resetPasswordToken: token, resetPasswordTokenExpiration: { $gt: Date.now() } }).then(user => {
        if (!user) {
            req.flash("err-message", "Session Expired!");
            return req.redirect("/forget-password");
        } else {
            bcrypt.hash(password, 12).then(hashedPassword => {
                user.password = hashedPassword;
                user.resetPasswordToken = undefined;
                user.resetPasswordTokenExpiration = undefined;
                return user.save();
            }).then(() => {
                res.redirect("/login");
            }).catch(err => {
                console.log(err);
            })

        }
    }).catch(err => {
        console.log(err);
    })
}