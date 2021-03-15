const router = require('express').Router();

const UserController = require('../../controllers/admin/UserController');
router.get('/login', UserController.getLogin);
router.post('/login', UserController.postLogin);
// router.get('/update/:id', UserController.edit);
// router.post('/update/:id', UserController.update);
// router.get('/delete/:id', UserController.delete);

const AdminController = require('../../controllers/admin/AdminController');
router.get('/init', AdminController.init);


const DashboardController = require('../../controllers/admin/DashboardController');
router.get('/dashboard', DashboardController.index);

const CustomerController = require('../../controllers/admin/CustomerController');
router.get('/customer', CustomerController.index);

const CategoryController = require('../../controllers/admin/CategoryController');
router.get('/category', CategoryController.index);
router.post('/category/create', CategoryController.create);
router.put('/category/update/:id', CategoryController.update);
router.get('/category/delete/:id', CategoryController.delete);
router.get('/category/search', CategoryController.search);
router.get('/category/excel/export', CategoryController.exportExcel);
router.post('/category/excel/import', CategoryController.importExcel);



const ContactController = require('../../controllers/admin/ContactController');
router.get('/contact', ContactController.index);



// upload

const uploadController = require("../../controllers/file/FileController");
router.post("/upload", uploadController.upload);
router.get("/upload/files", uploadController.getListFiles);
router.get("/upload/files/:name", uploadController.download);

module.exports = router;
