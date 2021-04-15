const controller = {};
const moment = require('moment');

controller.index = (req, res) => {

    var user = req.session.User;

    if(user && user.name == "customer"){
        res.redirect("/");
    }

    const userId = req.session.User?.id ?? 1;

    // curent month

    let startOfMonth = moment().clone().startOf('month');
    let endOfMonth = moment().clone().endOf('month');

    // last month

    const startOfLastMonth = moment(startOfMonth).subtract(1, 'months').format("yyyy/MM/DD");
    const endOfLastMonth = moment(endOfMonth).subtract(1, 'month').format("yyyy/MM/DD");
    startOfMonth = startOfMonth.format("yyyy/MM/DD");
    endOfMonth = endOfMonth.format("yyyy/MM/DD");


    // curent week
    const now = moment();
    const mondayOfWeek = now.clone().weekday(1);
    const sundayofWeek = now.clone().weekday(7);

    console.log(mondayOfWeek);
    console.log(sundayofWeek);

    // room 

    const sqlRoomCurentMonth = `select date_format(createTime, "%d-%m-%Y") as day,
    sum(case when o.status != 3 then 1 else 0 end) totalCurentOrder
    from orders o  
    where userId = ${userId} and (createTime >= '${startOfMonth}' and createTime <= '${endOfMonth}')
    group by date_format(createTime, "%d-%m-%Y")
   `;

    const sqlRoomLastMonth = `select date_format(createTime, "%d-%m-%Y") as day,
    sum(case when o.status != 3 then 1 else 0 end) totalLastOrder
    from orders o  
    where userId = ${userId} and (createTime >= '${startOfLastMonth}' and createTime <= '${endOfLastMonth}')
    group by date_format(createTime, "%d-%m-%Y")
   `;

    // customer

    const sqlCustomerCurentMonth = `select date_format(createTime, "%d-%m-%Y") as day,
    count(*) as totalCurentNewCustomer
    from users u  
    where u.customerBy = ${userId} and (u.createTime >= '${startOfMonth}' and u.createTime <= '${endOfMonth}')
    group by date_format(createTime, "%d-%m-%Y")
    `;

    const sqlCustomerLastMonth = `select date_format(createTime, "%d-%m-%Y") as day,
    count(*) as totalLastNewCustomer
    from users u  
    where u.customerBy = ${userId} and (u.createTime >= '${startOfMonth}' and u.createTime <= '${endOfMonth}')
    group by date_format(createTime, "%d-%m-%Y")
    `;

    // revenue

    const sqlRevenueCurentMonth = `select date_format(createTime, "%d-%m-%Y") as day, sum(amount) totalCurentRevenue
    from orders o  
    where userId = ${userId} and o.status != 1 and (createTime >= '${startOfMonth}' and createTime <= '${endOfMonth}')
    group by date_format(createTime, "%d-%m-%Y")
   `;

    const sqlRevenueLastMonth = `select date_format(createTime, "%d-%m-%Y") as day, sum(amount) totalLastRevenue
    from orders o  
    where userId = ${userId} and o.status != 1 and (createTime >= '${startOfLastMonth}' and createTime <= '${endOfLastMonth}') 
    group by date_format(createTime, "%d-%m-%Y")
   `;

    // room order

    const sqlRoomOrderCurentMonth = `select date_format(o.createTime, "%d-%m-%Y") as day, 
    sum(case when o.status != 3 then 1 else 0 end) totalCurentRoomOrder
    from orders o  
    join rooms r2 
    on r2.id = o.id 
    where o.userId = ${userId} and o.status != 3 and (createTime >= '${startOfMonth}' and createTime <= '${endOfMonth}')
    group by date_format(createTime, "%d-%m-%Y"), r2.id`;

    const sqlRoomOrderLastMonth = `select date_format(o.createTime, "%d-%m-%Y") as day, 
    sum(case when o.status != 3 then 1 else 0 end) totalLastRoomOrder
    from orders o  
    join rooms r2 
    on r2.id = o.id 
    where o.userId = ${userId} and o.status != 3 and (createTime >= '${startOfLastMonth}' and createTime <= '${endOfLastMonth}')
    group by date_format(createTime, "%d-%m-%Y"), r2.id`;


    const sql = `${sqlRoomCurentMonth}; ${sqlRoomLastMonth}; 
                 ${sqlCustomerCurentMonth}; ${sqlCustomerLastMonth}; 
                 ${sqlRevenueCurentMonth}; ${sqlRevenueLastMonth};
                 ${sqlRoomOrderCurentMonth}; ${sqlRoomOrderLastMonth}
                 `;
    req.getConnection((err, conn) => {
        conn.query(sql, (err, data) => {
            res.render('admin/Dashboard', {
                layout: './layout/_layoutAdminDashboard',
                extractScripts: true,
                extractStyles: true,
                user: user,
                roomCurentMonth: data[0],
                roomLastMonth: data[1],
                customerCurentMonth: data[2],
                customerLastMonth: data[3],
                revenueCurentMonth: data[4],
                revenueLastMonth: data[5],
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
            })
        });

    });




};

module.exports = controller;