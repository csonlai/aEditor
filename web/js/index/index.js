define(['tmpl','pages','stages','framesbar','transition','csseditor','preset_animation_config','preset_animation_editor','main_show','controller_setting','fbf_animation_editor','win_manager','util','work_list','sprite_list','user_images'],function(tmpl,Page,Stage,FramesBar,Transition,cssEditor,preset_animation_config,PresetAnimationEditor,MainShow,ControllerSetting,FbfAnimationEditor,WinManager,Util,WorkList,SpriteList,UserImages){
	//播放状态
	var playState;
	//当前模式
	window.currentMode = 'scene';
	//当前场景的数据
	var currentSceneData;
	//当前场景数据的场景名
	var currentSceneName;
	//单个动画对象
	var T;	
	//事件单个动画对象集合
	var EventSingleTList = [];
	//当前打开的作品id
	var currentWorkId;
	//当前打开的元件的id
	var currentControllerId;
	//是否显示类名
	var showClassName;

	var uid;

	//全局登录回调
	window.loginCb = function(data){
		index.setUid(data.uid);
	};
 
	//计算设定之和
	function caculateSetting(orginSetting,targetSetting){
		orginSetting = $.extend(true,{},orginSetting);
	
		for(var n in targetSetting){
			var scaleX = null,scaleY = null;

		
			if(n == 'scale' || n == 'scaleX' || n == 'scaleY'){
				if(n == 'scale'){
					scaleX = targetSetting[n];
					scaleY = targetSetting[n];
				}
				else if(n == 'scaleX'){
					scaleX = targetSetting[n];
				}
				else if(n == 'scaleY'){
					scaleY = targetSetting[n];
				}		

				var x = orginSetting['x'];
				var y = orginSetting['y'];
				var w = orginSetting['width'];
				var h = orginSetting['height'];




				if(scaleX != null){
					var newW = orginSetting['width'] = w * scaleX;
					orginSetting['x'] = x - (newW - w) / 2;
				}

				if(scaleY != null){
					var newH = orginSetting['height'] = h * scaleY;	
					orginSetting['y'] = y - (newH - h) / 2;
				}
				
			}
			else if(n == 'opacity'){
				orginSetting[n] = targetSetting[n];
			}
			else{
				//自定义属性
				if(n == 'customSetting'){
					if(orginSetting[n] == null){
						orginSetting[n] = {};
					}
					//计算自定义样式属性
					$.each(targetSetting[n],function(name,value){
						orginSetting[n][name] = value;
					});

				}
				else{
					if(typeof orginSetting[n] == 'undefined'){
						orginSetting[n] = (n == 'easing') ? '' : 0;
					}
					orginSetting[n] = orginSetting[n] + targetSetting[n];			
				}

			}
			
		}


		//暂时这样处理，3d变换origin的影响 tofixed
		if(orginSetting['perspective']){
			orginSetting.customSetting = orginSetting.customSetting || {};
			if(orginSetting['rotateX']){
				orginSetting.customSetting['-webkit-transform-origin'] = (orginSetting['x'] + orginSetting['width'] / 2) + 'px center'
			}
			else if(orginSetting['rotateY']){
				orginSetting.customSetting['-webkit-transform-origin'] = 'center ' + (orginSetting['y'] + orginSetting['height'] / 2) + 'px';
			}		
			
		}
	
		return orginSetting;
	};

	//遍历舞台上的所有非事件触发动画的元件
	function foreachSpriteWithEventAnimation(currentStageId,emitEventName,callback){
		var targetFramesBars = FramesBar.getFramesBarsByEmitEventName(emitEventName);
		
		$(targetFramesBars).each(function(j,framesBar){
			if(framesBar.stageId == currentStageId){
				//对应精灵
				var sprite = Stage.getSpriteById(framesBar.id);
				
				callback && callback(sprite);
			}
		});
	};



	var index = {
		init:function(){


			//页列表
			Page.init();
			//舞台列表
			Stage.init();

			//帧展示栏
			FramesBar.init();
			//css编辑器
			cssEditor.init();
			//预设动画选择器
			PresetAnimationEditor.init();
			//元件尺寸设置窗口
			ControllerSetting.BaseSetting.init();
			//元件列表窗口
			ControllerSetting.List.init();
			//主播放器
			MainShow.init();
			//逐帧动画编辑器初始化
			FbfAnimationEditor.init();

			//初始化折叠菜单
			this.initAccordion();
			//弹出窗口管理器初始化
			WinManager.init();
			//作品列表初始化
			WorkList.init();
			//精灵列表管理
			SpriteList.init();
			// 图片管理初始化
			UserImages.init();

			//最外层容器
			this.outerContainer = $('#outter-container');

			//元件信息部分输入框
			this.controllerWidthInput = $('.controller-width-input');
			this.controllerHeightInput = $('.controller-height-input');
			//帧展示栏外层容器
			this.framesBarOutterElement = $('.frames-bar-outter-container');

			//this.controllerModeSelect = $('.controller-mode-select');
			//默认选择
			//this.controllerModeSelect.data('selectedValue','比例缩放');
			//左边的元件按钮容器
			this.controllerLeftContainer = $('.controller-container');

			//回到场景按钮
			this.backSceneBtn = $('.back-scene');

			//元件尺寸部分输入框
			this.controllerSettingContainer = $('.controller-size-container');
			this.controllerCreateContainer = $('.controller-create-container');

			//场景信息部分输入框
			this.sceneCreateContainer = $('.scene-create-container');
			this.newBtn = $('.new-btn');

			//分页容器
			this.pagesContainer = $('.pages-container');

			//播放区域部分输入框
			this.playBtn = $('.play-button');
			this.playButtonIcon = $(this.playBtn.find('.glyphicon'));

			//当前作品标题
			this.workTitleText = $('.work-title');
			//元件名标题
			//this.controllerNameText = $('.controller-name-title');
			this.controllerNameText = $('.controller-name-input');

			//添加逐帧动画按钮
			this.addFbfAnimationBtn = $('.add-fbf-animation');

			//新建元件按钮
			this.newControllerBtn = $('.add-controller');


			//保存元件按钮
			this.saveControllerBtn = $('.save-controller-btn');
			//插入元件按钮
			this.addControllerBtn = $('.controller-add-button');
			//保存场景按钮
			this.saveSceneBtn = $('.save-btn');
			//打开作品按钮
			this.openWorkBtn = $('.load-btn');
			//播放全部按钮
			this.playAllBtn = $('.play-all-btn');
			//增加预设动画按钮
			this.addPresetAnimationBtn = $('.add-preset-animation');
			//停止按钮
			this.stopBtn = $('.stop-button');
			//导出按钮
			this.outputFileBtn = $('.output-file');

			//显示类名
			this.showClassNameCheckBox = $('.show-class-btn');

			//用户名
			this.userNameText = $('.user-name-text');
			//登录窗口
			this.loginWin = $('.login-win-mask');
			//登录按钮
			this.loginBtn = $('.user-login-btn');
			//注销按钮
			this.logoutBtn = $('.user-login-out-btn');
			// 图片管理按钮
			this.managerImgBtn = $('.img-manager-btn');
			// 使用教程按钮
			this.guideBtn = $('.guide-btn');
	

			//事件绑定
			this.bind();

			//一开始有一页
			Page.add();


			this.deleteTemp();

		},

		getData:function(){

			var localFramesBarsData = FramesBar.getData();
			var localStagesData = Stage.getData();

			if(window.currentMode == 'scene'){

				var localPagesData = Page.getData();

				var localData = {
					id: currentWorkId,
					name:this.workTitleText.val(), 
					localPagesData:localPagesData,
					localStagesData:localStagesData,
					localFramesBarsData:localFramesBarsData
				};

				return localData;
			}
			else{
				var controllerEditData = {};
			
				//元件模式
				controllerEditData.id = currentControllerId || Util.getRandomId();
				//controllerEditData.mode = this.controllerModeSelect.data('selectedValue') == '比例缩放' ? 0 : 1;
				controllerEditData.name = this.controllerNameText.val();
				controllerEditData.localFramesBarsData = localFramesBarsData;
				controllerEditData.localStagesData = localStagesData;

				return controllerEditData;				
			}
		

			
		},
		setWorkId:function(workId){
			if(currentSceneData){
				currentSceneData.id = workId;
			}
			currentWorkId = workId;
			cssEditor.setWorkId(currentWorkId);
	        Stage.setWorkId(currentWorkId);
	        FbfAnimationEditor.setWorkId(currentWorkId);
		},
		setData:function(localData){
			var self = this;
			localData = localData || {};
			var localStagesData = localData.localStagesData;
			var localFramesBarsData = localData.localFramesBarsData;
			var localPagesData = localData.localPagesData;

			//清理元素以及事件处理程序
			FramesBar.remove();
			Stage.remove();

        	if(window.currentMode == 'scene'){ 
				//设置作品名
				this.setWorkName(localData.name);
	        	//当前作品id
	        	this.setWorkId(localData.id);


	        }
	        else{
     			this.setControllerName(localData.name);
     			//当前元件id
     			currentControllerId = localData.id;
	        }



			//设置舞台数据
			Stage.setData(localStagesData);

	  		//设置帧展示栏数据
			FramesBar.setData(localFramesBarsData); 


			//设置页数据
			Page.setData(localPagesData);
		
			//初始化精灵列表
			var spriteList = Stage.getSpriteList();
			$.each(spriteList,function(i,s){
				SpriteList.addSpriteItem(s);
			});
			//SpriteList.setData();

			// //还原精灵对帧展示栏的引用
			// var allFramesBar = FramesBar.getFramesBars();

			// $(allFramesBar).each(function(i,fb){
			// 	var sprite = Stage.getSpriteById(fb.id);
			// 	sprite.setFramesBar(fb);
			// });



			//恢复数据后，为所有精灵恢复绑定对应的监听事件
			var allSprites = Stage.getSpriteList();

			$(allSprites).each(function(i,sprite){
		
				$(sprite.listenEventNameList).each(function(j,emitEventName){
					//为精灵绑定事件监听
					self.bindSpriteCustomEvent(sprite,emitEventName);

				});

			});

			//还原页选择
			if(localPagesData){
				var selectedPage = Page.getPages()[localPagesData.currentPageIndex || 0];
				if(selectedPage){
					selectedPage.select();
				}
			}
			if(localFramesBarsData){
				var selectedFrame,selectedKeyFrame;
				//还原帧展示栏选择
				var selectedFramesBar = FramesBar.getFramesBarById(localFramesBarsData.currentFramesBarId,localFramesBarsData.currentFramesBarEmitType,localFramesBarsData.currentFramesBarEmitEventName);
				if(selectedFramesBar && selectedFramesBar.length){
					selectedFramesBar.select();
					//还原帧选择
					selectedFrame = selectedFramesBar.getFrameById(localFramesBarsData.currentFrameId);
					if(selectedFrame){
						selectedFrame.select();
					}
					//还原关键帧选择
					else{
						selectedKeyFrame = selectedFramesBar.getKeyFrameById(localFramesBarsData.currentKeyFrameId);
						if(selectedKeyFrame){
							selectedKeyFrame.select();
						}
					}
				}
				
			}
			//还原精灵选择
			if(localStagesData){
				var selectedSprite = Stage.getSpriteById(localStagesData.currentSpriteId);
				if(selectedSprite){
					selectedSprite.select();
				}
			}
		},
		//显示登录
		showLogin:function(){
			this.userNameText.hide();
			this.logoutBtn.hide();
			this.loginBtn.show();
			this.loginWin.show();
			var loginIframe = this.loginWin.find('iframe');
			loginIframe.attr('src','http://account.alloyteam.com/page/ptlogin?redirect=http%3A%2F%2Faeditor.alloyteam.com%2Fcgi%2Flogin&close=1');
		},
		//隐藏登录
		hideLogin:function(userName){
			this.userNameText.text('欢迎你：' + userName);
			this.userNameText.show();
			this.logoutBtn.show();
			this.loginBtn.hide();
			this.loginWin.hide();
		},
		//删除临时目录
		deleteTemp:function(){
			var self = this;
			Util.delTemp(function(data){

				//已登录
				//var userName = localStorage.getItem('username');
				var userName = data.json.user_id;
				if(userName){
					self.hideLogin(userName);
				}

			},function(){
				//没有登录态
				self.showLogin(); 
			});
		},
		//设置用户名
		setUid:function(user_uid){
			uid = user_uid;
			this.hideLogin(uid);
			localStorage.setItem('username',uid);
		},
		//改变模式
		changeMode:function(mode){

			//切换到场景模式
			if(mode == 'scene'){
				this.sceneCreateContainer.show();
				this.controllerCreateContainer.hide();
				this.controllerSettingContainer.hide();
				this.controllerNameText.hide();
				this.workTitleText.show();
				this.pagesContainer.show();
				this.controllerLeftContainer.show();
				this.outerContainer.addClass('scene');
				this.outerContainer.removeClass('controller');
				

			}
			//切换到元件模式
			else {
				this.sceneCreateContainer.hide();
				this.controllerCreateContainer.show();
				this.controllerSettingContainer.show();
				this.controllerNameText.show();
				this.workTitleText.hide();
				this.pagesContainer.hide();
				this.controllerLeftContainer.hide();
				this.outerContainer.addClass('controller');
				this.outerContainer.removeClass('scene');
			}

			window.currentMode = mode;
		},

		//初始化折叠菜单
		initAccordion:function(){
			$('.accordin-container').accordion({
				header: "h4",
				animate: 100,
				collapsible: true,
				heightStyle: "content"
			});
		},
		//更新场景数据中的元件数据(渲染数据)
		_updateControllerDataInScene:function(sceneData,newControllerRenderData){
			var localStagesData = sceneData.localStagesData;
			if(localStagesData){
				var stageDataArr = localStagesData.stageDataArr;
				if(stageDataArr){
					$(stageDataArr).each(function(i,stageData){
						if(stageData.spriteListData){
							$.each(stageData.spriteListData,function(i,spriteData){
								if(spriteData.controllerRenderData && spriteData.controllerRenderData.id == newControllerRenderData.id){
									//更新场景数据里的元件数据（渲染数据）
									spriteData.controllerRenderData = newControllerRenderData;
								}
							});
						}
					});
				}
			}
		
		},
		//绑定精灵的自定义事件
		bindSpriteCustomEvent:function(sprite,emitEventName){
			var self = this;

			//绑定事件监听，播放对应动画
			sprite.bindAnimationCustomEvent(emitEventName,function(){
			
				//事件触发时，获取该精灵对应的帧展示栏
				var framesBar = sprite.getEventFramesBar(emitEventName);

				
				if(!framesBar) return;

				var e = arguments[1];
				//来自编辑区事件通知
				if(e && e.from == 'edit'){

					var t = self.getElementAnimationObject(sprite,'eventEmit',emitEventName);
				
					//播放单个元素的动画
					var st = Transition.playSingle(t);
					EventSingleTList.push(st);
				
					//触发动画播放
					$(window).trigger('playAnimation',{
						//对应播放的帧展示栏
						framesBar:framesBar
					});


				}
			});
		},
		bind:function(){

			var self = this;

			//为下拉菜单填充值并设置选择值
	  		$(document).on('click', '.dropdown-menu li a', function () {
	            var selText = $(this).text();
	            var dropDownList = $(this).closest('.dropdown');
	            Util.setDropDownListValue(dropDownList,selText);
	        });

	  		//选择一个作品
	        $(window).on('workSelect',function(){
	        	var e = arguments[1];
	        	currentSceneData = e.workData;
	        	if(!currentSceneData) return;
	        	currentSceneName = currentSceneData.name;
	        	//载入当前作品的数据
	        	self.setData(currentSceneData);
	        });

			//精灵的事件监听发生变化
			$(window).on('spriteAnimationEventListenChanged',function(){
				var e = arguments[1];
				var emitType = 'eventEmit';
				//精灵监听的事件名
				var emitEventName = e.emitEventName;
				//精灵是否只监听一次
				var isListenOnce = e.isListenOnce;

				//当前精灵
				var currentSprite = Stage.getCurrentSprite();

				//没有普通帧展示栏，先添加普通帧展示栏
				// if(!currentSprite.getCommondFramesBar()){
				// 	$(window).trigger('addToCommonFramesBar',{
				// 		sprite:currentSprite
				// 	}); 
				// }

				//如果已有同名事件，则先删除原来的事件处理程序，再添加
				if(currentSprite.listenEventHandlerMap && currentSprite.listenEventHandlerMap[emitEventName]){
					currentSprite.listenEventHandlerMap[emitEventName] = null;
					FramesBar.removeFramesBarById(currentSprite.id,emitType,emitEventName);
				}





				//为精灵绑定事件监听
				self.bindSpriteCustomEvent(currentSprite,emitEventName);
				//增加一个新的事件帧展示栏(监听事件播放一个动画)
				var newFramesBar = FramesBar.add(currentSprite,emitType,emitEventName,isListenOnce);
				var newKeyFrame;


				//该精灵的普通帧展示栏的第一个关键帧也复制过去
				var currentCommonFramesBar = currentSprite.getCommondFramesBar();
				if(currentCommonFramesBar){
					var commonFirstKeyFrame = currentCommonFramesBar.getKeyFrames()[0];
					//增加第一帧关键帧
					newKeyFrame = newFramesBar.addKeyFrame(0,commonFirstKeyFrame.getSetting());
				}	
				//没有普通帧展示栏的精灵
				else{
					//增加第一帧关键帧
					newKeyFrame = newFramesBar.addKeyFrame(0,currentSprite.getSetting());
				}
				


				//选择第一个关键帧
				newKeyFrame.select();	
			});


			//删除页检查编辑框的显示/隐藏性
			$(window).on('pageDelete',function(){
				self.checkEditorVisibility();
			});

			//监听添加精灵事件，增加一个帧展示栏
			$(window).on('spriteAdd',function(){

				var e = arguments[1];

				//精灵增加的时候，对应增加一个帧展示栏
				//FramesBar.add(e.sprite);
				//默认增加第0帧关键帧
				// var newKeyFrame = newFramesBar.addKeyFrame(0,e.sprite.getInitialSetting());
				// newKeyFrame.select();	

				e.sprite.select();	
				// //如果是元件，默认添加一个帧展示栏（让元件内动画可播放）
				// if(e.sprite.controller){
				// 	$(window).trigger('addToCommonFramesBar',{
				// 		sprite:e.sprite
				// 	});
				// }

				//编辑器隐藏/显示检查
				self.checkEditorVisibility();
		
			});

            //监听精灵删除事件，判断编辑器/隐藏
            $(window).on('spriteDelete',function(){

            	//编辑器隐藏/显示检查
            	setTimeout(function(){
            		self.checkEditorVisibility();
            	},0);
           
            });

            //监听页选择事件，判断编辑器显示/隐藏
            $(window).on('pageSelect',function(){

            	var e = arguments[1];
            	var stageId = e.selectedPage.id;
            	var framesBars = FramesBar.getFramesBars();
            	//标识该舞台是否存在帧展示栏
            	var stageHasFramesBar;

            	$.each(framesBars,function(fb){
            		if(fb.stageId == stageId){
            			stageHasFramesBar = true;
            		}
            	});

            	//该舞台不存在帧展示栏，则选择第一个精灵
            	if(!stageHasFramesBar){
            		var stage = Stage.getStageById(stageId);
            		var firstSprite = stage.getSpriteList()[0];
            		if(firstSprite){
            			firstSprite.select();
            		}
            	}

            	//编辑器隐藏/显示检查
            	setTimeout(function(){
            		self.checkEditorVisibility();
            	},0);
            });

			//监听触发把精灵添加到帧展示栏，为精灵增加一个普通帧展示栏
			$(window).on('addToCommonFramesBar',function(){
				var e = arguments[1];
			
				//精灵增加的时候，对应增加一个帧展示栏
				var newFramesBar = FramesBar.add(e.sprite);
				//默认增加第0帧关键帧
				var newKeyFrame = newFramesBar.addKeyFrame(0,e.sprite.getSetting());
				newKeyFrame.select();	
			});


			//动画播放过程中，选择帧展示栏，结束动画
			$(window).on('afterFramesBarSelect',function(){
				if(playState){
					self.stop();
				}
			});

			//粘贴精灵事件
			$(window).on('pasteSprite',function(){
				var e = arguments[1];
				var copySprite = e.sprite;
				//存在复制的精灵
				if(copySprite){
					var currentStage = Stage.getCurrentStage();
					var setting = copySprite.getSetting();
					var newSprite = currentStage.addSprite(setting);

					newSprite.stage = currentStage;

	
					if(copySprite.listenEventHandlerMap){
						//为精灵绑定自定义事件行为
						$.each(copySprite.listenEventHandlerMap,function(emitEventName){
							//为精灵绑定事件监听
							self.bindSpriteCustomEvent(newSprite,emitEventName);
						});
					}


					var firstNewKeyFrame;
					//精灵的所有帧展示栏
					var copySpriteFramesBars = copySprite.getAllFramesBars();

					$.each(copySpriteFramesBars,function(i,c_fb){
						var c_fb_setting = c_fb.getSetting();
						c_fb_setting.id = newSprite.id;
						c_fb_setting.stageId = currentStage.id;
						var newFramesBar = new FramesBar(c_fb_setting);
						//复制帧展示栏
						FramesBar.add(newFramesBar);
						
						//复制关键帧
						var keyFrames = c_fb.getKeyFrames();
						$(keyFrames).each(function(i,kf){
							var kf = newFramesBar.addKeyFrame(kf.index,kf.setting);
							if(!firstNewKeyFrame){
								firstNewKeyFrame = kf;
							}
						});
					});

					
					if(firstNewKeyFrame){
						firstNewKeyFrame.select();
					}
	
					//newSprite.select();

					


					// //复制的帧展示栏
					// var copyFramesBar = copySprite.framesbar;
					// var keyFrames = copyFramesBar.getKeyFrames();
					// //对应的帧展示栏
					// var framesBar = newSprite.framesbar;
					// //复制关键帧
					// $(keyFrames).each(function(i,kf){
					// 	framesBar.addKeyFrame(kf.index,kf.setting);
					// });

				}				
			});






			//元件编辑事件
			$(window).on('controllerEdit',function(){
				//先暂存场景数据
				currentSceneData = self.getData();
				//切换到元件模式
				self.changeMode('controller');

				var e = arguments[1];
				//要编辑的元件
				var controller = e.controller;
				//获取要编辑的元件的数据
				var controllerEditData = ControllerSetting.List.getControllerLocalData(controller.id);

				if(controllerEditData){
					self.setData(controllerEditData);

					//设置元件舞台尺寸input
					self.setStageControllerSizeInput(controller.width,controller.height);
				}

				// //该元件的编辑数据
				// var controllerEditData;
				// //元件数据集合
				// var controllerEditDataList;
				// var controllerEditDataListStr = localStorage.getItem('controllerEditDataList');

				// if(controllerEditDataListStr){
				// 	var controllerEditDataList = JSON.parse(controllerEditDataListStr);
				// 	//存在该id的元件
				// 	if(controllerEditData = controllerEditDataList[controller.id]){
				// 		//恢复元件编辑现场
				// 		self.setData(controllerEditData);
				// 	}
				// }
				

				//设置元件模式的输入框
				//self.setControllerModeInput(controller.mode);

			});

			//元件舞台尺寸变更
			$(window).on('controllerStageSizeChanged',function(){
				var e = arguments[1];
				var currentStage = Stage.getCurrentStage();
				//设置尺寸
				currentStage.setWidth(e.width);
				currentStage.setHeight(e.height);
				//更新输入框
				self.setStageControllerSizeInput(e.width,e.height);
			});

			//新建元件，设置元件宽高事件
			$(window).on('confirmControllerSetting',function(){
				var e = arguments[1];

				//当前模式
				self.changeMode('controller');
				//清空数据
				self.setData({
					name:e.name
				});
				//设置元件宽高输入框
				self.setStageControllerSizeInput(e.width,e.height);
				//创建一个特定宽高的舞台
				Stage.add(null,e.width,e.height,e.name,true);

				//删除元件的temp目录
				Util.delControllerTemp();

			});

			//点击富文本以外区域，把富文本内容赋值到对应div图层,并隐藏富文本框
			$(document).on('mousedown',function(e){
				//点击的刚好是添加文本的按钮或富文本区域，则忽略
				var clickSpriteElement;
				var clickSpriteTextWrapElement;
				var currentSprite;
				var currentSpriteElement;
				var target = $(e.target);
				var currentEditSprite = Stage.getCurrentEditSprite();

				
				if(target.closest('.sprite-text-add-button').length ||　target.closest('#globalEditor').length || target.closest('#edui_fixedlayer').length || target.closest('.sprite-single-text-add-button').length){
					return;
				}


				clickSpriteTextWrapElement = target.closest('.text-wrap');
			
				if(clickSpriteTextWrapElement.length){

					clickSpriteElement = clickSpriteTextWrapElement.parent();
					

					//点中的是当前精灵元素，不操作，忽略
					// if(clickSpriteElement.prop('id') == currentEditSprite.getSpriteElement().prop('id')){

					// 	return;
					// }
				}


				//隐藏
				//setTimeout(function(){
					var richEditorElement = $('#globalEditor');

					if(currentEditSprite && richEditorElement && richEditorElement[0].style.display != 'none'){
						richEditorElement.hide();
						//全局富文本对象
						var richEditor = Stage.getGlobalRichEditor();
						//富文本内容
						var content = richEditor.getContent();
						currentEditSprite.setTextContent(content);

					}
	

				//},0);
			});



			//监听预设动画选择事件
			$(window).on('animationConfirm',function(){
				var e = arguments[1];
				var duration = e.duration;
				var animationName = e.animationName;
				//当前选择的帧展示栏
				var currentFramesBar = FramesBar.getCurrentFramesBar();
				//当前精灵
				var currentSprite = Stage.getCurrentSprite();
				//当前setting
				var currentSetting = currentSprite.getSetting();
			
				//当前帧
				var currendFrame = FramesBar.getCurrentFrame();
				if(currendFrame){
					//当前帧索引
					var currentFrameIndex = currendFrame.index;
					//预设动画结束的索引
					var endFrameIndex = currentFrameIndex + (duration / currentFramesBar.frameDuration);
					
					//如果要添加关键帧的地方还没有帧,补充帧
					if(endFrameIndex >= currentFramesBar.framesArr.length){
						currentFramesBar.updateTotalDuration((endFrameIndex + 1) * currentFramesBar.frameDuration);
					}


					//选择的动画设置对象
					var selectedSetting = preset_animation_config[animationName];
					
					for(var percent in selectedSetting){

						p = Number(percent.replace('%','')) / 100;
						//增加的索引数
						var dIndex = Math.round((p * duration) / currentFramesBar.frameDuration);
						//计算出来的该百分比对应的帧索引
						var targetFrameIndex = currentFrameIndex + dIndex;
				
						//默认使用ease缓动
						if(!selectedSetting[percent]['easing']){
							selectedSetting[percent]['easing'] = 'ease';
						}
					
						//计算出来的设定值
						var targetSetting = caculateSetting(currentSetting,selectedSetting[percent]);

						//创建关键帧
						var newKeyFrame = currentFramesBar.addKeyFrame(targetFrameIndex,targetSetting);
				
						newKeyFrame.select();
					}
				}				
			});

			//逐帧动画选择
			$(window).on('fbfAnimationSelect',function(){
				var e = arguments[1];
				//精灵参数
				var spriteOpt = e.spriteOpt;
				//先暂存场景数据
				currentSceneData = self.getData();

				//切换到元件模式模式
				self.changeMode('controller');


				//清空当前舞台
				self.setData({
					name:e.name
				});

				//创建一个特定宽高的舞台
				Stage.add(null,spriteOpt.width,spriteOpt.height,e.name);

				
				//动画对象
				var animationObj = e.animationObj;
				//逐帧动画持续时长
				var totalDuration = animationObj.duration;

				//当前舞台
				var currentStage = Stage.getCurrentStage();
				//增加一个精灵
				var sprite = currentStage.addSprite({
					imgUrl:spriteOpt.imgUrl,
					width:spriteOpt.width,
					height:spriteOpt.height
				});
				// 添加普通帧展示栏
				$(window).trigger('addToCommonFramesBar',{
					sprite:sprite
				});

				// 不加setTimeout这里有渲染问题。。
				setTimeout(function(){
					//该精灵的帧展示栏
					var framesBar = sprite.framesbar;
					var repeatMode = e.animationObj.repeatMode;
					var repeatTime = e.animationObj.repeatTime;
					//设置重复播放模式
					framesBar.setRepeatMode(repeatMode);
					//设置重复播放次数
					framesBar.setRepeatTime(repeatTime);
					//更新帧展示栏长度为逐帧动画的长度
					framesBar.updateTotalDuration(totalDuration);
					//设置帧动画时长输入框
					FramesBar.setFrameDurationInput(totalDuration);

					//设置重复模式的选择框和重复次数的输入框
					FramesBar.setRepeatCheckBoxAndInput(repeatMode,repeatTime);
				
					$.each(animationObj.keyframes,function(percent,kf){
						percent = Number(percent.replace('%','')) / 100;

						//关键帧所在索引
						var kfIndex = Math.round((percent * totalDuration) / framesBar.frameDuration);
						//最后一个关键帧，索引要减一
						if(percent == 1){
							kfIndex -= 1;
						}
						
						var newKeyframe = framesBar.addKeyFrame(kfIndex,{
							easing:kf['-webkit-animation-timing-function'],
							width:spriteOpt.width,
							height:spriteOpt.height,
							imgUrl:spriteOpt.imgUrl,
							customSetting:{
								'background-position': kf['background-position'],
								'background-size':kf['background-size']
							}
						});

					});
					


					//第一个关键帧
					var firstKeyFrame = framesBar.getFirstKeyFrame();
					firstKeyFrame.select();		
				},0);




			});
	

			//改变类名显示
			this.showClassNameCheckBox.on('change',function(e){
			
				showClassName = $(e.target).prop('checked');
				if(showClassName){
					$('body').addClass('show-class-name');
				}
				else{
					$('body').removeClass('show-class-name');
				}
			});


			//登录按钮点击
			this.loginBtn.on('click',function(){
				self.loginWin.show();
			});

			// 图片管理按钮点击
			this.managerImgBtn.on('click',function(){
				Util.getImgs(function(data){
					UserImages.show(data.img_files,data.available_folder_size,currentWorkId);
				});
			});


			//注销按钮点击
			this.logoutBtn.on('click',function(){
				if(!window.confirm('确定要注销帐号吗？')){
					return;
				}
				Util.logout(function(){

					alert('注销成功');
					self.showLogin();
					
				});
			});

			// 使用教程按钮点击
			this.guideBtn.on('click',function(){
				window.open('http://www.alloyteam.com/2015/06/h5-jiao-hu-ye-bian-ji-qi-aeditor-jie-shao/',true);
			});



			//点击播放按钮
			this.playBtn.on('click',function(e){
				//按钮
				var target = $(e.target);
				var currentStage = Stage.getCurrentStage();
				var currentFramesBar = FramesBar.getCurrentFramesBar();

				//播放结束状态
				if(!playState || playState == 'end'){

					if(playState == 'end'){
						self.stop(true);
					}
					//触发播放开始前事件
					// $(window).trigger('beforePlayAnimation',{
					// 	framesBar:currentFramesBar
					// });
					//播放
					self.play();

				}
				//正在播放状态
				else if(playState == 'playing'){
					self.pause();
		
				}
				//暂停状态
				else if(playState == 'pause'){
					self.resume();
				}
			});

			//点击结束按钮
			this.stopBtn.on('click',function(){
				self.stop(true);
			});




			//点击场景新建按钮
			this.newBtn.on('click',function(){
				//todo:判断当前场景是否有保存，还没保存的提示一下
				//清空场景数据
				self.setData();
				self.setWorkId(null);
				//创建一个新页
				Page.add();
				//设置默认标题
				self.setWorkName('暂无标题');
				//删除临时目录
				Util.delTemp();
			});

			//点击回到场景
			this.backSceneBtn.on('click',function(){
				self.changeMode('scene');
				self.setData(currentSceneData);
			});

			//逐帧动画编辑器展示
			this.addFbfAnimationBtn.on('click',function(){
				FbfAnimationEditor.show();
			});



			//元件宽度编辑
			this.controllerWidthInput.on('change',function(){
				var currentStage = Stage.getCurrentStage();
				currentStage.setWidth($(this).val());
			});

			//元件高度编辑
			this.controllerHeightInput.on('change',function(){
				var currentStage = Stage.getCurrentStage();
				currentStage.setHeight($(this).val());
			});

			//点击新建元件
			this.newControllerBtn.on('click',function(){
				self.setWorkId(null);
				//先暂存场景数据
				currentSceneData = self.getData();
				currentSceneName = currentSceneData.name;
				//展示元件设置窗口
				ControllerSetting.BaseSetting.show();


			});



			//保存元件
			this.saveControllerBtn.on('click',function(){


				//获取元件编辑数据
				var controllerEditData = self.getData();

				//获取元件本地数据
				var localControllerData = ControllerSetting.List.getControllerLocalData(controllerEditData.id);

				if(!localControllerData || localControllerData.name != controllerEditData.name){
					//元件保存到后台
					Util.createController(controllerEditData,function(data){
						alert('保存成功');
					});			
				}
				else{
					//元件更新到后台
					Util.updateController(controllerEditData,function(data){
						alert('更新成功');
						//编辑数据转换为渲染数据
						var controllerRenderData = ControllerSetting.convert2RenderData(controllerEditData);
						//如果存在当前场景数据，并且当前场景数据包含了该元件数据(渲染数据)，则进行更新
						if(currentSceneData){
							self._updateControllerDataInScene(currentSceneData,controllerRenderData);
						}	
						//更新元件列表拉下来保存在本地的元件编辑数据
						ControllerSetting.List.updateControllerLocalData(controllerEditData);
					});	
		
				}






			});

			//点击添加元件
			this.addControllerBtn.on('click',function(){
				var currentStage = Stage.getCurrentStage();
				if(!currentStage){
					return;
				}
				ControllerSetting.List.show();
			});

			//点击保存场景数据
			this.saveSceneBtn.on('click',function(){
				var localDataList;
				var localData = self.getData();
				//新建(改名了则也新建)
				if(localData.id == null || currentSceneName != self.workTitleText.val()){
					WorkList.create(localData,function(data){
						currentSceneData = data;
						self.setWorkId(data.work_id);

						currentSceneName = localData.name;
					});

				}
				//更新
				else{
					WorkList.update(localData,function(data){
						currentSceneData = data;
						currentSceneData.id = data.work_id;
						currentSceneName = localData.name;
					});
				}



				// var localDataListStr = localStorage.getItem('localDataList');

				// if(localDataListStr){
				// 	localDataList = JSON.parse(localDataListStr);
				// }
				// else{
				// 	localDataList = {};
				// }
			
				// //改名字了，则新保存一份
				// if(localDataList[localData.id] && localDataList[localData.id].name != localData.name){
				// 	localData.id = Util.getRandomId();
				// }

				// //保存在对应作品名称中
				// localDataList[localData.id] = localData;
				// localStorage.setItem('localDataList',JSON.stringify(localDataList));

			});



			//点击载入场景数据
			this.openWorkBtn.on('click',function(){
				//展示作品选择窗口
				WorkList.show();
			});

			//播放全部按钮点击
			this.playAllBtn.on('click',function(){
				var obj = self.getAllAnimationObjectList();
				//移除所有动画style元素，避免影响播放全部的动画
				self.removeAllAnimationStyle();	

				//创造完整H5互动页播放展示
				MainShow.show(obj,showClassName);
			});

			//增加预设动画按钮
			this.addPresetAnimationBtn.on('click',function(){
				if($(this).hasClass('disable')) return;
			
				var currentFrame = FramesBar.getCurrentFrame();
				if(!currentFrame){
					alert('请选择一个起始帧！');
					return;
				}
				PresetAnimationEditor.show();
			});

			//点击输出js文件
			this.outputFileBtn.on('click',function(){

				//获取动画数据列表
				var animationObjectsList = self.getAllAnimationObjectList(true);
		
				var animationDataStr = JSON.stringify(animationObjectsList,null,4);

				animationDataStr = "MainPage.init();MainPage.create(" + animationDataStr + ");";
				//下载作品压缩包
				Util.postJsCode(animationDataStr,function(){
					//触发文件下载
					Util.downloadWork(currentWorkId);
				});

				
			});
		},
		checkEditorVisibility:function(){
        	var currentStage = Stage.getCurrentStage(),
        		spriteArr;

        	if(currentStage){
        		spriteArr = currentStage.getSpriteList();
        	}

        	if(currentStage && spriteArr && spriteArr.length){
	    		
           		//有精灵了，显示css属性编辑右侧栏
				$('.right-bar').show();
				$('.sprite-select-container').show();
				this.framesBarOutterElement.addClass('has-sprite'); 				
    		
	    	}
	    	else{
   				//没有精灵了，不显示css属性编辑右侧栏
				$('.right-bar').hide();
				$('.sprite-select-container').hide();
				this.framesBarOutterElement.removeClass('has-sprite'); 		
	    	}
		},
		//设置元件名
		setControllerName:function(name){
			this.controllerNameText.val(name || '暂无标题');
		},
		//设置作品名
		setWorkName:function(name){
			this.workTitleText.val(name);
		},

		getAllAnimationObjectList:function(isOutPut){
			var obj = {};
			var self = this;
			//所有页的动画对象的集合
			var animationObjectsList = [];
			//所有图片的集合
			var imgUrlsMap = {};

			var animationObject;


			if(window.currentMode == 'scene'){
				//获取所有页对象
				var pages = Page.getPages();

				if(!pages.length) {
					return;
				}

				//每一页的动画对象
				$.each(pages,function(i,p){
					animationObject = self.getPageAnimationObject(p.id,true,isOutPut);
					animationObjectsList.push(animationObject);

					//该页所有精灵的图片
					$.extend(imgUrlsMap,animationObject.spriteImgUrlsMap);
					//页的背景图片
					if(animationObject.backgroundImage){

						imgUrlsMap[animationObject.backgroundImage] = 1;
						
						
					}
				});

				//每页的精灵图片url map不需要生成出去
				delete animationObject.spriteImgUrlsMap;
				
				var currentStageTransitionDirection = Stage.getStageTransitionDirection();
				var currentStageTransitionObj = Stage.getCurrentStageTransitionObj();

				//舞台动画切换对象
				obj.currentStageTransitionObj = currentStageTransitionObj;
				obj.currentStageTransitionDirection = currentStageTransitionDirection;

			}
			//元件模式
			else{
				//元件舞台
				var currentStage = Stage.getCurrentStage();
				if(!currentStage){
					return;
				}
				animationObject = self.getPageAnimationObject(currentStage.id,true,isOutPut,true);

				animationObjectsList.push(animationObject);
			}

			obj.list = animationObjectsList;
			obj.imgUrlsMap = imgUrlsMap;


			return obj;
		
		},
		//下载js文件
		// downLoadJsFile:function(content){
		// 	var aLink = $('<a></a>');
		//     var blob = new Blob([content]);
		//     aLink.prop('download','main.js');
		//     aLink.prop('href',URL.createObjectURL(blob));

		//     var evt = document.createEvent("HTMLEvents");
  //   		evt.initEvent("click", false, false);
  //   		aLink[0].dispatchEvent(evt);

		// },
		removeAllAnimationStyle:function(){
			$('.animation-style').remove();
		},
		getElementAnimationObject:function(sprite,emitType,emitEventName,useNewElement,isOutPut){
			var self = this;
			//精灵对应动画对象
			var a_obj = {};
			//精灵元素
			var elem = sprite.getSpriteElement();
			//没有普通帧展示栏和事件帧展示栏的精灵
			//var isSingleSprite = arguments.length == 3 && typeof arguments[1] != 'string' && typeof arguments[2] != 'string';
			var singleOrOnlyEventFb = arguments.length == 3 && typeof arguments[1] != 'string' && typeof arguments[2] != 'string';
			var isSingleSprite = !sprite.getCommondFramesBar() && !sprite.hasEventFramesBar();

			//精灵的自定义css属性
			a_obj.spriteCustomSetting = sprite.spriteCustomSetting;
			//是否全局精灵对象
			a_obj.isGlobal = sprite.isGlobal;
			//精灵所在舞台id
			a_obj.stageId = sprite.stage.id;
			//精灵id
			a_obj.id = sprite.id;
			//精灵名
			a_obj.name = sprite.name;
			//精灵特定类名
			a_obj.className = sprite.className;
			//精灵层级
			a_obj.zIndex = sprite.zIndex;
			//文本精灵的内容
			if(sprite.isText){
				a_obj.textContent = sprite.textContent;
			}

			if(singleOrOnlyEventFb){
				useNewElement = arguments[1];
				isOutPut = arguments[2];
			}


			//是否新建元素
			//在编辑区域内,不新建元素
			if(!useNewElement){
				a_obj.elem = elem;
				if(sprite.controller){
					a_obj.controller = sprite.controller;
				}
			}
			//新建元素
			else{

				//触发方式和触发事件名(新建元素需要对其绑定对应点击事件监听)
				a_obj.clickActionJumpNext = sprite.clickActionJumpNext;
				a_obj.clickActionEventName = sprite.clickActionEventName;

				if(sprite.imgUrl){
					var imgPathArr = sprite.imgUrl.split('/');
					var imgFileName = imgPathArr[imgPathArr.length - 1];
				}

				if(isOutPut && imgFileName && imgFileName != 'undefined'){
					a_obj.imgUrl = './img/' + imgFileName;
				}
				else if(typeof sprite.imgUrl != 'undefined'){
					a_obj.imgUrl = sprite.imgUrl;
				}
				if(sprite.controller){
					a_obj.controllerRenderData = sprite.controller.controllerRenderData;
				}
			}

			if(singleOrOnlyEventFb){
				//只有精灵没有帧展示栏的情况
				if(isSingleSprite){
					a_obj.spriteCssProperties = $.extend({},sprite.getCssProperties(),{
						'zIndex':a_obj.zIndex
					});
	
				}	
				//只有事件帧展示栏的情况	
				else{
					a_obj.spriteCssProperties = $.extend({},sprite.getInitialCssProperties(),{
						'zIndex':a_obj.zIndex
					});
					
				}
				// 删除图片属性
				delete a_obj.spriteCssProperties['background-image'];

				return a_obj;	
			}






			//精灵
			var framesBar = FramesBar.getFramesBarById(sprite.id,emitType,emitEventName);
			//获取关键帧列表
			var keyFramesList = framesBar.getKeyFrames();
		
			//关键帧对象列表转换为css keyframes
			var keyFramesObj = Util.keyFrames2css(framesBar.totalFramesCount,keyFramesList,isOutPut);
			a_obj.keyframes = keyFramesObj;
			//是否重复
			a_obj.repeatMode = framesBar.getRepeatMode();
			a_obj.repeatTime = framesBar.getRepeatTime();
			//耗时
			a_obj.duration = framesBar.frameTotalDuration;
			//是否播放元件动画
			a_obj.isControllerPlay = framesBar.isControllerPlay;


			//图片文件名
			//a_obj.imgFileName = sprite.imgFileName;

			var animationEndJumpNext = framesBar.getAnimationEndJumpNext();
			var animationEndEventName = framesBar.getAnimationEndEventName();

			if(!useNewElement){
				//要播放的动画对应的帧展示栏renderId
				a_obj.playingFramesBarRenderId = framesBar.renderId;

				//动画结束触发事件
				a_obj.callback = function(){
					//动画结束触发事件
					if(animationEndEventName){
						console.log('trigger:' + animationEndEventName);
						//触发特定的动画结束事件
						$(window).trigger(animationEndEventName,{
							from:'edit',
							stageId:framesBar.stageId
						});
					}

					//触发帧展示栏动画结束事件
					$(window).trigger('framesBarAnimationEnd',{
						framesBar:framesBar
					});

				};

				//动画重复播放触发事件
				a_obj.interationCallback = function(e){
				
					//触发动画重复事件
					$(window).trigger('animationInteration',{
						animationName:e.animationName,
						framesBar:framesBar
					});
				};
			}
			else{
				//为新元素绑定的动画结束触发的事件名
				a_obj.animationEndEventName = animationEndEventName;
				a_obj.animationEndJumpNext = animationEndJumpNext;
			}
		
					


			//是否新建元素
			//在编辑区域内,不新建元素
			if(!useNewElement){
				
				//设置第一个精灵样式为第一个关键帧的样式，避免精灵width和height变化导致编辑模式下动画不对
				a_obj.elem.attr('style','');

				a_obj.elem.css($.extend({
					'z-index':a_obj.zIndex,
					'background-image':'url(' + sprite.imgUrl + ')'
				},sprite.spriteCustomSetting,keyFramesObj['0%']));
			}

			return a_obj;

		},
		//获取特定类型的动画对象
		getTypeAnimationObject:function(pageId,emitType,emitEventName){
			var stage = Stage.getStageById(pageId);
			var self = this;
			//单页动画对象
			var t_obj = {};
			//动画数组
			t_obj.transitionArr = [];


			foreachSpriteWithEventAnimation(pageId,emitEventName,function(sprite){

				var a_obj = self.getElementAnimationObject(sprite,emitType,emitEventName);				
				t_obj.transitionArr.push(a_obj);
				//如果有元件，则开始元件动画播放
				if(sprite.controller && a_obj.isControllerPlay){
					sprite.playControllerAnimation();
				}
			});

			return t_obj;
		},
		// setControllerModeInput:function(mode){
		// 	Util.setDropDownListValue(this.controllerModeSelect,mode == 0 ? '比例缩放' : '固定尺寸');
		// },
		setStageControllerSizeInput:function(width,height){
			this.controllerWidthInput.val(width);
			this.controllerHeightInput.val(height);
		},
		//获取特定页的动画对象
		getPageAnimationObject:function(pageId,useNewElement,isOutPut,isControllerPreview){
			var stage = Stage.getStageById(pageId);
			var page = Page.getPageById(pageId);
			var self = this;
			var jumpType;
			var spriteImgUrlsMap = {};

			//单页动画对象
			var t_obj = {};
			//动画数组
			t_obj.transitionArr = [];
			t_obj.eventTransitionArr = [];
			//翻页行为
			t_obj.actionEventName = stage.actionEventName;

			if(page){
				//获取该舞台的跳转类型
				jumpType = page.getCheckBoxJumpType();
			
				//是否自动滚到下一页
				t_obj.autoJump = jumpType.autoJump;
				t_obj.replay = jumpType.replay;		
				t_obj.preJump = jumpType.preJump;		
			}
			//元件预览模式，设置舞台尺寸
			if(isControllerPreview){
				t_obj.isControllerPreview = isControllerPreview;
			}

			t_obj.width = stage.width;
			t_obj.height = stage.height;

			//背景图片/背景颜色设置
			t_obj.backgroundImage = stage.backgroundImage;

			if(t_obj.backgroundImage && isOutPut){
				t_obj.backgroundImage = './img/' + stage.imgFileName;
			}

			t_obj.backgroundColor = stage.backgroundColor;


			//对应舞台精灵列表
			var spriteList = stage.getSpriteList();

			$(spriteList).each(function(j,sprite){

				if(sprite.imgUrl){
					if(isOutPut){
						spriteImgUrlsMap['./img/' + sprite.imgFileName] = 1;
					}
					else{
						spriteImgUrlsMap[sprite.imgUrl] = 1;
					}
					
				}
		
				//精灵对应的所有帧展示栏(普通/事件)
				var framesBars = FramesBar.getFramesBarById(sprite.id);

				if(framesBars.length){
					$(framesBars).each(function(i,framesBar){

						var a_obj = self.getElementAnimationObject(sprite,framesBar.emitType,framesBar.emitEventName,useNewElement,isOutPut);
						
						//普通帧展示栏
						if(framesBar.emitType == 'none'){
							//获取单个元素的动画对象
							t_obj.transitionArr.push(a_obj);
						}
						else if(framesBar.emitType == 'eventEmit'){

							//保存到键值表
							t_obj.eventTransitionArr.push({
								'emitEventName':framesBar.emitEventName,
								'isListenOnce':framesBar.isListenOnce,
								'animationObj':a_obj
							});
						}
					});

					//只有事件帧展示栏，没有普通帧展示栏的精灵
					if(!sprite.getCommondFramesBar()){
						var a_obj = self.getElementAnimationObject(sprite,useNewElement,isOutPut);
						t_obj.transitionArr.push(a_obj);
					}
				}
				//只有精灵没有对应帧展示栏,只展示静态精灵
				else{
					var a_obj = self.getElementAnimationObject(sprite,useNewElement,isOutPut);
					t_obj.transitionArr.push(a_obj);

				}
			});

			//该页的所有精灵的图片
			t_obj.spriteImgUrlsMap = spriteImgUrlsMap;

			return t_obj;


		},
		//播放动画
		play:function(){
			var self = this;
		
			

			//当前帧展示栏
			var currentFramesBar = FramesBar.getCurrentFramesBar();

			//if(!currentFramesBar) return;

			if(!currentFramesBar){
				var fbArr = FramesBar.getFramesBars();
				if(fbArr.length){
					currentFramesBar = fbArr[0];
					currentFramesBar.select();
				}
				else{
					return;
				}
			}

			$('body').addClass('playing_animation');
			
			//让帧标记回到原点
			currentFramesBar.reset();

			// var firstKeyFrame = currentFramesBar.getKeyFrames()[0];
			// firstKeyFrame.select();

			//当前舞台
			var currentStage = Stage.getCurrentStage();
			var t_obj = this.getTypeAnimationObject(currentStage.id,currentFramesBar.emitType,currentFramesBar.emitEventName);
		
			//播放完该页动画的回调
			t_obj.totalCallback = function(){
				playState = 'end';
				//播放icon
				self.setPlayIcon();
			};

			playState = 'playing';
			//切换到暂停icon
			this.setPauseIcon();

			//动画播放
			T = new Transition();
			T.add(t_obj);
			T.run();

			//触发播放事件
			$(window).trigger('playAnimation',{
				framesBar:currentFramesBar
			});

			//播放动画时禁用预设动画按钮
			this.addPresetAnimationBtn.addClass('disable');
		},
		//暂停动画
		pause:function(){
			var currentStage = Stage.getCurrentStage();
			playState = 'pause';
			//切换到继续icon
			this.setPlayIcon();

			T && T.pause();

			//触发暂停事件
			$(window).trigger('pauseAnimation',{
				stageId:currentStage.id
			});	
		},
		//继续动画
		resume:function(){
			var currentStage = Stage.getCurrentStage();
			playState = 'playing';
			//切换到暂停icon
			this.setPauseIcon();

			T && T.resume();

			//触发继续事件
			$(window).trigger('resumeAnimation',{
				stageId:currentStage.id
			});	
		},
		//停止播放动画
		stop:function(isReset){
			var currentStage = Stage.getCurrentStage();

			if(!currentStage){
				return;
			}

			console.log('Index stop animation');

			$('body').removeClass('playing_animation');
			//播放状态设置为结束状态
			playState = null;
			//停止播放
			T && T.stop();	

			//停止监听事件的动画对象的播放
			if(EventSingleTList.length){
				$.each(EventSingleTList,function(i,st){
					st.stop();
				});

				EventSingleTList = [];
			}	
			//设置播放按钮
			this.setPlayIcon();

			//触发停止事件
			$(window).trigger('stopAnimation',{
				stageId:currentStage.id,
				isReset:isReset
			});	

			//结束播放动画时恢复预设动画按钮
			this.addPresetAnimationBtn.removeClass('disable');
			
		},
		setPlayIcon:function(){
			//重置播放按钮为“播放”icon
			this.playButtonIcon[0].className = 'glyphicon glyphicon-play';
		},
		setPauseIcon:function(){
			//设置按钮为“播放”icon
			this.playButtonIcon[0].className = 'glyphicon glyphicon-pause';
		},
		setStopIcon:function(){
			//设置按钮为“播放”icon
			this.playButtonIcon[0].className = 'glyphicon glyphicon-stop';
		}
	};

	return index;
});