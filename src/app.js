const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts')
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const router = require('express').Router();
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const cookieParser = require('cookie-parser');

// build host
app.set('port', process.env.PORT || 3000);

global.__basedir = __dirname;


// Set Templating Engine
app.use(expressLayouts)
app.set('layout', './layout/_layoutAdmin', './layout/_layoutAdminDashboard', './layout/_layoutPage');
app.set('view engine', 'ejs'); // set view  engine --> c# --> cshtml react --> jsx ===> code js inline html
app.set('views', path.join(__dirname, 'views')); // define path views default

// middle ware 

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 60000 }
}));

app.use(function (req, res, next) {
    res.locals.user = req.session.User;
    next();
});

// Passport session setup. 
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

// Sử dụng FacebookStrategy cùng Passport.
passport.use(new FacebookStrategy({
    clientID: "543121906576699",
    clientSecret: "e9cce4b3064cc420b1abc883d8bbcc7d",
    callbackURL: "/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            console.log(accessToken, refreshToken, profile, done);
            return done(null, profile);
        });
    }
));

app.use(bodyParser.urlencoded({ extended: false })); //Parse body để get data
app.use(session({ secret: 'keyboard cat', key: 'sid'}));  //Save user login
app.use(passport.initialize());
app.use(passport.session());


// importing routes
const adminRoutes = require('./routes/admin/admin');
const pageRoutes = require('./routes/page/page');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev')); // show log
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'node_test_2',
    multipleStatements: true
}, 'single'));  // conenct db
// routes
app.use('/', pageRoutes);
app.use('/admin/', adminRoutes);

// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'resources')));

// starting the server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});

