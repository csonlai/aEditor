/**
 * Created by fujunou on 2015/4/21.
 */

var mongoose = require('mongoose');
var util = require('../util/util');

module.exports = function () {
    // Connect to mongodb
    var connect = function () {
        var options = { server: { socketOptions: { keepAlive: 1 } } };

        mongoose.connect(util.getDbUri(), options);
    };

    connect();

    console.log('mongo connected ...')

    mongoose.connection.on('error', console.log);
    mongoose.connection.on('disconnected', connect);
};