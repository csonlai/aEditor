var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;
var util = require('./util/util');

// templates
require('./config/templates')(app, path.join(__dirname, 'app/views'));

// db
require('./config/mongo')();

// 存放用户上传资源
app.use(express.static(path.join(__dirname, util.getCdnDir())));

// middlewares
require('./config/middlewares')(app);

//routes
require('./config/routes')(app);

// exceptions
require('./config/exceptions')(app);

app.listen(port, function () {
    console.log('Express started on port '+port+'...');
});