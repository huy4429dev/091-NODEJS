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
    if (req.session.User) {
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
        return res.redirect("/dang-nhap");
    }


    const sqlLogin = `SELECT * from users u 
                    join userroles u2 
                    on u.id = u2.userId 
                    join roles r 
                    on r.id = u2.roleId  where username = '${username}' and password = '${md5(password)}' limit 1`;
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
                    if (success[0].name == "admin" || success[0].name == "shop") {


                        res.redirect("/admin/dashboard");
                    }
                    else {
                        backURL= req.header('Referer') || '/';
                        // do your thang
                        res.redirect(backURL);
                    }
                }
            }
            else {
                errors.push("Sai tên đăng nhập hoặc mật khẩu");
                req.session.Error = errors[0];
                res.redirect("/dang-nhap");
            }
        });

    });

};

controller.getLogout = (req, res) => { 
    delete req.session.User;
    res.redirect("/");
};

controller.profile = (req, res) => {
    // if (!req.session.User) {
    //     res.redirect('/');
    // }

    // if (!req.session.User || req.session.User?.name == "admin" ||  req.session.User?.name == "shop") {
    //     res.redirect('/');
    // }

    const userId = req.session.User?.userId ?? 1;

    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;

    const sqlProfile = `SELECT * FROM users where id = ${userId} limit 1`;

    req.getConnection((err, conn) => {

        conn.query(sqlProfile, (err, success) => {
            console.log(success);
            res.render('page/profile',
                {
                    extractScripts: true,
                    extractStyles: true,
                    layout: './layout/_layoutPage',
                    errorValidate: errorValidate,
                    profile: success[0],
                    moment: moment,
                    errorValidate: errorValidate,
                    successAlert: successAlert,
                }
            );
        });

    });
};


controller.profilePost = (req, res) => {
    // if (!req.session.User) {
    //     res.redirect('/');
    // }

    // if (!req.session.User || req.session.User?.name == "admin" ||  req.session.User?.name == "shop") {
    //     res.redirect('/');
    // }


    const fullname = req.body.fullname;
    const email = req.body.email;
    const phone = req.body.phone;
    const gender = req.body.gender ?? 1;
    const datebirth = req.body.datebirth ?? moment().format("YYYY/MM/DD");
    const errors = [];
    const userId = req.session.User?.userId ?? 1;

    if (fullname.length <= 3) {
        errors.push("Tên khách hàng phải lớn hơn 3 kí tự !")
    }
    if (email.length <= 3) {
        errors.push("Email không đúng định dạng !")
    }


    if (errors.length > 0) {
        req.session.Error = errors[0];
        res.redirect("/ho-so");
    }
    else {
        req.getConnection((err, connection) => {
            connection.query(`UPDATE users set 
                         fullname = ?, email = ?, phone = ?, gender = ?, datebirth = ?
                        where id = ${userId}
                         `,
                [
                    fullname,
                    email,
                    phone,
                    gender,
                    datebirth

                ],
                (err, data) => {
                    if (err) {
                        res.json(err);
                    }
                    else {
                        req.session.Success = "Thêm mới khách hàng thành công";
                        res.redirect("/ho-so");
                    }

                })
        });
    }
};


controller.changePassword = (req, res) => {
    // if (!req.session.User) {
    //     res.redirect('/');
    // }

    // if (!req.session.User || req.session.User?.name == "admin" ||  req.session.User?.name == "shop") {
    //     res.redirect('/');
    // }

    const userId = req.session.User?.userId ?? 1;

    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;

    const sqlProfile = `SELECT * FROM users where id = ${userId} limit 1`;
    req.getConnection((err, conn) => {

        conn.query(sqlProfile, (err, success) => {

            res.render('page/UpdatePassword',
                {
                    extractScripts: true,
                    extractStyles: true,
                    layout: './layout/_layoutPage',
                    errorValidate: errorValidate,
                    profile: success[0],
                    moment: moment,
                    errorValidate: errorValidate,
                    successAlert: successAlert,
                }
            );
        });

    });
};

controller.changePasswordPost = (req, res) => {
    // if (!req.session.User) {
    //     res.redirect('/');
    // }

    // if (!req.session.User || req.session.User?.name == "admin" ||  req.session.User?.name == "shop") {
    //     res.redirect('/');
    // }

    const password = req.body.password;
    const newPassword = req.body.newPassword;
    const errors = [];
    const userId = req.session.User?.userId ?? 1;
    console.log(userId,'userId');

    if (password.length < 6) {
        errors.push("Mật khẩu không đúng định dạng !")
    }

    if (newPassword.length < 6) {
        errors.push("Mật khẩu không đúng định dạng !")
    }

    if (errors.length > 0) {
        req.session.Error = errors[0];
        res.redirect("/ho-so/mat-khau");
    }

    else {
        const sqlProfile = `SELECT * FROM users where id = ${userId} limit 1`;
        req.getConnection((err, connection) => {
            connection.query(sqlProfile, (err, success) => {
                if (md5(password) != success[0].password) {
                    req.session.Error = "Mật khẩu không khớp";
                    return res.redirect("/ho-so/mat-khau");
                }
                console.log(success);
                console.log(newPassword);
                connection.query(`UPDATE users set 
                password = ?
                where id = ${userId}
                 `,
                    [
                        md5(newPassword),
                    ],
                    (err, data) => {
                        console.log(data);
                        if (err) {
                            res.json(err);
                        }
                        else {
                            req.session.Success = "Cập nhật mật khẩu thành công";
                            res.redirect("/ho-so/mat-khau");
                        }

                    });
            });

        });
    }
};

controller.profileHistory = (req, res) => {
    // if (!req.session.User) {
    //     res.redirect('/');
    // }

    // if (!req.session.User || req.session.User?.name == "admin" ||  req.session.User?.name == "shop") {
    //     res.redirect('/');
    // }

    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;

    const userId = req.session.User?.userId ?? 1;
    const currentUserId = req.session.User?.userId ?? 1;
    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 5;

    req.getConnection((err, conn) => {
        const sqlProfile = `SELECT * FROM users where id = ${userId} limit 1`;
        const sql = `
                    ${sqlProfile};
                    select o.id, o.code , o.roomId , o.customerId , o.amount , o.status , o.createTime , o.updateTime, o.note ,
                            r.code as rCode , r.price , r.desposit ,
                            c.username , c.id as cid, c.username as cUsername, c.fullname as cFullname, 
                            u.username , u.id as uid, u.username as uUsername, u.fullname as uFullname
                    from orders o 
                    join rooms r 
                    on r.id = o.roomId 
                    join users c 
                    on c.id = o.customerId
                    join users u 
                    on u.id = o.userId 
                    where o.customerId  = ${currentUserId}
                    ORDER BY id DESC limit ? offset ? ; 
                    SELECT COUNT(*) as Total FROM orders where customerId = ${currentUserId} ;
                    `
            ;
        conn.query(sql, [parseInt(pageSize), (page - 1) * pageSize], (err, data) => {
            let orderIds = data[0].map(item => item.id).join();
            if (orderIds.length > 0) {
                orderIds = "in (" + orderIds + ")"
            }
            else {
                orderIds = "";
            }

            const sqlOrderDetail = `select *
                                    from orderdetails o 
                                    where o.orderId ${orderIds}`;

            conn.query(sqlOrderDetail, (errOrderDetail, dataOrderDetail) => {

                // map orderDetails to order
                data[0] = data[0].map(item => {
                    const orderDetails = dataOrderDetail.filter(d => d.orderId == item.id);
                    item.orderDetails = [...orderDetails];
                    return item;
                });

                if (err) {
                    res.json(err);
                }
                else {
                    res.render('page/BookHistory',
                        {
                            layout: './layout/_layoutPage',
                            extractScripts: true,
                            extractStyles: true,
                            errorValidate: errorValidate,
                            successAlert: successAlert,
                            categories: data[1],
                            profile: data[0],
                            curentPage: page,
                            total: data[2][0].Total % pageSize === 0 ? data[2][0].Total / pageSize : Math.floor(data[2][0].Total / pageSize) + 1,
                            title: 'Thiết lập hóa đơn',
                            breadcrumbs: [
                                {
                                    title: 'Hóa đơn',
                                    link: '/admin/order'
                                }
                            ],
                            actionSearch: '/admin/order/search',
                            q: '',
                            filter: '',
                            moment: moment
                        }
                    );
                }
            });
        });


    });

};



controller.bookRoom = (req, res) => {

    const { id } = req.params;
    const roomId = id;
    const currentUserId = req.session.User?.userId ?? 1;
    const username = req.session.User.username;
    const fullname = req.session.User.fullname;
    const email = req.session.User.email;
    const phone = req.session.User.phone;
    let timeCheckout = moment(req.session.User.timeCheckout, 'MM-DD-YYYY');
    timeCheckout = timeCheckout.format('yyyy/MM/DD')
    const status = parseInt(req.session.User.status);
    const errors = [];

    // validate basic
    if (errors.length > 0) {
        req.session.Error = errors[0];
        res.redirect("/admin/order/category");
    }

    else {
        req.getConnection((err, connection) => {
            const sqlRoom = `select * from rooms where id = ${roomId} limit 1`;
            connection.query(sqlRoom, (err, dataRoom) => {
                const foundCustomer = `select * from users u where u.phone = '${phone}';  select o.id from orders o order by o.id desc limit 1`;
                connection.query(foundCustomer, (err, data) => {
                    const code = 'DH0' + (data[1][0].id + 1 ?? 1);
                    if (data[0].length == 0) {
                        // create customer
                        const user = [
                            username, md5('123456'), email, fullname, 1, '/static/assets/uploads/admin/profile.png'
                        ];

                        connection.query('INSERT INTO users set  username = ? ,password = ? ,email = ?,fullname = ?,userStatus = ?,avatar = ?, phone = ?', [username, md5('123456'), email, fullname, 1, '/static/assets/uploads/admin/profile.png', phone], (err, u) => {
                            let userRoles = [u.insertId, 3];
                            connection.query('INSERT INTO userRoles (userId,roleId) values ?', [userRoles], (err, r) => {

                                const sqlInsert = `INSERT INTO node_test_2.orders (id,code, userId, roomId, customerId, amount, status, createTime, note, checked, timeCheckout)
                                VALUES(${data[1][0].id + 1},'${code}', ${currentUserId}, ${roomId}, ${u.insertId}, ${dataRoom[0].price}, 3, current_timestamp(), '', 0, '${timeCheckout}')); `;

                                connection.query(sqlInsert, (err, u) => {
                                    const roomUpdate = `update rooms set status = 1 where id = ${roomId}`;
                                    connection.query(roomUpdate, (err, u) => {
                                        req.session.Success = "Đặt phòng thành công";
                                        res.redirect("/phong" + roomId);
                                    });
                                });
                            })

                        });

                    }
                    else {
                        customer = data[0][0];
                        const sqlInsert = `INSERT INTO node_test_2.orders (id,code, userId, roomId, customerId, amount, status, createTime, note, checked, timeCheckout)
                                           VALUES(${data[1][0].id + 1},'${code}', ${currentUserId}, ${roomId}, ${customer.id}, ${dataRoom[0].price}, 3, current_timestamp(), '', 0, '${timeCheckout}'); `;
                        connection.query(sqlInsert, (err, u) => {
                            const roomUpdate = `update rooms set status = 1 where id = ${roomId}`;
                            connection.query(roomUpdate, (err, u) => {
                                req.session.Success = "Đặt phòng thành công";
                                res.redirect("/phong/" + roomId);
                            });
                        });
                    }
                });

            });
        });
    }
};



module.exports = controller;