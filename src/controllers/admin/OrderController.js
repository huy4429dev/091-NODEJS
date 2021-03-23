const excel = require('exceljs');
const moment = require('moment');
const readXlsxFile = require('read-excel-file/node');
const controller = {};

controller.index = (req, res) => {

    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;
    const currentUserId = 1;
    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 5;
    req.getConnection((err, conn) => {
        const sql = `select o.id, o.code , o.roomId , o.customerId , o.amount , o.status , o.createTime , o.updateTime, o.note ,
                            r.code as rCode, r.code , r.price , r.desposit ,
                            c.username , c.id as cid, c.username as cUsername, c.fullname as cFullname, 
                            u.username , u.id as uid, u.username as uUsername, u.fullname as uFullname
                    from orders o 
                    join rooms r 
                    on r.id = o.roomId 
                    join users c 
                    on c.id = o.customerId
                    join users u 
                    on u.id = o.userId 
                    where u.id  = ${currentUserId}
                    ORDER BY id DESC limit ? offset ?  ; SELECT COUNT(*) as Total FROM postCategories`;

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
                    res.render('admin/order',
                        {
                            layout: './layout/_layoutAdmin',
                            extractScripts: true,
                            extractStyles: true,
                            errorValidate: errorValidate,
                            successAlert: successAlert,
                            categories: data[0],
                            curentPage: page,
                            total: data[1][0].Total % pageSize === 0 ? data[1][0].Total / pageSize : Math.floor(data[1][0].Total / pageSize) + 1,
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
controller.create = (req, res) => {
    const name = req.body.name;
    const status = parseInt(req.body.status);
    const errors = [];
    // validate basic
    if (name.length <= 3) {
        errors.push("Tên danh mục phải lớn hơn 3 kí tự !")
    }
    if (errors.length > 0) {
        req.session.Error = errors[0];
        res.redirect("/admin/order/category");
    }
    else {
        req.getConnection((err, connection) => {
            connection.query('INSERT INTO postCategories set name = ?, status = ?', [name, status], (err, data) => {
                req.session.Success = "Thêm mới danh mục thành công";
                res.redirect("/admin/order/category");
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
        res.redirect("/admin/order/category");
    }
    else {
        req.getConnection((err, connection) => {
            connection.query('UPDATE postCategories SET ? WHERE ID = ?', [{ name: name, status: status }, id], (err, data) => {
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
        connection.query('DELETE FROM postCategories WHERE id = ?', [id], (err, rows) => {
            req.session.Success = "Xóa danh mục thành công";
            res.redirect('/admin/order/category');
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

        let sql = 'SELECT * FROM postCategories WHERE true ';
        let sqlCount = ' SELECT COUNT(*) as Total FROM postCategories WHERE true ';
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
                        title: 'Thiết lập hóa đơn',
                        breadcrumbs: [
                            {
                                title: 'hóa đơn',
                                link: '/admin/order'
                            },
                            {
                                title: 'Danh mục hóa đơn',
                                link: '/admin/order/category'
                            }
                        ],
                        actionSearch: '/admin/order/search',
                        q: q,
                        filter: filterStatus
                    }
                );
            }
        });

    });

};

controller.exportExcel = (req, res) => {

    const now = Date.now();

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("danh-muc");
    worksheet.columns = [
        { header: "#", key: "id", width: 5 },
        { header: "Tên danh mục", key: "name", width: 25 },
        { header: "Trạng thái", key: "status", width: 25 },
    ];
    worksheet.getRow(1).font = { bold: true };

    req.getConnection((err, conn) => {
        const sql = `SELECT * FROM postCategories ORDER BY id DESC`
        conn.query(sql, (err, data) => {
            const categories = data.map((item, index) => {
                return {
                    id: index,
                    name: item.name,
                    status: item.status == 1 ? 'Hoạt động' : 'Không hoạt động'
                }
            });

            if (err) {
                res.json(err);
            }
            else {
                worksheet.addRows(categories);

                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "danh-muc-" + now + ".xlsx"
                );

                return workbook.xlsx.write(res).then(function () {
                    res.status(200).end();
                });
            }
        });

    });

}

controller.importExcel = async (req, res) => {

    let filename = global.__basedir + req.body['path-excel-import'];
    readXlsxFile(filename).then((rows) => {

        const activeStatus = 1;
        const unactiveStatus = 2;
        rows = rows.map(item => {
            if (item[2].toLowerCase().trim() == 'không hoạt động') {
                item[2] = activeStatus;
            }
            else if (item[2].toLowerCase().trim() == 'hoạt động') {
                item[2] = unactiveStatus;
            }

            return [item[1], item[2]]
        });
        req.getConnection((err, connection) => {
            const sql = "INSERT INTO postCategories (name,status) VALUES ?";
            connection.query(sql, [rows], (err, data) => {
                req.session.Success = "Import dữ liệu thành công";
                res.redirect("/admin/order/category");
            })
        });
    });
}


module.exports = controller;