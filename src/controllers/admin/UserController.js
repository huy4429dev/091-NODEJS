const controller = {};
const md5 = require('md5');
controller.getLogin = (req, res) => {
    res.render('admin/Login', { layout: false });
};

controller.postLogin = (req, res) => {

    const username = req.body.username;
    const password = md5(req.body.password);

    // validate this ... 

    if (username == null || username.trim() == '') {
        res.json("Vui lòng nhập tài khoản");
    }

    if (password == null || password.trim() == '') {
        res.json("Vui lòng nhập mật khẩu");
    }

    req.getConnection((err, conn) => {

        conn.query(`SELECT * FROM users u where username = ? and password = ?  and exists (
            select 1 
            from roles r 
            join userRoles u2 
            on r.id = u2.roleId 
            where u.id = u2.userId and (lower(r.name) = 'admin' or lower(r.name) = 'employee'))`
            , [username, password], (err, admin) => {
                if (admin?.length > 0) {
                    req.session.User = {
                        ...admin[0]
                    };
                    res.redirect("/admin/dashboard");
                }
                else {
                    res.json("ĐĂNG NHẬP THẤT BẠI");
                }
            });

        //check email and password

    });
}
controller.getLogout = (req, res) => { 
    delete req.session.User;
    res.redirect("/admin/login");
};

module.exports = controller;