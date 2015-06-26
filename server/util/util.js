var fs = require('fs'),
    path = require('path'),
    config = require('../config/env/conf'),
    logger = require('../config/logger'),
    getSize = require('get-folder-size');


var errorMap = JSON.parse(fs.readFileSync('./config/env/' + config.err, 'utf-8'));
// 用户可用图片存储空间(MB)
var USER_AVAILABLE_SIZE = 10;

function extend(target, source, flag) {
    for (var key in source) {
        if (source.hasOwnProperty(key))
            flag ?
                (target[key] = source[key]) :
                (target[key] === void 0 && (target[key] = source[key]));
    }
    return target;
}

module.exports.getCdnDir = function () {
    return config.cdn;
};

module.exports.getDbUri = function () {
    return config.db;
};
module.exports.getPort = function () {
    return config.port;
};

module.exports.getDBUser = function () {
    return config.user;
};

module.exports.getUserIdUri = function () {
    return config.userIdUri;
};

module.exports.getDBPass = function () {
    return config.pass;
};

/**
 * 从一个目标对象中返回选取指定key组成的对象
 * @param {Object} sourceObj - 目标对象
 * @param {Array} keyArr - 指定的key
 * @returns {Object}
 */
module.exports.getObjKeysMap = function (sourceObj, keyArr) {
    sourceObj = sourceObj || {};
    var retObj = {};

    keyArr.forEach(function (key, index) {
        if (Object.hasOwnProperty.call(sourceObj,key) && sourceObj[key] !== undefined) {
            retObj[key] = sourceObj[key];
        }
    });
    return retObj;
};

/**
 * 创建多级目录
 * @param  {String} dirpath 路径
 * @param  {String} mode    模式
 */
module.exports.mkdirsSync = function (dirpath, mode) {
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
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
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

// 获取目录大小
module.exports.getUserAvailableImgsSize = function (user_id, callback) {
    var dir = path.join(this.getCdnDir(), user_id);

    getSize(dir, function (err, size) {
        if (err) {
            callback && callback(0);
        }
        else {
            var val = Math.max(0, USER_AVAILABLE_SIZE - (size / 1024 / 1024)).toFixed(2);
            callback && callback(val);
        }


    });
};

module.exports.json = function (res, req, data) {
    var ret, logInfo = {
        uid: req.cookies.user_id || 'uid不存在',
        time: (new Date()).toUTCString()
    };
    if (data.errType === 0) {
        // 正常返回
        ret = {
            retcode: 0,
            result: data.json || {}
        };
        ret.result.errno = 0;
        if (data.jsonMsg) {
            ret.result.msg = data.jsonMsg
        }
        logInfo = extend(logInfo, ret);
        logger.info(logInfo);
    } else if (data.errType === 1) {
        // 逻辑错误返回
        ret = {
            retcode: data.errCode,
            msg: errorMap.retcode[data.errCode]
        };
        logInfo = extend(logInfo, ret);
        logger.error(logInfo);
    } else if (data.errType === 2) {
        // 操作数据库出错
        ret = {
            retcode: 0,
            result: {
                errno: data.errCode,
                msg: errorMap.errno[data.errCode]
            }
        };
        logInfo = extend(logInfo, ret);
        logger.error(logInfo);
    }

    res.json(ret);
};

// 从请求中获取uid
module.exports.getUid = function (req) {
    return req.cookies.user_id || '';
};

// 从请求中获取作品ID
module.exports.getWorkId = function (req) {
    return req.body.work_id || req.query.work_id || '';
};
// 获取文件名
module.exports.getFileName = function (req) {
    return req.body.file_name || req.query.file_name || '';
};


// 从请求中获取元件ID
module.exports.getCtrlId = function (req) {
    return req.body.ctrl_id || req.query.ctrl_id || '';
};

// 从请求中获取类型
module.exports.getType = function (req) {
    return req.body.type || req.query.type || '';
};

// 未登录
module.exports.unLogin = function (res, req) {
    var ret = {
        retcode: -1,
        msg: '未登录',
        uid: req.cookies.user_id || 'uid不存在',
        time: (new Date()).toUTCString()

    };
    logger.error(ret);
    return res.json(ret);
};

/**
 * 递归删除目录
 * @param  {String} dirpath 路径
 */
module.exports.rmdirsSync = function (dirpath) {
    dirpath = path.resolve(dirpath);
    // console.log(dirpath);
    if (!fs.existsSync(dirpath)) {
        return;
    }
    var dirs = fs.readdirSync(dirpath);
    // console.log(dirs);
    var dir, len = dirs.length;
    if (len === 0) {
        fs.rmdirSync(dirpath);
        return;
    }
    for (var i = 0; i < len; i++) {
        dir = path.join(dirpath, dirs[i]);
        // console.log(dir);
        if (fs.statSync(dir).isDirectory()) {
            rmdirsSync(dir);
            // fs.rmdirSync(dir);
        } else {
            fs.unlinkSync(dir);
        }
    }
    fs.rmdirSync(dirpath);
};



