/**
 * Created by fujunou on 2015/4/21.
 */
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var util = require('../../util/util');

//todo mock a userID and workID
var userID = 'ID_USER_1';
var workID = '5535c53161c76a990cc21e31';

module.exports.upload = function(req, res) {

    var form = new formidable.IncomingForm();

    //todo
    form.uploadDir = util.getCdnDir()+[userID, workID].join('/');
    form.keepExtensions = true;

    if(! fs.exists(form.uploadDir)) {
        util.mkdirsSync(form.uploadDir);
    }

    form.parse(req, function (err, fields, files) {
        var img = files.uploadimg;
        var imgData = fields.img;

        var imgReName;

        if (err) {
            util.json(res, {
                errType: 1,
                errCode:5
            });
            return;
        }

        if (! imgData) {
            var extName = '';  //后缀名

            switch (img.type) {
                case 'image/pjpeg':
                    extName = 'jpg';
                    break;
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                    extName = 'png';
                    break;
                case 'image/x-png':
                    extName = 'png';
                    break;
            }

            if (extName.length == 0) {
                console.log('不支持的图片类型');
                return;
            }

            imgReName = path.join(form.uploadDir, util.guid() + '.' + extName);
            fs.renameSync(img.path, imgReName);

        } else {
            imgReName = path.join(form.uploadDir, util.guid() + '.' + util.getBase64ExtName(imgData));
            // base64 上传
            fs.writeFileSync(imgReName, new Buffer(imgData.replace(/^data:(.*);base64,/, ''), "base64"));
        }

        util.json(res, {
            errType: 0,
            json: {
                url: util.uriChange(imgReName)
            }
        });
    });
};