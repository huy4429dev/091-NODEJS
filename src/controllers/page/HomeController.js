const moment = require('moment');
const controller = {};

controller.index = (req, res) => {

    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 5;

    req.getConnection((err, conn) => {

        const sqlRoom = `select *
                            from rooms r 
                            join roomcategories r2 
                            on r2.id = r.categoryId 
                         ORDER BY r.id DESC limit ${pageSize} offset ${page}`;

        const sqlCount = `select count(*) as Total from rooms`;
        const sqlRoomVerify = `select *
                                from rooms r 
                                join roomcategories r2 
                                on r2.id = r.categoryId where verify = 1 ORDER BY  r.id  DESC limit 5 offset 0`;

        conn.query(`${sqlRoom}; ${sqlCount}; ${sqlRoomVerify}`, (err, data) => {
            console.log(data[0]);
            res.render('page/home',
            {
                layout: './layout/_layoutPage',
                extractScripts: true,
                extractStyles: true,
                categories: data[0],
                curentPage: page,
                total: data[1][0].Total % pageSize === 0 ? data[1][0].Total / pageSize : Math.floor(data[1][0].Total / pageSize) + 1,
                roomVerify: data[2],
                q: '',
                filter: ''
            }
        );
        });
    });
};

module.exports = controller;