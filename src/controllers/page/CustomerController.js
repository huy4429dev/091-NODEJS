const moment = require('moment');
const md5 = require('md5');
const controller = {};

controller.register = (req, res) => {

    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;

    req.getConnection((err, conn) => {
        res.render('page/register',
            {
                layout: './layout/_layoutPageCustomer',
                extractScripts: true,
                extractStyles: true,
                q: '',
                filter: '',
                errorValidate: errorValidate,
                successAlert: successAlert,
                moment: moment
            }
        );
    });
};

controller.registerPost = (req, res) => {

    const roleId = parseInt(req.body.roleId);
    const fullname = req.body.fullname;
    const userStatus = 1;
    const username = req.body.username;
    const password = md5(req.body.password);
    const email = req.body.email;
    const phone = req.body.phone;
    const gender = req.body.gender ?? 1;
    const errors = [];


    // validate basic
    if (username.length <= 3) {
        errors.push("Tài khoản khách hàng phải lớn hơn 8 kí tự !")
    }
    if (fullname.length <= 3) {
        errors.push("Tên khách hàng phải lớn hơn 8 kí tự !")
    }
    if (password.length <= 3) {
        errors.push("Mật khẩu phải lớn hơn 8 kí tự !")
    }
    if (roleId == 1) {
        errors.push("Bạn không thể hack hệ thống");
    }
    if (errors.length > 0) {
        req.session.Error = errors[0];
        res.redirect("/dang-ki");
    }
    else {
        req.getConnection((err, connection) => {
            connection.query(`INSERT INTO users set 
                             fullname = ?, userStatus = ?, username = ?, password = ?, email = ?, phone = ?
                             `,
                [
                    fullname,
                    userStatus,
                    username,
                    password,
                    email,
                    phone

                ],
                (err, data) => {
                    const userId = data.insertId;
                    connection.query('INSERT INTO userRoles set roleId = ?, userId = ?', [roleId, userId], (err, data) => {
                        if (err) {
                            res.json(err);
                        }
                        else {
                            req.session.Success = "Thêm mới khách hàng thành công";
                            res.redirect("/dang-ki");
                        }

                    })
                })
        });
    }
};

controller.login = (req, res) => {

    if(req.session.User){
        res.redirect('/');
    }
    const errorValidate = req.session.Error;
    delete req.session.Error;

    res.render('page/login',
        {
            extractScripts: true,
            extractStyles: true,
            layout: './layout/_layoutPageCustomer',
            errorValidate: errorValidate
        }
    );

};

controller.loginPost = (req, res) => {


    const username = req.body.username;
    const password = req.body.password;

    const errors = [];

    // validate 

    if (username == null || username.trim() == '') {
        errors.push("Vui lòng nhập tài khoản");
    }

    if (password == null || password.trim() == '') {
        errors.push("Vui lòng nhập mật khẩu");
    }

    if (errors.length > 0) {
        req.session.Error = errors[0];
        res.redirect("/dang-nhap");
    }


    const sqlLogin = `SELECT * FROM users u where username = '${username}' and password = '${md5(password)}' limit 1`;
    req.getConnection((err, conn) => {

        conn.query(sqlLogin, (err, success) => {

            if (err) {
                res.json("LỖI KẾT NỐI MYSQL");
            }
            if (success?.length > 0) {

                if (success) {

                    req.session.User = {
                        ...success[0]
                    };

                    res.redirect("/");
                }
            }
            else {
                errors.push("Sai tên đăng nhập hoặc mật khẩu");
               
            }
        });

    });

};

module.exports = controller;