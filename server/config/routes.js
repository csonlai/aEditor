var ctrls = require('../app/ctrls/crudCtrl');
var files = require('../app/ctrls/filesCtrl');
var oauth = require('../app/ctrls/oauthCtrl');

module.exports = function (app) {

    app.get('/forlogin', function (req, res) {
        res.render('login');
    });

    /*绑定CGI接口*/
    // 作品元件增加，更新
    app.post('/upsert', ctrls.upsert);

    // 作品元件删除
    app.post('/delete', ctrls.delete);

    // 作品元件查询
    app.get('/query', ctrls.query);

    // 图片上传
    app.post('/upload', files.upload);

    // 作品zip包下载
    app.get('/workdownload', files.workdownloads);

    // 生成下载用JS文件
    app.post('/jscode', files.createJsFile);

    // 登录用接口
    app.get('/login', oauth.doLogin);

    // 注销用接口
    app.get('/logout', oauth.doLogout);
    
    // 清空uid中的temp目录
    app.get('/deltemp', files.deleteTempDir);

    // 获取图片目录
    app.get('/getimgs',ctrls.getAllImgs);

    // 删除一张图片
    app.post('/delimg',files.deleteUserImage);


    // 清空uid中元件的temp目录
    app.get('/delctrltemp', files.deleteTempControllerDir);
    

};