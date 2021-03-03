const controller = {};

controller.index = (req,res) => {
    res.render('admin/Dashboard', {
    });
};

module.exports = controller;