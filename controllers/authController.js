exports.getLogin = (req, res, next) => {
    console.log(req.session.isLoggedIn);
    res.render("auth/login", {
        pageTitle: "LogIn-webTRON Shop",
        path: "/login"
    });
}


exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    const body = JSON.parse(JSON.stringify(req.body));
    res.redirect("/login");
}