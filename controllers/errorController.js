const get404 = (req, res, next) => {

    res.render("404", {
        pageTitle: "Page not found!",
        path: '',
        errMessage: req.flash("err-message"),

    });
};

module.exports.get404 = get404;