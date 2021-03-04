const controller = {};

controller.index = (req, res) => {

    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;

    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 2;
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
                                link: '/admin/room/category'
                            }
                        ]
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
        // insert to db
        req.getConnection((err, connection) => {
                connection.query('INSERT INTO postCategories set ?', [{name: name}, {status: status}], (err, data) => {
                req.session.Success = "Thêm mới danh mục thành công";
                res.redirect("/admin/category");
            })
        });
    }
}


module.exports = controller;