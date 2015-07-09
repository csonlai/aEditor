define(['tmpl','sprite','util','dropmenu','controller','sprite-action-setting','sprite_event_animation_setting','background_setting','stage_transition_config','layer-size-setting'],function(tmpl,Sprite,Util,DropMenu,Controller,SpriteActionSetting,SpriteEventAnimationSetting,BackgroundSetting,StageTransitionConfig,layerSizeSetting){

	var TMPL_NAME = 'stages';
	//保存所有舞台元素
	var stageObjs = [];
	//舞台高度
	var stageHeight = 0;
	//当前舞台索引
	var currentStageIndex;
	//当前选中的精灵
	var currentSprite;
	//选中的用于复制的精灵对象
	var copySprite;
	//鼠标右击相对于舞台的位置
	var stageX,stageY;
	//是否在播放动画
	//var isRunningAnimation;

	//当前舞台切换动画类型
	var currentStageTransitionType;
	var currentStageTransitionDirection;
	//当前选中frame的setting
	var currentFrameSetting;
	//全局富文本对象
	var globalRichEditor;
	//当前处于编辑状态的精灵
	var currentEditSprite;
	// 当前作品id
	var currentWorkId;
	//全局精灵包装元素
	var globalSpriteWrap;




	//舞台对象构造函数
	var Stage = function(opt){
		this.init(opt);
	};
	//选择了帧
	function onFrameOrKeyFrameSelect(){
		var e = arguments[1];
		//所选关键帧
		var selectedFrame = e.frame || e.keyFrame.frame;
		var selectedFrameIndex = selectedFrame.index;

		var framesBar = selectedFrame.framesbar;
		//所在帧展示栏
		var frameBarId = framesBar.id;
		//所选帧展示栏事件名
		var emitEventName = framesBar.emitEventName;

		//当前舞台
		var stage = Stage.getCurrentStage();
		//对应舞台所有精灵
		var spriteList = stage.getSpriteList();

		//遍历这个舞台上的所有精灵
		$(spriteList).each(function(i,sprite){

			//所选精灵
			if(sprite.id == frameBarId){
				//更新对应精灵属性
				currentFrameSetting = selectedFrame.getCalculatedSetting();
				if(currentFrameSetting){
					sprite.setStyle(currentFrameSetting);
					sprite.select();
				}
			}
			//同一舞台非所选精灵
			else{

				//sprite.unSelect();
				//同一舞台同类型帧展示栏
				var spriteFramesBar = emitEventName ? sprite.getEventFramesBar(emitEventName) : sprite.getCommondFramesBar();
				//没有同类型帧展示栏
				if(!spriteFramesBar){
					//sprite.reset();
					//如果被选择的是事件帧展示栏，并且没有同类型的帧展示栏，则该精灵恢复到普通帧展示栏第一个关键帧的样式
					if(emitEventName){
						var commonFramesBar = sprite.getCommondFramesBar();
						if(commonFramesBar){
							var firstSetting = commonFramesBar.getKeyFrames()[0].getSetting();
							sprite.setStyle(firstSetting);
						}
					}
					return;
				}
				//该帧展示栏在该索引的帧
				var spriteSelectedFrame = spriteFramesBar.getFrameByIndex(selectedFrameIndex);
				//超长的话选择最后一个帧
				if(!spriteSelectedFrame){
					spriteSelectedFrame = spriteFramesBar.framesArr[spriteFramesBar.framesArr.length - 1];
				}
			
				//if(spriteSelectedFrame){
					//更新对应精灵属性
					if(!spriteSelectedFrame){
						return;
					}
					frameSetting = spriteSelectedFrame.getCalculatedSetting();
					if(!frameSetting){
						return;
					}
					sprite.setStyle(frameSetting);
				//}

				//移动帧标记栏	
				spriteFramesBar.moveFrameMarkByIndex(selectedFrameIndex);

			}
			//存在元件，则元件定位到初始显示位置
			if(sprite.controller){
				sprite.controller.stopAnimation();
			}
		});
	};

	//舞台对象实例函数
	Stage.prototype = {
		//初始化
		init:function(opt){
			var self = this;
			opt = opt || {};
			//舞台所在容器
			this.container = opt.container || $('.stages-list');
			//设置数据
			this.setData(opt);
			//渲染
			this.render();
	
			if(opt.spriteListData){

				$.each(opt.spriteListData,function(i,spriteData){
				
					spriteData.stage = self;
					var sprite = new Sprite(spriteData);
					//设置初始样式，避免没有帧展示栏的精灵没有样式
					sprite.setStyle(sprite.getInitialSetting());

					self.spriteList.push(sprite);
				});
			}
			//默认加的第一页，加page-current类
			// if(this.index === 0){
			// 	this.element.addClass('pt-page-current');
			// }

			//设置背景颜色
			this.setBackgroundColor(opt.backgroundColor);
			//设置背景图片
			this.setBackgroundImage(opt.backgroundImage,opt.imgFileName);

			this.bind();
		},
		bind:function(){
			var self = this;

		},
		//设置数据
		setData:function(opt){
			var self = this;
			//舞台名字，目前只有元件有
			this.name = opt.name;
			//建立随机id
			this.id = opt.id || Util.getRandomId();
			//索引
			this.index = opt.index || 0;
			//宽
			this.width = opt.width || 320;
			//高
			this.height = opt.height || 480;
			//元件填充模式
			this.mode = opt.mode;
			//是否重复
			//this.repeat = opt.repeat;
			//是否元件舞台
			this.isControllerStage = opt.isControllerStage;
			//精灵元素列表
			this.spriteList = [];
	
			//离开该页的事件行为
			this.setLeaveAction(opt.actionEventName);
	

		},	
		//设置离开该页的事件行为
		setLeaveAction:function(actionEventName){
			this.actionEventName = actionEventName;
		},
		//舞台宽度设置
		setWidth:function(width){
			var element = this.getStageElement();
			this.width = width;
			element.css({
				width:width,
				marginLeft:-this.width/2,
				marginTop:-this.height/2
			});
		},
		//舞台高度设置
		setHeight:function(height){
			var element = this.getStageElement();
			this.height = height;
			element.css({
				height:height,
				marginLeft:-this.width/2,
				marginTop:-this.height/2
			});
		},
		getGlobalSpriteWrap:function(){
			if(!globalSpriteWrap){
				globalSpriteWrap = $('<div class="global-sprite-wrap"></div>');
				Stage.stagesList.append(globalSpriteWrap);
			}
			return globalSpriteWrap;
		},

		//通过id删除精灵
		removeSpriteById:function(id){

			for(var i = 0;i < this.spriteList.length;i ++ ){
				var sprite = this.spriteList[i];
				if(sprite.id == id){
					sprite.remove();
					this.spriteList.splice(i,1);
					i--;
				}
			}
		},
		//获取数据
		getData:function(){
			var spriteListData = {};

			$(this.spriteList).each(function(i,s){
				var spriteData = s.getData();
				spriteListData[s.id] = spriteData;
			});


			return {
				name:this.name,
				id:this.id,
				index:this.index,
				width:this.width,
				height:this.height,
				mode:this.mode,
				isControllerStage:this.isControllerStage,
				backgroundImage : this.backgroundImage,
				imgFileName : this.imgFileName,
				backgroundColor:this.backgroundColor,
				spriteListData:spriteListData,
				actionEventName:this.actionEventName
			};
		},
		setBackgroundColor:function(color){
			var element = this.getStageElement();
			element.css({
				'background-color':color
			});
			this.backgroundColor = color;
		},
		setBackgroundImage:function(image,imgFileName){
			if(image && imgFileName){
				var element = this.getStageElement();
				element.css({
					'background-image':'url(' + image + ')'
				});
				this.backgroundImage = image;
				this.imgFileName = imgFileName;
			}
		},
		select:function(){
			var self = this;
			var stageElement = this.getStageElement();

			if(stageElement.hasClass('selected')) return;

			stageElement.addClass('selected');
		},
		unSelect:function(){
			var stageElement = this.getStageElement();
			stageElement.removeClass('selected');
		},
		setZIndex:function(zIndex){
			var element = this.getStageElement();
			element.css({
				'z-index': zIndex
			});
			this.zIndex = zIndex;
		},
		getZIndex:function(){
			return this.zIndex;
		},
		//渲染
		render:function(){

			//新页的html串
			var newStageTmplStr = tmpl[TMPL_NAME]({
				id:TMPL_NAME + '_' + this.id,
				index:this.index,
				width:this.width,
				height:this.height,
				marginLeft:-this.width/2,
				marginTop:-this.height/2
			});

			this.container.append(newStageTmplStr);

			//舞台元件绑定舞台resize设置
			var element = this.getStageElement();

			if(this.isControllerStage){
				//可改变尺寸
				element.resizable({
					handles:'ne,nw,se,sw,e,n,s,w',
					stop:function(e,ui){
						var w = ui.size.width;
						var h = ui.size.height;

						var prop = {
							width:w,
							height:h,
							marginLeft:-w/2,
							marginTop:-h/2,
							left:'50%',//这里要覆写一下，因为元素会自动被resize组件增加left和top的值
							top:'50%'	
						};

						//设置舞台元素的css值
						element.css(prop);

						//元件舞台尺寸更改事件通知
						$(window).trigger('controllerStageSizeChanged',{
							width:w,
							height:h
						});
						
					}
				});
			}
		},
		//获取舞台元素
		getStageElement:function(){
			if(!this.element || !this.element.length){
				this.element = $('#' + TMPL_NAME + '_' + this.id);
			}
			return this.element;
		},
		//根据id删除精灵
		deleteSpriteById:function(id){
			var spriteList = this.spriteList;
			for(var i = 0 ;i < spriteList.length; i ++){
				if(spriteList[i].id == id){
					spriteList[i].remove();
					spriteList.splice(i,1);
					
					//删除后自动选择上一个精灵
					if(spriteList[i - 1]){
						spriteList[i - 1].select();
					}	

					return;
				}
			}
		},
		//获取精灵列表
		getSpriteList:function(){
			return this.spriteList;
		},
		//增加一个精灵元素
		addSprite:function(spriteOpt){
			var newSprite;
			//初始化新的sprite所在stage对象
			spriteOpt.stage = this;
			//舞台列表容器，用于作为全局精灵的容器
			spriteOpt.stagesList = this.stagesList;
			
			//创建新的sprite对象
			newSprite = new Sprite(spriteOpt);
			//增加到sprite列表
			this.spriteList.push(newSprite);
		
			//新增精灵元素事件通知
			$(window).trigger('spriteAdd',{
				sprite:newSprite
			});

			//单文本初始添加的时候不会直接进入编辑状态
			if(newSprite.isText && !newSprite.isSingle){
				currentEditSprite = newSprite;
			}
			//设置初始样式
			newSprite.setStyle(newSprite.getInitialSetting());

		
			return newSprite;
		},
		//获取精灵的对象
		getSpriteById:function(id){
			var spriteList = this.spriteList;
			var sprite;
		
			for(var i = 0 ,l = spriteList.length;i<l;i++){
				sprite = spriteList[i];
				if(id == sprite.id){
					return sprite;
				}
			}
		},
		//删除元素
		remove:function(){
			var element = this.getStageElement();
			element.remove();

			$.each(this.spriteList,function(i,sprite){
				sprite && sprite.remove();
			});

			this.spriteList = [];
		}
	};
	//初始化
	Stage.init = function(opt){	
		opt = opt || {};	
		//页列表元素
		this.stagesList = $('.stages-list');
		//新增精灵元素的按钮
		this.spriteAddBtn = $('.sprite-add-button > input');
		//新增图层按钮
		this.spriteLyerAddBtn = $('.sprite-layer-add-button');
		//新增文本按钮
		this.spriteTextAddBtn = $('.sprite-text-add-button');
		//新增单文本按钮
		this.spriteSingleTextAddBtn = $('.sprite-single-text-add-button');	
		

		//舞台切换动画类型选择
		this.stageTransitionTypeSelect = $('.stage-transition-type-select');

		//舞台切换动画的上下方向
		this.stageTransitionUtdRadio = $('.stage-transition-utd');
		//舞台切换动画的左右方向
		this.stageTransitionLtrRadio = $('.stage-transition-ltr');

		//初始化每个舞台高度
		stageHeight = this.stagesList.height();
		//设置数据
		this.setData(opt);
		//事件绑定
		this.bind();
		//精灵设置事件监听播放动画初始化
		SpriteEventAnimationSetting.init();
		//精灵行为设置框初始化
		SpriteActionSetting.init();
		//舞台背景设置初始化
		BackgroundSetting.init();
		//层尺寸设置初始化
		layerSizeSetting.init();

		globalRichEditor = UE.getEditor('globalEditor');


	};
	//设置数据
	Stage.setData = function(opt){
		opt = opt || {};
		stageObjs = [];
	
		currentStageIndex = currentSprite = copySprite = undefined;

		this.clearDomList();

		if(opt.stageDataArr){
			$(opt.stageDataArr).each(function(i,stageData){
				var stage = new Stage(stageData);
				stageObjs.push(stage);
			});

			currentSprite = Stage.getSpriteById(opt.currentSpriteId);
		}
		//舞台动画切换类型设置
		if(opt.currentStageTransitionType){
			Util.setDropDownListValue(this.stageTransitionTypeSelect,opt.currentStageTransitionType);
		}
		//舞台动画方向设置
		if(opt.currentStageTransitionDirection){
			opt.currentStageTransitionDirection == 'utd' ? this.stageTransitionUtdRadio.prop('checked',true) : this.stageTransitionLtrRadio.prop('checked',true);
		}


	};
	//清除dom列表
	Stage.clearDomList = function(){
		this.stagesList.html('');
	};
	//获取数据
	Stage.getData = function(){
		var stageDataArr = [];
		$(stageObjs).each(function(i,stageObj){
			var stageData = stageObj.getData();
			stageDataArr.push(stageData);
		});
		return {
			//animationDuration:this.animationDuration,
			//animationEasing:this.animationEasing,
			stageDataArr:stageDataArr,
			currentStageIndex:currentStageIndex,
			//currentStageId:currentStage.id,
			currentSpriteId:currentSprite && currentSprite.id,
			currentStageTransitionType:this.getCurrentStageTransitionType(),
			currentStageTransitionDirection:this.getStageTransitionDirection()
		};
	},
	//获取所有舞台元素
	Stage.getStages = function(){
		return stageObjs;
	};





	//事件绑定
	Stage.bind = function(){
		var self = this;
		//监听选中一页事件，跳到特定页的舞台
		$(window).on('pageSelect',function(){
			var e = arguments[1];
			var selectedPage = e.selectedPage;

			var stage = self.getStageById(selectedPage.id);

			//var index = selectedPage.index;
			//跳到特定页的舞台
			Stage.select(stage.index);

		});

		//监听增加帧展示栏事件，为对应精灵设置帧展示栏
		$(window).on('framesBarAdd',function(){
			var e = arguments[1];
			var framesBar = e.framesBar;
			var sprite = self.getSpriteById(framesBar.id);
			sprite.setFramesBar(framesBar);
		});


		//舞台背景改变
		$(window).on('stageBackgroundChange',function(){
			var e = arguments[1];
			var currentStage = self.getCurrentStage();

		
			if(e.color){
				currentStage.setBackgroundColor(e.color);
			}
			if(e.image){
				currentStage.setBackgroundImage(e.image,e.imgFileName);
			}
		});


		$(window).on('spritePositionUpdate',function(){
			var e = arguments[1];
			var sprite = e.sprite;
			//没有帧展示栏和事件帧展示栏的精灵
			if(!sprite.getCommondFramesBar() && !sprite.hasEventFramesBar()){
				sprite.select();
			}
		});


		//监听设置精灵行为事件
		$(window).on('confirmAction',function(){
			var e = arguments[1];

			if(e.actionEmitType == 'click' && currentSprite){
				//对应精灵绑定设置的点击行为
				currentSprite.bindClickAction(e);
			}
			//设置舞台翻页行为
			else if(e.actionEmitType == 'stageAction'){
				var currentStage = self.getCurrentStage();
				currentStage.setLeaveAction(e.actionEventName);
			}
		});

		//监听csseditor设置关键帧设置事件
		$(window).on('keyFrameSettingChanged',function(){
			if(currentSprite){
				var e = arguments[1];
				var keyFrameSetting = e.keyFrameSetting;
				//为精灵设置设定的样式
				currentSprite.setStyle(keyFrameSetting);
			}
		});


		//监听csseditor设置精灵属性
		$(window).on('spriteSettingChanged',function(){
		
			if(currentSprite){
				var e = arguments[1];
				var spriteSetting = e.spriteSetting;
				var controllerMode = e.controllerMode;
				//为精灵设置设定的类名
				currentSprite.name = spriteSetting.name;
				currentSprite.className = spriteSetting.className;
				currentSprite.setNameTag(currentSprite.name);
	

				currentSprite.imgUrl = spriteSetting.imgUrl;
				currentSprite.imgFileName = spriteSetting.imgFileName;
	
				//为精灵设置设定的缩放模式
				currentSprite.controllerMode = spriteSetting.controllerMode;
				
				//有帧展示栏的精灵才叠加设置关键帧的setting
				if(currentSprite.getCommondFramesBar() || currentSprite.hasEventFramesBar()){
					if(currentFrameSetting){
						currentFrameSetting.name = spriteSetting.name;
						currentFrameSetting.className = spriteSetting.className;
						currentFrameSetting.controllerMode = spriteSetting.controllerMode;
					}		
				}
				else{
					currentFrameSetting = null;
				}


				var spriteCustomSetting = spriteSetting.spriteCustomSetting;

				//精灵的自定义样式
				currentSprite.spriteCustomSetting = spriteCustomSetting;
				
				//存在精灵自定义样式
				if(spriteCustomSetting){
					//刷新sprite的style，先用精灵自定义样式设置，再用所选关键帧样式属性覆盖
					currentSprite.setStyle($.extend({
						imgUrl:currentSprite.imgUrl,
						imgFileName:currentSprite.imgFileName
						//perspective:currentSprite.perspective
					},currentFrameSetting));
				}

				
				//精灵属性覆盖initialSetting
				var initialSetting = currentSprite.getInitialSetting();
				if(initialSetting){
					$.extend(initialSetting,spriteSetting);
				}




			}
		});


		//监听新增一页事件,新增一个对应舞台
		$(window).on('pageAdd',function(){
			var e = arguments[1];
			var id = e.page.id;
			//新增一个舞台对象
			Stage.add(id);
		});

		//监听页面顺序改变事件
		$(window).on('pagesOrderChange',function(){
			var e = arguments[1];
			var pages = e.pages;
			var currentPageIndex = e.currentPageIndex;

			currentStageIndex = currentPageIndex == null ? (pages.length - 1) : currentPageIndex;

			console.log('currentStageIndex:' + currentStageIndex);
	
			//设置舞台的index以及舞台元素的css层级
			$.each(pages,function(i,p){
				//对应页的舞台
				var stage = Stage.getStageById(p.id);
				var index = p.index;
				stage.index = index;
			});
			//排序
			stageObjs = stageObjs.sort(function(s1,s2){
				return s1.index > s2.index;
			});
			//dom排序
			$.each(stageObjs,function(i,s){
				var element = s.getStageElement();
				self.stagesList.append(element);
			});
		});

		//双击编辑文本精灵，显示富文本框
		$(window).on('spriteTextEdit',function(){
			var sprite = arguments[1].sprite;
			var stage = sprite.stage;
			var stageElement = stage.getStageElement();
			var currentStage;


			// 全局精灵并且不在所在舞台，则直接return
			if(sprite.isGlobal){
				currentStage = self.getCurrentStage();
				if(stage != currentStage) {
					return;
				}
			}
			
	
			var richEditorElement = $('#globalEditor');

			//richEditorElement.appendTo(stageElement);

			richEditorElement.css({
				left:sprite.x + stageElement.prop('offsetLeft'),
				top:sprite.y + stageElement.prop('offsetTop'),
				width:sprite.width,
				height:sprite.height
			});

			//重置编辑器
			globalRichEditor.setContent(sprite.getTextContent() || '');
			globalRichEditor.reset();
			//设置当前编辑状态的精灵
			currentEditSprite = sprite;

			richEditorElement.show();
		});


		//单行文本按钮点击
		this.spriteSingleTextAddBtn.on('click',function(){
			var stage = Stage.getCurrentStage();
			if(!stage){
				return;
			}
			// 初始文本尺寸居中
			var x = (stage.width - 128) / 2;
			var y = (stage.height - 22) / 2;
			// 添加一个单行文本图层
			var textSprite = stage.addSprite({
				x:x,
				y:y,
				isText:true,
				textContent:'双击添加单行文本',
				isSingle:true
			});
		});


		//屏蔽鼠标右击
		this.stagesList.on('contextmenu',function(e){
			e.preventDefault();
		});

		//右击精灵元素显示菜单
		this.stagesList.on('mousedown',function(e){

			if(e.button == 2){

				var target = $(e.target).closest('.sprite');
				var stageOffset = self.stagesList.offset();

				//击中一个精灵
				if(target.length > 0){
					//当前舞台
					var currentStage = Stage.getCurrentStage();
					//所点击精灵
					var spriteId = Util.getOriginId(target.attr('id'));
					var sprite = currentStage.getSpriteById(spriteId);

					if(sprite){
						//lock的精灵不右击显示菜单
						if(sprite.isLock) return;
						//选中精灵
						sprite.select();					
					}

				}

				//显示右击菜单
				self.showDropMenu(e);
				//更新鼠标相对于舞台的右击位置
				stageX = e.pageX - stageOffset.left;
				stageY = e.pageY - stageOffset.top;
			}


		});
		//监听选择元件事件
		$(window).on('confirmControllerSelect',function(){
			var e = arguments[1];
	
			//所选的元件的渲染数据
			var controllerRenderData = e.controllerRenderData;
			//新实例化一个元件对象
			//var controller = new Controller(controllerRenderData,true);
			//获取当前舞台对象
			var stage = Stage.getCurrentStage();

			var x = stage.width / 2 - controllerRenderData.width / 2;
			var y = stage.height / 2 - controllerRenderData.height / 2;

			//增加一个精灵
			var sprite = stage.addSprite({
				x:x,
				y:y,
				width:controllerRenderData.width,
				height:controllerRenderData.height,
				controllerRenderData:controllerRenderData
			});	

			//如果是元件，默认添加一个帧展示栏（让元件内动画可播放）
			if(sprite.controller){
				$(window).trigger('addToCommonFramesBar',{
					sprite:sprite
				});
			}

		});

		//确定新层的尺寸大小事件
		$(window).on('confirmNewLayerSize',function(){
			var e = arguments[1];
			var w = e.width;
			var h = e.height;
			var stage = Stage.getCurrentStage();
			var x = stage.width / 2 - w / 2;
			var y = stage.height / 2 - h / 2;

			if(e.layerType == 'layer'){

				//添加一个图层
				stage.addSprite({
					x:x,
					y:y,
					isText:true,//图层默认可文本编辑
					width:w,
					height:h
				});				
			}
			else{

				//添加一个图层
				var textSprite = stage.addSprite({
					x:x,
					y:y,
					width:w,
					height:h,
					isText:true
				});


				//初始化全局富文本编辑器
				var richEditorElement = $('#globalEditor');

				globalRichEditor.setContent('');
				globalRichEditor.reset();

				richEditorElement.css({
					left:textSprite.x,
					top:textSprite.y,
					width:textSprite.width,
					height:textSprite.height
				});				
			}
		});

		//新增文本按钮点击
		this.spriteTextAddBtn.on('click',function(){
			var currentStage = self.getCurrentStage();
			if(!currentStage){
				return;
			}	
			//显示文本尺寸设定
			layerSizeSetting.show('textLayer');
		});


		//新增图层按钮点击
		this.spriteLyerAddBtn.on('click',function(){
			var currentStage = self.getCurrentStage();
			if(!currentStage){
				return;
			}
			//显示尺寸设定
			layerSizeSetting.show('layer');
		});

		//精灵图片选择
		this.spriteAddBtn.on('change',function(e){

			var currentStage = self.getCurrentStage();
			if(!currentStage){
				return;
			}

			//路径
			var imgPath = $(this).val();
			//图片文件名
			var imgFileName = this.files[0].name;
			var fileSize = this.files[0].size;

			// 验证图片合法性
			if(!Util.imgFileValidate(imgFileName,fileSize)){
				return;
			}

			//图片数据
			//var imgData = window.URL.createObjectURL($(this)[0].files[0]);
			var imgData;


			//新建一个img元素用于加载图片
			var newImg = $('<img>');

			var reader = new FileReader();

			reader.addEventListener('load',function (e) {
				imgData = e.target.result;
				var type = window.currentMode == 'scene' ? 0 : 1;

				//上传图片文件
				Util.uploadImg(type,currentWorkId,imgData,imgFileName,function(url,newFileName){
					newImg.attr('src',url);

					//加载图片之后设置sprite尺寸
					newImg.on('load',function(e){

						//获取当前舞台对象
						var stage = Stage.getCurrentStage();

						var w = newImg.prop('naturalWidth') / 2;
						var h = newImg.prop('naturalHeight') / 2;
						var x = stage.width / 2 - w / 2;
						var y = stage.height / 2 - h / 2;

						//增加一个精灵
						var sprite = stage.addSprite({
							x:x,
							y:y,
							width:w,
							height:h,
							imgUrl:url,
							imgFileName:newFileName
						});	

						//触发位置更新事件
						$(window).trigger('spritePositionUpdate',{
							sprite:sprite,
							isLoad:true
						});			

					});
				});

			    
			},false);


			//todo:先用本地base64展示，再偷偷上传图片，完成后替换
			//读取图片数据
			reader.readAsDataURL(this.files[0]);
			//newImg.attr('src',imgData);

			//清空选择，避免下次相同路径触发不了change事件
			$(this).val('');
		});
		
		//舞台内点击事件代理
		this.stagesList.on('click',function(e){
			var target = $(e.target);
			var sprite = target.closest('.sprite');

			//点击的祖先元素为sprite元素
			if(sprite.length){
				//精灵id
				var id = Util.getOriginId(sprite.attr('id'));
				//当前舞台对象
				var currentStage = self.getCurrentStage();
				//当前舞台内所点击的精灵对象
				var selectedSprite = currentStage.getSpriteById(id);
				//锁定的精灵不选中
				if(!selectedSprite || selectedSprite.isLock) return;
				//选中精灵
				selectedSprite.select();
				
			}

		});


		//监听精灵项点击事件，选中对应的精灵
		$(window).on('spriteItemClick',function(){
			var e = arguments[1];
			var id = e.id;
			var sprite = self.getSpriteById(id);
		
			if(sprite){
				sprite.select();
			}

		});



		//动画播放的时候,取消当前精灵选择
		$(window).on('playAnimation',function(){
			var e = arguments[1];
			var stageId = e.framesBar.stageId;
			var isControllerPlay = e.framesBar.isControllerPlay;
	
			//取消选择当前精灵
			var currentSprite = self.getCurrentSprite();
			if(currentSprite){
				currentSprite.unSelect();
			}
			
			// //如果有元件，播放元件动画
			// var sprite = self.getSpriteById(e.framesBar.id);
		
			// if(sprite.controller && isControllerPlay){
			// 	sprite.controller.playAnimation();
			// }

		});
		//取消正在播放的帧展示栏id属性,另外,如果有元件，元件也停止播放动画
		$(window).on('stopAnimation',function(){
			var e = arguments[1];
			var spriteList = self.getSpriteList();
			//同一舞台的精灵元件，停止播放精灵动画
			$.each(spriteList,function(i,sprite){
				if(e.stageId == sprite.stage.id){
					//取消正在播放的帧展示栏id属性(这个renderId在spriteSelect里有用)
					sprite.setPlayingFramesBarRenderId('');
					//如果有元件，元件也停止播放动画
					if(sprite.controller){
						sprite.controller.stopAnimation();
					}
				}
			});
		});

		//同一舞台的精灵元件，如果有元件，暂停播放元件动画
		$(window).on('pauseAnimation',function(){
			var e = arguments[1];
			var spriteList = self.getSpriteList();
			
			$.each(spriteList,function(i,sprite){
				if(e.stageId == sprite.stage.id && sprite.controller){
					sprite.controller.pauseAnimation();
				}	
			});

		});

		//同一舞台的精灵，如果有元件，继续播放元件动画
		$(window).on('resumeAnimation',function(){
			var e = arguments[1];
			var spriteList = self.getSpriteList();
			//同一舞台的精灵元件，恢复播放精灵动画
			$.each(spriteList,function(i,sprite){
				if(e.stageId == sprite.stage.id && sprite.controller){
					sprite.controller.resumeAnimation();
				}
			});
			
		});

		//动画重复时，如果精灵有元件，让元件动画也重新播放
		$(window).on('animationInteration',function(){
			var e = arguments[1];
			//动画对应的帧展示栏
			var framesBar = e.framesBar;
			var spriteList = self.getSpriteList();
			$.each(spriteList,function(i,sprite){
				//如果正是当前精灵的帧动画发生重复播放	
				if(framesBar.id == sprite.id && sprite.controller){
					sprite.playControllerAnimation();
				}
			});
		});

		//改变精灵的锁定状态
		$(window).on('lockStateChanged',function(){
			var e = arguments[1];
			var isLock = e.lock;
			var id = e.id;
	
			var sprite = self.getSpriteById(id);
			if(isLock){
				sprite.lock();
			}
			else{
				sprite.unlock();
			}
		});
		//监听删除精灵项事件，删除对应精灵
		$(window).on('spriteItemDelete',function(){
			var e = arguments[1];
			if(window.confirm('是否删除该精灵？')){
				var currentStage = self.getCurrentStage();
				//根据id删除对应精灵
				currentStage.deleteSpriteById(e.id);			
			}

		});


		//帧选择事件
		$(window).on('afterFrameSelect',onFrameOrKeyFrameSelect.bind(this));
		//关键帧选择事件
		$(window).on('afterKeyFrameSelect',onFrameOrKeyFrameSelect.bind(this));


		$(window).on('hideStateChanged',function(){
		
			var e = arguments[1];
			var isHide = e.isHide;
			var id = e.id;
			var sprite = self.getSpriteById(id);

			if(isHide){
				sprite.hideImg();
			}
			else{
				sprite.showImg();
			}

		});



		//监听精灵选择事件
		$(window).on('spriteSelect',function(){
			var e = arguments[1];
			var selectedSprite = e.selectedSprite;

			if(currentSprite && currentSprite != selectedSprite){
				currentSprite.unSelect();
			}

			currentSprite = selectedSprite;
		});

		//帧展示栏删除事件
		$(window).on('framesBarRemove',function(){
			var e = arguments[1];
			var framesBar = e.framesBar;
			var sprite = self.getSpriteById(framesBar.id);
			
			//删除的不是事件帧展示栏而是普通帧展示栏，则整个精灵删除
			if(framesBar.emitType ==  'none'){
				if(sprite){
					sprite.framesbar = null;
					//sprite.setStyle(sprite.getInitialSetting());
				}
				//var currentStage = self.getCurrentStage();
				//currentStage.removeSpriteById(framesBar.id);

			}
			//如果hi删除事件帧展示栏，也删除精灵对应的事件监听绑定
			else{
			
				if(sprite){
					//删除对应事件的绑定
					sprite.removeAnimationCustomEvent(framesBar.emitEventName);
				}
			}

			if(!sprite.getCommondFramesBar() && !sprite.hasEventFramesBar()){
				sprite.setStyle(sprite.getInitialSetting());
				//精灵回到无帧展示栏状态的事件通知
				$(window).trigger('spriteBackToSingle',{
					sprite:sprite
				});
			}
		});

		//监听置于最顶层事件
		$(window).on('spriteZIndexUp',function(){
			var e = arguments[1];
			var sprite = e.sprite;
			//设置置顶
			self.setSpriteZIndexUp(sprite);
		});
		//监听置于最底层事件
		$(window).on('spriteZIndexDown',function(){
			var e = arguments[1];
			var sprite = e.sprite;
			//设置置底
			self.setSpriteZIndexDown(sprite);
		});


		//监听页面被删除事件，删除对应舞台
		$(window).on('pageDelete',function(){
			var e = arguments[1];
			self.deleteStageById(e.pageId);
		});
	};

	// 获取所有全局精灵
	Stage.getGlobalSpriteList = function(){
		var spriteList = this.getSpriteList();
		var globalSpriteArr = [];
		$.each(spriteList,function(i,s){
			if(s.isGlobal){
				globalSpriteArr.push(s);
			}
		});
		return globalSpriteArr;
	};

	//设置精灵的zIndex置底
	Stage.setSpriteZIndexDown = function(sprite){
		var currentStage,
			spriteList;

		if(sprite.isGlobal){
			spriteList = this.getGlobalSpriteList();
			console.log('globalSpriteArr:' + spriteList.length);
		}
		else{
			currentStage = this.getCurrentStage();
			spriteList = currentStage.getSpriteList();		
		}


		var minZIndex = 0;
		var spriteZIndex = sprite.getZIndex();
		debugger;
		//该舞台上的所有精灵
		$(spriteList).each(function(i,s){
			var zIndex = s.getZIndex();
			//找出当前最大的zIndex
			if(zIndex < minZIndex){
				minZIndex = zIndex;
			}
			//比该精灵大层级的其他精灵，增加一个层级
			if(zIndex < spriteZIndex){
				s.setZIndex(zIndex + 1);
			}
		});
		//置于底层
		sprite.setZIndex(minZIndex - 1);		
	};

	//获取所有精灵
	Stage.getSpriteList = function(){
		var list = [];
		$.each(stageObjs,function(i,stage){
			var spriteList = stage.getSpriteList();
			list.concat(spriteList);
		});
		return list;
	};

	//获取当前处于编辑状态的精灵
	Stage.getCurrentEditSprite = function(){
		return currentEditSprite;
	};
	//设置当前处于编辑状态的精灵
	Stage.setCurrentEditSprite = function(sprite){
		currentEditSprite = sprite;
	};

	//设置精灵的zIndex置顶
	Stage.setSpriteZIndexUp = function(sprite){debugger;
		var currentStage = this.getCurrentStage();
		var spriteList = currentStage.getSpriteList();

		var maxZIndex = 0;
		var spriteZIndex = sprite.getZIndex();
		//该舞台上的所有精灵
		$(spriteList).each(function(i,s){
			var zIndex = s.getZIndex();
			//找出当前最大的zIndex
			if(zIndex > maxZIndex){
				maxZIndex = zIndex;
			}
			//比该精灵大层级的其他精灵，减少一个层级
			if(zIndex > spriteZIndex){
				s.setZIndex(zIndex - 1);
			}
		});
		//置于顶层
		sprite.setZIndex(maxZIndex + 1);		
	}

	//根据id删除舞台对象
	Stage.deleteStageById = function(id){
		for(var i = 0; i <  stageObjs.length ;i++){

			stageObjs[i].index = i;
			
			if(stageObjs[i].id == id){
		
				//如果删除的是当前舞台对象，则取消当前舞台对象的引用
				if(currentStageIndex == i){
					// //删除了选中的最后一页
					// if(currentStageIndex == stageObjs.length - 1){
					// 	currentStageIndex--;
					// }		
					currentStageIndex = null;
				}
				//删除舞台在所选舞台下面
				else if(i > currentStageIndex){

				}
				//删除舞台在所选舞台上面
				else if(i < currentStageIndex){
					currentStageIndex--;
				}

				stageObjs[i].remove();
				stageObjs.splice(i,1);
				i -- ;
			}	
		}

		//选中下一个舞台
		//Stage.select(currentStageIndex);

	};
	//获取当前精灵
	Stage.getCurrentSprite = function(){
		return currentSprite;
	};

	//根据id获取舞台对象
	Stage.getStageById = function(id){
		var targetStage;
		$.each(stageObjs,function(i,stage){
			if(stage.id == id){
				targetStage = stage;
			}
		});
		return targetStage;
	};
	//消除上一个置顶元素的样式类

	//创建右击菜单
	Stage.createDropMenu = function(){
		var self = this;

		return new DropMenu({
			container:$('.stages-list'),
			//点击回调
			callback:function(index,item){
				var name = item.value;
				//复制精灵
				if(name == 'copySprite'){
					//用于复制的精灵对象
					copySprite = currentSprite;
				}
				//精灵置于最顶层
				else if(name == 'upSprite'){
				
					//触发置于顶层事件
					$(window).trigger('spriteZIndexUp',{
						sprite:currentSprite
					});
					//设置置顶样式
					//currentSprite.setZIndex(UpZIndex);
				}
				//精灵置于最底层
				else if(name == 'bottomSprite'){
					$(window).trigger('spriteZIndexDown',{
						sprite:currentSprite
					});
					//设置置顶样式
					//currentSprite.setZIndex(downZIndex);
				}
				//删除精灵
				else if(name == 'deleteSprite'){

					if(window.confirm('是否删除该精灵？')){
						var currentStage = self.getCurrentStage();
						//根据id删除对应精灵
						currentStage.deleteSpriteById(currentSprite.id);				
					}

				}
				//设置精灵点击行为
				else if(name == 'setClickAction'){
					//展示精灵行为设置框
					SpriteActionSetting.show('click',{
						actionEventName:currentSprite.clickActionEventName,
						actionJumpNext:currentSprite.clickActionJumpNext
					});
				}
				//设置监听事件的动画
				else if(name == 'setEventAnimation'){
					SpriteEventAnimationSetting.show();
				}
				//添加到时间轴
				else if(name == 'addToCommonFramesBar'){
					$(window).trigger('addToCommonFramesBar',{
						sprite:currentSprite
					}); 
				}
				//设置为全局精灵
				else if(name == 'setSpriteGlobal'){
					currentSprite = Stage.getCurrentSprite();
					currentSprite.setGlobal(true);
				}
				//设置为非全局精灵
				else if(name == 'cancelSetSpriteGlobal'){
					currentSprite = Stage.getCurrentSprite();
					currentSprite.setGlobal(false);
				}
				//粘贴复制的关键帧
				else if(name == 'pasteSprite'){
					//触发粘贴精灵事件
					$(window).trigger('pasteSprite',{
						sprite:copySprite
					});
					
					// //存在复制的精灵
					// if(copySprite){
					// 	var currentStage = self.getCurrentStage();
					// 	var setting = copySprite.getSetting();
					// 	var newSprite = currentStage.addSprite(setting);
					// 	newSprite.select();

					// 	var copySpriteFramesBars = copySprite.getAllFramesBars();

					// 	$.each(copySpriteFramesBars,function(i,c_fb){
					// 		var newFramesBar = FramesBar.add(newSprite,c_fb.emitType,c_fb.emitEventName,c_fb.isListenOnce);

					// 	});


					// 	// //复制的帧展示栏
					// 	// var copyFramesBar = copySprite.framesbar;
					// 	// var keyFrames = copyFramesBar.getKeyFrames();
					// 	// //对应的帧展示栏
					// 	// var framesBar = newSprite.framesbar;
					// 	// //复制关键帧
					// 	// $(keyFrames).each(function(i,kf){
					// 	// 	framesBar.addKeyFrame(kf.index,kf.setting);
					// 	// });

					// }

				}
				//设置背景颜色
				else if(name == 'setStageBackground'){
					var currentStage = self.getCurrentStage();

					BackgroundSetting.show({
						backgroundColor:currentStage.backgroundColor,
						backgroundImage:currentStage.backgroundImage,
						imgFileName:currentStage.imgFileName
					});
				}
				//设置翻页行为
				else if(name == 'setStageAction'){
					var currentStage = self.getCurrentStage();
					//打开设置翻页行为的窗口
					SpriteActionSetting.show('stageAction',{
						actionEventName:currentStage.actionEventName
					});
				}
			}
		});
	};
	//通过精灵id从所有舞台中搜索精灵
	Stage.getSpriteById = function(id){
		for(var i = 0,l = stageObjs.length;i<l;i++){
			var stage = stageObjs[i];
			var sprite = stage.getSpriteById(id);
			if(sprite){
				return sprite;
			}
		};
	};

	Stage.setWorkId = function(workId){
		currentWorkId = workId;

		BackgroundSetting.setWorkId(workId);
	};

	Stage.getSpriteList = function(){
		var list = [];
		$.each(stageObjs,function(n,stage){
			var spriteList = stage.getSpriteList();
			list = list.concat(spriteList);
		});
		return list;
	},
	//显示右击菜单
	Stage.showDropMenu = function(e){
		//菜单显示项
		var items = [];
		var target = $(e.target);
		var spriteElement = target.closest('.sprite');


		

		//创建
		if(!this.dropMenu){
			this.dropMenu = this.createDropMenu();
		}

		//右击中一个精灵
		if(spriteElement.length){
			items.push({
				text:'复制',
				value:'copySprite'
			});
			items.push({
				text:'置于最顶层',
				value:'upSprite'
			});
			items.push({
				text:'置于最底层',
				value:'bottomSprite'
			});
			items.push({
				text:'删除',
				value:'deleteSprite'
			});
			items.push({
				text:'设置点击行为',
				value:'setClickAction'
			});
			items.push({
				text:'添加事件动画',
				value:'setEventAnimation'
			});

			
			//如果该精灵没有普通帧展示栏，可添加普通帧展示栏
			var sprite = Stage.getSpriteById(Util.getOriginId(spriteElement.prop('id')));
			var commonFramesBar = sprite.getCommondFramesBar();

			if(!commonFramesBar){
				items.push({
					text:'添加到时间轴',
					value:'addToCommonFramesBar'
				});
			}

			if(!target.closest('.stage.ui-resizable').length){
				if(!target.closest('.global-sprite-wrap').length){
					items.push({
						text:'设置为全局精灵',
						value:'setSpriteGlobal'
					});
				}
				else{
					items.push({
						text:'取消全局精灵设置',
						value:'cancelSetSpriteGlobal'
					});
					
				}
			}

		}
		//右击中舞台区域
		else{	

			var currentStage = this.getCurrentStage();
			if(!currentStage) return;


			//右击空白区域，并存在可复制元素，则展示粘贴
			if(copySprite){
				items.push({
					text:'粘贴',
					value:'pasteSprite'
				});			
			}



			//设置背景图片
			items.push({
				text:'设置背景',
				value:'setStageBackground'
			},{
				text:'设置翻页行为',
				value:'setStageAction'
			});

		}


		//设置显示项，显示右击菜单
		this.dropMenu.show({
			items:items,
			left:e.pageX,
			top:e.pageY
		});
	};
	//新增一个stage
	Stage.add = function(id,width,height,name,isControllerStage){

		//初始化一个舞台对象
		var newStage = new Stage({
			name:name,
			id:id,
			index:stageObjs.length,
			width:width,
			height:height,
			isControllerStage:isControllerStage
		});


		//触发page增加事件
		$(window).trigger('stageAdd',{
			newStage:newStage
		});
	
		//新增到数组
		stageObjs.push(newStage);

		newStage.select();

	};

	//获取当前舞台
	Stage.getCurrentStage = function(){
		return this.get(currentStageIndex || 0);
	};

	//获取某个索引的舞台对象
	Stage.get = function(index){
		return stageObjs[index];
	};

	Stage.getGlobalRichEditor = function(){
		return globalRichEditor;
	};


	//获取舞台的跳转动画类型
	Stage.getCurrentStageTransitionType = function(){
		return this.stageTransitionTypeSelect.data('selectedValue') || '移动';
	};
	//获取舞台跳转动画对象
	Stage.getCurrentStageTransitionObj = function(){
		currentStageTransitionType = this.getCurrentStageTransitionType();
		currentStageTransitionDirection = this.getStageTransitionDirection();

		return StageTransitionConfig[currentStageTransitionType][currentStageTransitionDirection];
	};


	//动画方向
	Stage.getStageTransitionDirection = function(){
		return this.stageTransitionUtdRadio.prop('checked') ? 'utd' : 'ltr';
	};

	//展示下一页舞台
	Stage.next = function(){
		currentStageIndex++;
		this.select(currentStageIndex);
	};
	//跳到特定索引页的舞台
	Stage.select = function(index){
		var inClass,outClass;
		//更新当前舞台索引
		var preStage;
		var stage;
	
		// if(index === currentStageIndex){
		// 	return;
		// }

		preStage = stageObjs[currentStageIndex];
		stage = stageObjs[index];

		//舞台动画类型
		currentStageTransitionType = this.getCurrentStageTransitionType();
		currentStageTransitionDirection = this.getStageTransitionDirection();

		// if(typeof currentStageIndex != 'undefined'){

		// 	var transitionTypeObj = this.getCurrentStageTransitionObj()[currentStageIndex < index ? 'down' : 'up'];

		// 	inClass = transitionTypeObj['inClass'];
		// 	outClass = transitionTypeObj['outClass'];

		// 	if(preStage){
		// 		preStage.element[0].className = 'stage ' + outClass;
		// 	}
		// 	if(stage){
		// 		stage.element[0].className = 'stage ' + inClass + ' pt-page-current';
		// 	}
		// }



		if(preStage){
			preStage.unSelect();
		}
		if(stage){
			stage.select();
		}

		currentStageIndex = index;

	};

	//移除
	Stage.remove = function(){
		var stages = this.getStages();
		$.each(stages,function(i,stage){
			stage.remove();
		});
		currentStageId = null;

		if(globalSpriteWrap){
			globalSpriteWrap.remove();
			globalSpriteWrap = null;
		}
	};

	return Stage;
});