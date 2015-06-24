define(['tmpl','util','keyframe','tween'],function(tmpl,Util,KeyFrame,Tween){
	var FRAME_TMPL_NAME = 'frame';

	//帧对象
	function Frame(opt){
		this.init(opt);
	};

	Frame.prototype = {
		init:function(opt){
			opt = opt || {};

			this.setData(opt);
			//元素
			this.element = $('<div>',{
				id:this.renderId,
				class:'frame'
			});
			//dom元素中增加索引
			this.element.data('index',this.index);

			this.element.css({
				width:this.frameLength
			});
			//渲染
			this.render();

	
		},
		//获取数据
		getData:function(){


			return {
				id:this.id,
				index:this.index,
				frameLength:this.frameLength/*,
				keyFrameData:keyFrameData*/
			};
		},
		//设置数据
		setData:function(opt){
			//随机帧id
			this.id = opt.id || Util.getRandomId();
			//帧索引
			this.index = opt.index || 0;
			//帧的可视长度
			this.frameLength = opt.frameLength || 12;
			//帧元素上的id
			this.renderId = FRAME_TMPL_NAME + '_' + this.id;
			//关键帧
			this.keyFrame = opt.keyFrame;
			//所属帧展示栏
			this.framesbar = opt.framesbar;

		},
		//获取根据关键帧计算后的设定
		getCalculatedSetting:function(){
			var self = this;
			var framesbar = this.framesbar;
			var keyFramesArr = framesbar.getKeyFrames();
			//该帧的左右关键帧
			var kf,l_kf,r_kf;

			//如果该帧有关键帧，则直接返回关键帧设定
			if(this.keyFrame){
				return this.keyFrame.getSetting();
			}

			//获取该帧左右两边的关键帧
			var leftRightKfObj = framesbar.getLeftRightKeyFrame(self);
			l_kf = leftRightKfObj.l_kf;
			r_kf = leftRightKfObj.r_kf;


			//如果右边一直没有关键帧，则该帧在最右边的关键帧右边，所以返回最后一个关键帧设定则可
			if(!r_kf){
				if(!keyFramesArr.length){
					return;
				}
				return keyFramesArr[keyFramesArr.length - 1].getSetting();
			}
			else{
				var l_setting = l_kf.getSetting();
				var r_setting = r_kf.getSetting();
				var current_setting = {};

				easing = l_setting['easing'];
			
			
				//缓动类型
				easing = (easing).split('-').join('');

				//当前时间
				var t = (self.index - l_kf.index) * framesbar.frameDuration;
				//持续时间
				var d = (r_kf.index - l_kf.index) * framesbar.frameDuration;


				$.each(l_setting,function(n){
					if(n != 'customSetting'){
						current_setting[n] = self.getCalculatedSettingValue(n,l_setting,r_setting,t,d,easing);
					}
				});

				current_setting.customSetting = {};
		
				//自定义css属性
				if(l_setting.customSetting){
					
					$.each(l_setting.customSetting,function(n){
						if(n == 'imgFileName'){
							debugger;
						}
						current_setting.customSetting[n] = self.getCalculatedSettingValue(n,l_setting.customSetting,r_setting.customSetting,t,d,easing);	
					});			
				}

				return current_setting;

			}
		},
		//计算缓动值
		calculateEasingValue:function(startValue,endValue,t,d,easing){
			var setting_value;
			startValue = Number(startValue);
			endValue = Number(endValue);

			if(startValue == endValue) return endValue;
			
			if(easing == 'stepstart'){
				setting_value = endValue;
			}
			else if(easing == 'stepend'){
				setting_value = startValue;
			}
			else{
				//初始值
				var b = startValue;	
				//变化量
				var c = endValue - b;
				
				if(Tween[easing]){
					//当前帧应得的值
					setting_value = Tween[easing](t,b,c,d);
				}
				else{
					setting_value = Tween['linear'](t,b,c,d);
				}
			}

			return setting_value;
		},
		//计算出新的颜色对象
		calculateColorObj:function(leftColorObj,rightColorObj,t,d,easing){
			var self = this;
			var newColorObj = {};
			$.each(leftColorObj,function(name){
				var value = self.calculateEasingValue(leftColorObj[name],rightColorObj[name],t,d,easing);
				newColorObj[name] = (name == 'alpha') ? value : Math.round(value);
			});
			return newColorObj;
		},
		getCalculatedSettingValue:function(n,l_setting,r_setting,t,d,easing){
			
			var setting_value;

			
			//customSetting不存在会出现这种情况
			if(!r_setting){
				return l_setting[n];
			}

			if(l_setting[n] === '' || r_setting[n] === ''){
				setting_value = '';
			}

			//是否数字属性值
			else if(!isNaN(Number(l_setting[n])) && !isNaN(Number(r_setting[n]))){
				setting_value = this.calculateEasingValue(l_setting[n],r_setting[n],t,d,easing);
			}
			//背景颜色渐变计算
			else if(n == 'backgroundColor' && l_setting[n] && r_setting[n]){
				var leftColorObj = Util.colorValue2Obj(l_setting[n]);
				var rightColorObj = Util.colorValue2Obj(r_setting[n]);

				//从透明渐变的话，避免颜色中间值的计算
				if(leftColorObj.alpha == 0){
					leftColorObj.red = rightColorObj.red;
					leftColorObj.green = rightColorObj.green;
					leftColorObj.blue = rightColorObj.blue;
				}
				//渐变到透明的话，避免颜色中间值的计算
				else if(rightColorObj.alpha == 0){
					rightColorObj.red == leftColorObj.red;
					rightColorObj.green = leftColorObj.green;
					rightColorObj.blue = leftColorObj.blue;
				}
				//计算出新的颜色对象
				var newColorObj = this.calculateColorObj(leftColorObj,rightColorObj,t,d,easing);
				var newColorValue = Util.colorObj2Value(newColorObj);
				//计算出来的颜色值
				setting_value = newColorValue;


			}
			else if(easing == 'stepstart'){
				setting_value = r_setting[n];
			}
			else{
				setting_value = l_setting[n];
			}

			return setting_value;
		},
		//渲染
		render:function(){
			//插入元素
			var frameElement = this.framesbar.getFramesBarOlElement();
			frameElement.append(this.element);
		},
		//设置关键帧
		setKeyFrame:function(keyFrame){
			//设置该帧的关键帧对象
			this.keyFrame = keyFrame;

		},
		//获取关键帧
		getKeyFrame:function(){
			return this.keyFrame;
		},
		//获取帧对象元素
		getFrameElement:function(){
			return this.element;
		},
		//移除
		remove:function(){
			//释放关键帧对象
			if(this.keyFrame){
				this.keyFrame.remove();
				this.keyFrame = null;
			}
			var element = this.getFrameElement();
			element.remove();
			this.element = null;
		},
		//帧被选择
		select:function(){
			var self = this;
			if(this.element.hasClass('selected')){
				return;
			}

			console.log('Frame selected');
			
			this.element.addClass('selected');

			//同时选中帧展示栏
			if(this.framesbar){
				this.framesbar.select();
			}

			//触发帧选择事件
			$(window).trigger('frameSelect',{
				frame:self
			});

			//触发帧选择事件
			$(window).trigger('afterFrameSelect',{
				frame:self
			});

		},
		//帧取消选择
		unSelect:function(){
			this.element.removeClass('selected');
			//触发帧取消选择事件
			$(window).trigger('frameUnSelect',{
				frame:self
			});
		},
		remove:function(){
			var element = this.getFrameElement();
			element && element.remove();
			this.element = null;
		}
	};
	return Frame;
});