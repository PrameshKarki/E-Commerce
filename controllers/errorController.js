const get404 = (req, res, next) => {

    res.render("404", {
        pageTitle: "Page not found!",
        path: '',
        errMessage: undefined

    });
};

module.exports.get404 = get404;