//Import modules
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

//Import routes
const shopRoutes = require('./routes/shopRoute');
const adminRoutes = require('./routes/adminRoute');

//Import Models
const User = require("./models/user");

//Instantiate express app
const app = express();

//Export controllers
const errorController = require('./controllers/errorController');

//Set template engine
app.set("view engine", "ejs");
app.set("views", "views");

//Set body parser
app.use(bodyParser.urlencoded({ extended: false }));

//For serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Set middleware
app.use((req, res, next) => {
    User.fetch(1).then(user => {
        const fetchedUser = user[0];
        req.user = fetchedUser[0];
        next();
    }).catch(err => {
        console.log(err);
    })

})


//Middleware for shop routes
app.use(shopRoutes);
//Middleware for admin routes
app.use('/admin', adminRoutes);

//Serve 404 page
app.use(errorController.get404);
//Don't invoke function here

//Run Server
app.listen(3000);