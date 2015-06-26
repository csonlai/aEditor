/**
 * @file 作品及元件的增删改查操作
 * @author jagus.ou@gmail.com
 */


var Model = [require('../models/workModel'), require('../models/ctrlModel')];
var util = require('../../util/util');
var path = require('path');
var fs = require('fs');

var baseUrl = 'http://aeditor.alloyteam.com/';

var getJsonData = function getJsonData(type, data) {
    return type === 0 ? {
        work_id: data._id
    } : {
        ctrl_id: data._id
    };
};

var getModel = function (type) {
    return Model[type];
};


// 创建与修改
module.exports.upsert = function (req, res, next) {
    var postData = req.body,
        modelDataKeys = ['user_id', 'name', 'is_delete'],
        tip,$model, modelData,conditions,
        // 默认为0（作品），1（元件）
        type = +postData.type || 0, uid,
        typeKey = type == 1 ? 'ctrl' : 'work';

    switch (type) {
        case 0:
            conditions = {
                _id: postData.work_id
            };
            modelDataKeys.push('work_data');
            tip = '作品';
            break;
        case 1:
            conditions = {
                _id: postData.ctrl_id
            };
            modelDataKeys.push('ctrl_data');
            tip = '元件';
            break;
        default :;
    }

    $model = getModel(type);
    modelData = util.getObjKeysMap(postData, modelDataKeys);

    //无论作品还是元件，都增加user_id,便于索引
    uid = util.getUid(req);
    modelData.user_id = uid;

    // 如果没有id传过来，表示新增(即保存)
    // 增加作品时要将user_id/temp下面的图片文件复制到user_id/分配的workd_id下面
    if(! conditions._id) {
        $model.create(modelData, function (err, workData) {
            var pSource, pTarget, $work_id, $work_data;
            var rfn = function (match, g1, g2) {
                match = match.split(g1);
                match.splice(1,0,typeKey + '/' + $work_id);
                return match.join('');
            };

            if (err) {
                // 返回错误
                return util.json(res, req, {
                    errType: 2,
                    errCode: 2
                });
            }

            pSource = path.join(util.getCdnDir(), uid, 'temp', type == 1 ? 'ctrl' : 'work');
            $work_id = workData.id;
            $work_data = util.getObjKeysMap(workData._doc, ['user_id', 'name', 'is_delete', typeKey + '_data']);
            pTarget = path.join(util.getCdnDir(), uid, typeKey, $work_id);

            // 重命名temp文件夹为work_id,达到复制作用
            fs.rename(pSource, pTarget,function(err){
                if(err){
                    console.log(err);
                    //TODO 返回增加失败，并删除这条记录
                    res.json({
                        msg:'增加失败，原因，重命名图片文件夹失败'+pTarget
                    });
   
                } else {

                    //重新创建temp目录
                    util.mkdirsSync(pSource);


                    var dataKey = type == 1 ? 'ctrl_data' : 'work_data';

                    // 由于重命名了图片保存目录，所以要修改图片路径
                    $work_data[dataKey] = $work_data[dataKey]
                        .replace(/"imgUrl"\:".*?\b(temp\/(ctrl|work))\b.*?"/gm, rfn)
                        .replace(/"spriteImgUrl"\:".*?\b(temp\/(ctrl|work))\b.*?"/gm, rfn)
                        .replace(/url\(.*?\b(temp\/(ctrl|work))\b.*?\)/gm, rfn);


                    $model.findByIdAndUpdate($work_id, $work_data, function (err, data) {
                        //TODO 返回增加失败，并删除这条记录
                        if (err || data == null) {
                            return;
                        }

                        return util.json(res, req, {
                            errType: 0,
                            json: getJsonData(type, data),
                            jsonMsg: '新增'+tip+'成功'
                        });
                    });

                }
            });
            return;
        });

        return;
    }

    //  有id传过来表示更新
    // 更新的时候要比较作品中的user_id与cookie中的user_id是否一致，否则不能入库.不用管，user_id是后台
    // 从cookie中赋值的，所以肯定会相同
    $model.findByIdAndUpdate(conditions._id, modelData, function (err, data) {
        if (err || data == null) {
            return util.json(res, req, {
                errType: 2,
                errCode: 3
            });
        }

        return util.json(res, req, {
            errType: 0,
            json: getJsonData(type, data),
            jsonMsg: '更新'+tip+'成功'
        });
    });


};

// 删除
module.exports.delete = function (req, res, next) {
    var postData = req.body,
        type = +postData.type || 0,
        userID = util.getUid(req),
        $model, id;



    if(type === 0) {
        id = postData.work_id;
    } else if (type === 1) {
        id = postData.ctrl_id;
    }

    if(id == null) {
        return util.json(res, req, {
            errType: 1,
            errCode: 1
        });
    }

    $model = getModel(type);

    // 删除一个已经存在的作品直接报错
    $model.count({_id: {$eq: id}, is_delete: '0'}, function(err, count) {
        if (err) {
            return util.json(res, req, {
                errType: 2,
                errCode: 6
            });
        }

        if(count == 0) {
            return util.json(res, req, {
                errType: 2,
                errCode: 8
            });
        }

        $model.findByIdAndUpdate({_id: {$eq: id}}, {is_delete: '1'}, function(err, result) {
            if (err) {
                return util.json(res, req, {
                    errType: 2,
                    errCode:7
                });
            }

            var workPath = path.join(util.getCdnDir(), userID, type == 1 ? 'ctrl' : 'work',id);
            //同时删除图片文件夹
            util.rmdirsSync(workPath);

            util.json(res, req, {
                errType: 0,
                json: {
                    msg: '删除成功'
                }
            });
        });
    });
};

// 通过user_id查询
module.exports.query = function (req, res, next) {
    var conditions = req.query;
    var type = +req.query.type || 0;
    var $model = getModel(type);
    var selectKey = 'name '+ (type === 0 ? 'work_data' :'ctrl_data');

    conditions.size = +conditions.size || 5;
    conditions.page = +conditions.page || 0;

    var userId= util.getUid(req);
    var page = conditions.page;
    var size = conditions.size;

    console.log(page + ':' + size);

    var _skip = (page) * size;

    var total = 0;

    var _contions = {
        user_id : {$eq: userId},
        is_delete: {$eq:'0'}
    };

    _skip = _skip > 0 ? _skip : 0;

    // TODO 优化页数查询
    $model.count(_contions, function(err, count) {
        if (err) {
            return util.json(res, req, {
                errType: 2,
                errCode: 4
            });
        }

        total = count;
    });

    $model.find(_contions)
        .select(selectKey)
        .skip(_skip)
        .limit(size)
        .sort({'update_time': 1})
        .exec(function(err, results) {
            if (err) {
                return util.json(res, req, {
                    errType: 2,
                    errCode: 5
                });
            }

            if(type === 0) {
                util.json(res, req, {
                    errType: 0,
                    json: {
                        works: results,
                        total_page: Math.floor(total / size), // 总页数
                        cur_page:page, // 当前页数
                        length: total // 总的结果数
                    }
                });
            } else {
                util.json(res, req, {
                    errType: 0,
                    json: {
                        ctrls: results,
                        total_page: Math.floor(total / size),
                        cur_page:page,
                        length: total
                    }
                });
            }
        });
};


function getImageResults(userId,results,type,fileObj,callback){

     var i = 0;   

     if(results.length == 0){
        callback && callback();
        return;
     }

    // 获取每个作品图片文件夹
    results.forEach(function(result){

        var id = result.id;
        var imgsDir;
        var name;

        if(type == 0){
            imgsDir = path.join(userId, 'work', id);
            name = 'work';
        }
        else if(type == 1){
            imgsDir = path.join(userId, 'ctrl', id);
            name = 'ctrl';
        }
        else if(type == 2){
            imgsDir = path.join(userId, 'temp/work');
            name = 'tempwork';
        }
        else if(type == 3){
            imgsDir = path.join(userId, 'temp/ctrl');
            name = 'tempctrl';
        }

        // 读取作品文件夹内的图片文件
        fs.readdir(util.getCdnDir() + '/' + imgsDir, function(err, files){

             i++;

            fileObj[name][result.id] = {
                name:result.name,
                imgList:[]
            };

            if(!err && !result.is_delete){
               
                // 该作品内的图片
                files.forEach(function(imgFile){
                    var url = imgsDir + '\\' + imgFile;
                    url = url.replace(/\\/g,'/');

                    fileObj[name][result.id].imgList.push(baseUrl + url);
                });
            }
            else{
               
            }

            // 读取完毕
            if(i == results.length){

                callback && callback();

            }


        });
    });
}

// 获取某用户的所有图片(根据文件夹划分)
module.exports.getAllImgs  = function (req, res) {

    var $work_model = getModel(0);
    var $ctrl_model = getModel(1);

    var userId = util.getUid(req);
    // 当前作品id
    var work_id = req.query.work_id;
    // 图片文件分类字典
    var fileObj = {
        'tempwork':{},
        'tempctrl':{},
        'work':{},
        'ctrl':{}

    };
    var finishCount = 0;
    var availableFolderSize = 0;

    var tempWorkDir = '';
    var tempCtrDir = '';

    var callback = function(){
  
        finishCount ++;

        console.log('count:' + finishCount);

        // 完成
        if(finishCount == 5){

            // 返回图片列表
            util.json(res, req, {
                errType: 0,
                json:{
                    img_files:fileObj,
                    available_folder_size:availableFolderSize
                }
            });
        }
    };
   

    var _contions = {
        user_id : {$eq: userId},
        is_delete: {$eq:'0'}
    };

    // 获取作品图片
    $work_model.find(_contions)
        .select('name work_data')
        .skip(0)
        .exec(function(err, results) {
            console.log('err:' + err);
            if (err) {
                return util.json(res, req, {
                    errType: 2,
                    errCode: 5
                });
            }
            getImageResults(userId,results,0,fileObj,callback);
        });

    // 获取元件图片
    $ctrl_model.find(_contions)
        .select('name ctrl_data')
        .skip(0)
        .exec(function(err, results) {
            console.log('err:' + err);
            if (err) {
                return util.json(res, req, {
                    errType: 2,
                    errCode: 5
                });
            }

            getImageResults(userId,results,1,fileObj,callback);

        
        });

    // 获取临时作品目录图片
    getImageResults(userId,[{
        id:'tempwork',
        name:'当前作品'
    }],2,fileObj,callback);

    // 获取临时元件目录图片
    getImageResults(userId,[{
        id:'tempctrl',
        name:'当前元件'
    }],3,fileObj,callback);

    // 获取用户可用存储空间
    util.getUserAvailableImgsSize(userId, function(size){
        availableFolderSize = size;
        callback();
    });

}; 
