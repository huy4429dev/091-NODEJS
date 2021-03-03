const controller = {};

controller.index = (req, res) => {

    res.render('admin/customer',
        {
            categories: [1, 2, 3, 4]
        }
    );
};

module.exports = controller;