const excel = require('exceljs');
const moment = require('moment');
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
        const sql = `select *
                     from contacts
                     order by id desc limit ? offset ?
                      ;
                     select count(*) as TOTAL
                     from contacts `;
                     
        conn.query(sql, [parseInt(pageSize), (page - 1) * pageSize], (err, data) => {
            if (err) {
                res.json(err);
            }
            else {
                res.render('admin/contact',
                    {
                        layout: './layout/_layoutAdmin',
                        extractScripts: true,
                        extractStyles: true,
                        errorValidate: errorValidate,
                        successAlert: successAlert,
                        contacts: data[0],
                        curentPage: page,
                        total: data[1][0].Total % pageSize === 0 ? data[1][0].Total / pageSize : Math.floor(data[1][0].Total / pageSize) + 1,
                        title: 'Phản hồi khách hàng',
                        breadcrumbs: [
                            {
                                title: 'Phản hồi',
                                link: '/admin/contact'
                            }
                        ],
                        actionSearch: 'admin/contact/search',
                        q: '',
                        filter: ''
                    }
                );
            }
        });

    });

};

controller.create = (req, res) => {
    const fullname = req.body.fullname;
    const contactStatus = parseInt(req.body.status);
    const subject = req.body.subject;
    const content = req.body.content;
    const email = req.body.email;
    const phone = req.body.phone;
    const note = req.body.note;
    const errors = [];


    // validate basic
    if (errors.length > 0) {
        req.session.Error = errors[0];
        res.redirect("/admin/contact");
    }
    else {
        req.getConnection((err, connection) => {
            connection.query(`INSERT INTO contacts set 
                             fullname = ?, contactStatus = ?, subject = ?, content = ?, email = ?, phone = ?,note  = ?
                             `,
                [
                    fullname,
                    contactStatus,
                    subject,
                    content,
                    email,
                    phone,
                    note
                ],
                (err, data) => {
                    
                    req.session.Success = "Thêm mới liên hệ thành công";
                    res.redirect("/admin/contact");
                })
        });
    }
}

// controller.update = (req, res) => {

//     const { id } = req.params;
//     const subject = req.body.name;
//     const status = parseInt(req.body.status);
//     const errors = [];
//     if (errors.length > 0) {
//         res.redirect("/admin/contact");
//     }
//     else {
//         req.getConnection((err, connection) => {
//             connection.query('UPDATE roomCategories SET ? WHERE ID = ?', [{ name: name, status: status }, id], (err, data) => {
//                 res.json(
//                     {
//                         name: name,
//                         status: status,
//                         message: 'cập nhật liên hệ thành công',
//                         success: true
//                     });
//             })
//         });
//     }
// }

controller.delete = (req, res) => {
    const { id } = req.params;
    req.getConnection((err, connection) => {
        connection.query('DELETE FROM contacts WHERE id = ?', [id], (err, rows) => {
            req.session.Success = "Xóa liên hệ thành công";
            res.redirect('admin/contact');
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

        let sql = 'SELECT * FROM contacts WHERE true ';
        let sqlCount = ' SELECT COUNT(*) as Total FROM contacts WHERE true ';
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
                res.render('admin/contact',
                    {
                        layout: './layout/_layoutAdmin',
                        extractScripts: true,
                        extractStyles: true,
                        errorValidate: errorValidate,
                        successAlert: successAlert,
                        contacts: data[0],
                        curentPage: page,
                        total: data[1][0].Total % pageSize === 0 ? data[1][0].Total / pageSize : Math.floor(data[1][0].Total / pageSize) + 1,
                        title: 'Phản hồi khách hàng',
                        breadcrumbs: [
                            {
                                title: 'Phản hồi khách hàng',
                                link: '/admin/contact'
                            }
                        ],
                        actionSearch: 'admin/contact/search',
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
    let worksheet = workbook.addWorksheet("khach-hang");
    worksheet.columns = [
        { header: "#", key: "id", width: 5 },
        { header: "Tên khách hàng", key: "name", width: 25 },
        { header: "Trạng thái", key: "status", width: 25 },
    ];
    worksheet.getRow(1).font = { bold: true };

    req.getConnection((err, conn) => {
        const sql = `SELECT * FROM contacts ORDER BY id DESC`
        conn.query(sql, (err, data) => {
            const contacts = data.map((item, index) => {
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
                worksheet.addRows(contacts);

                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                );
                res.setHeader(
                    "Content-Disposition",
                    "attachment; filename=" + "khach-hang-" + now + ".xlsx"
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
            const sql = "INSERT INTO contacts (name,status) VALUES ?";
            connection.query(sql, [rows], (err, data) => {
                req.session.Success = "Import dữ liệu thành công";
                res.redirect("/admin/contact");
            })
        });
    });
}


module.exports = controller;