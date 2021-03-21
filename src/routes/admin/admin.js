const router = require('express').Router();

const UserController = require('../../controllers/admin/UserController');
router.get('/login', UserController.getLogin);
router.post('/login', UserController.postLogin);
router.get('/logout', UserController.getLogout);
// router.get('/update/:id', UserController.edit);
// router.post('/update/:id', UserController.update);
// router.get('/delete/:id', UserController.delete);

const AdminController = require('../../controllers/admin/AdminController');
router.get('/init', AdminController.init);


const DashboardController = require('../../controllers/admin/DashboardController');
router.get('/dashboard', DashboardController.index);


// Customer 

const CustomerController = require('../../controllers/admin/CustomerController');
router.get('/customer', CustomerController.index);
router.post('/customer/create', CustomerController.create);
router.put('/customer/update/:id', CustomerController.update);
router.get('/customer/delete/:id', CustomerController.delete);
router.get('/customer/search', CustomerController.search);
router.get('/customer/excel/export', CustomerController.exportExcel);
router.post('/customer/excel/import', CustomerController.importExcel);


// Room

const RoomCategoryController = require('../../controllers/admin/RoomCategoryController');
router.get('/room/category', RoomCategoryController.index);
router.post('/room/category/create', RoomCategoryController.create);
router.put('/room/category/update/:id', RoomCategoryController.update);
router.get('/room/category/delete/:id', RoomCategoryController.delete);
router.get('/room/category/search', RoomCategoryController.search);
router.get('/room/category/excel/export', RoomCategoryController.exportExcel);
router.post('/room/category/excel/import', RoomCategoryController.importExcel);

const RoomController = require('../../controllers/admin/RoomController');
router.get('/room', RoomController.index);
router.post('/room/create', RoomController.create);
router.put('/room/update/:id', RoomController.update);
router.get('/room/delete/:id', RoomController.delete);
router.get('/room/search', RoomController.search);
router.get('/room/excel/export', RoomController.exportExcel);
router.post('/room/excel/import', RoomController.importExcel);


//Contact
const ContactController = require('../../controllers/admin/ContactController');
router.get('/contact', ContactController.index);
router.post('/contact/create', ContactController.create);
// router.put('/contact/update/:id', ContactController.update);
router.get('/contact/delete/:id', ContactController.delete);
router.get('/contact/search', ContactController.search);
router.get('/contact/excel/export', ContactController.exportExcel);
router.post('/contact/excel/import', ContactController.importExcel);


// Post

const PostCategoryController = require('../../controllers/admin/PostCategoryController');
router.get('post/category', PostCategoryController.index);
router.post('post/category/create', PostCategoryController.create);
router.put('post/category/update/:id', PostCategoryController.update);
router.get('post/category/delete/:id', PostCategoryController.delete);
router.get('post/category/search', PostCategoryController.search);
router.get('post/category/excel/export', PostCategoryController.exportExcel);
router.post('post/category/excel/import', PostCategoryController.importExcel);

// upload

const uploadController = require("../../controllers/file/FileController");
router.post("/upload", uploadController.upload);
router.get("/upload/files", uploadController.getListFiles);
router.get("/upload/files/:name", uploadController.download);

module.exports = router;
