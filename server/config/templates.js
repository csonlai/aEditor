module.exports = function (app, viewsPath) {
    /*var handlebars = require('express-handlebars');
    var hbs = handlebars.create({
        defaultLayout: 'main',
        extname:'.hbs'
    });

    app.set('views', viewsPath);
    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');*/

    app.set('views', viewsPath);
    app.set('view engine', 'jade');
};