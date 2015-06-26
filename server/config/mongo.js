var mongoose = require('mongoose');
var util = require('../util/util');

module.exports = function () {
    // Connect to mongodb
    var connect = function () {
        var user = util.getDBUser(),
            pass = util.getDBPass();
        var options = {
            db: { native_parser: true },
            server: { socketOptions: { keepAlive: 1 }, poolSize: 10},
            replset: { rs_name: 'aeditor' },
            user: user,
            pass: pass
        };

        mongoose.connect(util.getDbUri(), options);
    };

    connect();

    console.log('mongo connected ...')

    mongoose.connection.on('error', console.log);
    mongoose.connection.on('disconnected', connect);
};