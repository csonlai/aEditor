define(['tmpl','util'],function(tmpl,Util){

	var KEYFRAME_TMPL_NAME = 'keyframe';
	//关键帧对象
	function KeyFrame(opt){
		this.init(opt);
	};

	KeyFrame.prototype = {
		init:function(opt){
			opt = opt || {};

			this.setData(opt);
			//关键帧元素
			this.element = $('<div class="keyframe" id="' + this.renderId + '"></div>');
			//渲染
			this.render();
			//事件绑定
			this.bind();

		},
		//获取数据
		getData:function(){
			return {
				id:this.id,
				index:this.index,
				//cssProperties:this.cssProperties,
				setting:this.setting
			};
		},
		//设置数据
		setData:function(opt){
			//随机关键帧id
			this.id = opt.id || Util.getRandomId();
			//索引
			this.index = opt.index || 0;
			//样式属性
			//this.cssProperties = opt.cssProperties;
			//所在帧对象
			this.frame = opt.frame;

			this.renderId = KEYFRAME_TMPL_NAME + '_' +this.id;


			//设置初始设定
			this.setSetting($.extend({
				display:'block',
				x:0,
				y:0,
				backgroundColor:'transparent',
				rotate:0,
				opacity:1,
				easing:'linear'
			},opt.setting));

		},
		//复制关键帧
		clone:function(){
			return newKeyFrame({
				//cssProperties:this.cssProperties,
				setting:this.setting
			});
		},

		bind:function(){
			var self = this;
			//除了第一个关键帧外，其他关键帧可以拖拽
			if(this.index > 0){
				//所在帧展示栏
				var framesbar = this.frame.framesbar;
				var olElement = framesbar.getFramesBarOlElement();
			
				//可拖动
				this.element.draggable({
					axis: "x",
					stop:function(e,ui){
						var target = $(e.target);
						//关键帧中线位置
						var center = target.offset().left -  olElement.offset().left;
						var totalCount = framesbar.framesArr.length;
					
						var targetIndex = Math.min(totalCount - 1 ,Math.max(0,(Math.round(center / (self.frame.frameLength + 1)))));
						//新增关键帧
						var newKeyFrame = framesbar.addKeyFrame(targetIndex,self.setting);
						newKeyFrame.select();

						//移除拖拽的关键帧
						framesbar.deleteKeyFrameById(self.id);

					}
				});	
			}
		},
		//获取关键帧元素
		getKeyFrameElement:function(){
			return this.element;
		},
		//渲染
		render:function(){
			var frameElement = this.frame.getFrameElement();
			frameElement.append(this.element);
		},
		//选择
		select:function(){
			var frameElement = this.getKeyFrameElement();

			if(frameElement.hasClass('selected')) return;
			
			console.log('KeyFrame selected');

			//同时选中帧展示栏
			if(this.frame.framesbar){
				this.frame.framesbar.select();
			}

			frameElement.addClass('selected');

			//触发选择关键帧事件
			$(window).trigger('keyFrameSelect',{
				keyFrame:this
			});
			//触发选择关键帧事件
			$(window).trigger('afterKeyFrameSelect',{
				keyFrame:this
			});
			//同时选中该帧
			//this.frame.select();
		},
		//取消选择
		unSelect:function(){


			var frameElement = this.getKeyFrameElement();
			if(frameElement){
				frameElement.removeClass('selected');
				//触发取消选择关键帧事件
				$(window).trigger('keyFrameUnselect',{
					unSelectedKeyFrame:this
				});	
			}	
		},
		//改变模式后，更新cssProperties
		updateCssProperties:function(controllerMode){
			this.setting.controllerMode = controllerMode;
			//setting转换为对应css样式对象
			var cssProperties = Util.convertKeyFrameSetting2CssProperties(this.setting);
			this.setCssProperties(cssProperties);
		},
		//设置设定
		setSetting:function(setting){

			delete setting.imgFileName;
			delete setting.imgUrl;
			delete setting.textContent;
	
			this.setting = $.extend(this.setting,setting);
			//设置initialWidth和initialHeight用于转换为scale
			if(this.index == 0){
				if(this.setting.initialWidth == null){
					this.setting.initialWidth = this.setting.width;
				}
				if(this.setting.initialHeight == null){
					this.setting.initialHeight = this.setting.height;
				}
			}

			//setting转换为对应css样式对象
			var cssProperties = Util.convertKeyFrameSetting2CssProperties(this.setting);
			this.setCssProperties(cssProperties);
		},
		//获取设定
		getSetting:function(){
			//return $.extend({},this.setting);
			return this.setting;
		},
		//设置css属性
		setCssProperties:function(cssProperties){
			this.cssProperties = cssProperties;
		},
		//移除
		remove:function(){
			 var element = this.getKeyFrameElement();
			 element && element.remove();
			 this.element = null;
			 //todo:事件移除之后再补,需要修改写法
			 this.frame.keyFrame = null;
			 this.frame = this.id = this.setting = this.cssProperties = null;
			 
		}
	};

	return KeyFrame;
});
