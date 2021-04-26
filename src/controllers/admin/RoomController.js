const moment = require('moment');
const controller = {};

controller.index = (req, res) => {

    const userId = req.session.User?.userId ?? 1;
    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;
    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 12;
    const rooms = [];

    req.getConnection((err, conn) => {

        const sql = ` select r.id , r.code , r.title , r.status , r.price , r.desposit , r.acr , r.capacity , r.utilities , r.thumbnail , r.images , r.address, r.createdTime , r.updatedTime , r.description , r.content, r.categoryId ,
                      r.countCheckout , r.timeOrderActive, r.verify,
                      r2.name categoryName, 
                      u.username roomUsername, u.id roomUserId, u.fullname roomUserFullname,  u.phone roomUserPhone, u.address roomUserAddress , u.address roomUserAddress,
                      o.id orderId, o.checked, o.timeCheckout, o.code orderCode, o.amount orderAmount, o.createTime orderCreateTime, o.updateTime orderUpdateTime, o.status orderStatus, o.note orderNote,
                      u2.username customerName, u2.id customerId, u2.fullname customerFullname, u2.phone customerPhone, u2.address customerAddress,
                      o2.id detailId, o2.utility , o2.createTime detailCreateTime , o2.updateTime detailUpdateTime, o2.amount detailAmount
                      from rooms r 
                      left join roomcategories r2 
                      on r2.id = r.categoryId 
                      left join users u 
                      on r.userid  = u.id
                      left join orders o 
                      on o.roomId  = r.id
                      left join users u2 
                      on u2.id = o.customerId 
                      left join orderdetails o2 
                      on o.id  = o2.orderId 
                      WHERE r.userId = ${userId}
                      ORDER BY r.status, id DESC,
                               o.checked ASC,
                               o.status DESC ; 
                     SELECT COUNT(*) as Total FROM rooms r where r.userId = ${userId};
                     select * from roomcategories r 
                     `;

        conn.query(sql, [parseInt(pageSize), (page - 1) * pageSize], (err, data) => {
            data[0].forEach((r, index) => {
                let foundRoom = rooms.findIndex(item => item.id == r.id);
                if (foundRoom == -1) {
                    rooms.push({
                        id: r.id,
                        code: r.code,
                        title: r.title,
                        timeOrderActive: r.timeOrderActive,
                        status: r.status,
                        price: r.price,
                        desposit: r.desposit,
                        acr: r.acr,
                        verify: r.verify,
                        capacity: r.capacity,
                        utilities: r.utilities,
                        thumbnail: r.thumbnail,
                        images: r.images,
                        createdTime: r.createdTime,
                        updatedTime: r.updatedTime,
                        description: r.description,
                        content: r.content,
                        categoryId: r.categoryId,
                        countCheckout: r.countCheckout,
                        categoryName: r.categoryName,
                        roomUsername: r.roomUsername,
                        roomUserId: r.roomUserId,
                        roomUserAddress: r.roomUserAddress,
                        roomUserPhone: r.roomUserPhone,
                        roomUserFullname: r.roomUserFullname,
                        orderStatus: r.orderStatus,
                        timeCheckout: r.timeCheckout,
                        address: r.address,
                        checked: r.checked,
                        orders: []
                    });
                    foundRoom = rooms.length - 1;
                }
                // import orders

                if (r.orderId != null) {
                    let foundOrder = rooms[foundRoom].orders.findIndex(item => item.id == r.orderId);
                    if (foundOrder == -1) {
                        rooms[foundRoom].orders.push({
                            id: r.orderId,
                            orderCode: r.orderCode,
                            orderAmount: r.orderAmount,
                            orderCreateTime: r.orderCreateTime,
                            orderUpdateTime: r.orderUpdateTime,
                            orderStatus: r.orderStatus,
                            orderNote: r.orderNote,
                            timeCheckout: r.timeCheckout,
                            customerName: r.customerName,
                            customerId: r.customerId,
                            customerFullname: r.customerFullname,
                            customerPhone: r.customerPhone,
                            customerAddress: r.customerAddress,
                            checked: r.checked,
                            details: []
                        });
                        foundOrder = rooms[foundRoom].orders.length - 1;
                    }


                    // import details
                    if (r.detailId != null) {

                        rooms[foundRoom].orders[foundOrder].details.push({
                            id: r.detailId,
                            utility: r.utility,
                            createTime: r.detailCreateTime,
                            updateTime: r.detailUpdateTime,
                            amount: r.detailAmount
                        });

                    }
                }


            });

            console.log(rooms);

            if (err) {
                res.json(err);
            }
            else {
                res.render('admin/room',
                    {
                        layout: './layout/_layoutAdmin',
                        extractScripts: true,
                        extractStyles: true,
                        hideActionImportExcel: true,
                        hideActionExportExcel: true,
                        errorValidate: errorValidate,
                        successAlert: successAlert,
                        categories: rooms,
                        curentPage: page,
                        total: data[1][0].Total % pageSize === 0 ? data[1][0].Total / pageSize : Math.floor(data[1][0].Total / pageSize) + 1,
                        roomCategories: data[2],
                        title: 'Thiết lập phòng',
                        breadcrumbs: [
                            {
                                title: 'Phòng',
                                link: '/admin/room'
                            }
                        ],
                        actionSearch: '/admin/room/search',
                        q: '',
                        filter: '',
                        moment: moment
                    }
                );
            }
        });

    });

};
controller.create = (req, res) => {
    const images = req.body.images;
    const thumbnail = req.body.thumbnail;
    const utilities = req.body.utilities;
    const title = req.body.title;
    const categoryId = req.body.categoryId;
    const price = req.body.price;
    const acr = req.body.acr;
    const desposit = req.body.desposit;
    const capacity = req.body.capacity;
    const address = req.body.address;
    const description = req.body.description;
    const userId = req.session.User?.userId ?? 1;
    const status = 1;

    const errors = [];
    // validate basic
    if (title.length <= 3) {
        errors.push("Tên danh mục phải lớn hơn 3 kí tự !")
    }
    if (errors.length > 0) {
        req.session.Error = errors[0];
        res.redirect("/admin/room");
    }
    else {
        req.getConnection((err, connection) => {
            const sqlGetLastId = `select r.id 
                                    from rooms r 
                                    order by id desc 
                                    limit 1`;
            connection.query(sqlGetLastId, (err, data) => {
                const code = "PH-0" + data[0].id + 1;
                connection.query(`INSERT INTO ROOMS
                                 set
                                    images = ?,
                                    thumbnail = ?,
                                    utilities = ?,
                                    title = ?,
                                    categoryId = ?,
                                    price = ?,
                                    acr = ?,
                                    desposit = ?,
                                    capacity = ?,
                                    address = ?,
                                    description = ?,
                                    userId = ?,
                                    code = ?,
                                    status = ?,
                                 `, [
                    images,
                    thumbnail,
                    utilities,
                    title,
                    categoryId,
                    price,
                    acr,
                    desposit,
                    capacity,
                    address,
                    description,
                    userId,
                    code,
                    status
                ],

                    (err, data) => {
                        req.session.Success = "Thêm mới danh mục thành công";
                        res.redirect("/admin/room");
                    })
            })


        });
    }
}

controller.update = (req, res) => {

    const { id } = req.params;
    const name = req.body.name;
    const status = parseInt(req.body.status);
    const errors = [];
    if (name.length <= 3) {
        errors.push("Tên danh mục phải lớn hơn 3 kí tự !")
    }
    if (errors.length > 0) {
        res.redirect("/admin/room");
    }
    else {
        req.getConnection((err, connection) => {
            connection.query('UPDATE roomCategories SET ? WHERE ID = ?', [{ name: name, status: status }, id], (err, data) => {
                res.json(
                    {
                        name: name,
                        status: status,
                        message: 'cập nhật danh mục thành công',
                        success: true
                    });
            })
        });
    }
}

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, connection) => {
        connection.query('DELETE FROM roomCategories WHERE id = ?', [id], (err, rows) => {
            req.session.Success = "Xóa danh mục thành công";
            res.redirect('/admin/room');
        });
    });
}

controller.search = (req, res) => {

    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;
    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 12;
    const q = req.query.q != undefined ? `%${req.query.q.trim()}%` : '';
    const filterStatus = req.query.filterStatus;
    const userId = req.session.User?.userId ?? 1;
    let startDate = moment(req.query.startDate, 'DD-MM-YYYY');
    startDate = startDate.format('yyyy/MM/DD')
    let endDate = moment(req.query.endDate, 'DD-MM-YYYY');
    endDate = endDate.format('yyyy/MM/DD')
    const rooms = [];

    req.getConnection((err, conn) => {

        let sql = ` select r.id , r.code , r.title , r.status , r.price , r.desposit , r.acr , r.capacity , r.utilities , r.thumbnail , r.images , r.address, r.createdTime , r.updatedTime , r.description , r.content, r.categoryId ,
                          r.countCheckout , r.timeOrderActive,
                          r2.name categoryName, 
                          u.username roomUsername, u.id roomUserId, u.fullname roomUserFullname,  u.phone roomUserPhone, u.address roomUserAddress , u.address roomUserAddress,
                          o.id orderId, o.checked, o.timeCheckout, o.code orderCode, o.amount orderAmount, o.createTime orderCreateTime, o.updateTime orderUpdateTime, o.status orderStatus, o.note orderNote,
                          u2.username customerName, u2.id customerId, u2.fullname customerFullname, u2.phone customerPhone, u2.address customerAddress,
                          o2.id detailId, o2.utility , o2.createTime detailCreateTime , o2.updateTime detailUpdateTime, o2.amount detailAmount
                          from rooms r 
                          join roomcategories r2 
                          on r2.id = r.categoryId 
                          join users u 
                          on r.userid  = u.id
                          left join orders o 
                          on o.roomId  = r.id
                          left join users u2 
                          on u2.id = o.customerId 
                          left join orderdetails o2 
                          on o.id  = o2.orderId 
                          WHERE r.userId = ${userId} and TRUE 
                         `;
        let sqlCount = `SELECT COUNT(*) as Total FROM rooms r where r.userId = ${userId} and TRUE`;
        let param = '';
        if (q != '') {
            sql += ` AND LOWER(r.code) LIKE  '${q}'`;
            sqlCount += ` AND LOWER(r.code) LIKE  '${q}'`;
            param = q;
        }

        if (filterStatus != undefined && filterStatus != '') {
            sql += `AND r.status = ${filterStatus}`;
            sqlCount += `AND r.status = ${filterStatus}`;
        }

        if (startDate != 'Invalid date') {

            sql += ` AND createdTime >= '${startDate}'`;
            sqlCount += ` AND createdTime >= '${startDate}'`;
            sql += ` AND createdTime <= '${endDate}' `;
            sqlCount += ` AND createdTime <= '${endDate}'`;
        }

        sql = sql + 'ORDER BY r.status, id DESC, o.checked ASC, o.status DESC limit ? offset ?; select * from roomcategories;' + sqlCount;
        conn.query(sql, [parseInt(pageSize), (page - 1) * pageSize], (err, data) => {
            data[0].forEach((r, index) => {
                let foundRoom = rooms.findIndex(item => item.id == r.id);
                if (foundRoom == -1) {
                    rooms.push({
                        id: r.id,
                        code: r.code,
                        title: r.title,
                        timeOrderActive: r.timeOrderActive,
                        status: r.status,
                        price: r.price,
                        desposit: r.desposit,
                        acr: r.acr,
                        capacity: r.capacity,
                        utilities: r.utilities,
                        thumbnail: r.thumbnail,
                        images: r.images,
                        createdTime: r.createdTime,
                        updatedTime: r.updatedTime,
                        description: r.description,
                        content: r.content,
                        categoryId: r.categoryId,
                        countCheckout: r.countCheckout,
                        categoryName: r.categoryName,
                        roomUsername: r.roomUsername,
                        roomUserId: r.roomUserId,
                        roomUserAddress: r.roomUserAddress,
                        roomUserPhone: r.roomUserPhone,
                        roomUserFullname: r.roomUserFullname,
                        orderStatus: r.orderStatus,
                        timeCheckout: r.timeCheckout,
                        address: r.address,
                        checked: r.checked,
                        orders: []
                    });
                    foundRoom = rooms.length - 1;
                }
                // import orders

                if (r.orderId != null) {
                    let foundOrder = rooms[foundRoom].orders.findIndex(item => item.id == r.orderId);
                    if (foundOrder == -1) {
                        rooms[foundRoom].orders.push({
                            id: r.orderId,
                            orderCode: r.orderCode,
                            orderAmount: r.orderAmount,
                            orderCreateTime: r.orderCreateTime,
                            orderUpdateTime: r.orderUpdateTime,
                            orderStatus: r.orderStatus,
                            orderNote: r.orderNote,
                            timeCheckout: r.timeCheckout,
                            customerName: r.customerName,
                            customerId: r.customerId,
                            customerFullname: r.customerFullname,
                            customerPhone: r.customerPhone,
                            customerAddress: r.customerAddress,
                            checked: r.checked,
                            details: []
                        });
                        foundOrder = rooms[foundRoom].orders.length - 1;
                    }


                    // import details
                    if (r.detailId != null) {

                        rooms[foundRoom].orders[foundOrder].details.push({
                            id: r.detailId,
                            utility: r.utility,
                            createTime: r.detailCreateTime,
                            updateTime: r.detailUpdateTime,
                            amount: r.detailAmount
                        });

                    }
                }
            });
            if (err) {
                res.json(err);
            }
            else {
                res.render('admin/room',
                    {
                        layout: './layout/_layoutAdmin',
                        extractScripts: true,
                        extractStyles: true,
                        hideActionImportExcel: true,
                        hideActionExportExcel: true,
                        errorValidate: errorValidate,
                        successAlert: successAlert,
                        categories: rooms,
                        roomCategories: data[2],
                        curentPage: page,
                        total: data[1][0].Total % pageSize === 0 ? data[1][0].Total / pageSize : Math.floor(data[1][0].Total / pageSize) + 1,
                        title: 'Thiết lập phòng',
                        breadcrumbs: [
                            {
                                title: 'Phòng',
                                link: '/admin/room'
                            }
                        ],
                        actionSearch: '/admin/room/search',
                        q: q,
                        filter: filterStatus,
                        moment: moment
                    }
                );
            }
        });

    });

};

controller.verify = (req, res) => {
    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;

    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 5;
    req.getConnection((err, conn) => {
        const sql = `select r.id vId, r.status vStatus, r.createdTime vCreatedTime , r.updatedTime vUpdatedTime,  r.roomId  vRoomId, u.fullname , u.phone 
                    from roomverifies r
                    join users u 
                    on u.id = r.creatorId 
                    ORDER BY r.id DESC limit ? offset ? ;
                    select count(*)
                    from roomverifies r
                    join users u 
                    on u.id = r.creatorId 
                    `;
        conn.query(sql, [parseInt(pageSize), (page - 1) * pageSize], (err, data) => {
            if (err) {
                res.json(err);
            }
            else {
                res.render('admin/RoomVerify',
                    {
                        layout: './layout/_layoutAdmin',
                        extractScripts: true,
                        extractStyles: true,
                        errorValidate: errorValidate,
                        successAlert: successAlert,
                        hideActionAdd: true,
                        hideActionSearch: true,
                        hideActionImportExcel: true,
                        hideActionExportExcel: true,
                        categories: data[0],
                        curentPage: page,
                        total: data[1][0].Total % pageSize === 0 ? data[1][0].Total / pageSize : Math.floor(data[1][0].Total / pageSize) + 1,
                        title: 'Xác thực phòng',
                        breadcrumbs: [
                            {
                                title: 'Phòng',
                                link: '/admin/room'
                            },
                            {
                                title: 'Xác thực phòng',
                                link: '/admin/room/verify'
                            }

                        ],
                        actionSearch: '/admin/room/verify/search',
                        q: '',
                        filter: '',
                        moment: moment
                    }
                );
            }
        });

    });
}

controller.sendVerify = (req, res) => {
    const userVerifyId = req.session.User?.userId ?? 1;
    const { id } = req.params;
    const { creatorId } = req.query;

    const sqlQueryVerify = `SELECT * FROM roomVerifies WHERE roomId = ${id}`;

    req.getConnection((err, connection) => {
        connection.query(sqlQueryVerify, (err, data) => {

            if (data.length == 0) {
                connection.query('INSERT INTO roomVerifies set creatorId = ?, userVerifyId = ? , roomId = ? , status =  ?, createdTime = NOW() , updatedTime = NOW()', 
                    [creatorId, userVerifyId, id, 0], (err, data) => {
                    res.json(
                        {
                            status: 0,
                            message: 'Gửi yêu cầu xác thực thành công',
                            success: true
                        });
                })
            }
            else {
                res.json(
                    {
                        status: 1,
                        message: 'Yêu cầu xác thực đang được xử lý',
                        success: true
                    });
            }
        })
    });
}

controller.updateVerify = (req, res) => {
    const userVerifyId = req.session.User?.userId ?? 1;
    const { id } = req.params;
    const {status} = req.query;
    const sqlQueryVerify = `SELECT * FROM roomVerifies WHERE id = ${id} limit 1`;

    req.getConnection((err, connection) => {
        connection.query(sqlQueryVerify, (err, data) => {

            if (data.length == 1) {
                connection.query(`UPDATE roomVerifies set creatorId = ${userVerifyId}, status = ${status} , updatedTime = NOW()`, (err, data) => {
                    console.log(err);
                    res.json(
                        {
                            message: 'Cập nhật trạng thái thành công',
                            success: true
                        });
                })
            }
            else {
                res.json(
                    {
                        message: 'Lỗi không tồn tại đơn xác thực',
                        success: false
                    });
            }
        })
    });
}



module.exports = controller;