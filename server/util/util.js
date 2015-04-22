/**
 * Created by fujunou on 2015/4/21.
 */
var fs = require('fs'),
    path = require('path'),
    util = require('util'),
    config = require('../config/env/development');

var errorMap = JSON.parse(fs.readFileSync('./config/env/'+config.err, 'utf-8'));

module.exports.getCdnDir = function () {
    return config.cdn;
};

module.exports.getDbUri = function () {
    return config.db;
};

/**
 * 创建多级目录
 * @param  {String} dirpath 路径
 * @param  {String} mode    模式
 */
module.exports.mkdirsSync = function(dirpath, mode) {
    dirpath = path.resolve(dirpath);
    if (fs.existsSync(dirpath)) {
        return;
    }
    var dirs = dirpath.split(path.sep);
    var dir = '';
    for (var i = 0; i < dirs.length; i++) {
        dir += path.join(dirs[i], path.sep);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, mode);
        }
    }
};

// 生成uid
module.exports.guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    }).toUpperCase();
};

module.exports.uriChange = function (uri) {
    // 去掉public
    uri = uri.slice(this.getCdnDir().length);
    return uri.replace(/\\/gm, '/');
};

// 获取base64图片格式
module.exports.getBase64ExtName = function (base64Str) {
    return /data\:image\/(\w+)\;/.exec(base64Str)[1];
};

module.exports.json = function (res, data) {
    var ret;
    if(data.errType === 0) {
        // 正常返回
        ret = {
            retcode: 0,
            result: {
                errno: 0,
                result: data.json || {}
            }
        };
    } else if(data.errType === 1) {
        // 错误返回
        ret  ={
            retcode: data.errCode,
            msg: errorMap.retcode.errCode
        }
    } else {
        ret = {
            retcode: 0,
            result: {
                errno: data.errCode,
                msg: errorMap.errno.errCode
            }
        }
    }

    res.json(ret);
};