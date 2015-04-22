/**
 * Created by fujunou on 2015/4/11.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WorkSchema = new Schema({
    user_id: { type : String},
    name: String,
    is_delete: { type : String, default : '0', enum: ['0', '1'] },
    update_time:{type : Date, default : Date.now},
    work_data:{}
});

WorkSchema.path('name').validate(function (value) {
    return value.length;
}, '作品名字不能为空');

WorkSchema.path('is_delete').validate(function (value) {
    return /0|1/.test(value);
}, '删除标志只能为0或1');


WorkSchema.pre('save', function(next) {
    // 储存前做点什么
    next();
});


// 创建Model Work
var WorkModel = mongoose.model('Work', WorkSchema);

module.exports = WorkModel;