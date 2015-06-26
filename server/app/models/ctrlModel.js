/**
 * Created by fujunou on 2015/5/16.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CtrlSchema = new Schema({
    user_id: { type : String},
    name: String,
    is_delete: { type : String, default : '0', enum: ['0', '1'] },
    update_time:{type : Date, default : Date.now},
    ctrl_data:{}
});

CtrlSchema.path('name').validate(function (value) {
    return value.length;
}, '元件字不能为空');

CtrlSchema.path('is_delete').validate(function (value) {
    return /0|1/.test(value);
}, '删除标志只能为0或1');


CtrlSchema.pre('save', function(next) {
    // 储存前做点什么
    next();
});


// 创建Model Ctrl
var CtrlModel = mongoose.model('Ctrl', CtrlSchema);

module.exports = CtrlModel;