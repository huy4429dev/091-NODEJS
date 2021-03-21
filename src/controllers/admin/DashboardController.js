const controller = {};

controller.index = (req, res) => {
    var user = req.session.User;
    if (user == null) {
        res.redirect("/admin/login");
    }
    res.render('admin/Dashboard', {
        layout: './layout/_layoutAdminDashboard',
        extractScripts: true,
        extractStyles: true,
        user: user,
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
        q: '',
        filter: ''
    });
};

module.exports = controller;