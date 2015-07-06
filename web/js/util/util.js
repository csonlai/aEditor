//工具类
define([],function(){
	var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
	var domainUrl = 'http://aeditor.alloyteam.com';
	var cgiUrl = domainUrl + '/cgi';

	var userId = 'ID_USER_0';


	var Util = {
		//获取随机id
		getRandomId:function(){
			return ~~(Math.random() * 1e8);
		},
		//获取原始id（不带前缀）
		getOriginId:function(id){
			var idArr = id.split('_');
			return idArr[idArr.length - 1];
		},
		colorHex : function(string){
			var that = string;

			//由于转成16进制不支持rgba，所以这里先作一个转换，把rgba转换成rgb
			if(/^(rgba|RGBA)/.test(that)){
				var colorObj = this.colorValue2Obj(that);
				that = 'rgb(' + colorObj.red + ',' + colorObj.green + ','+ colorObj.blue + ')';
			}
			if(/^(rgb|RGB)/.test(that)){
				var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
				var strHex = "#";
				for(var i=0; i<aColor.length; i++){
					var hex = Number(aColor[i]).toString(16);
					if(hex.length == 1){
						hex = '0' + hex;
					}
					if(hex === "0"){
						hex += hex;	
					}
					strHex += hex;
				}
				if(strHex.length !== 7){
					strHex = that;	
				}
				return strHex;
			}else if(reg.test(that)){
				var aNum = that.replace(/#/,"").split("");
				if(aNum.length === 6){
					return that;	
				}else if(aNum.length === 3){
					var numHex = "#";
					for(var i=0; i<aNum.length; i+=1){
						numHex += (aNum[i]+aNum[i]);
					}
					return numHex;
				}
			}else{
				return that;	
			}
		},
		colorRgb : function(string){
			var sColor = string.toLowerCase();
			if(sColor && reg.test(sColor)){
				if(sColor.length === 4){
					var sColorNew = "#";
					for(var i=1; i<4; i+=1){
						sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));	
					}
					sColor = sColorNew;
				}
				
				var sColorChange = [];
				for(var i=1; i<7; i+=2){
					sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));	
				}
				return "RGB(" + sColorChange.join(",") + ")";
			}else{
				return sColor;	
			}
		},
		colorObj2Value:function(colorObj){
			return 'rgba(' + colorObj.red + ',' + colorObj.green + ',' + colorObj.blue + ',' + colorObj.alpha + ')';
		},
		colorValue2Obj:function( color ){
			var values = { red:null, green:null, blue:null, alpha:null };
			if( typeof color == 'string' ){
				
				if(color == 'transparent'){
					values = {
						red:   0,
						green: 0,
						blue:  0,
						alpha: 0
					};
				}
				/* hex */
				else if( color.indexOf('#') === 0 ){
					color = color.substr(1)
					if( color.length == 3 )
						values = {
							red:   parseInt( color[0]+color[0], 16 ),
							green: parseInt( color[1]+color[1], 16 ),
							blue:  parseInt( color[2]+color[2], 16 ),
							alpha: 1
						}
					else
						values = {
							red:   parseInt( color.substr(0,2), 16 ),
							green: parseInt( color.substr(2,2), 16 ),
							blue:  parseInt( color.substr(4,2), 16 ),
							alpha: 1
						}
				/* rgb */
				}else if( color.indexOf('rgb(') === 0 ){
					var pars = color.indexOf(',');
					values = {
						red:   parseInt(color.substr(4,pars)),
						green: parseInt(color.substr(pars+1,color.indexOf(',',pars))),
						blue:  parseInt(color.substr(color.indexOf(',',pars+1)+1,color.indexOf(')'))),
						alpha: 1
					}
				/* rgba */
				}else if( color.indexOf('rgba(') === 0 ){
					var pars = color.indexOf(','),
						repars = color.indexOf(',',pars+1);
					values = {
						red:   parseInt(color.substr(5,pars)),
						green: parseInt(color.substr(pars+1,repars)),
						blue:  parseInt(color.substr(color.indexOf(',',pars+1)+1,color.indexOf(',',repars))),
						alpha: parseFloat(color.substr(color.indexOf(',',repars+1)+1,color.indexOf(')')))
					}
				/* verbous */
				}else{
					var stdCol = { acqua:'#0ff',   teal:'#008080',   blue:'#00f',      navy:'#000080',
								   yellow:'#ff0',  olive:'#808000',  lime:'#0f0',      green:'#008000',
								   fuchsia:'#f0f', purple:'#800080', red:'#f00',       maroon:'#800000',
								   white:'#fff',   gray:'#808080',   silver:'#c0c0c0', black:'#000' };
					if( stdCol[color]!=undefined )
						values = this.colorValue2Obj(stdCol[color]);
				}
			}
			return values;
		},
		//设置下拉菜单的值
		setDropDownListValue:function(dropDownList,value){
            var listButton = $(dropDownList.find('.dropdown-toggle'));
            //设置选择值被下拉菜单的hide事件访问
            dropDownList.data('selectedValue',value);
            //填充选择值
            listButton.html(value + '<span class="caret"></span>');
		},
		convertKeyFrameSetting2CssProperties:function(currentSetting,firstKfSetting,isOutPut){
			var setting;
			currentSetting = currentSetting || {};

			if(firstKfSetting){
				setting = {};
				$.each(firstKfSetting,function(n,v){
					if(v != currentSetting[n]){
						setting[n] = currentSetting[n];
					}
				});
			}
			else{
				setting = currentSetting;
			}
		
			var css_obj = {};
			var img_css_obj = {};
			var tf_str = '';
			// if(typeof currentSetting.display != 'undefined'){
			// 	if(currentSetting.display == 'none'){
			// 		css_obj['isHide'] = true;
			// 		// css_obj['width'] = 0;
			// 		// css_obj['height'] = 0;
			// 		// css_obj['-webkit-transform'] = 'translateX(-9999px)';
			// 		css_obj['-webkit-animation-timing-function'] = 'step-end';	

			// 		return css_obj;
			
			// 	}
			// }

			if(typeof currentSetting.display != 'undefined'){
				if(currentSetting.display == 'none'){
					css_obj['isHide'] = true;
				}
			}

			// //吧base64替换为图片路径+文件名
			// if(isOutPut){
			// 	if(currentSetting.imgFileName){
			// 		css_obj['background-image'] = 'url(./img/' + currentSetting.imgFileName + ')';
			// 	}
			// }
			// else if(typeof currentSetting.imgUrl != 'undefined'){
			// 	css_obj['background-image'] = currentSetting.imgUrl ? 'url(' + currentSetting.imgUrl + ')' : 'none';
			// }

			if(typeof currentSetting.backgroundColor != 'undefined'){
				css_obj['background-color'] = currentSetting.backgroundColor;
			}	

			if(typeof currentSetting.opacity != 'undefined'){	
				css_obj['opacity'] = currentSetting.opacity;	
			}



			if(typeof currentSetting.perspective != 'undefined'){
				tf_str += 'perspective(' + currentSetting.perspective +') ';
			}


			var w,h,scaleX,scaleY;

			if(typeof currentSetting.width != 'undefined'){
				w = currentSetting.width;
			}

			if(typeof currentSetting.height != 'undefined'){
				h = currentSetting.height;
			}




			var x,y;
		
			var initialWidth,initialHeight;

			initialWidth = (firstKfSetting && firstKfSetting.initialWidth) || currentSetting.initialWidth || w || 0;
			initialHeight = (firstKfSetting && firstKfSetting.initialHeight) || currentSetting.initialHeight || h || 0;

		
			if(typeof currentSetting.x != 'undefined'){
				x = currentSetting.x;
			}


			if(typeof currentSetting.y != 'undefined'){
				y = currentSetting.y;
			}
			
			if(!currentSetting.controllerMode){
				if(x != null){
					x = x + (currentSetting.width - initialWidth) / 2;
				}
				if(y != null){
					y = y + (currentSetting.height - initialHeight) / 2;
				}
				
				


				if(w != null){
					scaleX = w / initialWidth;
				}
				if(h != null){
					scaleY = h / initialHeight;
				}
			}
	

			if(x){
				tf_str += 'translateX(' + x +'px) ';
			}
			if(y){
				tf_str += 'translateY(' + y +'px) ';
			}

			//rotate不设置值，另外设置了translateZ，会导致旋转360动画失效 tofixed
			
			//第一个关键帧css才加这个启动3d
			if(!firstKfSetting){
				//tf_str += 'translateZ(0) ';
			}
				
			//if(currentSetting.rotateX){
				tf_str += 'rotateX(' + currentSetting.rotateX +'deg) ';
			//}

			//if(currentSetting.rotateY){
				tf_str += 'rotateY(' + currentSetting.rotateY +'deg) ';
			//}

			//if(currentSetting.rotateZ){
				tf_str += 'rotateZ(' + currentSetting.rotateZ +'deg) ';
			//}





			if(currentSetting.skewX){
				tf_str += 'skewX(' + currentSetting.skewX +'deg) ';
			}

			if(currentSetting.skewY){
				tf_str += 'skewY(' + currentSetting.skewY +'deg) ';
			}


			if(!currentSetting.controllerMode){

				if(typeof scaleX != 'undefined' && scaleX != 1){
					tf_str += 'scaleX(' + scaleX + ') ';
				}

				if(typeof scaleY != 'undefined' && scaleY != 1){
					tf_str += 'scaleY(' + scaleY + ') ';
				}
				//当前是第一个关键帧的setting
				if(!firstKfSetting){
					css_obj['width'] = initialWidth;
					css_obj['height'] = initialHeight;					
				}


			}
			else{
				css_obj['width'] = setting.width;
				css_obj['height'] = setting.height;		
			}

			if(tf_str){
				css_obj['-webkit-transform'] = tf_str;	
			}


			css_obj['-webkit-animation-timing-function'] = currentSetting.easing || (firstKfSetting && firstKfSetting.easing);
			
			if(css_obj['-webkit-animation-timing-function'] == 'ease'){
				delete css_obj['-webkit-animation-timing-function'];
			}



			//存在自定义css属性(自定义css属性覆盖原有css属性)
			if(typeof currentSetting.customSetting != 'undefined'){
				css_obj = $.extend(css_obj,currentSetting.customSetting);
			}
			return css_obj;
		},
		//关键帧对象列表转换为css keyframes对象
		keyFrames2css:function(totalFramesCount,keyframes,isOutPut){

			var self = this;
			//关键帧对象
			var keyFramesObj = {};
			var preObj;
			var firstKfCss;
			var firstKfSetting;

			//有关键帧
			if(keyframes.length){

				//把关键帧转换成css keyframes
				$(keyframes).each(function(k,kf){

					//改css属性对应的百分比
					var percent = (kf.index / (totalFramesCount - 1)) * 100 + '%';

				
					//if(!kf.cssProperties){
						kf.cssProperties = self.convertKeyFrameSetting2CssProperties(kf.setting,firstKfSetting,isOutPut);
					//}

					if(kf.index == 0){
						firstKfSetting = kf.setting;
					}


					//设置关键帧对象的css属性
					keyFramesObj[percent] = $.extend({},kf.cssProperties);
				
					// //吧base64替换为图片路径+文件名
					// if(isOutPut && kf.setting.imgFileName){
					// 	kf.cssProperties['background-image'] = 'url(./img/' + kf.setting.imgFileName + ')';
					// }

					if(kf.cssProperties.isHide){
						if(preObj){
							preObj['-webkit-animation-timing-function'] = 'step-end';	
						}

						keyFramesObj[percent]['-webkit-transform'] = 'translateX(-9999px)';
						keyFramesObj[percent]['-webkit-animation-timing-function'] = 'step-end';	
					}


					// if(kf.index == 0){
					// 	firstKfCss = kf.cssProperties;
					// }
					// else{
					// 	//去掉和第一个关键帧重复的css属性，避免生成冗余的css keyframe
					// 	$.each(firstKfCss,function(n,v){
					// 		if(v == kf.cssProperties[n]){
					// 			delete kf.cssProperties[n];
					// 		}
					// 	});
					// }

					preObj = keyFramesObj[percent];

				});

				//设置终点关键帧为最后一个关键帧的值，避免动画复原
				keyFramesObj['100%'] = keyframes[keyframes.length - 1].cssProperties;
			}
		
			return keyFramesObj;
		},
		//删除作品
		deleteWork:function(workId,success,fail){
			$.ajax({
				type:'POST',
				url:cgiUrl + '/delete',
				data:{
					work_id:workId
				},
				success:function(data){
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
				
					}
					
				} 
			});			
		},
		//获取作品列表
		getWorks:function(page,size,success,fail){
		
			$.ajax({
				type:'GET',
				url:cgiUrl + '/query',
				data:{
					t:Date.now(),
					user_id:userId,
					page:page,
					size:size
				},
				success:function(data){
					var retcode = data.retcode;
					
					if(retcode == 0){
						var result = data.result;
						success && success(result);
					}
					
				} 
			});
		},
		//创建作品
		createWork:function(workData,success,fail){
			$.ajax({
				type:'POST',
				url:cgiUrl + '/upsert',
				data:{
					name:workData.name,
					work_data:JSON.stringify(workData)
				},
				success:function(data){
			
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
			
					}
					
				} 
			});
		},
		//创建元件
		createController:function(controllerData,success,fail){
			$.ajax({
				type:'POST',
				url:cgiUrl + '/upsert',
				data:{
					type:1,
					name:controllerData.name,
					ctrl_data:JSON.stringify(controllerData)
				},
				success:function(data){
			
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
			
					}
					
				} 
			});
		},
		//获取元件列表
		getControllerList:function(page,size,success,fail){
			$.ajax({
				type:'GET',
				url:cgiUrl + '/query',
				data:{
					t:Date.now(),
					type:1,
					user_id:userId,
					page:page,
					size:size
				},
				success:function(data){
					var retcode = data.retcode;
					
					if(retcode == 0){
						var result = data.result;
						success && success(result);
					}
					
				} 
			});
		},
		//删除元件
		deleteController:function(id,success,fail){
			$.ajax({
				type:'POST',
				url:cgiUrl + '/delete',
				data:{
					type:1,
					ctrl_id:id
				},
				success:function(data){
				
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
				
					}
					
				} 
			});		
		},
		//更新元件
		updateController:function(ctrlData,success,fail){
			
			$.ajax({
				type:'POST',
				url:cgiUrl + '/upsert',
				data:{
					type:1,
					ctrl_id:ctrlData.id,
					name:ctrlData.name,
					ctrl_data:JSON.stringify(ctrlData)
				},
				success:function(data){
			
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
			
					}
					
				} 
			});
		},
		//更新作品
		updateWork:function(workData,success,fail){
			
			$.ajax({
				type:'POST',
				url:cgiUrl + '/upsert',
				data:{
					work_id:workData.id,
					name:workData.name,
					work_data:JSON.stringify(workData)
				},
				success:function(data){
			
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
			
					}
					
				} 
			});
		},
		//注销
		logout:function(success,fail){
			$.ajax({
				type:'GET',
				url:cgiUrl + '/logout',
				data:{
					t:Date.now()
				},
				success:function(data){
		
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
					}
					else{
						fail && fail();
					}
					
				} 
			});			
		},
		//上传图片
		uploadImg:function(type,id,imgData,imgFileName,success,fail){
			imgFileName = imgFileName.split('.')[0];
			// 参数
			var param = {
				type:type,
				img:imgData,
				img_name:imgFileName
			};
			// 区分元件和作品
			param[type == 1 ? 'ctrl_id' : 'work_id'] = id;

			$.ajax({
				type:'POST',
				url:cgiUrl + '/upload',
				data:param,
				success:function(data){
					var retcode = data.retcode;

					if(retcode == 0){
						var result = data.result;

						if(result.url){
							var urlArr = result.url.split('/');
							var newFileName = urlArr[urlArr.length - 1]; 
						}


						var url =  domainUrl + '/' + result.url;
						success(url,newFileName);
					}
					else{
						if(retcode == 11){
							alert('图片存储空间不够用了，请在图片管理中删除一些图片吧');
						}
						else{
							alert('上传失败，请稍后重试');
						}
						fail && fail(data);
					}
					
				}, 
				error:function(){
					alert('上传失败，请稍后重试');
					fail && fail();
				}
			});

			// setTimeout(function(){
			// 	var url = './img/' + imgFileName;
			// 	success(url);
			// },0);
		},
		//创建作品
		postJsCode:function(code,success){
			$.ajax({
				type:'POST',
				url:cgiUrl + '/jscode',
				data:{
					user_id:userId,
					jscode:code
				},
				success:function(data){
			
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
			
					}
					
				} 
			});
		},
		//获取用户的图片列表
		getImgs:function(success){
			$.ajax({
				type:'GET',
				url:cgiUrl + '/getimgs',
				success:function(data){
			
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
			
					}
					
				} 
			});
			
		},
		//下载作品压缩包
		downloadWork:function(currentWorkId,success){
		
			var aLink = $('<a></a>');
		    aLink.prop('href',cgiUrl + '/workdownload' + (currentWorkId ? '?work_id=' + currentWorkId : ''));

		    var evt = document.createEvent("HTMLEvents");
    		evt.initEvent("click", false, false);
    		aLink[0].dispatchEvent(evt);
					
		},
		//删除一张图片
		delImg:function(fileName,id,type,success,fail){
			var param = {
				t:Date.now(),
				file_name:fileName,
				type:type
			};
			if(id){
				param[type == 1 ? 'ctrl_id' : 'work_id'] = id;
			}
			$.ajax({
				type:'POST',
				url:cgiUrl + '/delimg',
				data:param,
				success:function(data){
			
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
			
					}
					else{
						alert('删除失败，请稍后重试');
						fail && fail(data);
					}
					
				},
				error:function(){
					fail && fail();
				} 
			});
		},
		//删除用户图片目录
		delTemp:function(success,fail){
			$.ajax({
				type:'GET',
				url:cgiUrl + '/deltemp?' + 't=' + Date.now(),
				success:function(data){
			
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
			
					}
					else{

						fail && fail();
					}
					
				} 
			});
		},
		//删除元件图片目录
		delControllerTemp:function(success,fail){
			$.ajax({
				type:'GET',
				url:cgiUrl + '/delctrltemp?' + 't=' + Date.now(),
				success:function(data){
			
					var retcode = data.retcode;
					if(retcode == 0){
						var result = data.result;
						success && success(result);
			
					}
					else{

						fail && fail();
					}
					
				} 
			});
		},
		// 验证图片合法性
		imgFileValidate:function(imgFileName,fileSize){
			//文件格式限制
			if(!/\.(jpg|png|gif|jpeg)$/i.test(imgFileName)){
				alert('上传文件必须为图片');
				return false;
			}
			//文件大小限制
			if(fileSize > 2 * 1024 * 1024){
				alert('图片大小不能超过2M');
				return false;
			}

			return true;
		}
	};

	return Util;
});