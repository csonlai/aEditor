
(function (window, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(['transition'],factory);
    } else {
        window.MainPage = factory(window.Transition);
    }
})(this,function(Transition){

	//当前页索引
	var currentIndex = 0;
	//舞台列表
	var stageList;
	//精灵元素键值表
	var spriteElementMap = {};
	var controllerMap = {};
	//元素初始样式保存表
	var firstCssPropertyMap;
	//页面宽度
	var winWidth = window.innerWidth;
	var winHeight = window.innerHeight;
	//是否在手机端打开
	var isMobile = $.os && ($.os.ios || $.os.android);
	//事件记录表
	var eventHandlerMap = {};
	//点击行为记录表
	var clickActionMap;
	//当前动画播放方向
	var currentStageTransitionDirection;
	//当前舞台动画对象
	var currentStageTransitionObj;
	//是否展示类名
	var showClassName;
	//已加载资源的数量
	var loadedCount = 0;
	//全局精灵的包装元素
	var globalSpriteWrap;




	var T;

	//低于android 4.0的系统
    var isUnderAndroid4 = $.os && $.os.android && Number($.os.version.split('.')[0]) < 4;

    function __onImgResourceLoaded(callback,totalCount){

    	return function(){
    		loadedCount ++;
    		//百分比
    		callback && callback(~~(loadedCount / totalCount * 100));
    	}


    };

	function getRandomId(){
		return ~~(Math.random() * 1e8);
	};

	function nextPageHandler(){
		var animationObject = MainPage.animationObjectsList[currentIndex];
		if(/*animationObject.slideJump &&*/ currentIndex < stageList.length - 1){
			MainPage.next();
		}
	};

	function prePageHandler(){

		var animationObject = MainPage.animationObjectsList[currentIndex];
		if(/*animationObject.slideJump &&*/ animationObject.preJump && currentIndex > 0){
			MainPage.pre();
		}
	};


    //hack android2.3下需要过滤的3d变形属性,避免3d变形属性导致变形失效的bug
    function filterAndroid23Transform(transformString){
        return transformString.replace(/translateZ\(.*?\)/g,'')
                       .replace(/rotateX\(.*?\)/g,'')
                       .replace(/rotateY\(.*?\)/g,'')
                       .replace(/rotateZ/g,'rotate')
                       .replace(/translateZ\(.*?\)/g,'')
                       .replace(/perspective\(.*?\)/g,'');
    };

    function processMobileTransform(transformString){ 

    	if(isUnderAndroid4){
    		transformString = filterAndroid23Transform(transformString);
    	}
    
        // var str = transformString.replace(/translateX\((.*?)\)/g,function(str,value){
        //     var value = Number(value.replace('px',''));
        //     return 'translateX(' + ((value / 320) * winWidth) + 'px)';
        // });
        // .replace(/translateY\((.*?)\)/g,function(str,value){
        //     var value = Number(value.replace('px',''));
        //     return 'translateY(' + ((value / 480) * winHeight) + 'px)';
        // });

       
		return transformString;
        //return str;
        
    };


	var MainPage = {
		init:function(opt){
			opt = opt || {};
			this.showArea = $('.main-show-area');
			this.showClassName(opt.showClassName);
			this.bind();
		},
		bind:function(){
			//防止ios下滚动条出现
			this.showArea.on('touchmove',function(e){
				e.preventDefault();
			});

		},	
		bindSwipeHandler:function(){

			//上到下
			if(currentStageTransitionDirection == 'utd'){
				this.showArea.bind('swipeDown',prePageHandler);
				this.showArea.bind('swipeUp',nextPageHandler);
			}
			//左到右
			else{
				this.showArea.bind('swipeRight',prePageHandler);
				this.showArea.bind('swipeLeft',nextPageHandler);
			}
		},
		//去掉特定舞台上得所有精灵的动画属性
		_resetSpritesAnimationByStage:function(stageElement){
			//去掉舞台内所有精灵的动画属性
			var spriteList = stageElement.find('.ms-sprite');
			spriteList.each(function(i,spriteElement){
				//精灵dom的id
				var spriteElementId = spriteElement.id;
				//根据id找到该元素的初始css属性
				var firstCssProperty = firstCssPropertyMap[spriteElementId];
				//恢复初始css属性,让元素在翻页时，初始位置正确，为动画开始位置
				$(spriteElement).css(firstCssProperty);
			});
			stageElement.addClass('ms-no-animation');
		},
		_resumeSpritesAnimationByStage:function(stageElement){
			stageElement.removeClass('ms-no-animation');
		},
		//绑定舞台翻页动画结束事件
		_bindStageAnimationEnd:function(stageElement){
			var self = this;
			stageElement.on('webkitAnimationEnd',function(){
				var index = stageElement.data('index');
			
				//该页里精灵的动画
				if(index == currentIndex){
					//页面进入完成的事件通知
					$(window).trigger('pageEnterFinish',{
						pageIndex:index,
						from:'main_show',
						isGlobalEvent:1
					});

					//页面进入完成的事件通知
					$(window).trigger('pageEnterFinish' + index,{
						isGlobalEvent:1,
						from:'main_show'
					});

					self.run();

				}
				else{
					//页面离开完成的事件通知
					$(window).trigger('pageLeaveFinish',{
						pageIndex:index,
						isGlobalEvent:1
					});	

					//页面进入完成的事件通知
					$(window).trigger('pageLeaveFinish' + index,{
						isGlobalEvent:1
					});				
				}
			});
		},
		_bindClickAction:function(t,from){
			var self = this;
		
			var handler;
			if(t.clickActionJumpNext || t.clickActionEventName){
				//点击精灵元素触发动画
				handler = function(){
					var stageElement = t.elem.closest('.ms-stage');

					if(t.clickActionEventName){
						//触发特定事件
						$(window).trigger(t.clickActionEventName,{
							stageElementIndex:stageElement.data('index'),
							from:from
						});
					}
					//点击精灵元素跳到下一页
					if(t.clickActionJumpNext && t.stageIndex == currentIndex){
						//播放下一页
						self.next();
					}
				};
			
				//保证同一个元素事件只绑定一次
				if(!clickActionMap){
					clickActionMap = {};
				}
				if(clickActionMap[t.id]){
					t.elem.off('click',handler);
				}

				clickActionMap[t.id] = handler;
				
				t.elem.on('click',handler);
			}
			
		},
		//添加所有元素
		addElements:function(animationObjectsList){
			var self = this;

			$.each(animationObjectsList,function(i,ao){
				var stageElement = self.addStage();


				//第一页增加current类
				if(i == 0){
					stageElement.addClass('pt-page-current');
				}

				//添加到舞台元素列表
				stageList.push(stageElement);

				//设置索引值
				stageElement.data('index',i);

				var cssParam = {
					'z-index':100 - i,
					'background-image':ao.backgroundImage ? 'url(' + ao.backgroundImage + ')' : 'none',
					'background-color':ao.backgroundColor ? ao.backgroundColor : '#FFF'
				};



				//元件模式点击全部播放，元件动画居中显示
				if(ao.isControllerPreview){

					$.extend(cssParam,{
						width:ao.width,
						height:ao.height,
						left:'50%',
						top:'50%',
						'margin-left' : -ao.width / 2,
						'margin-top' : -ao.height/2						
					});		
				}
			

				//设置层级
				stageElement.css(cssParam);	

				//动画结束，去掉transition动画属性,运行下一个舞台的动画
				self._bindStageAnimationEnd(stageElement);



				self.createSingle(ao,stageElement);

				//该页动画完成之后自动跳转
				ao.totalCallback = function(){
					//该页动画播放完的事件通知
					$(window).trigger('pageAnimationFinish',i);

					//允许自动跳转
					if(ao.autoJump && currentIndex == i){
						//self.run();
						//跳到下一个舞台元素
						//self.jumpTo(currentIndex + 1);
						self.next();
					}
				};

			});

		},
		//加载资源
		loadResource:function(imgUrlsMap,callback){
			loadedCount = 0;

			var totalCount = Object.keys(imgUrlsMap).length;
			if(totalCount == 0){
				callback && callback(100);
				return;
			}
			$.each(imgUrlsMap, function(imgUrl){
				var newImg = new Image();
				newImg.onload = newImg.onerror = __onImgResourceLoaded(callback,totalCount);
				newImg.src = imgUrl;


			});
		},
		//设置资源加载回调,用于显示加载百分比
		setResourceLoadedCallback:function(callback){
			this.resourceLoadedCallback = callback;
		},
		create:function(animationObject){

			if(!animationObject){
				return;
			}

			var self = this;
			//需要加载的图片列表
			var imgUrlsMap = animationObject.imgUrlsMap;

			//初始化当前页索引
			currentIndex = 0;
			//初始化舞台列表
			stageList = [];

			animationObjectsList = $.extend(true,[],animationObject.list);
		
			//动画序列
			this.animationObjectsList = animationObjectsList;

			if(!animationObjectsList.length) return;



			currentStageTransitionObj = animationObject.currentStageTransitionObj;
			currentStageTransitionDirection = animationObject.currentStageTransitionDirection;
			
			//绑定swipe处理
			this.bindSwipeHandler();
			//加载完资源后开始
			this.loadResource(imgUrlsMap,function(percent){
				//提供外部检查百分比，显示百分比动画的机会
				if(self.resourceLoadedCallback){
					self.resourceLoadedCallback(percent);
				}
			
				//资源加载完成,开始运行
				if(percent == 100){

					//添加所有元素
					self.addElements(animationObjectsList);

					self.run();
				}
			});



				

			
		},
		showClassName:function(show){
			showClassName = show;
			if(show){
				this.showArea.addClass('show-class-name');
			}
			else{
				this.showArea.removeClass('show-class-name');
			}
		},

		createSingle:function(ao,stageElement,isFromEdit){
		
			spriteElementMap = {};
			controllerMap = {};

			var self = this;
			//元素动画数组 
			var transitionArr = ao.transitionArr;

			$.each(transitionArr,function(j,t){

				//新元素
				var newElement = self.addNewElement(t,stageElement,isFromEdit);
				//用新元素赋值
				spriteElementMap[t.id] = t.elem = newElement;
				controllerMap[t.id] = t.controllerSingle;

				//所在舞台索引
				t.stageIndex = Number(stageElement.data('index'));

				if(t.className && isMobile){
					//设置用户指定的类名	
					newElement.addClass(t.className);
					//获取用户填充的元素内容
					var elementContent = $('#' + t.className + '_content').html();

					if(elementContent){
						//填充元素内容
						newElement.html(elementContent);
					}

				}
				//绑定动画结束行为
				self._bindEndAction(t,'main_show');

				//绑定精灵点击行为
				self._bindClickAction(t,'main_show');
			});

			//事件触发的动画键值表
			var eventTransitionArr = ao.eventTransitionArr;
		
			$.each(eventTransitionArr,function(i,eventTransitonObj){
				var eventName = eventTransitonObj.emitEventName;
				var et = $.extend(true,{},eventTransitonObj.animationObj);
				
				//事件对应精灵元素
				var spriteElement = spriteElementMap[et.id];
				var controllerSingle = controllerMap[et.id];
				// //只有事件帧展示栏的元素
				// if(!spriteElement){
				// 	spriteElement = self.addNewElement(t,stageElement,isFromEdit);
				// }
	
				//用新元素赋值
				et.elem = spriteElement;

				var eventHandler = function(){
					var et = arguments.callee.et;
					var e = arguments[1] || {};
					var stageElement = et.elem.closest('.ms-stage');
					
					//区分来源，避免编辑区和播放区动画由于同时监听同一个事件，或者是全局事件,同时播放
					if(e && e.from == 'main_show' && (e.stageElementIndex == stageElement.data('index') || e.isGlobalEvent) ){
					
						//绑定动画结束行为
						self._bindEndAction(et,'main_show');

						Transition.playSingle(et);
						//如果有元件，播放元件动画
						if(controllerSingle && et.isControllerPlay){
							self.runSingle(controllerSingle);
						}

					}
				};
				eventHandler.et = et;
				var elementId = et.elem.prop('id');
				//记录哪些事件该精灵元素已经绑定过，避免重新监听。（一个精灵同一种事件只能监听一次）
				if(!eventHandlerMap){
					eventHandlerMap = {};
				}
				if(!eventHandlerMap[elementId]){
					eventHandlerMap[elementId] = {};
				}

				eventHandlerMap[elementId][eventName] = eventHandler;
	
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


		_bindEndAction:function(t,from){
			var self = this;
			//存在动画结束要触发的事件名和动画结束要跳转到下一页
			if(t.animationEndEventName || t.animationEndJumpNext){
				//动画结束触发对应事件
				t.callback = function(){

					var stageElement = $(t.elem).closest('.ms-stage');
					

					if(t.animationEndEventName){
						//触发特定的动画结束事件
						$(window).trigger(t.animationEndEventName,{
							from:from,
							stageElementIndex:stageElement.data('index')
						});
					}
					//动画结束后，如果当前页还是该元素所在页，则进行跳转
					if(t.animationEndJumpNext && currentIndex == t.stageIndex){
						self.next();
					}
				};
			}
		},
		//跳到下一页/上一页
		jumpTo:function(isNext){
			var index = isNext ? currentIndex + 1 : currentIndex - 1;
			//要应用翻页动画的舞台
			var stageElement = stageList[currentIndex];
			//要跳到的舞台
			var targetStargeElememt = stageList[index];
			//要跳到的舞台的obj
			var targetAnimationObject = this.animationObjectsList[index];
			//要离开的舞台obj
			var animationObject = this.animationObjectsList[currentIndex];
			//触发翻页行为事件
			if(animationObject.actionEventName){	
				$(window).trigger(animationObject.actionEventName,{
					from:'main_show',
					stageElementIndex:currentIndex
				});
				
			}

	


			//触发离开某页的事件
			$(window).trigger('pageLeave',{
				pageIndex:currentIndex,
				isGlobalEvent:1,
				from:'main_show'
			});

			//触发离开某页的事件
			$(window).trigger('pageLeave' + currentIndex,{
				isGlobalEvent:1,
				from:'main_show'
			});


			//触发进入某页的事件
			$(window).trigger('pageEnter',{
				pageIndex:index,
				isGlobalEvent:1,
				from:'main_show'
			});

			//触发进入某页的事件
			$(window).trigger('pageEnter' + index,{
				isGlobalEvent:1,
				from:'main_show'
			});


			if(typeof currentIndex != 'undefined'){

				var transitionTypeObj = currentStageTransitionObj[currentIndex < index ? 'down' : 'up'];

				var inClass = transitionTypeObj['inClass'];
				var outClass = transitionTypeObj['outClass'];
			
				stageElement[0].className = 'ms-stage ' + outClass;
				targetStargeElememt[0].className = 'ms-stage ' + inClass + ' pt-page-current';
			}

			//播放翻页动画前删除要跳到的舞台上的所有精灵原有动画属性
			if(targetAnimationObject.played && targetAnimationObject.replay){
				this._resetSpritesAnimationByStage(targetStargeElememt);
			}

			currentIndex = index;
		},
		//跳到上一个舞台
		pre:function(){
			this.jumpTo();
		},
		//跳到某下一个舞台
		next:function(){
			this.jumpTo(true);
		},
		runSingle:function(animationObject){
			T = new Transition();
			T.add(animationObject);
			T.run();	
			return T;	
		},
		//运行动画
		run:function(){

			$(window).trigger('beforeRun');

			var self = this;
			//Transition.stop();
			var animationObject = this.animationObjectsList[currentIndex];

			//移除禁止动画属性
			this._resumeSpritesAnimationByStage(stageList[currentIndex]);

			if(animationObject && (!animationObject.played || animationObject.replay)){
				this.runSingle(animationObject);
				//标记已经播放过
				animationObject.played = true;
				//播放元件动画
				$.each(animationObject.transitionArr,function(i,transitionObj){
					//有元件并且允许同时播放元件动画
					if(transitionObj.controllerSingle && transitionObj.isControllerPlay){
						self.runSingle(transitionObj.controllerSingle);
					}
				});
			}

			$(window).trigger('afterRun');

		},

		//创建一个新的元素
		addNewElement:function(transitionObj,stageElement,isFromEdit){
	
			var self = this;
			var controllerSingle;
			var controllerWrap;
			var controllerRenderData = transitionObj.controllerRenderData;
			var stageContainerElement = $(stageElement.find('.ms-stage-container'));
			//元件
			if(controllerRenderData){
				controllerWrap = $('<div></div>',{
					class:'ms-controller-wrap'
				});
				var container = $('<div></div>',{
					class:'ms-stage-container'
				});

				controllerWrap.append(container);

				controllerSingle = self.createSingle(controllerRenderData,controllerWrap);
			}
	
			var elementId = (isFromEdit ? 'controller_sprite_' : 'ms_') + getRandomId()/*transitionObj.id*/ ;
			var newElement = $('<div></div>',{
				id:elementId,
				class:isFromEdit ? 'controller-sprite' : 'ms-sprite' + ' ' + transitionObj.className
			});

			//文本内容
			if(transitionObj.textContent){
				newElement.html(transitionObj.textContent);
			}

			//显示类名
			if(showClassName){
				var classNameTag = $('<div></div>',{
					class:'ms-sprite-class-name-tag'
				});
				classNameTag.text(transitionObj.name);
				newElement.append(classNameTag);
			}

			var cssObj = {
				'z-index':transitionObj.zIndex					
			};

			//扩展精灵的自定义样式属性
			if(transitionObj.spriteCustomSetting){
				$.extend(cssObj,transitionObj.spriteCustomSetting);
			}

			if(transitionObj.imgUrl){
				cssObj['background-image'] = 'url(' + transitionObj.imgUrl + ')';
			}
			// else if(!isMobile && !controllerRenderData){
			// 	newElement.addClass('ms-sprite-empty-container');
			// }

			//newElement.css(cssObj);
			if(transitionObj.keyframes && !$.isEmptyObject(transitionObj.keyframes)){

				//以第一个关键帧的css属性设置新元素的初始属性
				var firstCssProperty = $.extend(cssObj,transitionObj.keyframes['0%']);
				delete firstCssProperty['-webkit-animation-timing-function'];



				//mobile环境下得变形字符串处理
				if(isMobile && !newElement.data('xConvert')){
					firstCssProperty['-webkit-transform'] = processMobileTransform(firstCssProperty['-webkit-transform']);
					//标识该元素已经转换过
					newElement.data('xConvert',1);
				}


				firstCssProperty.width = Number(firstCssProperty.width);
				firstCssProperty.height = Number(firstCssProperty.height);

				newElement.css(firstCssProperty);



				//保存初始样式，用于翻页时恢复
				if(!firstCssPropertyMap){
					firstCssPropertyMap = {};
				}
				firstCssPropertyMap[elementId] = firstCssProperty;
			}
			//只有精灵没有帧展示栏
			else{
				newElement.css($.extend({
					'z-index':transitionObj.zIndex
				},transitionObj.spriteCssProperties));
			}


			if(controllerWrap){
				controllerWrap.appendTo(newElement);
				transitionObj.controllerSingle = controllerSingle;
			}
			//全局精灵
			if(transitionObj.isGlobal){
				if(!globalSpriteWrap){
					globalSpriteWrap = $('<div></div>',{
						class:'ms-global-sprite-wrap'
					});
					globalSpriteWrap.appendTo(this.showArea);
				}
				
				newElement.appendTo(globalSpriteWrap);
				
			}
			else{
				//新元素添加到舞台
				newElement.appendTo(stageContainerElement);				
			}




			return newElement;
		},
		addStage:function(){
			//增加一个舞台元素
			var stageElement = $('<div></div>',{
				class:'ms-stage'
			});
			//舞台容器
			var stageContainerElement = $('<div></div',{
				class:'ms-stage-container'
			});

			stageElement.append(stageContainerElement);
			stageElement.appendTo(this.showArea);

			return stageElement;
		},
		removeAllAnimationStyle:function(){
			$('.animation-style').remove();
		},
		//清空容器
		clear:function(){
			this.showArea.html('');
		},
		remove:function(){
			globalSpriteWrap = null;
			this.showArea.html('');
			//删除所有舞台上的精灵的动画
			T && T.stop();
			this.clear();
			this.removeAllAnimationStyle();
			this.removeAllEventHandler();
		},
		removeAllEventHandler:function(){
		
			$.each(eventHandlerMap,function(id,eventObj){
				$.each(eventObj,function(eventName,handler){
					$(window).off(eventName,handler);
				});
			});

			eventHandlerMap = {};

			this.showArea.off('swipeDown',this.prePageHandler);

			this.showArea.off('swipeUp',this.nextPageHandler);	

			this.showArea.off('swipeRight',this.prePageHandler);

			this.showArea.off('swipeLeft',this.nextPageHandler);	
					
		}

	};

	return MainPage;


});