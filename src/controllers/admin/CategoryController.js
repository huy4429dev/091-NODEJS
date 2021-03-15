const excel = require('exceljs');
const readXlsxFile = require('read-excel-file/node');
const controller = {};

controller.index = (req, res) => {

    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;

    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 5;
    req.getConnection((err, conn) => {
        const sql = 'SELECT * FROM postCategories ORDER BY id DESC limit ? offset ?  ; SELECT COUNT(*) as Total FROM postCategories';
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
                                link: '/admin/category'
                            }
                        ],
                        actionSearch: '/admin/category/search',
                        q: ''
                    }
                );
            }
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
        res.redirect("/admin/category");
    }
    else {
        req.getConnection((err, connection) => {
            connection.query('INSERT INTO postCategories set name = ?, status = ?', [name, status], (err, data) => {
                req.session.Success = "Thêm mới danh mục thành công";
                res.redirect("/admin/category");
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
        res.redirect("/admin/category");
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
            res.redirect('/admin/category');
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

    req.getConnection((err, conn) => {
        let sql = '';
        let param = '';
        if (q != '') {
            sql = `SELECT * FROM postCategories WHERE LOWER(name)  LIKE ? ORDER BY id DESC limit ? offset ? ;
                        SELECT COUNT(*) as Total FROM postCategories WHERE LOWER(name)  LIKE ?
                        `;
            param = q;
        }

        else if(filterStatus !=  undefined){
            sql = `SELECT * FROM postCategories WHERE status = ? ORDER BY id DESC limit ? offset ? ;
            SELECT COUNT(*) as Total FROM postCategories WHERE status = ?
            `;
            param =  parseInt(filterStatus);
        }
        console.log(param);

        conn.query(sql, [param, parseInt(pageSize), (page - 1) * pageSize, param], (err, data) => {

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
                                link: '/admin/category'
                            }
                        ],
                        actionSearch: '/admin/category/search',
                        q: q
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
                res.redirect("/admin/category");
            })
        });
    });
}


module.exports = controller;