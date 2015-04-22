/**
 * Created by fujunou on 2015/4/21.
 */
var express = require('express');
var works = require('../app/ctrls/workCtrl');
var upload = require('../app/ctrls/uploadCtrl');
var router = express.Router();

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.render('index');
    });

    /*测试用*/
    app.get('/add', function (req, res) {
        res.render('addwork');
    });
    app.get('/update', function (req, res) {
        res.render('updatework');
    });

    app.get('/img', function (req, res) {
        res.render('upload');
    });
    /*测试用*/

    app.post('/upsert', works.upsert);
    app.get('/query', works.query);
    app.get('/delete', works.delete);
    app.post('/upload', upload.upload);



};