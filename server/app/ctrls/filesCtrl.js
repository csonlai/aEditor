/**
 * @file 图片上传，zip包下载
 * @author jagus.ou@gmail.com
 */

var fs = require('fs');
var path = require('path');
var stream = require('stream');
var util = require('../../util/util');
var archiver = require('archiver');
var workModel = require('../models/workModel');
var fileCompare = require('file-compare');

var execFile = require('child_process').execFile;



var Imagemin = require('imagemin');



function deleteTempControllerDir (uid){
    var tempCtrl = path.join(util.getCdnDir(), uid, 'temp','ctrl');
    var ctrl = path.join(util.getCdnDir(), uid,'ctrl');
    if(fs.existsSync(tempCtrl)) {
        util.rmdirsSync(tempCtrl);
    }
     util.mkdirsSync(tempCtrl);

    if(!fs.existsSync(ctrl)){
        util.mkdirsSync(ctrl);
    }

}

function deleteTempWorkDir (uid){
    var tempWork = path.join(util.getCdnDir(), uid, 'temp','work');
    var work = path.join(util.getCdnDir(), uid,'work');
    
    if(fs.existsSync(tempWork)) {
        util.rmdirsSync(tempWork);
    }

    util.mkdirsSync(tempWork);
   
    if(!fs.existsSync(work)){
        util.mkdirsSync(work);
    }

}






/**
 * 图片base64上传
 * 如果没有workID，则将图片放到userID/temp目录下
 */

module.exports.upload = function(req, res) {
    var imgBase64Str = req.body.img || '';
    var userID = util.getUid(req);
    var type = util.getType(req);

    var id = type == 1? util.getCtrlId(req) : util.getWorkId(req);

    var cndFolder;
    var imgName = req.body.img_name || util.guid();
    var imgExtName,
        imgTempReName;

    // 对base64串作检测
    if(! /^data:(.*);base64,/.test(imgBase64Str) && imgBase64Str.length < 100) {
        return util.json(res, req, {
            errType: 1,
            errCode: 6
        });
    }

    // 存在作品或元件
    if(id){
        cndFolder = util.getCdnDir()+[userID,type == 1 ? 'ctrl': 'work',id].join('/');
    }
    else{
        cndFolder = util.getCdnDir()+[userID, 'temp', type == 1 ? 'ctrl': 'work'].join('/');
    }
    


    if(! fs.existsSync(cndFolder)) {
        util.mkdirsSync(cndFolder);
    }


    imgExtName = '.'+util.getBase64ExtName(imgBase64Str);

    imgReName = path.join(cndFolder, imgName + imgExtName);
    imgTempReName = path.join(cndFolder, 'temp_' + imgName + imgExtName);

    // 如果图片已经存在，返回已存在图片的地址
    if(fs.existsSync(imgReName)) {
        //imgReName = path.join(cndFolder, path.basename(imgReName, imgExtName) + '0'+imgExtName);
        util.json(res, req, {
            errType: 0,
            json: {
                url: util.uriChange(imgReName)
            }
        });
        return;
    }

    var imgData = new Buffer(imgBase64Str.replace(/^data:(.*);base64,/, ''), "base64");

    util.getUserAvailableImgsSize(userID,function(size){
        // 超过最大存储空间限制
        if(imgData.length / 1024 / 1024 > size){
            util.json(res, req, {
                errType: 1,
                errCode:11
            }); 
        }
        else{
            // 图片压缩
            var imgStream = fs.createWriteStream(imgReName);
            imgStream.on('finish',function(){

         
                new Imagemin()
                .src(imgReName)
                .use(Imagemin.jpegtran({progressive: true}))
                .dest(cndFolder)
                .run(function(err){
                    // if(err){
                    //     console.log('error:' + err);
                    //     // 压缩失败
                    //    util.json(res, req, {
                    //         errType: 1,
                    //         errCode: 8
                    //     });   

                    // }
                    // else{
                    //     util.json(res, req, {
                    //         errType: 0,
                    //         json: {
                    //             url: util.uriChange(imgReName)
                    //         }
                    //     });                
                    // }
                    util.json(res, req, {
                        errType: 0,
                        json: {
                            url: util.uriChange(imgReName)
                        }
                    });  
                });

            });
            imgStream.write(imgData);
            imgStream.end();            
        }
    });






};

// 删除一张服务端图片
module.exports.deleteUserImage = function(req, res){
    var user_id = util.getUid(req);
    var type = util.getType(req);

    var fileName = util.getFileName(req);
    fileName = decodeURIComponent(fileName);

    var id = type == 1? util.getCtrlId(req) : util.getWorkId(req);
    var path;
    // 存在作品或元件
    if(id){
        path = util.getCdnDir()+[user_id,type == 1 ? 'ctrl': 'work',id,fileName].join('/');
    }
    else{
        path = util.getCdnDir()+[user_id, 'temp', type == 1 ? 'ctrl': 'work',fileName].join('/');
    }

  

    fs.unlink(path,function(err){
      
        if(err){
            return util.json(res, req, {
                errType: 1,
                errCode: 9
            });

        }
        else{
            util.getUserAvailableImgsSize(user_id,function(size){

                return util.json(res, req, {
                    errType: 0,
                    errCode: 0,
                    json:{
                        available_folder_size:size
                    }
                    
                });  

            });
     
        }

    });
    
};



// 作品打包下载
module.exports.workdownloads = function (req, res) {
    // 先判断此用户下此作品是否存在，存在即可下载
    // 最后证明不需要作品id,因为JS文件始终是临时生成的
    var user_id = util.getUid(req),
        work_id = util.getWorkId(req);

    var jsPath, imgPath, archive;
      
    if(user_id) {
        conditions = {
            user_id: {$eq: user_id},
            _id: {$eq: work_id}
        };

        if(!work_id) {
            // 如果没有work_id，则使用user_id/temp打包
            archive = archiver('zip');
            archive.on('error', function(err) {
                res.status(500).send({error: '系统出错'});
            });

            res.on('close', function() {
                console.log('Archive wrote %d bytes', archive.pointer());
                return res.status(200).send('OK').end();
            });

            res.attachment('aeditor-'+new Date()*1+'.zip');
            archive.pipe(res);
            jsPath = path.join(util.getCdnDir(), 'js', user_id);
            imgPath = path.join(util.getCdnDir(), user_id, 'temp','work');

            archive.bulk([
                { expand: true, cwd: 'zip', src: ['index.html'], dest:'/' },
                { expand: true, cwd: 'zip/css', src: ['*.css'], dest:'/css/' },
                { expand: true, cwd: 'zip/js', src: ['*.js'], dest:'/js/' },
                { expand: true, cwd: jsPath, src: ['main.js'], dest:'/js/' },
                { expand: true, cwd: imgPath, src: ['*.*'], dest:'/img/' }
            ]);

            archive.finalize();
            return;
        }

        workModel.count(conditions, function(err, count) {
            if (err) {
                return util.json(res, req, {
                    errType: 2,
                    errCode: 9
                });
            }
            var imgFdExist = fs.existsSync(path.join(util.getCdnDir(), user_id, 'work',work_id));

            if(count === 1 && imgFdExist) {
                archive = archiver('zip');
                archive.on('error', function(err) {
                    res.status(500).send({error: '系统出错'});
                });

                res.on('close', function() {
                    console.log('Archive wrote %d bytes', archive.pointer());
                    return res.status(200).send('OK').end();
                });

                res.attachment('aeditor-'+new Date()*1+'.zip');
                archive.pipe(res);
                jsPath = path.join(util.getCdnDir(), 'js', user_id);
                imgPath = path.join(util.getCdnDir(), user_id, 'work',work_id);
              
                archive.bulk([
                    { expand: true, cwd: 'zip', src: ['index.html'], dest:'/' },
                    { expand: true, cwd: 'zip/css', src: ['*.css'], dest:'/css/' },
                    { expand: true, cwd: 'zip/js', src: ['*.js'], dest:'/js/' },
                    { expand: true, cwd: jsPath, src: ['main.js'], dest:'/js/' },
                    { expand: true, cwd: imgPath, src: ['*.*'], dest:'/img/' }
                ]);

                archive.finalize();
            } else {
                return util.json(res, req, {
                    errType: 2,
                    errCode: 10
                });
            }
        })

    } else {
        return util.json(res, req, {
            errType: 1,
            errCode: 1
        });
    }
};

// 利用前台传过来的JScode，生成下载用JS
module.exports.createJsFile = function (req, res, next) {
    var jscode = req.body.jscode || '';
    var userId= util.getUid(req);

    var jsFileDir = path.join(util.getCdnDir(), '/js/'+userId);
    var jsFilePath = path.join(jsFileDir, '/main.js');
    if(! jscode || !userId) {
        return util.json(res, req, {
            errType: 1,
            errCode: 1
        });
    }

    if(! fs.existsSync(jsFileDir)) {
        util.mkdirsSync(jsFileDir);
    } else {
        // 存在则删除main.js文件
        try {
            fs.unlinkSync(jsFilePath);
        } catch (e) {

        }
    }

    fs.writeFile(jsFilePath, [';',jscode,';'].join(''), function (err) {
        if (err) {
            return util.json(res, req, {
                errType: 2,
                errCode: 11
            });
        };

        util.json(res, req, {
            errType: 0,
            json: {
                msg: '生成JS文件成功'
            }
        });
    });
};





module.exports.deleteTempDir = function (req, res) {
    var uid = util.getUid(req);

    deleteTempWorkDir(uid);
    deleteTempControllerDir(uid);

    util.json(res, req, {
        errType: 0,
        json: {
            msg: '清空temp目录成功',
            json:{
                user_id:uid
            }
        }
    });
};

module.exports.deleteTempControllerDir = function(req, res){
    var uid = util.getUid(req);
    deleteTempControllerDir(uid);
    util.json(res, req, {
        errType: 0,
        json: {
            msg: '清空元件temp目录成功'
        }
    });
};
