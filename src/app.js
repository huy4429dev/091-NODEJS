const express = require('express');
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

// Set Templating Engine
app.use(expressLayouts)
app.set('layout', './layout/_layoutAdmin');
app.set('view engine', 'ejs'); // set view  engine --> c# --> cshtml react --> jsx ===> code js inline html
app.set('views', path.join(__dirname, 'views')); // define path views default

// middle ware 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev')); // show log

app.use(myConnection(mysql, {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'node_test'             
}, 'single'));  // conenct db

// routes
app.use('/', customerRoutes);
app.use('/admin/', adminRoutes);

// static files
app.use(express.static(path.join(__dirname, 'public')));

// starting the server
app.listen(app.get('port'), () => {
    console.log(`server on port ${app.get('port')}`);
});