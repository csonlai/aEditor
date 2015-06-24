//精灵元素
define(['tmpl','util','controller'],function(tmpl,Util,Controller){

	var TMPL_NAME = 'sprite';

	var spriteCountIndex = 0;
	

	//用于检测文本宽度的元素
	var testWidthDiv;



	function Sprite(opt){
		this.init(opt);
	};

	Sprite.prototype = {
		//初始化
		init:function(opt){
			this.setData(opt);

			//渲染
			this.render();
			//如果有元件数据。初始化元件
			if(this.controllerRenderData){
				this.initController(this.controllerRenderData);
			}
		
			//事件绑定
			this.bind();
			//设置样式
			//this.setStyle(this);
			//初始设定
			this.initialSetting = this.getSetting();

			//设置层级
			this.setZIndex(this.zIndex);
			//空的精灵容器
			if(!this.imgUrl && !this.controller){
				var element = this.getSpriteElement();
				//空容器类，显示标识
				element.addClass('empty-sprite-container');
			}
		
			//恢复点击行为事件绑定
			this.bindClickAction({
				actionJumpNext:this.clickActionJumpNext,
				actionEventName:this.clickActionEventName
			});

			var element = this.getSpriteElement();
			this.nameTag = $('.sprite-class-name-tag',element);
			//设置类名标记
			this.setNameTag(this.name);

			// if(this.isText){
			// 	this.textWrap = $('.text-wrap',element);
			// 	this.textWrap.css({
			// 		width:this.width,
			// 		height:this.height
			// 	});
			// }



		

		
		},
		setData:function(opt){
			this.id = opt.id || Util.getRandomId();
			//left坐标
			this.x = opt.x || 0;
			//top坐标
			this.y = opt.y || 0;

			this.zIndex = opt.zIndex;
			//精灵名
			this.name = opt.name || 's_' + (spriteCountIndex++);
			//类名(有默认类名)
			this.className = opt.className || this.name;

			//宽
			this.width = opt.width;
			//高
			this.height = opt.height;
			//缩放
			this.scale = opt.scale || 1;
			//旋转
			this.rotateZ = opt.rotateZ || 0;
			this.rotateX = opt.rotateX || 0;
			this.rotateY = opt.rotateY || 0;
			//倾斜
			this.skewX = opt.skewX || 0;
			this.skewY = opt.skewY || 0;

			this.perspective = opt.perspective || 0;
			//透明度
			if(opt.opacity != null){
				this.opacity = opt.opacity;
			}
			else{
				this.opacity = 1;
			}
			
			//是否显示
			this.display = opt.display || 'block';
			//使用的图片url
			this.imgUrl = opt.imgUrl;
			//图片文件名
			this.imgFileName = opt.imgFileName;
			//视距
			//this.perspective = opt.perspective;
			//背景颜色
			this.backgroundColor = opt.backgroundColor;
			//元件渲染数据
			this.controllerRenderData = opt.controllerRenderData;
			//所在stage
			this.stage = opt.stage;
			//所在舞台列表容器
			this.stagesList = opt.stagesList || $('.stages-list');

			this.actionEventName = null;

			this.zIndex = opt.zIndex || 0;

			this.listenEventNameList = opt.listenEventNameList || [];

			this.clickActionEventName = opt.clickActionEventName;

			this.clickActionJumpNext = opt.clickActionJumpNext;
			//事件帧选择栏集合
			this.eventFramesBarsMap = {};


			//是否全局精灵
			this.isGlobal = opt.isGlobal;
			//精灵的自定义样式属性
			this.spriteCustomSetting = opt.spriteCustomSetting;

			this.controllerMode = opt.controllerMode || 0;
			//是否文本图层
			this.isText = opt.isText;
			//文本内容
			this.textContent = opt.textContent;
			//是否单文本
			this.isSingle = opt.isSingle;


		},
		//获取数据
		getData:function(){
			
			// var data = {
			// 	display:this.display,
			// 	id:this.id,
			// 	x:this.x,
			// 	y:this.y,
			// 	zIndex:this.zIndex,
			// 	width:this.width,
			// 	height:this.height,
			// 	name:this.name,
			// 	className:this.className,
			// 	backgroundColor:this.backgroundColor,
			// 	perspective:this.perspective,
			// 	// scale:this.scale,
			// 	rotate:this.rotate,
			// 	opacity:this.opacity,
			// 	//isCopy:this.isCopy,
			// 	imgUrl:this.imgUrl,
			// 	imgFileName:this.imgFileName,
			// 	controllerRenderData:this.controllerRenderData,
			// 	//listenEventHandlerMap:this.listenEventHandlerMap
			// 	listenEventNameList:Object.keys(this.listenEventHandlerMap || {}),
			// 	clickActionEventName:this.clickActionEventName,
			// 	clickActionJumpNext:this.clickActionJumpNext,
			// 	controllerMode:this.controllerMode,
			// 	isGlobal:this.isGlobal,
			// 	//精灵的自定义样式属性
			// 	spriteCustomSetting:this.spriteCustomSetting,
			// 	controllerMode:this.controllerMode,
			// 	isText:this.isText,
			// 	textContent:this.textContent,
			// 	isSingle:this.isSingle,
			// 	initialSetting:this.getInitialSetting()

			// };



			var data = $.extend({},this.getInitialSetting(),{ // 这些设置在设置的时候不会被设置到initialSetting中，所以这里要单独抽出来覆盖
				id:this.id,
				listenEventNameList:Object.keys(this.listenEventHandlerMap || {}),
				isGlobal:this.isGlobal,
				isText:this.isText,
				textContent:this.textContent,
				isSingle:this.isSingle,
				zIndex:this.zIndex,
				actionEventName:this.actionEventName

			});
	

			if(!this.getCommondFramesBar() && !this.hasEventFramesBar()){
				//data.spriteCssProperties = this.convertSetting2CssProperties(this.getInitialSetting());
				data.spriteCssProperties = this.getCssProperties();
			}
	
			return data;
		},

		initController:function(controllerRenderData){
			if(controllerRenderData){

				var controllerWrapElement = this.getControllerWrapElement();
				
				//初始化元件对象
				this.controller = new Controller({
					controllerRenderData:controllerRenderData,
					container:controllerWrapElement,
					fromEdit:true 
				});

			}
		},
		addToGlobal:function(elem){
			globalSpriteWrap = this.stage.getGlobalSpriteWrap();
			globalSpriteWrap.append(elem);

		},
		addToStage:function(elem){
			var stageElement = this.stage.getStageElement();
			stageElement.append(elem);
		},
		//设置/解除设置全局精灵
		setGlobal:function(isGlobal){
			var element = this.getSpriteElement();
			var spriteRoot = element.parent().parent();
			this.isGlobal = isGlobal;

			if(isGlobal){
				this.addToGlobal(spriteRoot);
			}
			else{
				this.addToStage(spriteRoot);
			}
		},
		//设置类名标记
		setNameTag:function(name){
			this.nameTag.text(name);
		},
		//设置普通帧展示栏
		setFramesBar:function(framesBar){
			//增加普通帧展示栏
			if(framesBar.emitType == 'none'){
				this.framesbar = framesBar;
			}
			//增加事件帧展示栏
			else{
				this.eventFramesBarsMap[framesBar.emitEventName] = framesBar;
			}
			//是否单文本
			framesBar.isSingle = this.isSingle;
		},
		//设置文本内容
		setTextContent:function(content){
			if(this.isSingle && this.controllerMode == 0){
				var visibleWidth,visibleHeight,element;
				var currentScaleX,currentScaleY;
				var currentWidth,currentHeight;

				//用于检测单行文本宽度的div
				if(!testWidthDiv){
					testWidthDiv = $('<div></div>',{
						class:'test-width-div'
					});
					$('body').append(testWidthDiv);
				}
				testWidthDiv.html(content);

				visibleWidth = testWidthDiv.width() + 1;
				visibleHeight = testWidthDiv.height();

				if(this.initialSetting && this.initialSetting.width != null){
					currentScaleX = this.width / (this.initialSetting.width);
					currentScaleY = this.height / (this.initialSetting.height);
				}
				else{
					currentScaleX = 1;
					currentScaleY = 1;
					this.width = visibleWidth;
					this.height = visibleHeight;
				}

				if(this.initialSetting){
					this.initialSetting.width = visibleWidth;
					this.initialSetting.height = visibleHeight;
				}

				element = this.getSpriteElement();
				
				currentWidth = visibleWidth * currentScaleX;
				currentHeight = visibleHeight * currentScaleY;

				this.setStyle({
					width:currentWidth,
					height:currentHeight
				});

		

			
				$(window).trigger('spriteSingleTextChange',{
					sprite:this,
					//需要重置所有初始尺寸
					resetInitialSize:true,
					currentScaleX:currentScaleX,
					currentScaleY:currentScaleY,
					currentWidth:currentWidth,
					currentHeight:currentHeight
				});

			}

			this.textContent = content;
			this.textWrapElement.html(content);
			
		},
		getCommondFramesBar:function(){
			return this.framesbar;
		},
		hasEventFramesBar:function(){
			return !!(this.eventFramesBarsMap && Object.keys(this.eventFramesBarsMap).length);
		},
		//获取特定事件的帧展示栏		
		getEventFramesBar:function(emitEventName){
			if(emitEventName){
				return this.eventFramesBarsMap[emitEventName];
			}	
			else{
				var fbArr = [];
				$.each(this.eventFramesBarsMap,function(name,fb){
					fbArr.push(fb);
				});

				return fbArr;
			}
			
		},
		//绑定动画自定义事件
		bindAnimationCustomEvent:function(emitEventName,handler){
			if(!this.listenEventHandlerMap){
				this.listenEventHandlerMap = {};
			}

			var element = this.getSpriteElement();
			$(window).on(emitEventName,handler);
		
			//保存句柄用于删除
			this.listenEventHandlerMap[emitEventName] = handler;
		},
		//播放元件动画
		playControllerAnimation:function(){
			if(this.controller){
				this.controller.playAnimation();
			}
		},
		//设置正在播放的帧展示栏动画的renderId
		setPlayingFramesBarRenderId:function(renderId){
			var element = this.getSpriteElement();
			element.attr('data-playing-framesbar-render-id',renderId);
		},
		//获取正在播放的帧展示栏动画的renderId
		getPlayingFramesBarRenderId:function(){
			var element = this.getSpriteElement();
			return element.attr('data-playing-framesbar-render-id');
		},
		//删除绑定动画自定义事件
		removeAnimationCustomEvent:function(emitEventName){
			var self = this;

			if(!this.listenEventHandlerMap){
				return;
			}

			if(!emitEventName){
				$.each(this.listenEventHandlerMap,function(name){
					self.removeAnimationCustomEvent(name);
				});
				return;
			}
			var handler = this.listenEventHandlerMap[emitEventName];
			if(handler){
				$(window).off(emitEventName,handler);
				delete this.listenEventHandlerMap[emitEventName];
				delete this.eventFramesBarsMap[emitEventName];
			}
		},

		//删除跳到下一页标记
		removeJumpNextFlag:function(){
			if(this.jumpNextFlag){
				this.jumpNextFlag.remove();
			}
		},
		//设置跳到下一页标记
		setJumpNextFlag:function(){
			var spriteElement = this.getSpriteElement();
			if(!this.jumpNextFlag){
				this.jumpNextFlag = $('<div></div>',{
					class:'sprite-jump-next-flag glyphicon glyphicon-arrow-down'
				});
			}	
			this.jumpNextFlag.appendTo(spriteElement);
		},
		setEventActionNameFlag:function(actionEventName){
			var spriteElement = this.getSpriteElement();
			if(!this.eventActionFlag){
				this.eventActionFlag = $('<div></div>',{
					class:'sprite-event-action-flag'
				});
			}
			this.eventActionFlag.appendTo(spriteElement);
			this.eventActionFlag.html('click:' + actionEventName);
		},	
		removeEventActionNameFlag:function(){
			if(this.eventActionFlag){
				this.eventActionFlag.remove();
			}
		},
		//设置点击行为标记
		setClickActionFlag:function(){
			//点击触发事件
			if(this.clickActionEventName){
				this.setEventActionNameFlag(this.clickActionEventName);
			}
			else{
				this.removeEventActionNameFlag();
			}
			//点击跳到下一页
			if(this.clickActionJumpNext){
				this.setJumpNextFlag();
			}
			else{
				this.removeJumpNextFlag();
			}
		},
		//绑定点击行为
		bindClickAction:function(e){
			var self = this;
			var element = this.getSpriteElement();
			//这里只设置标记，不实际绑定事件监听，因为编辑状态下点击精灵不会触发事件动画
			this.clickActionJumpNext = e.actionJumpNext;
			this.clickActionEventName = e.actionEventName;
		

			if(element){
				//设置精灵的点击行为标记
				this.setClickActionFlag();
			}
		},
		//事件绑定
		bind:function(){
			var self = this;

			var element = this.getSpriteElement();
			var element_rswr = element.parent();
			var element_drwr = element_rswr.parent();
			//可改变尺寸
			element.resizable({
				handles:'ne,nw,se,sw,e,n,s,w',
				stop:function(e,ui){
					var prop = {
						x:ui.position.left + self.x,
						y:ui.position.top + self.y,
						width:ui.size.width,
						height:ui.size.height
					};
					//去掉插件默认设置的left/top值，因为已经转换为translateX与Y值
					element.css({
						'left':0,
						'top':0
					});

					// //目前宽度是百分比模式,则保持使用百分比模式
					// if(self.width.indexOf('%') > -1){
					// 	prop.width = (prop.width / self.stage.width * 100) + '%';
					// }
			
					self.setStyle(prop);

					//触发位置更新事件
					$(window).trigger('spritePositionUpdate',{
						sprite:self
					});	
				}
			});
			//可拖动
			element_drwr.draggable({
				start:function(){
					//锁定状态或正在播放动画，精灵不可拖动
					if(self.isLock || $('body').hasClass('playing_animation')){
						return false;
					}
				},
				stop:function(e,ui){
					var prop = {
						x:ui.position.left + self.x,
						y:ui.position.top + self.y
					};
					//去掉插件默认设置的left/top值，因为已经转换为translateX与Y值
					element_drwr.css({
						'left':0,
						'top':0
					});
					self.setStyle(prop);	

					//触发位置更新事件
					$(window).trigger('spritePositionUpdate',{
						sprite:self
					});		

				}
			});
			//可旋转
			element.rotatable({
				start:function(){

				},
				stop:function(e,ui){
					var angle = ui.angle.current * 180 / Math.PI;
					var prop = {
						rotateZ:angle
					};
					self.setStyle(prop);
					//触发位置更新事件
					$(window).trigger('spritePositionUpdate',{
						sprite:self
					});	
				}
			});


			//文本支持双击进入富文本编辑模式
			if(this.isText){
				element.on('dblclick',function(){
					//文本触发精灵双击编辑事件
					$(window).trigger('spriteTextEdit',{
						sprite:self
					});
				});
			}

			//取消非当前舞台的全局精灵选择
			$(window).on('pageSelect',function(){
				var e = arguments[1];
				var pageId = e.selectedPage.id;

				if(self.isGlobal){
					if(pageId != self.stage.id){
						self.lock();
					}
					else{
						self.unlock();
					}
				}
			});

			$(window).on('playAnimation',function(){
				var e = arguments[1];
				var stageId = e.framesBar.stageId;
				//对没有帧展示栏的精灵不做子子元素样式清除操作
				if(!self.getCommondFramesBar() && !self.hasEventFramesBar()) return;

				if(self.stage.id == stageId){
					// 拥有同类型的帧展示栏
					if((e.framesBar.emitType == 'none' && self.getCommondFramesBar()) || (e.framesBar.emitType == 'event' && self.getEventFramesBar(e.framesBar.emitEventName))){
						//播放动画的时候移除text-wrap元素的样式属性。交给精灵本身的样式处理
						if(self.isText){
							var	textElement = self.getTextElement();
							textElement.attr('style','');							
						}
						if(self.controller){
							var controllerWrapElement = self.getControllerWrapElement();	
							controllerWrapElement.attr('style','');
						}
					}

						
				}

			});
		},


		hideImg:function(){
			var element = this.getSpriteElement();
			element.addClass('sprite-invisible');
		},	
		showImg:function(){	
			var element = this.getSpriteElement();
			element.removeClass('sprite-invisible');
		},
		lock:function(){
			var element = this.getSpriteElement();
			element.addClass('locked');
			this.isLock = true;

		},
		unlock:function(){
			var element = this.getSpriteElement();
			element.removeClass('locked');

			this.isLock = false;
		},
		getTextContent:function(){
			return this.textContent;
		},
		getSpriteImgElement:function(){
			var spriteElement = this.getSpriteElement();
			if(!this.spriteImgElement){
				this.spriteImgElement = $('.sprite-img',spriteElement);
			}
			return this.spriteImgElement;
		},
		getSpriteElement:function(){
			if(!this.element || !this.element.length){
				this.element = $('#' + TMPL_NAME + '_' + this.id);
			}
			return this.element;
		},
		//精灵被选择
		select:function(){
			var element = this.getSpriteElement();

			if(element.hasClass('selected')){
				return;
			}
	
			element.addClass('selected');

			// //全局精灵设置的元素和普通精灵不一样
			// if(this.isGlobal){
			// 	var elementRoot = element.parent().parent();
			// 	elementRoot.addClass('selected');
			// }


			console.log('Sprite selected');

			//触发精灵选择的事件
			$(window).trigger('spriteSelect',{
				selectedSprite:this
			});

			//触发精灵选择的事件
			$(window).trigger('afterSpriteSelect',{
				selectedSprite:this
			});


		},
		//精灵取消选择
		unSelect:function(){
			var element = this.getSpriteElement();

			if(!element.hasClass('selected')){
				return;
			}

			element.removeClass('selected');

			// //全局精灵设置的元素和普通精灵不一样
			// if(this.isGlobal){
			// 	var elementRoot = element.parent().parent();
			// 	elementRoot.removeClass('selected');
			// }
		},
		//设置层级
		setZIndex:function(zIndex){
			var element = this.getSpriteElement();
			element.css({
				'z-index':zIndex
			});
			this.zIndex = zIndex;
			// //全局精灵设置的元素和普通精灵不一样
			// if(this.isGlobal){
			// 	var elementRoot = element.parent().parent();
			// 	elementRoot.css({
			// 		'z-index':zIndex + 999
			// 	});
			// }
		},
		getTextElement:function(){
			
			if(!this.textElement){
				var element = this.getSpriteElement();
				this.textElement = $('.text-wrap',element);
			}
			return this.textElement;
		},
		getControllerWrapElement:function(){
			if(!this.controllerWrapElement){
				var spriteElement = this.getSpriteElement();
				this.controllerWrapElement = spriteElement.find('.controller-wrap');
			}
			return this.controllerWrapElement;
		},
		//设置样式
		setStyle:function(setting){

			setting = $.extend(this,setting);

			var self = this;
			var element = this.getSpriteElement();
			var imgElement = this.getSpriteImgElement();
			var textElement = this.getTextElement();
			var controllerWrapElement = this.getControllerWrapElement();

			element.removeClass('running-sprite');

			element.data('elementCurrentAngle',setting.rotateZ * Math.PI / 180);


			// //精灵自己的自定义样式
			// if(this.spriteCustomSetting){
			// 	var spriteCssProperties = this.spriteCustomSetting;
			// }
			
			//应用于sprite元素的css对象	
			//var cssProperties = $.extend({},spriteCssProperties,self.convertSetting2CssProperties(setting));
			var cssProperties = this.getCssProperties();
			
			//应用于sprite子元素的css对象
			var childCssProperties = {
				'opacity':cssProperties['opacity'],
				'background-color':cssProperties['background-color'],
				'background-image':cssProperties['background-image'],
				'background-position':cssProperties['background-position'],
				'background-size':cssProperties['background-size'],
				'border-radius':cssProperties['border-radius'],  //圆角需要
				'border':cssProperties['border'],
				'border-width':cssProperties['border-width'],
				'border-style':cssProperties['border-style']
				
			};
			//缩放模式，并且不在初始状态（在帧展示栏的状态下），才使用scale缩放
			if(this.controllerMode == 0 && (this.getCommondFramesBar() || this.hasEventFramesBar())){
				childCssProperties['-webkit-transform'] = 'scale('+ this.width / this.initialSetting.width + ',' + this.height / this.initialSetting.height + ')';
				childCssProperties['-webkit-transform-origin'] = 'left top';
				childCssProperties['width'] = this.initialSetting.width;
				childCssProperties['height'] = this.initialSetting.height;
			}
			else{
				// childCssProperties['-webkit-transform'] = 'none';
				// childCssProperties['-webkit-transform-origin'] = 'center center';
				// childCssProperties['width'] = '100%';
				// childCssProperties['height'] = '100%';
			}

			

			// if(cssProperties.isHide){
			// 	cssProperties['-webkit-animation-timing-function'] = 'step-end';
			// 	cssProperties['width'] = 0;
			// 	cssProperties['height'] = 0;	
			// }
			// else{
		
			// }

			//隐藏
			if(cssProperties.isHide){
				cssProperties['display'] = 'none';	
			}
			else{
				cssProperties['display'] = 'block';	
			}
			

			//取消精灵的动画
			cssProperties['-webkit-animation-name'] = 'none';
			//暂时这样写
			cssProperties['-webkit-animation-timing-function'] = 'linear';
		
			if(this.imgUrl){
				imgElement.attr('style','');
				imgElement.css(childCssProperties);
			}
			if(this.isText){
				textElement.attr('style','');
				textElement.css(childCssProperties);
			}

			if(this.controller){
				controllerWrapElement.attr('style','');
				controllerWrapElement.css(childCssProperties);
			}
			


			//父元素不设置这些属性，设置在子元素上
			delete cssProperties['opacity'];
			delete cssProperties['background-color'];
			delete cssProperties['background-image'];
			
			delete cssProperties['background-size'];
			delete cssProperties['background-position'];

			delete cssProperties['border-radius'];
			delete cssProperties['border-style'];
			delete cssProperties['border-width'];
			delete cssProperties['border'];

			if(element[0]){
		

				//先删除原有的css属性，再重置
				element[0].style.cssText = '';	
				
				//使用关键帧属性覆盖精灵自定义属性，再写style
				// element.css($.extend({
				// 	//'background-image':self.imgUrl
				// },spriteCssProperties,cssProperties));

				element.css(cssProperties);

				//存在元件并且元件是填充模式，则元件随着精灵同比缩放
				if(this.controller){
					// if(this.controllerMode == 0){
					// 	this.controller.resize(this.width,this.height);
					// }
					// else{
					// 	this.controller.resize(this.controller.width,this.controller.height);
					// }
				}

				if(this.isText){
					// if(this.controllerMode == 0){
					// 	//缩放文本
					// 	this.resizeText();
					// }
					// else{
					// 	this.removeResizeText();
					// }

				}
				//如果还没有普通帧展示栏，则把设定设置为初始设定
				if(!this.getCommondFramesBar() && !this.hasEventFramesBar()){
					this.initialSetting = this.getSetting();
				}


				console.log('Sprite set style');
			}
		},
		// //消除文本缩放
		// removeResizeText:function(){
		// 	this.textWrapElement.css({
		// 		'width':'100%',
		// 		'height':'100%',
		// 		'-webkit-transform':'scale(1,1)',
		// 		'-webkit-transform-origin': 'left top'
		// 	});
		// },
		//缩放文本
		// resizeText:function(){
		// 	var initialWidth = this.initialWidth;
		// 	var initialHeight = this.initialHeight;
			
		// 	this.textWrapElement.css({
		// 		'width':this.initialWidth,
		// 		'height':this.initialHeight,
		// 		'-webkit-transform':'scale(' + this.width / initialWidth + ',' + this.height / initialHeight +')',
		// 		'-webkit-transform-origin': 'left top'
		// 	});
		// },
		getInitialSetting:function(){
			return this.initialSetting;
		},
		//获取该精灵所有的帧展示栏
		getAllFramesBars:function(){
			if(this.framesbar){
				return [this.framesbar].concat(this.getEventFramesBar());
			}
			else{
				return this.getEventFramesBar();
			}
	
		},
		//获取设定
		getSetting:function(){

			var param = {
				display:this.display,
				imgUrl:this.imgUrl || '',
				imgFileName:this.imgFileName,
				name:this.name,
				className:this.className,
				width:this.width,
				height:this.height,
				x:this.x,
				y:this.y,
				zIndex:this.zIndex,
				backgroundColor:this.backgroundColor || 'transparent',
				rotateZ:this.rotateZ,
				rotateX:this.rotateX,
				rotateY:this.rotateY,
				skewX:this.skewX,
				skewY:this.skewY,
				perspective:this.perspective,
				controllerRenderData:this.controllerRenderData,
				opacity:this.opacity,
				controllerMode:this.controllerMode,
				spriteCustomSetting:this.spriteCustomSetting,
				isText:this.isText,
				textContent:this.textContent,
				clickActionEventName:this.clickActionEventName,
				clickActionJumpNext:this.clickActionJumpNext,
				isSingle:this.isSingle,
				customSetting:this.customSetting,
				isGlobal:this.isGlobal,
				initialWidth:this.initialSetting && this.initialSetting.width,
				initialHeight:this.initialSetting && this.initialSetting.height
				//controllerMode:this.controller && this.controller.mode
			};

			//param.initialWidth =this.initialSetting ? this.initialSetting.width : this.width;
			//param.initialHeight = this.initialSetting ? this.initialSetting.height : this.height;

			return param; 
		},
		//转换设置对象到css属性对象
		convertSetting2CssProperties:function(setting){

			var css_obj = {};
			var img_css_obj = {};
			var tf_str = '';
			if(typeof setting.display != 'undefined'){
				if(setting.display == 'none'){
					css_obj['isHide'] = true;

					return css_obj;
				}
			}
		
			if(typeof setting.imgUrl != 'undefined'){
				css_obj['background-image'] = setting.imgUrl ? 'url(' + setting.imgUrl + ')' : 'none';
			}

			if(typeof setting.backgroundColor != 'undefined'){
				css_obj['background-color'] = setting.backgroundColor;
			}	

			if(typeof setting.opacity != 'undefined'){	
				css_obj['opacity'] = setting.opacity;	
			}
			if(typeof setting.zIndex != 'undefined'){	
				css_obj['zIndex'] = setting.zIndex;	
			}

			if(typeof setting.perspective != 'undefined'){
				tf_str += 'perspective(' + setting.perspective + ') ';
			}


			if(typeof setting.x != 'undefined'){
				tf_str += 'translateX(' + setting.x +'px) ';
			}


			if(typeof setting.y != 'undefined'){
				tf_str += 'translateY(' + setting.y +'px) ';
			}


			if(typeof setting.rotateX != 'undefined'){
				tf_str += 'rotateX(' + setting.rotateX +'deg) ';
			}


			if(typeof setting.rotateY != 'undefined'){
				tf_str += 'rotateY(' + setting.rotateY +'deg) ';
			}

			if(typeof setting.rotateZ != 'undefined'){
				tf_str += 'rotateZ(' + setting.rotateZ +'deg) ';
			}



			if(typeof setting.skewX != 'undefined'){
				tf_str += 'skewX(' + setting.skewX + 'deg) ';
			}


			if(typeof setting.skewY != 'undefined'){
				tf_str += 'skewY(' + setting.skewY + 'deg) ';
			}
			
			// 非文本，增加3d变形
			tf_str += 'translateZ(0)';
			
			

			// //使用缩放替换简单的宽高拉伸(test)
			// var initialWidth = this.initialSetting.width;
			// var initialHeight = this.initialSetting.height;
			// var x = setting.x;
			// var y = setting.y;
			// var w,h;

			// if(typeof setting.width != 'undefined'){
			// 	w = setting.width;
			// }

			// if(typeof setting.height != 'undefined'){
			// 	h = setting.height;
			// }

			// //比例缩放
			// if(!this.controllerMode){

			// 	if(x != null){
			// 		x = x + (setting.width - initialWidth) / 2;
			// 	}
			// 	if(y != null){
			// 		y = y + (setting.height - initialHeight) / 2;
			// 	}
				
			// 	if(w != null){
			// 		scaleX = w / initialWidth;
			// 	}
			// 	if(h != null){
			// 		scaleY = h / initialHeight;
			// 	}

			// 	if(typeof scaleX != 'undefined' && scaleX != 1){
			// 		tf_str += 'scaleX(' + scaleX + ') ';
			// 	}

			// 	if(typeof scaleY != 'undefined' && scaleY != 1){
			// 		tf_str += 'scaleY(' + scaleY + ') ';
			// 	}
	
			// 	css_obj['width'] = initialWidth;
			// 	css_obj['height'] = initialHeight;					
			// }
			// //固定尺寸
			// else{
			// 	css_obj['width'] = setting.width;
			// 	css_obj['height'] = setting.height;		
			// }





			css_obj['-webkit-transform'] = tf_str;	



			if(typeof setting.easing != 'undefined' && setting.easing != 'none'){	
				css_obj['-webkit-animation-timing-function'] = setting.easing;
			}

			if(typeof setting.width != 'undefined'){
				css_obj['width'] = setting.width;
			}

			if(typeof setting.height != 'undefined'){
				css_obj['height'] = setting.height;
			}




			//存在自定义css属性
			if(typeof setting.customSetting != 'undefined'){
				css_obj = $.extend(css_obj,setting.customSetting);
			}

			return css_obj;
		},

		getCssProperties:function(){
			var setting = this.getSetting();
			//精灵自己的自定义样式
			if(this.spriteCustomSetting){
				var spriteCssProperties = this.spriteCustomSetting;
			}
			return $.extend({},spriteCssProperties,this.convertSetting2CssProperties(setting));
		},
		getInitialCssProperties:function(){
			var setting = this.getInitialSetting();
			//精灵自己的自定义样式
			if(this.spriteCustomSetting){
				var spriteCssProperties = this.spriteCustomSetting;
			}
			return $.extend({},spriteCssProperties,this.convertSetting2CssProperties(setting));
		},

		//渲染
		render:function(){
			var opt = {
				id:TMPL_NAME + '_' + this.id
			};

			//使用图片
			if(this.imgUrl){
				opt.imgUrl = this.imgUrl;
			}
			//使用元件而不是图片
			else if(this.controllerRenderData){
				opt.useController = true;
			}
			else if(this.isText){
				opt.isText = true;
			}

			
			//精灵模板串
			var spriteTmplStr = tmpl[TMPL_NAME](opt);

			//全局精灵和非全局精灵放在不同地方
			if(this.isGlobal){
				this.addToGlobal(spriteTmplStr);
			}
			else{
				this.addToStage(spriteTmplStr);
			}


			var spriteElement = this.getSpriteElement();
			//文本内容容器
			this.textWrapElement = spriteElement.find('.text-wrap');

			if(this.textContent){
				this.setTextContent(this.textContent);
			}

			

		},
		getZIndex:function(){
			return this.zIndex;
		},
		//移除
		remove:function(){
			var element = this.getSpriteElement();
			element.remove();
			this.element = null;
			//删除监听的自定义事件
			this.removeAnimationCustomEvent();

			if(this.controller){
				this.controller.remove();
			}
			//触发精灵删除事件
			$(window).trigger('spriteDelete',{
				sprite:this
			});
	

		}
	};

	return Sprite;
});