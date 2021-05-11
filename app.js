//Import modules
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
//Import mongoose
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

//Import routes
const shopRoutes = require('./routes/shopRoute');
const adminRoutes = require('./routes/adminRoute');
const authRoutes = require("./routes/authRoute");

//Import controllers
const errorController = require('./controllers/errorController');

//Import Models
const User = require("./models/user");

const MONGODB_URI = "mongodb://localhost:27017/mongooseShop";

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collections: "sessions"
})

//Instantiate express app
const app = express();

//Set template engine
app.set("view engine", "ejs");
app.set("views", "views");

//Set Session
app.use(session({ secret: "secretKey", resave: false, saveUninitialized: false, store: store }))

//Set body parser
app.use(bodyParser.urlencoded({ extended: false }));

//For serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Set middleware
app.use((req, res, next) => {
    if (!req.session.user) {
        next();
    } else {
        User.findById(req.session.user._id).then(user => {
            req.user = user;
            next();
        }).catch(err => {
            console.log(err);
        })

    }

})

//Middleware for shop routes
app.use(shopRoutes);
//Middleware for admin routes
app.use('/admin', adminRoutes);
//Middleware for auth routes
app.use(authRoutes);


//Serve 404 page
app.use(errorController.get404);
//Don't invoke function here


mongoose.connect(MONGODB_URI).then(() => {
    app.listen(3000);
}).catch(err => {
    console.error(err);
})
