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
router.get('/category', CategoryController.index); // nhìn là hiểu rồi truy cập vô route admin/cateogry gọi hàm index của categoryController


const ContactController = require('../../controllers/admin/ContactController');
router.get('/contact', ContactController.index);

module.exports = router;
