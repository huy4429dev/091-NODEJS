const excel = require('exceljs');
const moment = require('moment');
const { isURL } = require('read-excel-file/commonjs/types/URL');
const readXlsxFile = require('read-excel-file/node');
const controller = {};

controller.index = (req, res) => {

    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;

    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 12;
    const rooms = [];

    req.getConnection((err, conn) => {

        const sql = ` select r.id , r.code , r.title , r.status , r.price , r.desposit , r.acr , r.capacity , r.utilities , r.thumbnail , r.images , r.address, r.createdTime , r.updatedTime , r.description , r.content, r.categoryId ,
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
                      ORDER BY r.status, id DESC,
                               o.checked ASC,
                               o.status DESC limit ? offset ?; 
                     SELECT COUNT(*) as Total FROM rooms;
                     select * from roomcategories r 
                     `;;

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
    const userId = 1;
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
    const pageSize = req.query.pageSize ?? 5;
    const q = req.query.q != undefined ? `%${req.query.q}%` : '';
    const filterStatus = req.query.filterStatus;

    let startDate = moment(req.query.startDate, 'DD-MM-YYYY');
    startDate = startDate.format('yyyy/MM/DD')
    let endDate = moment(req.query.endDate, 'DD-MM-YYYY');
    endDate = endDate.format('yyyy/MM/DD')

    req.getConnection((err, conn) => {

        let sql = 'SELECT * FROM roomCategories WHERE true ';
        let sqlCount = ' SELECT COUNT(*) as Total FROM roomCategories WHERE true ';
        let param = '';
        if (q != '') {
            sql += `AND LOWER(name) LIKE  '${q}'`;
            sqlCount += `AND LOWER(name) LIKE  '${q}'`;
            param = q;
        }

        if (filterStatus != undefined && filterStatus != '') {
            sql += `AND status = ${filterStatus}`;
            sqlCount += `AND status = ${filterStatus}`;
        }

        sql += ` AND createTime >= '${startDate}'`;
        sqlCount += ` AND createTime >= '${startDate}'`;
        sql += ` AND createTime <= '${endDate}' `;
        sqlCount += ` AND createTime <= '${endDate}'`;


        sql = sql + ' ORDER BY id DESC limit ? offset ? ; ' + sqlCount;
        conn.query(sql, [parseInt(pageSize), (page - 1) * pageSize], (err, data) => {

            if (err) {
                res.json(err);
            }
            else {
                res.render('admin/category',
                    {
                        layout: './layout/_layoutAdmin',
                        extractScripts: true,
                        extractStyles: true,
                        errorValidate: errorValidate,
                        successAlert: successAlert,
                        categories: data[0],
                        curentPage: page,
                        total: data[1][0].Total % pageSize === 0 ? data[1][0].Total / pageSize : Math.floor(data[1][0].Total / pageSize) + 1,
                        title: 'Thiết lập phòng',
                        breadcrumbs: [
                            {
                                title: 'Phòng',
                                link: '/admin/room'
                            },
                            {
                                title: 'Danh mục phòng',
                                link: '/admin/room'
                            }
                        ],
                        actionSearch: '/admin/room/search',
                        q: q,
                        filter: filterStatus
                    }
                );
            }
        });

    });

};



module.exports = controller;