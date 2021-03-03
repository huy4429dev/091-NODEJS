const controller = {};
const md5 = require('md5');

controller.getLogin = (req, res) => {
    res.render('admin/Login');
};

controller.postLogin = (req, res) => {

    const username = req.body.username;
    const password =  md5(req.body.password);

    // validate this ... 

    if(username == null || username.trim() == ''){
        res.json("Vui lòng nhập tài khoản");
    }

    if(password == null || password.trim() == ''){
        res.json("Vui lòng nhập mật khẩu");
    }

    req.getConnection((err, conn) => {

        conn.query('SELECT * FROM users where username = ? and password = ? ' ,  [username, password] , (err, admin) => {
            if (admin?.length > 0) {
                res.redirect("/admin/dashboard");
            }
            else{
                res.json("ĐĂNG NHẬP THẤT BẠI");
            }
        });

        //check email and password

    });
}



module.exports = controller;