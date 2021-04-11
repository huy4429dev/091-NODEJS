const moment = require('moment');
const controller = {};

controller.deltail = (req, res) => {
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
            console.log(data[0]);
            res.render('page/roomDetail',
                {
                    layout: './layout/_layoutPage',
                    extractScripts: true,
                    extractStyles: true,
                    categories: data[0],
                    q: '',
                    filter: '',
                    moment: moment
                }
            );  
        });
    });
};

module.exports = controller;