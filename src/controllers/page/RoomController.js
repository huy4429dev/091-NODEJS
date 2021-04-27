const moment = require('moment');
const controller = {};

controller.deltail = (req, res) => {

    const errorValidate = req.session.Error;
    const successAlert = req.session.Success;
    delete req.session.Error;
    delete req.session.Success;
    const { id } = req.params;
    req.getConnection((err, conn) => {
        const sql = ` select r.id , r.code , r.title , r.status , r.price , r.desposit , r.acr , r.capacity , r.utilities , r.thumbnail , r.images , r.address, r.createdTime , r.updatedTime , r.description , r.content, r.categoryId ,
                      r.countCheckout , r.timeOrderActive, r.electricityBill, r.waterBill, r.wifiBill, r.verifyTime,
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
                      where r.id  = ${id}
                      limit 1
                        `;
        conn.query(sql, (err, data) => {
            res.render('page/roomDetail',
                {
                    layout: './layout/_layoutPage',
                    extractScripts: true,
                    extractStyles: true,
                    categories: data[0],
                    q: '',
                    filter: '',
                    moment: moment,
                    errorValidate: errorValidate,
                    successAlert: successAlert,
                }
            );
        });
    });
};

controller.search = (req, res) => {

    const page = req.query.page ?? 1;
    const pageSize = req.query.pageSize ?? 5;
    let price = req.query.price;
    let categoryId = req.query.categoryId;

    if (price != undefined && !price.length) {
        price = [price];
    }
    if (!(price instanceof Array) && price != undefined) {
        price = [price];
    }
    if (price?.length) {
        price = price.sort(function (a, b) {
            return a - b;
        });
        if (price[0] == "all") {
            price = '';
        }
        else if (price.length == 1) {
            price = `r.price > ${price[0]}`;
        }
        else {
            price = `r.price >= ${price[0]} and r.price <= ${price[price.length - 1]}`;
        }
    }

    if (categoryId != undefined && !categoryId.length) {
        categoryId = [categoryId];
    }

    if (!(categoryId instanceof Array) && categoryId != undefined) {
        categoryId = [categoryId];
    }
    console.log(categoryId,'categoryId');
    if (categoryId?.length > 0  ) {
        categoryId = `(${categoryId.join(',')})`;
    }
    let sql = `select *
                from rooms r 
                join roomcategories r2 
                on r2.id = r.categoryId
                WHERE r.verify = 1 `;

    const sqlCategories = `select * from roomcategories`;
    let sqlCount = `SELECT COUNT(*) as Total
                from rooms r 
                join roomcategories r2 
                on r2.id = r.categoryId
                WHERE r.verify = 1`;

    const q = req.query.q != undefined ? `%${req.query.q.trim()}%` : '';
    const address = req.query.address != undefined ? `%${req.query.address.trim()}%` : '';

    if (q != '') {
        sql += ` AND LOWER(r.title) LIKE  '${q}'`;
        sqlCount += ` AND LOWER(r.title) LIKE  '${q}'`;
        param = q;
    }
    if (address != '') {
        sql += ` AND LOWER(r.address) LIKE  '${address}'`;
        sqlCount += ` AND LOWER(r.address) LIKE  '${address}'`;
        param = q;
    }

    if (!(price instanceof Array) && price != undefined && price?.trim() != '') {
        sql += ` AND ${price}`;
        sqlCount += ` AND ${price}`;
    }

    if (!(categoryId instanceof Array) && categoryId != undefined && categoryId?.trim() != '') {
        sql += ` AND  r2.id in ${categoryId}`;
        sqlCount += ` AND r2.id in  ${categoryId}`;
    }

    req.getConnection((err, conn) => {
        conn.query(`${sql}; ${sqlCount}; ${sqlCategories}`, (err, data) => {
            console.log(sql);
            res.render('page/SearchRoom',
                {
                    layout: './layout/_layoutPage',
                    extractScripts: true,
                    extractStyles: true,
                    categories: data[0],
                    curentPage: page,
                    total: data[1][0].Total % pageSize === 0 ? data[1][0].Total / pageSize : Math.floor(data[1][0].Total / pageSize) + 1,
                    roomCategories: data[2],
                    q: q.replace(/%/g, ''),
                    filter: ''
                }
            );
        });
    });
}

module.exports = controller;