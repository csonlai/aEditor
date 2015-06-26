var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');
var util = require('../util/util');
var logger = require("../config/logger");


module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());

    // 鉴权中间件
    app.use(function (req, res, next) {
        var token = req.cookies.SID;
        var reqOpt = {
            url: util.getUserIdUri(),
            method: 'get',
            headers: {
                'cookie': 'SID='+token
            }
        };

        var noOauthCgi = app.get('noOauthCgi');
        var useThisMd  = true;

        // 判断是否要经过鉴权
        noOauthCgi.forEach(function (cgi, index) {
            var cgiName = cgi.url;
            var type = cgi.type || 'get';

            if(req.path.indexOf(cgiName) > -1 && req.method.toLowerCase() === type.toLowerCase()) {
                useThisMd = false;
            }
        });

        if(! token) {
            return util.unLogin(res, req);
        }

        if(useThisMd) {
            // 没有user_id,就当作没登录
            if(! util.getUid(req)) {
                return util.unLogin(res,req);
            }

            request(reqOpt, function (err, response, body) {
                var loginRet = JSON.parse(body);
                if(err) {
                    util.unLogin(res, req);
                } else {
                    if(loginRet.hasOwnProperty('user') && loginRet.user.uid === util.getUid(req)) {
                        next();
                    } else {
                        return util.json(res, req, {
                            errType: 2,
                            errCode: 12
                        });
                    }
                }
            });
        } else {
            next();
        }
    });
};