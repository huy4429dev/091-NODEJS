const router = require('express').Router();

const HomeController = require('../../controllers/page/HomeController');
router.get('/', HomeController.index);


const RoomController = require('../../controllers/page/RoomController');
router.get('/phong/:id', RoomController.deltail);


const CustomerController = require('../../controllers/page/CustomerController');

router.get('/dang-ki', CustomerController.register);
router.post('/dang-ki', CustomerController.registerPost);
router.get('/dang-nhap', CustomerController.login);
router.post('/dang-nhap', CustomerController.loginPost);




module.exports = router;