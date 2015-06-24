define(['tmpl','util','main_page','transition'],function(tmpl,Util,MainPage,Transition){	
	//元件构造函数
	function Controller(opt){
		this.init(opt);
	};

	var T;

	function getRandomId(){
		return ~~(Math.random() * 1e8);
	};

	Controller.prototype = {
		init:function(opt){
			var controllerRenderData = opt.controllerRenderData;

			this.controllerRenderData = controllerRenderData;
			this.container = opt.container;
	
			this.id = controllerRenderData.id;
			this.name = controllerRenderData.name;
			this.width = controllerRenderData.width;
			this.height = controllerRenderData.height;

			this.eventHandlerMap = {};

			//设置元件填充模式
			this.setMode(controllerRenderData.mode);//0 填充 1 裁剪
			
			this.render();
			this.bind();



		},
		setMode:function(mode){
			this.mode = mode || 0;
		},
		render:function(){

			//元件元素
			var controllerElement = $('<div></div>',{
				id:Util.getRandomId(),
				class:'controller'
			});
			controllerElement.css({
				width:this.width,
				height:this.height
			});

			this.element = controllerElement;
			this.appendTo(this.container);

			var controllerRenderData = $.extend(true,{},this.controllerRenderData);

			this.animationObject = this.create(controllerRenderData,this.element,true);
		},
		resize:function(w,h){

			this.scaleX = w / this.width;
			this.scaleY = h / this.height;
			this.element.css({
				'-webkit-transform':'scaleX(' + this.scaleX +') scaleY(' + this.scaleY + ')',
				'-webkit-transform-origin':'left top'
			});
		},
		//是在编辑舞台里
		isInEditStage:function(){
			return this.element.closest('.stage').length > 0;
		},
		//事件绑定
		bind:function(){
			var self = this;
			//双击进入编辑状态
			this.element.parent().on("dblclick",function(){
				if(self.isInEditStage()){
					//触发编辑事件
					$(window).trigger('controllerEdit',{
						controller:self
					});
				}
			});
		},

		//设置元件精灵列表的所有精灵的样式
		setSpriteListElementStyle:function(cssObj){
			var spriteElementList = $('.controller-sprite',this.element);
			if(typeof cssObj == 'object'){
				$(spriteElementList).each(function(i,spriteElement){
					$(spriteElement).css(cssObj);
				});
			}
			else if(typeof cssObj == 'function'){
				$(spriteElementList).each(cssObj);		
			}
		},

		//创建一个新的元素
		addNewElement:function(transitionObj,stageElement,isFromEdit){

			var self = this;
			var controllerSingle;
			var controllerWrap;
			var firstCssProperty;
	
			var elementId = (isFromEdit ? 'controller_sprite_' : 'ms_') + getRandomId()/*transitionObj.id*/ ;
			var newElement = $('<div></div>',{
				id:elementId,
				class:isFromEdit ? 'controller-sprite' : 'ms-sprite'
			});

			var cssObj = {
				'z-index':transitionObj.zIndex					
			};

			if(transitionObj.imgUrl){
				cssObj['background-image'] = 'url(' + transitionObj.imgUrl + ')';
			}

			if(transitionObj.textContent){
				newElement.html(transitionObj.textContent);
			}

			//newElement.css(cssObj);

			if(transitionObj.keyframes){
				firstCssProperty = $.extend(cssObj,transitionObj.spriteCustomSetting,transitionObj.keyframes['0%']);

				delete firstCssProperty['-webkit-animation-timing-function'];
			}
			else{
				firstCssProperty = $.extend(cssObj,transitionObj.spriteCustomSetting,transitionObj.spriteCssProperties);
			}
			
			
			newElement.css(firstCssProperty);
			//新元素添加到舞台
			newElement.appendTo(stageElement);

			transitionObj.firstCssProperty = firstCssProperty;

			return newElement;
		},

		create:function(ao,stageElement,isFromEdit){

			var spriteElementMap = {};

			var self = this;
			//元素动画数组 
			var transitionArr = ao.transitionArr;

			$.each(transitionArr,function(j,t){

				var newElement = self.addNewElement(t,stageElement,isFromEdit);

				//用新元素赋值
				spriteElementMap[t.id] = t.elem = newElement;

				//绑定动画结束行为
				MainPage.__bindEndAction(t,'edit');

				//绑定精灵点击行为
				MainPage.__bindClickAction(t,'edit');
			});

			//事件触发的动画键值表
			var eventTransitionArr = ao.eventTransitionArr;
		
			$.each(eventTransitionArr,function(i,eventTransitonObj){
				var eventName = eventTransitonObj.emitEventName;
				//var et = $.extend(true,{},eventTransitonObj.animationObj);
				var et = eventTransitonObj.animationObj;

				//事件对应精灵元素
				var spriteElement = spriteElementMap[et.id];

				//用新元素赋值
				et.elem = spriteElement;

				var eventHandler = function(){
					//var et = arguments.callee.et;
					var e = arguments[1];

					if(e.from == 'edit'){
						//绑定动画结束行为
						MainPage.__bindEndAction(et,'edit');

						Transition.playSingle(et);
					}
					
				};
				//eventHandler.et = et;


				//记录哪些事件该精灵元素已经绑定过，避免重新监听。（一个精灵同一种事件只能监听一次）
				
				if(!self.eventHandlerMap[et.id]){
					self.eventHandlerMap[et.id] = {};
				}

				if(self.eventHandlerMap[et.id][eventName]){
					$(window).off(eventName,self.eventHandlerMap[et.id][eventName]);
					self.eventHandlerMap[et.id][eventName] = null;
				}

				self.eventHandlerMap[et.id][eventName] = eventHandler;
	
					

				if(eventTransitonObj.isListenOnce){
					//监听事件一次，播放对应行为动画
					$(window).one(eventName,eventHandler);		
				}
				else{
					//监听事件，播放对应行为动画
					$(window).on(eventName,eventHandler);					
				}
				

			});	
			
			return ao;
		},
		playAnimation:function(){
		
			var ao = this.animationObject;

			//播放动画
			this.T = new Transition();
			this.T.add(ao);
			this.T.run();
			
		},

		pauseAnimation:function(){
			this.T && this.T.pause();
		},
		resumeAnimation:function(){
			this.T && this.T.resume();		
		},
		stopAnimation:function(){
			$.each(this.animationObject.transitionArr,function(i,transitionObj){
				var elem = transitionObj.elem;
				var firstCssProperty = transitionObj.firstCssProperty;
				
				elem.css(firstCssProperty);
			});

			this.T && this.T.stop();
		},
		//添加到某个容器
		appendTo:function(container){
			$(container).append(this.element);
		},
		getControllerElement:function(){
			return this.element;
		},
		removeAllEventHandler:function(){
		
			$.each(this.eventHandlerMap,function(id,eventObj){
				$.each(eventObj,function(eventName,handler){
					$(window).off(eventName,handler);
				});
			});
			this.eventHandlerMap = {};
		},
		remove:function(){
			this.removeAllEventHandler();
			this.stopAnimation();
			this.element.remove();
		},
		getData:function(){
			return this.data;
		}
	};

	return Controller;
});