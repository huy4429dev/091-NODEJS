const router = require('express').Router();

const HomeController = require('../../controllers/page/HomeController');
router.get('/', HomeController.index);


const RoomController = require('../../controllers/page/RoomController');
router.get('/phong/:id', RoomController.deltail);
router.get('/tim-kiem/phong', RoomController.search);


const CustomerController = require('../../controllers/page/CustomerController');

router.get('/dang-ki', CustomerController.register);
router.post('/dang-ki', CustomerController.registerPost);
router.get('/dang-nhap', CustomerController.login);
router.post('/dang-nhap', CustomerController.loginPost);
router.get('/dang-xuat', CustomerController.getLogout);
router.get('/ho-so', CustomerController.profile);
router.post('/ho-so', CustomerController.profilePost);
router.get('/ho-so/mat-khau', CustomerController.changePassword);
router.post('/ho-so/mat-khau', CustomerController.changePasswordPost);
router.get('/ho-so/dat-phong', CustomerController.profileHistory);

router.post('/dat-phong/:id', CustomerController.bookRoom);




module.exports = router;