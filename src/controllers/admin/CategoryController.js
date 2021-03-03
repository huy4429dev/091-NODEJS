const controller = {};

controller.index = (req, res) => {

    req.getConnection((err, conn) => {

        conn.query('SELECT * FROM postCategories', (err, data) => {
            if (err) {
                res.json(err);
            }
            else {
                res.render('admin/category',
                    {
                        categories: data,
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

module.exports = controller;