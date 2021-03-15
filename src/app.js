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

// importing routes
const customerRoutes = require('./routes/customer');
const adminRoutes = require('./routes/admin/admin');

// buld host
app.set('port', process.env.PORT || 3000);

global.__basedir = __dirname;


// Set Templating Engine
app.use(expressLayouts)
app.set('layout', './layout/_layoutAdmin', './layout/_layoutPage');
app.set('view engine', 'ejs'); // set view  engine --> c# --> cshtml react --> jsx ===> code js inline html
app.set('views', path.join(__dirname, 'views')); // define path views default

// middle ware 

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 60000 }
}));


//set session
app.get('/set_session', (req, res) => {
    //set a object to session
    req.session.User = "Lỗi GÌ ĐÓ !"

    return res.status(200).json({ status: 'success' })
})

//set session
app.get('/get_session', (req, res) => {
    //check session
    if (req.session.User) {
        return res.status(200).json({ status: 'success', session: req.session.User })
    }
    return res.status(200).json({ status: 'error', session: 'No session' })
})


//destroy session
app.get('/destroy_session', (req, res) => {
    //destroy session
    req.session.destroy(function (err) {
        return res.status(200).json({ status: 'success', session: 'cannot access session here' })
    })
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev')); // show log
app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'node_test',
    multipleStatements: true
}, 'single'));  // conenct db
// routes
app.use('/', customerRoutes);
app.use('/admin/', adminRoutes);

// static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'resources')));

// starting the server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});