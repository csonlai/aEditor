module.exports = function (app) {
    // 定制404页面
    // 定制404页面
    app.use(function (req, res) {
        res.type('text/plain');
        res.status(404);
        res.send('404  NOT FOUND!');
    });

// 定制500页面
    app.use(function (req, res) {
        res.type('text/plain');
        res.status(500);
        res.send('404  SERVER ERROR!');
    });
};