/**
 * Created by fujunou on 2015/4/21.
 */

var Work = require('../models/workModel');
var util = require('../../util/util');

// 创建与修改
module.exports.upsert = function (req, res, next) {
    var work = req.body,
        conditions = {_id: work.work_id},
        update = work,
        options = {upsert: true};

    if(! conditions._id) {
        // 创建work
        Work.create(work, function (err, data) {
            if (err) {
                // 返回错误
                util.json(res, {
                    errType: 2,
                    errCode: 2
                });
                return;
            }

            util.json(res, {
                errType: 0,
                json: {
                    work_id: data._id
                }
            });
        });

        return;
    }

    // 更新work
    delete work.work_id;
    Work.findOneAndUpdate(conditions, update, options, function(err, data) {
        if (err) {
            // 返回错误
            util.json(res, {
                errType: 2,
                errCode: 3
            });
            return;
        }

        util.json(res, {
            errType: 0,
            json: {
                work_id: data._id
            }
        });
    });
};

// 通过user_id查询
module.exports.query = function (req, res, next) {
    var conditions = req.query;

    conditions.size = +conditions.size || 5;
    conditions.page = +conditions.page || 0;

    var userId= conditions.user_id;
    var page = conditions.page;
    var size = conditions.size;
    var _skip = (page - 1) * size;
    var total = 0;

    var _contions = {
        user_id : {$eq: userId},
        is_delete: {$eq:'0'}
    };

    _skip = _skip > 0 ? _skip : 0;

    // TODO 优化页数查询
    Work.count(_contions, function(err, count) {
        if (err) {
            util.json(res, {
                errType: 2,
                errCode: 4
            });
            return;
        }

        total = count;
    });

    Work.find(_contions)
        .select('name wor_data')
        .skip(_skip)
        .limit(size)
        .sort({'update_time': 1})
        .exec(function(err, results) {
            if (err) {
                util.json(res, {
                    errType: 2,
                    errCode: 5
                });
                return;
            }

            util.json(res, {
                errType: 0,
                json: {
                    works: results,
                    total_page: Math.floor(total / size), // 总页数
                    cur_page:page, // 当前页数
                    length: total // 总的结果数
                }
            });
        });
};

// 删除
module.exports.delete = function (req, res, next) {
    var id = req.work_id;
    // 删除一个已经存在的作品直接报错
    Work.count({_id: {$eq: id}, is_delete: '0'}, function(err, count) {
        if (err) {
            util.json(res, {
                errType: 2,
                errCode: 6
            });
            return;
        }

        if(count == 0) {
            util.json(res, {
                errType: 1,
                errCode: 4
            });
            return;
        }

        Work.findOneAndUpdate({_id: {$eq: id}}, {is_delete: '1'}, function(err, result) {
            if (err) {
                util.json(res, {
                    errType: 2,
                    errCode:7
                });
                return;
            }

            util.json(res, {
                errType: 0
            });
        });
    });


};