//帧展示栏
define(['tmpl','util','dropmenu','frame_mark','sprite-action-setting','preset_animation_editor','keyframe','frame'],function(tmpl,Util,DropMenu,FrameMark,SpriteActionSetting,PresetAnimationEditor,KeyFrame,Frame){

	var TMPL_NAME = 'framesbar';
	
	//右击当前选中的帧对象
	var currentFrame;
	//当前选中的关键帧
	var currentKeyFrame;
	//当前帧展示栏
	var currentFramesBar;
	//被复制的关键帧对象
	var cloneKeyFrame;
	//正则播放的帧展示栏
	var framesBarPlaying;

	//保存事件帧展示栏的容器
	var eventFramesBarContainerMap = {

	};
	//保存普通帧展示栏的容器
	var commonFramesBarContainerMap = {

	};

	//帧或者关键帧被选择时，更新frameMark的位置
	function onFrameOrKeyFrameSelect(){

		var e = arguments[1];

		var framesBar;
		var index;

		var current = currentKeyFrame || currentFrame;
		var selected = e.keyFrame || e.frame;
		var newCurrent;
	
		//当前的选择
		if(current && current.id != selected.id){
			current.unSelect();
			currentKeyFrame ? currentKeyFrame = null : currentFrame = null;
		}

		e.keyFrame ? newCurrent = currentKeyFrame = e.keyFrame : newCurrent = currentFrame = e.frame;

		index = newCurrent.index;

		framesBar = newCurrent.framesbar || newCurrent.frame.framesbar;
		framesBar.running = false;
		//更新帧标记位置
		framesBar.moveFrameMarkByIndex(index);
	}

	function FramesBar(opt){
		this.init(opt);
	};
	//帧展示栏对象
	FramesBar.prototype = {
		//frameBar对象初始化
		init:function(opt){
			opt = opt || {};
			var self = this;

			this.setData(opt);
			//渲染
			this.render();

			//事件绑定
			this.bind();

			//重新创建帧对象与元素
			this._initFrameArr();
			//创建关键帧
			if(opt.keyFramesDataList){
				this._initKeyFrameArr(opt.keyFramesDataList);
			}

			//帧标记
			this.frameMark = new FrameMark({
				id:this.id,
				stageId:this.stageId,
				container:this.getFramesBarOlElement(),
				frameLength:this.frameLength,
				frameDuration:this.frameDuration,
				totalFramesCount:this.totalFramesCount
			});

		
			//设置该帧展示栏动画结束的行为
			this.setAnimationEndAction({
				actionEventName:this.animationEndEventName,
				actionJumpNext:this.animationEndJumpNext
			});

				
		},
		reset:function(){
			this.frameMark.stop();
			this.running = false;
			// $(window).trigger('framesBarReset',{
			// 	framesBar:this
			// });
		},
		//获取该帧展示栏的数据
		getData:function(){

			//关键帧数据数组
			var keyFramesDataList = [];
			//获取每个关键帧的数据
			$(this.keyFramesArr).each(function(i,kf){
				var kfData = kf.getData();
				keyFramesDataList.push(kfData);
			});

			return {
				id:this.id,
				spriteName:this.spriteName,
				spriteClassName:this.spriteClassName,
				spriteCustomSetting:this.spriteCustomSetting,
				spriteImgFileName:this.spriteImgFileName,
				spriteImgUrl:this.spriteImgUrl,
				//spritePerspective:this.spritePerspective,
				stageId:this.stageId,
				isControllerPlay:this.isControllerPlay,
				frameDuration:this.frameDuration,
				frameTotalDuration:this.frameTotalDuration,
				totalFramesCount:this.totalFramesCount,
				frameLength:this.frameLength,
				keyFramesDataList:keyFramesDataList,
				emitType:this.emitType,
				emitEventName:this.emitEventName,
				repeatMode:this.repeatMode,
				repeatTime:this.repeatTime,
				animationEndEventName:this.animationEndEventName,
				animationEndJumpNext:this.animationEndJumpNext,
				isListenOnce:this.isListenOnce,
				controllerMode:this.controllerMode
			};
		},
		//设置帧展示栏的数据
		setData:function(opt){
			var self = this;
			
			//所属舞台
			this.stageId = opt.stageId;
			//随机id
			this.id = opt.id || Util.getRandomId();
			this.frameTotalDuration = opt.frameTotalDuration || 210;
			//每帧代表的时长
			this.frameDuration = opt.frameDuration || 0.1;
			//一共展示多少帧
			this.totalFramesCount = this.frameTotalDuration / this.frameDuration;
			//帧的可视长度
			this.frameLength = opt.frameLength || 12;
			//精灵名
			this.spriteName = opt.spriteName || '';

			//精灵类名
			this.spriteClassName = opt.spriteClassName || '';

			this.spriteImgUrl = opt.spriteImgUrl;
			this.spriteImgFileName = opt.spriteImgFileName;

			this.spriteCustomSetting = opt.spriteCustomSetting;

			//帧列表
			this.framesArr = [];
			//关键帧列表
			this.keyFramesArr = [];
			//动画触发类型
			this.emitType = opt.emitType || 'none';
			//动画触发事件名
			this.emitEventName = opt.emitEventName || '';

			this.repeatMode = opt.repeatMode;
			this.repeatTime = opt.repeatTime;

			this.isListenOnce = opt.isListenOnce;

			this.animationEndEventName = opt.animationEndEventName;
			this.animationEndJumpNext = opt.animationEndJumpNext;
			//是否同时播放元件动画
			this.isControllerPlay = (typeof opt.isControllerPlay == 'undefined') ? true : opt.isControllerPlay;
			//精灵的元件模式
			this.controllerMode = opt.controllerMode || 0;

			//this.spritePerspective = opt.spritePerspective || 0;


		},
		getSetting:function(){
			return {
				frameTotalDuration:this.frameTotalDuration,
				frameDuration:this.frameDuration,
				totalFramesCount:this.totalFramesCount,
				frameLength:this.frameLength,
				spriteName:this.spriteName,
				spriteClassName:this.spriteClassName,
				spriteImgUrl:this.spriteImgUrl,
				spriteImgFileName:this.spriteImgFileName,
				spriteCustomSetting:$.extend({},this.spriteCustomSetting),
				emitType:this.emitType,
				emitEventName:this.emitEventName,
				repeatMode:this.repeatMode,
				repeatTime:this.repeatTime,
				isListenOnce:this.isListenOnce,
				animationEndEventName:this.animationEndEventName,
				animationEndJumpNext:this.animationEndJumpNext,
				isControllerPlay:this.isControllerPlay,
				controllerMode:this.controllerMode,
				stageId:this.stageId

			};
		},
		setControllerPlayMode:function(isControllerPlay){
			this.isControllerPlay = isControllerPlay;
		},
		//把帧标记移动到某个位置
		moveFrameMarkByIndex:function(index){
			this.frameMark.updateCurrentPositionByFrameIndex(index);
		},
		setSpriteName:function(spriteName){
			this.spriteName = spriteName;
			this.spriteNameContainer.html(spriteName);
		},
		setSpriteClassName:function(spriteClassName){
			this.spriteClassName = spriteClassName;
		},
		setSpriteControllerMode:function(controllerMode){
			this.controllerMode = controllerMode;
			//改变精灵的缩放模式之后，更新cssProerties
			$.each(this.keyFramesArr,function(i,kf){
				kf.updateCssProperties(controllerMode);
			});
			
		},
		setSpriteImg:function(spriteImgFileName,spriteImgUrl){
			this.spriteImgFileName = spriteImgFileName;
			this.spriteImgUrl = spriteImgUrl;
		},
		// setSpritePerspective:function(perspective){
		// 	this.spritePerspective = perspective;
		// },
		setSpriteCustomSetting:function(spriteCustomSetting){
			this.spriteCustomSetting = spriteCustomSetting;
		},
		setEndActionFlag:function(){
			if(this.animationEndEventName){
				this.setEndEventFlag(this.animationEndEventName);
			}
			else{
				this.removeEndEventFlag();
			}


			if(this.animationEndJumpNext){
				this.setEndJumpNextFlag();
			}
			else{
				this.removeEndJumpNextFlag();
			}
		},
		setEndJumpNextFlag:function(){
			var framesBarElement = this.getFramesBarOlElement();
			if(!this.endJumpNextFlag){
				this.endJumpNextFlag = $('<div></div>',{
					class:'framesbar-end-jump-next-flag glyphicon glyphicon-arrow-down'
				});
			}

			this.endJumpNextFlag.appendTo(framesBarElement);
		},
		removeEndJumpNextFlag:function(){
			if(this.endJumpNextFlag){
				this.endJumpNextFlag.remove();
				this.endJumpNextFlag = null;
			}
		},
		//设置结束动画事件标记
		setEndEventFlag:function(animationEndEventName){debugger;
			var framesBarElement = this.getFramesBarOlElement();
			if(!this.endEventFlag){
				this.endEventFlag = $('<div></div>',{
					class:'framesbar-end-event-flag'
				});
			}
			this.endEventFlag.html('end:' + animationEndEventName);
			this.endEventFlag.appendTo(framesBarElement);
		},
		removeEndEventFlag:function(){
			if(this.endEventFlag){
				this.endEventFlag.remove();
				this.endEventFlag = null;
			}
		},
		//设置动画结束的事件触发的事件名
		setAnimationEndAction:function(opt){
			//动画结束时要触发的事件名
			this.animationEndEventName = opt.actionEventName;
			//动画结束时是否跳到下一页
			this.animationEndJumpNext = opt.actionJumpNext;	
			//设置标记	
			this.setEndActionFlag();
		},
		getAnimationEndJumpNext:function(){
			return this.animationEndJumpNext;
		},
		getAnimationEndEventName:function(){
			return this.animationEndEventName;
		},
		setRepeatMode:function(repeatMode){
			this.repeatMode = repeatMode;
		},
		getRepeatMode:function(){
			return this.repeatMode;
		},
		setRepeatTime:function(times){
			this.repeatTime = times;
		},
		getRepeatTime:function(times){
			return this.repeatTime;
		},
		//选择第一个关键帧
		selectFirstKeyFrame:function(){
			return this.keyFramesArr[0];
		},
		//设置动画触发类型
		setAnimationEmitType:function(emitType,emitEventName){
			var container;
			this.emitType = emitType;
			this.emitEventName = emitEventName;

			var framesBarElement = this.getFramesBarElement();

			if(emitType == 'none'){
				//获取对应铍铜帧展示栏的容器
				container = FramesBar.getCommondFramesBarContainer(this.stageId);
				container.append(framesBarElement);
			}
			else if(emitType == 'eventEmit'){
				//获取对应事件的帧展示栏容器
				container = FramesBar.getEventFramesBarContainer(emitEventName,this.stageId);
				container.append(framesBarElement);
			}
		},
		//获取某个关键帧的左边和右边的关键帧
		getLeftRightKeyFrame:function(frame){
			var framesBar = this;
			var keyFramesArr = framesBar.getKeyFrames();
			//该帧的左右关键帧
			var l_kf,r_kf;

			for(var i = 0,l = keyFramesArr.length;i<l;i++){

				kf = keyFramesArr[i];
		
				if(kf.index < frame.index){
					//寻找最后一个左关键帧
					//因为一定有第0帧关键帧，所以这里一定有l_kf
					l_kf = kf;
				}
				else if(kf.index > frame.index){
					//寻找第一个右关键帧
					r_kf = kf;
					break;
				}
			}
			if(!l_kf){
				l_kf = keyFramesArr[0];
			}
			return {
				l_kf:l_kf,
				r_kf:r_kf
			};
		},
		//获取某个索引之前的关键帧，不传索引则获取最后一个关键帧
		getLastKeyFrame:function(index){
			var keyFrames = this.getKeyFrames();
			var lastKeyFrame;


			//如果不传参数 返回最后一个关键帧
			if(!index) return keyFrames[keyFrames.length - 1];

			for(var i = 0,l = keyFrames.length;i < l ; i ++){
				if(keyFrames[i].index < index){
					lastKeyFrame = keyFrames[i];
				}
				else{
					break;
				}
			}

			return lastKeyFrame;
		},
		//根据id删除关键帧
		deleteKeyFrameById:function(keyFrameId){
			var keyFramesArr = this.keyFramesArr;
			var keyFrame;
			for(var i = 0;i < keyFramesArr.length;i++){
				keyFrame = keyFramesArr[i];
				if(keyFrame.id == keyFrameId){
					keyFrame.remove();
					keyFramesArr.splice(i,1);
					return;
				}
			}
		},
		//创建一个新的帧对象
		createFrame:function(){
			return new Frame({
				index:this.framesArr.length,
				framesbar:this,
				frameLength:this.frameLength
			});
		},
		//根据索引获取frame对象
		getFrameByIndex:function(index){
			return this.framesArr[index];
		},
		//根据id获取frame对象
		getFrameById:function(id){
			var framesArr = this.framesArr;
			for(var i = 0,l = framesArr.length;i<l;i++){
				if(framesArr[i].id == id){
					return framesArr[i];
				}
			}
		
		},
		//根据id获取关键帧对象
		getKeyFrameById:function(id){
			var keyFramesArr = this.keyFramesArr;
			for(var i = 0,l = keyFramesArr.length;i<l;i++){
				if(keyFramesArr[i].id == id){
					return keyFramesArr[i];
				}
			}
		},
		//获取关键帧列表
		getKeyFrames:function(){
			return this.keyFramesArr = this.keyFramesArr.sort(function(k1,k2){
				return k1.index > k2.index;
			});;
		},
		//获取第一个关键帧
		getFirstKeyFrame:function(){
			return this.keyFramesArr[0];
		},
		//添加一个关键帧
		addKeyFrame:function(index,setting){
			// //如果要添加关键帧的地方还没有帧,补充帧
			// if(index >= this.framesArr.length){
			// 	this.updateTotalDuration((index + 1) * this.frameDuration);
			// }

			
			//解决诡异的 复制之后修改文字，切换页，双击编辑文字，文字变为原来的 bug	
			// if(setting.textContent){
			// 	delete setting.textContent;
			// }
			setting = {
				display:setting.display,
				width:setting.width,
				height:setting.height,
				easing:setting.easing,
				x:setting.x,
				y:setting.y,
				backgroundColor:setting.backgroundColor || 'transparent',
				rotateZ:setting.rotateZ,
				rotateX:setting.rotateX,
				rotateY:setting.rotateY,
				skewX:setting.skewX,
				skewY:setting.skewY,
				perspective:setting.perspective,
				opacity:setting.opacity,
				customSetting:setting.customSetting,
				controllerMode:setting.controllerMode,
				initialWidth:setting.initialWidth,
				initialHeight:setting.initialHeight
			};


			//var lastKeyFrameSetting = this.keyFramesArr[this.keyFramesArr.length - 1];
			//上一个选择的关键帧或关键帧
			var preFrame = currentKeyFrame ? currentKeyFrame : currentFrame;
			if(preFrame){
				var preFramesBar = preFrame.frame ? preFrame.frame.framesbar : preFrame.framesbar;
			}

			var newKeyFrame;
			var targetFrame;

			//使用传入的关键帧对象
			if(typeof index == 'object'){
				newKeyFrame = index;
				//要添加到的帧对象
				targetFrame = newKeyFrame.frame;
			}
			else{
				//要添加到的帧对象
				targetFrame = this.getFrameByIndex(index);

				//如果原来就有 先remove掉（关键帧粘贴到关键帧的情况）
				if(targetFrame.keyFrame){
					this.removeKeyFrameByIndex(targetFrame.index);
				}

				//创建一个新的关键帧
				newKeyFrame = new KeyFrame({
					index:index,
					frame:targetFrame,
					setting:setting
					
				});

			}

			//为帧对象设置关键帧
			targetFrame.setKeyFrame(newKeyFrame);
			//增加到关键帧数组
			this.keyFramesArr.push(newKeyFrame);



			//如果没有指定的设置，则把新的关键帧的设定设置为上一个关键帧的设定
			if(!newKeyFrame.setting){
				//上一个关键帧的设置
				var lastKeyFrame = this.getLastKeyFrame(newKeyFrame.index);

				if(lastKeyFrame && lastKeyFrame.setting){
					newKeyFrame.setSetting(lastKeyFrame.setting);
				}
			}
		
			//触发增添关键帧事件
			$(window).trigger('addKeyFrame',{
				keyFrame:newKeyFrame
			});

			return newKeyFrame;
		},
		//选中
		select:function(){
		
			var framesBar = this.getFramesBarElement();
			if(framesBar.hasClass('selected')) return;

			console.log('Framsbar selected');
			
			framesBar.addClass('selected');
			//触发选择帧展示栏事件
			$(window).trigger('framesBarSelect',{
				selectedFramesBar:this
			});

			//触发选择帧展示栏之后的事件
			$(window).trigger('afterFramesBarSelect',{
				selectedFramesBar:this
			});
		},
		//取消选中
		unSelect:function(){
			var framesBar = this.getFramesBarElement();

			if(!framesBar.hasClass('selected')) return;

			framesBar.removeClass('selected');
			//触发取消选择帧展示栏事件
			$(window).trigger('framesBarUnSelect',{
				unSelectedFramesBar:this
			});
		},
		//获取帧显示栏元素
		getFramesBarElement:function(){
			var id = this.emitType == 'eventEmit' ? TMPL_NAME + '_event_' + this.emitEventName + '_' + this.id : TMPL_NAME + '_' + this.id;
			if(!this.element || !this.element.length){
				this.element = $('#'+ id);
			}
			return this.element;
		},
		//增加一个帧
		addFrame:function(){
			this.framesArr.push(this.createFrame());
		},
		//初始化帧列表
		_initFrameArr:function(){

			var i = 0 ;
			
			while( i < this.totalFramesCount){
				this.addFrame();
				i++;
			}
		},
		//初始化关键帧
		_initKeyFrameArr:function(keyFramesDataList){
			var self = this;

			$(keyFramesDataList).each(function(i,kf){
				//重新创建关键帧
				self.addKeyFrame(kf.index,kf.setting);
			});
		},
		//事件绑定
		bind:function(){
			var self = this;

			//动画开始，禁用输入
			$(window).on('playAnimation',function(){
				self.lockCheckBox.prop('disabled',true);
				self.hideCheckBox.prop('disabled',true);
				self.deleteBtn.prop('disabled',true);
			});

			//动画开始，恢复输入
			$(window).on('stopAnimation',function(){
				self.lockCheckBox.prop('disabled',false);
				self.hideCheckBox.prop('disabled',false);
				self.deleteBtn.prop('disabled',false);
			});

		},
		setHideCheckBox:function(isHide){
			this.hideCheckBox.prop('checked',isHide);
		},
		//设置锁checkbox的状态
		setLockCheckBox:function(isLock){
			this.lockCheckBox.prop('checked',isLock);
		},
		//更新长度
		updateTotalDuration:function(frameTotalDuration){
			//修改之前的
			var preFrameTotalDuration = this.frameTotalDuration;

			this.frameTotalDuration = Number(Number(frameTotalDuration).toFixed(1));
			//更新输入框的总时长值
			FramesBar.setFrameDurationInput(this.frameTotalDuration);

			this.totalFramesCount = Math.round((Number(this.frameTotalDuration) / this.frameDuration));
			
			this._updateVisibleLength();

			//同时更新帧标记的时长和总帧数
			this.frameMark.updateTotalDurationAndFramesCount(frameTotalDuration,this.totalFramesCount);
			//缩短了
			if(preFrameTotalDuration > frameTotalDuration){
				//最后一个帧
				var lastFrame = this.framesArr[this.framesArr.length - 1];

				//关键帧选择
				if(lastFrame.keyFrame){
					lastFrame.keyFrame.select();
				}
				//帧选择
				else{
					lastFrame.select();
				}
			}

		},
		//更新显示长度,多除少补
		_updateVisibleLength:function(){
			var framesArr = this.framesArr;
			var keyFramesArr = this.keyFramesArr;
			var totalFramesCount = this.totalFramesCount;
			var frameMark = this.frameMark;
			

			if(totalFramesCount < framesArr.length){
				//遍历处理帧对象列表
				for(var i = 0; i < framesArr.length;i++){
					var f = framesArr[i];
					//移除多余帧
					if(f.index + 1 > totalFramesCount){

						if(f == currentFrame){
							currentFrame = null;
						}
						//删除对应关键帧
						if(f.keyFrame){
							if(currentKeyFrame == f.keyFrame){
								currentKeyFrame = null;
							}
							
							this.removeKeyFrameByIndex(f.index);
						}
						//删除帧
						this.removeFrameByIndex(f.index);
						i--;
					}
				};
			}
			//增加新增的帧
			else if(totalFramesCount > framesArr.length){
				var countToAdd = totalFramesCount - framesArr.length;
			
				for(var i = 0 ; i < countToAdd; i++){
					this.addFrame();
				}
			}
	
			//添加到最后，避免影响间隔条文样式
			frameMark.element.appendTo(frameMark.container);

			this.totalFramesCount = totalFramesCount;

		},
		//获取帧展示栏的列表元素
		getFramesBarOlElement:function(){
			var element = this.getFramesBarElement();
			return $(element.find('.frames-bar',element));
		},

		//渲染帧展示栏
		render:function(){
			var id = this.emitType == 'eventEmit' ? TMPL_NAME + '_event_' + this.emitEventName + '_' + this.id : TMPL_NAME + '_' + this.id;
			//渲染id
			this.renderId = id;

			var frameBarTmplStr = tmpl[TMPL_NAME]({
				id:id,
				spriteName:this.spriteName,
				emitType:this.emitType,
				emitEventName:this.emitEventName
			});
			var container;

			if(this.emitType == 'eventEmit'){
				//获取对应事件的帧展示栏容器
				container = FramesBar.getEventFramesBarContainer(this.emitEventName,this.stageId);
			}
			else{
				container = FramesBar.getCommondFramesBarContainer(this.stageId);
			}

			container.append(frameBarTmplStr);

			var element = this.getFramesBarElement();

			//删除按钮
			this.deleteBtn = $('.delete-frames-bar-button');
			//锁定checkbox
			this.lockCheckBox = $('.lock-frames-bar-checkbox',element);
			//隐藏checkbox
			this.hideCheckBox = $('.hide-frames-bar-checkbox',element);
			//类名显示容器
			this.spriteNameContainer = $('.frames-bar-name',element);

			console.log('Single FramesBar Render!');
		},
		//显示
		show:function(){
			var element = this.getFramesBarElement();
			element.show();
		},
		//隐藏
		hide:function(){
			var element = this.getFramesBarElement();
			element.hide();
		},
		removeFrameByIndex:function(index){
			for(var i = 0;i < this.framesArr.length;i ++){
				if(this.framesArr[i].index == index){
					this.framesArr[i].remove();
					this.framesArr.splice(i,1);
					
					return;
				}
			}
		},
		//根据索引删除关键帧
		removeKeyFrameByIndex:function(index){
			for(var i = 0 ; i < this.keyFramesArr.length;i ++){
				if(this.keyFramesArr[i].index == index){
					this.keyFramesArr[i].remove();
					this.keyFramesArr.splice(i,1);

					return;
				}
			}

			var frame = this.getFrameByIndex(index);
			frame.keyFrame = null;


		},
		//移除
		remove:function(){
			var element = this.getFramesBarElement();
			element.remove();

			$.each(this.framesArr,function(i,frame){
				frame && frame.remove();
			});

			$.each(this.keyFramesArr,function(i,keyFrame){
				keyFrame && keyFrame.remove();
			});

			this.framesArr = [];
			this.keyFramesArr = [];

			//触发帧展示栏删除事件
			$(window).trigger('framesBarRemove',{
				framesBar:this
			});	
		}
	};
	//初始化
	FramesBar.init = function(opt){
		opt = opt || {};
		//帧展示栏外层容器
		this.framesBarWraper = $('.frames-bar-wraper');
		//帧展示栏容器
		this.framesBarContainer = $('.frames-bar-container');
		//事件触发帧展示栏
		this.eventEmitFramsBarWrap = $('.event-emit-frames-bar-container');
		//帧工具栏
		this.framesToolBarContainer = $('.frames-tool-bar-container');
		//时长输入框
		this.durationInput = $('.frames-bar-duration-input');
		//设置帧展示栏时重复次数
		this.framesBarRepeatTimeInput = $('.framesbar-repeat-time');
		//设置帧展示栏重复模式
		this.framesBarRepeatModeInput = $('.framesbar-repeat-mode');
		//设置是否播放元件动画的输入框
		this.framesBarControllerPlayInput = $('.framesbar-controller-play');
		//外层容器
		this.framesBarWraperContainer = $('.frames-bar-wraper-container');

		//事件绑定
		this.bind();
		//设置数据
		this.setData(opt);

		

		SpriteActionSetting.init();

		this.initFramesBarTimeMark();



	}
	//获取所有帧展示栏的数据
	FramesBar.getData = function(){
		var framesBarDataArr = [];

		$(this.framesBarArr).each(function(i,fb){
			var framesBarData = fb.getData();
			framesBarDataArr.push(framesBarData);
		});

		return {
			frameDuration:this.frameDuration,
			frameTotalDuration:this.frameTotalDuration,
			totalFramesCount:this.totalFramesCount,
			frameLength:this.frameLength,
			framesBarDataArr : framesBarDataArr,
			currentFrameId: currentFrame && currentFrame.id,
			currentKeyFrameId: currentKeyFrame && currentKeyFrame.id,
			currentFramesBarId: currentFramesBar && currentFramesBar.id,
			currentFramesBarEmitType:currentFramesBar && currentFramesBar.emitType,
			currentFramesBarEmitEventName:currentFramesBar && currentFramesBar.emitEventName

		};	
	};
	//设置帧展示栏数据
	FramesBar.setData = function(opt){
		opt = opt || {};
		var framesBarDataArr = opt.framesBarDataArr;
		var self = this;

		//每帧代表的时长
		this.frameDuration = opt.frameDuration || 0.1;
		//默认帧时长(s)
		this.frameTotalDuration = opt.frameTotalDuration || 6;
		//一共展示多少帧
		this.totalFramesCount = this.frameTotalDuration / this.frameDuration;
		//每帧可视长度(px)
		this.frameLength = opt.frameLength || 12;
		//帧展示栏列表
		this.framesBarArr = [];

		cloneKeyFrame = null;
			
		this.clearDomList();
	
		if(framesBarDataArr){
			//数据转化成对象
			$(framesBarDataArr).each(function(i,framesBarData){
				var framesBar = new FramesBar(framesBarData);
				FramesBar.add(framesBar);
			});

		}

		//恢复当前所选帧展示栏
		if(opt.currentFramesBarId){
			currentFramesBar = this.getFramesBarById(opt.currentFramesBarId,opt.currentFramesBarEmitType,opt.currentFramesBarEmitEventName);
		}
		// var firstFramesBar = this.framesBarArr[0];
		// if(firstFramesBar){
		// 	var firstKeyFrame = firstFramesBar.getKeyFrames()[0];
		// 	if(firstKeyFrame){
		// 		firstKeyFrame.select();
		// 	}
		// }

	};
	//清除dom列表
	FramesBar.clearDomList = function(){
		var framesBarDomList = this.framesBarWraper.find('.frames-bar-single-wrap');
		$(framesBarDomList).remove();
	};
	//禁用相关输入框
	FramesBar.disableInput = function(){
		this.durationInput.prop('disabled',true);
		this.framesBarControllerPlayInput.prop('disabled',true);
		this.framesBarRepeatModeInput.prop('disabled',true);
		this.framesBarRepeatTimeInput.prop('disabled',true);
	};
	//启用相关输入框
	FramesBar.enableInputs = function(){
		this.durationInput.prop('disabled',false);
		this.framesBarControllerPlayInput.prop('disabled',false);
		this.framesBarRepeatModeInput.prop('disabled',false);
		this.framesBarRepeatTimeInput.prop('disabled',false);
	};
	


	//事件绑定
	FramesBar.bind = function(){
		var self = this;

		//监听设置动画结束行为事件
		$(window).on('confirmAction',function(){
			var e = arguments[1];
			if(e.actionEmitType == 'animationEnd' && currentFramesBar){
				//动画结束触发行为
				currentFramesBar.setAnimationEndAction(e);
			}
		});

		//选择一个帧展示栏的时候，先复位其他帧展示栏的frameMark
		$(window).on('framesBarSelect',function(){
			var e = arguments[1];
			var selectedFramesBar = e.selectedFramesBar;
			var repeat = selectedFramesBar.getRepeatMode();

			var framesBarsList = self.getFramesBarsByStageId(selectedFramesBar.stageId);
			//避免不同类型的帧展示栏之间，选择其中一种类型的帧展示栏，另一种类型的帧展示栏的frameMark没有复位
			$.each(framesBarsList,function(i,fb){
				if(!self.isSameFramesBar(fb,selectedFramesBar)){
					//让frameMark复位
					fb.reset();
				}
			});

			//当前帧展示栏的选择/取消选择
			if(currentFramesBar && !self.isSameFramesBar(selectedFramesBar,currentFramesBar)){
				currentFramesBar.unSelect();
			}
			currentFramesBar = selectedFramesBar;

			//设置时长输入框显示
			self.setFrameDurationInput(selectedFramesBar.frameTotalDuration);
			//更新帧展示栏的播放次数/重复播放checkbox
			self.setRepeatCheckBoxAndInput(repeat,selectedFramesBar.repeatTime);
			//更新是否播放元件动画的checkbox
			self.setControllerPlayModeCheckBox(selectedFramesBar.isControllerPlay);	
		});


		//精灵选择事件
		$(window).on('afterSpriteSelect',function(){
			var e = arguments[1];
			var sprite = e.selectedSprite;
			//正在播放的帧展示栏动画的renderId
			var commonFramesBar = sprite.getCommondFramesBar() || self.getFramesBarById(sprite.id,'none','');
			var fb;
			var playingRenderId = sprite.getPlayingFramesBarRenderId();

			if(playingRenderId){
				fb = self.getFramesBarByRenderId(playingRenderId);
			}
			else if(currentFramesBar){
				if(currentFramesBar.emitEventName){
					fb = sprite.getEventFramesBar(currentFramesBar.emitEventName);
				}
			}

			if(!fb){
				if(commonFramesBar){
					fb = commonFramesBar;
				}
				else{

					var eventFramesBars = self.getFramesBarById(sprite.id);
					if(eventFramesBars.length){
						fb = eventFramesBars[0];
					}
					else{
						if(currentFramesBar){
							currentFramesBar.unSelect();
							currentFramesBar = null;
						}
						if(currentKeyFrame){
							currentKeyFrame.unSelect();
							currentKeyFrame = null;
						}
						if(currentFrame){
							currentFrame.unSelect();
							currentFrame = null;
						}
						return;					
					}
				}
			}

			//跳到特定帧展示栏的位置
			self.movePositionTo(fb);


			

			//帧展示标记
			var frameMark = fb.frameMark;
			
			//标记当前所在的帧索引
			var currentFrameIndex = frameMark.getCurrentIndex();
			var frame = fb.getFrameByIndex(currentFrameIndex);

			//选择当前所在帧
			if(frame.keyFrame){
				frame.keyFrame.select();
			}
			else{
				frame.select();
			}

		});

		//监听结束动画事件，自动选择第一个关键帧
		$(window).on('stopAnimation',function(){
			var e = arguments[1];
			//正在播放的动画帧展示栏或当前选择的帧展示栏
			var framesBar = framesBarPlaying || currentFramesBar;
			//选择第一个帧
			if(e.isReset && framesBar){
				var firstKeyFrame = framesBar.getKeyFrames()[0];
				firstKeyFrame.select();
			}
			framesBarPlaying = null;

			//动画结束，启用输入框
			self.enableInputs();		
		});


		//暂停播放帧标记动画
		$(window).on('pauseAnimation',function(){
			var e = arguments[1];
			var framesBarsList = self.getFramesBars();
			$.each(framesBarsList,function(i,fb){
				
				if(fb.stageId == e.stageId && fb.running){
					fb.frameMark.pause();
				}
			});	

		});

		//监听动画继续播放事件，继续播放帧标记动画
		$(window).on('resumeAnimation',function(){
			var e = arguments[1];
			var framesBarsList = self.getFramesBars();

			$.each(framesBarsList,function(i,fb){
				if(fb.stageId == e.stageId && fb.frameMark.isPaused){
					fb.frameMark.play();
				}
			});		
		});


		//监听页面选择事件，隐藏/显示对应帧展示栏列表，并选择第一个帧展示栏的第一个关键帧
		$(window).on('pageSelect',function(){
			var e = arguments[1];
			var pageId = e.selectedPage.id;
			var firstFramesbar;
			var firstKeyFrame;
			var allLastestKeyFrame;
			var lastestKeyFrame;

			//更新改页的帧展示栏的对应显示与隐藏
			self.updateFramesBarsVisibility(pageId);
			var framesBars = FramesBar.getFramesBarsByStageId(pageId);
			//选择页的时候，选择第一个帧展示栏以及第一个关键帧
			if(framesBars.length){
				// //选取第一个帧展示栏
				// firstFramesbar = framesBars[0];
				// firstFramesbar.select();

				// firstKeyFrame = firstFramesbar.getKeyFrames()[0];
				// //选取第一个关键帧
				// if(firstKeyFrame){
				// 	firstKeyFrame.select();
				// }


				//选取普通帧展示栏中拥有最大位置的关键帧来选中
				for(var i = 0; i < framesBars.length; i++){
					var fb = framesBars[i];
					
					if(fb.emitType == 'none'){
						var keyFrames = fb.getKeyFrames();
						lastestKeyFrame = keyFrames[keyFrames.length - 1];

						if(!allLastestKeyFrame || lastestKeyFrame.index > allLastestKeyFrame.index){
							allLastestKeyFrame = lastestKeyFrame;
						}

					}
				}

				if(allLastestKeyFrame){
					allLastestKeyFrame.select();
				}
			}


			

		});
		//监听精灵删除事件，删除一个帧展示栏
		$(window).on('spriteDelete',function(){
			var e = arguments[1];
			var id = e.sprite.id;
			//根据id删除对应帧展示栏
			self.removeFramesBarById(id);
			self.updateFramesBarsVisibility(e.sprite.stage.id);
		});

		//监听动画播放之前的事件，播放之前选择第一帧关键帧，避免结束动画取消aniation-name属性后，回到之前点击选择的帧的style样式
		// $(window).on('beforePlayAnimation',function(){
		// 	var e = arguments[1];
		// 	var framesBar = e.framesBar;
		// 	//获取精灵的所有对应帧展示栏
		// 	var framesBars = self.getFramesBarById(framesBar.id);

		// 	//如果该精灵某个帧展示栏还在播放动画，则停止该帧展示栏帧标记的运动
		// 	$(framesBars).each(function(i,fb){
		// 		if(fb.running){
		// 			fb.frameMark.stop();
		// 		}
		// 	});
		// });
		//播放动画的时候 取消选择当前帧/关键帧、帧展示栏，并让framemark重头开始播放
		$(window).on('playAnimation',function(){
			var e = arguments[1];

			//播放的帧展示栏
			if(!framesBarPlaying){			
				framesBarPlaying = currentFramesBar;
			}

			//播放动画时取消选择
			if(currentFramesBar) {
				currentFramesBar.unSelect();
				currentFramesBar = null;
			}
			if(currentKeyFrame) {
				currentKeyFrame.unSelect();
				currentFramesBar = null;
			}
			if(currentFrame) {
				currentFrame.unSelect();
				currentFrame = null;
			}

			var playFramesBar = e.framesBar;
			var framesBarsList = self.getFramesBars();

			//播放帧展示栏的frameMark动画
			$.each(framesBarsList,function(i,fb){
				if(fb.stageId == playFramesBar.stageId && self.isSameTypeFramesBar(fb,playFramesBar)){
					fb.frameMark.stop();
					fb.frameMark.play();
					fb.running = true;
				}
			});

			//动画播放时，禁用输入框
			self.disableInput();
		});
		

		//动画重复时，让frameMark也重复播放
		$(window).on('animationInteration',function(){
			var e = arguments[1];
			//动画对应的帧展示栏
			var framesBar = e.framesBar;

			framesBar.frameMark.stop();
			//帧标记也跟随精灵动画重复播放
			framesBar.frameMark.play();
		
		});


		//单文本改变 全部关键帧重置initialWidth和initialHeight
		$(window).on('spriteSingleTextChange',function(){
			var e = arguments[1];
			var sprite = e.sprite;
			var resetInitialSize = e.resetInitialSize;
			//对比上次的缩放
			var scale;
			debugger;
			if(resetInitialSize){
			
				var fbs = self.getFramesBarById(sprite.id);
				$.each(fbs,function(i,fb){

					var kfs = fb.getKeyFrames();
					$.each(kfs,function(j,kf){

						scaleX = sprite.initialSetting.width / kf.setting.initialWidth;
						scaleY = sprite.initialSetting.height / kf.setting.initialHeight;
					
						kf.setSetting({
							width:kf.setting.width * scaleX,
							height:kf.setting.height * scaleY,
							initialWidth:sprite.initialSetting.width,
							initialHeight:sprite.initialSetting.height						
						});
					});
				});
			}
		});


		//监听精灵位置更新事件,设置/增加关键帧的属性值
		$(window).on('spritePositionUpdate',function(){
			var e = arguments[1];
			var sprite = e.sprite;
			var spriteSetting = sprite.getSetting();

			
			var initialWidth = sprite.initialSetting.width;
			var initialHeight = sprite.initialSetting.height;

			//if(!currentFramesBar) return;

			//从没有普通帧展示栏也没有事件帧展示栏的精灵选择过来该精灵
			if(!currentFramesBar){
				framesBar = sprite.getCommondFramesBar();

				if(!framesBar){
					var eventFramesBars = self.getFramesBarById(sprite.id);
					if(eventFramesBars && eventFramesBars.length){
						framesBar = eventFramesBars[0];
					}
					else{
						return;
					}
				}
				frameIndex = 0;

			}
			else{

				//初始width和height值
				var firstKeyFrame = currentFramesBar.getFirstKeyFrame();
				if(!firstKeyFrame) return;


				var initialSetting = firstKeyFrame.getSetting();

				currentFramesBar.spriteImgFileName = spriteSetting.imgFileName;
				currentFramesBar.spriteImgUrl = spriteSetting.imgUrl;

			
				if(spriteSetting.initialWidth == null){
					spriteSetting.initialWidth = initialSetting.initialWidth;
				}
				if(spriteSetting.initialHeight == null){
					spriteSetting.initialHeight = initialSetting.initialHeight;
				}

				var frameIndex = currentKeyFrame ? currentKeyFrame.index : currentFrame.index;
				var framesBar ;

				//对应帧展示栏
				if(sprite.id == currentFramesBar.id){
					framesBar = currentFramesBar;
				}
				else{
					if(currentFramesBar.emitEventName){
						framesBar = sprite.getEventFramesBar(currentFramesBar.emitEventName);
					}
					else{
						framesBar = sprite.getCommondFramesBar();
					}
				}
				
				
				if(!framesBar){
					return;
				}
			}



			//对应帧
			frame = framesBar.getFrameByIndex(frameIndex);

			if(!frame){
				return;
			}


			if(!frame.keyFrame){
				//新增的关键帧默认无缓动
				spriteSetting.easing = 'linear';
				//增加一个关键帧
				framesBar.addKeyFrame(frame.index,spriteSetting);
			}
			else{
				//缓动设置还是用自己的
				spriteSetting.easing = frame.keyFrame.setting.easing;


				frame.keyFrame.setSetting(spriteSetting);

			}
			//选择对应帧展示栏和关键帧
			//framesBar.select();
			frame.keyFrame.select();

		});

		//编辑关键帧属性发生变化，则改变当前关键帧的属性值
		$(window).on('keyFrameSettingChanged',function(){
			var e = arguments[1];
			if(!currentFramesBar) return;
			var firstKeyFrame = currentFramesBar.getFirstKeyFrame();
			//初始设定
			var initialSetting = firstKeyFrame.getSetting();
			//元件的缩放模式
			e.keyFrameSetting.controllerMode = currentFramesBar.controllerMode;
		
			if(e.keyFrameSetting.initialWidth == null){
				e.keyFrameSetting.initialWidth = initialSetting.initialWidth;
			}
			if(e.keyFrameSetting.initialHeight == null){
				e.keyFrameSetting.initialHeight = initialSetting.initialHeight;
			}
		
			//当前选择的是一个关键帧，则改变关键帧属性
			if(currentKeyFrame){
				currentKeyFrame.setSetting(e.keyFrameSetting);
			}
			//当前选择的是一个帧，则增加关键帧
			else if(currentFrame){
				//当前帧所在的索引
				var index = currentFrame.index;
				//增加关键帧
				var newKeyFrame = currentFrame.framesbar.addKeyFrame(index,e.keyFrameSetting);	
				newKeyFrame.select();	
			}
		});


		//编辑精灵属性发生变化，则改变当前精灵的属性值
		$(window).on('spriteSettingChanged',function(){
			if(currentFramesBar){


				var e = arguments[1];
				var spriteSetting = e.spriteSetting;
				var framesBarId = currentFramesBar.id;
				var framesBarsArr = self.getFramesBarById(framesBarId);
				//普通帧展示栏和事件帧展示栏同时设置
				$.each(framesBarsArr,function(i,fb){
					//设置精灵的名字
					fb.setSpriteName(spriteSetting.name);
					//设置帧展示栏的精灵类名
					fb.setSpriteClassName(spriteSetting.className);
					//设置帧展示栏的缩放模式
					fb.setSpriteControllerMode(spriteSetting.controllerMode);
					
					//设置精灵的自定义样式
					fb.setSpriteCustomSetting(spriteSetting.spriteCustomSetting);
					
					//设置精灵图片
					fb.setSpriteImg(spriteSetting.imgFileName,spriteSetting.imgUrl);
				});
			
			}
		});	


		//监听选择关键帧事件
		$(window).on('keyFrameSelect',onFrameOrKeyFrameSelect);
		//监听选择帧事件
		$(window).on('frameSelect',onFrameOrKeyFrameSelect);


		//删除了帧展示栏，则更新事件帧展示栏状态展示
		$(window).on('framesBarRemove',function(){
			var e = arguments[1];
			var framesBar = e.framesBar;
			self.updateFramesBarsVisibility(framesBar.stageId);
			//释放当前有关被删除帧展示栏的选择引用
			if(currentFramesBar == framesBar){
				currentFramesBar = null;
			}
			if(currentFrame && currentFrame.framesbar == framesBar){
				currentFrame = null;
			}
			else if(currentKeyFrame && currentKeyFrame.frame && currentKeyFrame.frame.framesbar == framesBar){
				currentKeyFrame = null;
			}
			//删除一个帧展示栏后，默认选择该舞台第一个帧展示栏第一个关键帧
			var framesBars = self.getFramesBarsByStageId(framesBar.stageId);
			var firstFramesBar = framesBars[0];
			if(firstFramesBar){
				var firstKeyFrame = firstFramesBar.getFirstKeyFrame();
				if(firstKeyFrame){
					firstKeyFrame.select();
				}
				
			}
		});



		//监听拖动开始事件
		$(window).on('spriteDragStart',function(){
			var e = arguments[1];
			var sprite = e.sprite;
			var fb;
			if(currentFramesBar.emitEventName){
				fb = sprite.getEventFramesBar(currentFramesBar.emitEventName);	
			}
			if(!fb){
				fb = sprite.getCommondFramesBar();
			}
			//当前帧索引	
			var index = currentFrame ? currentFrame.index : currentKeyFrame.index;
			var targetFrame = fb.getFrameByIndex(index);
			targetFrame.select();	

		});



		//帧展示栏动画结束改变一下状态
		$(window).on('framesBarAnimationEnd',function(){
			var e = arguments[1];
			if(e.framesBar){
				e.framesBar.running = false;
			}
		});

		//点击删除按钮,删除对应帧展示栏
		$(this.framesBarWraper).on('click','.delete-frames-bar-button',function(e){
			if(!window.confirm('是否删除该时间轴？')){
				return;
			}
			var framesBarElement = $(e.target).closest('.frames-bar-single-wrap');
			var emitType = framesBarElement.data('emit-type');
			var emitEventName = framesBarElement.data('emit-event-name');
			var id = Util.getOriginId(framesBarElement.prop('id'));
		
			self.removeFramesBarById(id,emitType,emitEventName);

		});


		//改变当前帧展示栏的重复次数
		this.framesBarRepeatTimeInput.on('change',function(e){
			var repeatTimes = $(e.target).val();
			//设定当前帧展示栏的重复状态
			if(currentFramesBar){
				currentFramesBar.setRepeatTime(repeatTimes || 'infinite');
			}		
		});

		//帧展示栏重复播放设定
		this.framesBarRepeatModeInput.on('change',function(e){
			var repeatTimeInput = self.framesBarRepeatTimeInput;
			var target = $(e.target);
			var checkVal = target[0].checked;
			//设定当前帧展示栏的重复状态
			var currentFramesBar =  FramesBar.getCurrentFramesBar();
			if(!currentFramesBar){
				return;
			}
			currentFramesBar.setRepeatMode(checkVal);
		
			if(checkVal){
				repeatTimeInput.show();
			}
			else{
				repeatTimeInput.hide();
			}
		});
		//设置是否同时播放元件动画
		this.framesBarControllerPlayInput.on('change',function(e){
			var target = $(e.target);
			var checkVal = target[0].checked;
			//设定当前帧展示栏的是否播放元件动画
			if(currentFramesBar){
				currentFramesBar.setControllerPlayMode(checkVal);
			}
		});



		// //锁定checkbox选择
		// $(this.framesBarWraper).on('change','.lock-frames-bar-checkbox',function(e){
		// 	var isChecked = $(this).prop('checked');
		// 	var framesBarElement = $(e.target).closest('.frames-bar-single-wrap');
		// 	var id = Util.getOriginId(framesBarElement.prop('id'));
			
		// 	//改变同一精灵所有帧展示栏的锁定状态
		// 	var framesBarsArr = self.getFramesBarById(id);

		// 	$.each(framesBarsArr,function(i,fb){
		// 		fb.isLock = isChecked;
		// 		fb.setLockCheckBox(isChecked);
		// 	});

		// 	//锁状态的变更事件通知
		// 	$(window).trigger('lockStateChanged',{
		// 		lock:isChecked,
		// 		id:id,
		// 		//是否改变当前选中精灵的锁定状态
		// 		isCurrentSprite:id == currentFramesBar.id
		// 	});
			
		// });



		// //隐藏状态改变
		// $(this.framesBarWraper).on('change','.hide-frames-bar-checkbox',function(e){

		// 	var isChecked = $(this).prop('checked');
		// 	var framesBarElement = $(e.target).closest('.frames-bar-single-wrap');
		// 	var id = Util.getOriginId(framesBarElement.prop('id'));


		// 	var framesBarsArr = self.getFramesBarById(id);
		// 	//改变同一精灵所有帧展示栏的隐藏状态
		// 	$.each(framesBarsArr,function(i,fb){
		// 		fb.isHide = isChecked;
		// 		fb.setHideCheckBox(isChecked);
		// 	});
		// 	//隐藏状态的变更事件通知
		// 	$(window).trigger('hideStateChanged',{
		// 		isHide:isChecked,
		// 		id:id
		// 	});
		// });


		//帧时长输入框设置
		this.durationInput.on('change',function(){
			if(!currentFramesBar) return;
			//改变后的时长
			var duration = Number(self.durationInput.val());
			//事件数值设置限制
			if(isNaN(duration) || duration === 0 || duration > 10){
				return;
			}
			currentFramesBar.updateTotalDuration(duration);
		});

		//帧展示栏列表内的点击事件
		$(document.body).on('click','.frames-bar',function(e){
			var target = $(e.target);
			var frameBarTarget = target.closest('.frames-bar-single-wrap');

			//点击的帧展示栏
			if(frameBarTarget.length){
				var frameBarId = Util.getOriginId(frameBarTarget.attr('id'));
				var emitType = frameBarTarget.data('emit-type');
				var emitEventName = frameBarTarget.data('emit-event-name');

				var framesBar = self.getFramesBarById(frameBarId,emitType,emitEventName);

				//选择帧展示栏
				//framesBar.select();

				//点击中一个帧
				if (target.hasClass('frame')) {
					var frameId = Util.getOriginId(target.attr('id'));

					//点击中得帧
					var frame = framesBar.getFrameById(frameId);
					//帧被选中(如果有关键帧，则选中关键帧)
					if(frame.keyFrame){
						target = $(target.children()[0])
					}
					else{
						frame.select();
					}
					
				}

				//点击中一个关键帧
				if(target.hasClass('keyframe')){
					//点击中的关键帧
					var keyFrameId = Util.getOriginId(target.attr('id'));
					var keyFrame = framesBar.getKeyFrameById(keyFrameId);
					//关键帧选择
					keyFrame.select();				
				}
			}
		});

		//右击帧展示栏显示菜单
		this.framesBarWraper.on('mousedown','.frames-bar',function(e){
			
			if(e.button == 2){
				// //点击的帧展示栏
				var framesBarElement = $(this).closest('.frames-bar-single-wrap');
				var framesBarId = Util.getOriginId(framesBarElement.attr('id'));
				var emitType = framesBarElement.data('emit-type');
				var emitEventName = framesBarElement.data('emit-event-name');

				var framesBar = FramesBar.getFramesBarById(framesBarId,emitType,emitEventName);
				// //点击选中状态
				// framesBar.select();

				//选中的对象
				var target = $(e.target);

				//选中帧
				if(target.hasClass('frame')){
					var frameId = Util.getOriginId(target.attr('id'));
					//获取对应id的帧对象
					var frame = framesBar.getFrameById(frameId);
					//帧被选中
					frame.select();
					//展示右击菜单
					self.showDropMenu(e);
				}
				//选中关键帧
				else if(target.hasClass('keyframe')){
					//关键帧id
					var keyFrameId = Util.getOriginId(target.attr('id'));
					//获取关键帧对象
					var keyFrame = framesBar.getKeyFrameById(keyFrameId);
					//选择该关键帧
					keyFrame.select();
					//展示右击菜单
					self.showDropMenu(e);

				}

			}

		});

		//屏蔽鼠标右击
		this.framesBarWraper.on('contextmenu',function(e){
			e.preventDefault();
		});
	};

	// 跳到特定帧展示栏的位置显示
	FramesBar.movePositionTo = function(fb){
		//先只对普通帧展示栏做这个优化
		if(fb.emitType != 'none') return;
		var container = this.framesBarContainer;
		var innerContainer = $('.common-stage-container');

		if(innerContainer.length){

			var innerContainerTop = innerContainer.offset().top;
			var fbElem = fb.getFramesBarElement();
			var top = fbElem.offset().top;

			//滚动条跳到特定位置
			container.prop('scrollTop', top - innerContainerTop);
		}
		
	};

	//设置重复模式的input和checkbox
	FramesBar.setRepeatCheckBoxAndInput = function(repeat,repeatTime){
		var framesBarRepeatTimeInput = this.framesBarRepeatTimeInput;
		//更新checkbox的值为当前帧展示栏的重复播放状态
		this.framesBarRepeatModeInput.prop('checked',repeat || false);
		if(repeat){
			framesBarRepeatTimeInput.show();
			framesBarRepeatTimeInput.val(repeatTime);
		}
		else{
			framesBarRepeatTimeInput.hide();
			framesBarRepeatTimeInput.val('');
		}
	};
	//设置是否同时播放元件动画
	FramesBar.setControllerPlayModeCheckBox = function(isControllerPlay){
		this.framesBarControllerPlayInput.prop('checked',isControllerPlay);
	};

	//获取当前帧展示栏
	FramesBar.getCurrentFramesBar = function(){
		return currentFramesBar;
	};


	//根据帧展示栏id删除帧展示栏
	FramesBar.deleteFramesBarByStageId = function(stageId){
		var framesBarArr = this.framesBarArr;
		//对应舞台的帧展示栏集合
		for(var i = 0;i < framesBarArr.length; i ++){
			if(framesBarArr[i].stageId == stageId){
				framesBarArr[i].remove();
				framesBarArr.splice(i,1);
				i--;
			}
		}
		
	};

	//根据舞台id展示对应帧展示栏，并选择第一个帧展示栏的第一个关键帧
	FramesBar.showFramesBarsByStageId = function(stageId){
			//对应舞台的帧展示栏集合
			var framesbarList = this.getFramesBarsByStageId(stageId);
			//显示所有
			$.each(framesbarList,function(i,fb){
				fb.show();
			});

			//该舞台的第一个帧展示栏
			var firstFramesbar = framesbarList[0];
			if(firstFramesbar){
				//存在至少一个帧展示栏，启用工具栏
				this.enableToolBar();
			}
			else{
				//不存在至少一个帧展示栏，禁用工具栏
				this.disableToolBar();
			}
	};

	//启用顶部工具栏
	FramesBar.enableToolBar = function(){
		this.framesToolBarContainer.find('input').prop('disabled',null);
	};
	//禁用顶部工具栏
	FramesBar.disableToolBar = function(){
		this.framesToolBarContainer.find('input').prop('disabled',1);
	};

	//更新事件帧展示栏容器的显示与隐藏
	FramesBar.updateEventFramesBarContainer = function(){
		var eventFramesBarContainer = $('.event-framesbar-container');
		
		eventFramesBarContainer.each(function(i,container){
			container = $(container);
			var framesBarDomList = $(container.find('.frames-bar'));
			var isHide = true;

			if(!framesBarDomList.length){
				// container.hide();
			}
			else{
				framesBarDomList.each(function(j,framesBarDom){
					if($(framesBarDom).css('display') != 'none'){
						isHide = false;
					}
				});
			}

			if(isHide){
				container.hide();
			}
			else{
				container.show();
			}
		});
	};

	//更新事件帧展示栏集合的显示/隐藏状态
	FramesBar._updateVisbilityByStage = function(mapObj,stageId){
		
		$.each(mapObj,function(n,obj){
			if(n == stageId){
				obj.container.show();
			}
			else{
				obj.container.hide();
			}
		});
	};

	//更新帧展示栏的显示或隐藏
	FramesBar.updateFramesBarsVisibility = function(stageId){
		//更新每一页普通帧展示栏的显示/隐藏状态
		this._updateVisbilityByStage(commonFramesBarContainerMap,stageId);
		//更新每一页的事件帧展示栏的显示/隐藏状态
		this._updateVisbilityByStage(eventFramesBarContainerMap,stageId);
	};
	//根据舞台id获取对应的帧展示栏
	FramesBar.getFramesBarsByStageId = function(stageId){
		var targetFramesBarArr = [];
		$.each(this.framesBarArr,function(i,fb){
			if(fb.stageId == stageId){
				targetFramesBarArr.push(fb);
			}
		});
		return targetFramesBarArr;
	};
	//根据事件名获取对应的帧展示栏
	FramesBar.getFramesBarsByEmitEventName = function(emitEventName){
		var targetFramesBarArr = [];
		$.each(this.framesBarArr,function(i,fb){
			if(fb.emitEventName == emitEventName){
				targetFramesBarArr.push(fb);
			}
		});
		return targetFramesBarArr;
	};

	//获取普通帧展示栏的容器
	FramesBar.getCommondFramesBarContainer = function(stageId){
		var wrap = this.framesBarContainer;
		if(!commonFramesBarContainerMap[stageId]){
			var stageCommonContainer = $('<div></div>',{
				class:'common-stage-container'
			});
			stageCommonContainer.data('stageId',stageId);
			wrap.append(stageCommonContainer);

			commonFramesBarContainerMap[stageId] = {
				container:stageCommonContainer
			};

		}

		return commonFramesBarContainerMap[stageId].container;
	};

	//获取特定事件的帧展示栏容器
	FramesBar.getEventFramesBarContainer = function(emitEventName,stageId){
		var wrap = this.eventEmitFramsBarWrap;
		//不存在该舞台的事件容器
		if(!eventFramesBarContainerMap[stageId]){
			//该舞台的事件容器
			var stageEventContainer = $('<div></div>',{
				class:'event-stage-container'
			});
			//保留对应的舞台id
			stageEventContainer.data('stageId',stageId);

			//舞台容器增加到外层
			wrap.append(stageEventContainer);

			eventFramesBarContainerMap[stageId] = {
				container:stageEventContainer,
				framesBarsContainerMap:{}
			};

		}

		//该舞台不存在该事件的帧展示栏容器
		if(!eventFramesBarContainerMap[stageId].framesBarsContainerMap[emitEventName]){

			var container = eventFramesBarContainerMap[stageId].container;

			//新建对应事件的容器
			var eventFramesBarContainer = $('<div></div>',{
				class:'event-framesbar-container'
			});
			//对应事件名的标签
			var eventNameTag = $('<div></div>',{
				class:'event-name-framesbar-tag'
			});

			//设置事件名tag
			eventNameTag.text(emitEventName);
			//事件帧展示栏容器增加事件名tag
			eventFramesBarContainer.append(eventNameTag);
			//事件名保存到dom元素属性
			eventFramesBarContainer.data('event-name',emitEventName);

			//增加到舞台容器
			container.append(eventFramesBarContainer);
			//保存到map
			eventFramesBarContainerMap[stageId].framesBarsContainerMap[emitEventName] = eventFramesBarContainer;
		}

		return eventFramesBarContainerMap[stageId].framesBarsContainerMap[emitEventName];
	};


	//显示右击菜单
	FramesBar.showDropMenu = function(e){
		//菜单显示项
		var items = [];

		//创建
		if(!this.dropMenu){
			this.dropMenu = this.createDropMenu();
		}

		//击中普通帧，并且拥有复制的关键帧，并且是当前帧展示栏，则显示粘贴关键帧选项
		if((currentFrame || currentKeyFrame) && cloneKeyFrame && cloneKeyFrame.frame && cloneKeyFrame.frame.framesbar.id == currentFramesBar.id){
			items.push({
				text:'粘贴',
				value:'pasteKeyFrame'
			});
		}
	
		//击中关键帧,
		if(currentKeyFrame){
			//显示复制关键帧选项
			items.push({
				text:'复制',
				value:'copyKeyFrame'		
			});

			//对除了第一个之外的关键帧显示删除按钮
			if(currentKeyFrame.index > 0){
				items.push({
					text:'删除关键帧',
					value:'deleteKeyFrame'
				});
			}
		}
		//击中帧展示栏
		if(currentKeyFrame || currentFrame){
			items.push({
				text:'设置动画结束行为',
				value:'setAnimationEndAction'
			});
			items.push({
				text:'插入预设动画',
				value:'addPresetAnimation'
			});
			items.push({
				text:'删除时间轴',
				value:'deleteFramesBarEvent'
			});
		}

		//设置显示项，显示右击菜单
		this.dropMenu.show({
			items:items,
			left:e.pageX,
			top:e.pageY
		});
	};

	//根据id获取帧展示栏对象
	FramesBar.getFramesBarById = function(id,emitType,emitEventName){
		var framesBarArr = this.framesBarArr;
		var framesBar;
		var arr = [];

		for(var i = 0,l = framesBarArr.length;i<l;i++){
			framesBar = framesBarArr[i];
			if(!emitType){
				if(framesBar.id == id){
					arr.push(framesBar);
				}
			}
			else if(framesBar.id == id && framesBar.emitType == emitType && framesBar.emitEventName == emitEventName){
				return framesBar;
			}
		}

		if(!emitType){
			return arr;
		}
	};

	//根据id移除帧展示对象
	FramesBar.removeFramesBarById = function(id,emitType,emitEventName){
	
		var framesBarArr = this.framesBarArr;
		var framesBar;

		for(var i = 0;i < framesBarArr.length;i++){
			framesBar = framesBarArr[i];
			if(framesBar.id == id){

				if((emitType && emitType != framesBar.emitType) || (emitEventName && emitEventName != framesBar.emitEventName)){
					continue;
				}

				framesBarArr.splice(i,1);
				framesBar.remove();
				i--;


				//删除事件帧展示栏时，如果已经被删空了，则把父容器也删除
				if(framesBar.emitEventName){
					
					var stageId = framesBar.stageId;
					var container = this.getEventFramesBarContainer(framesBar.emitEventName,stageId);

					//如果该事件帧展示容器下面已经没有帧展示栏了，则删除该容器
					if(!$('.frames-bar-single-wrap',container).length){

						eventFramesBarContainerMap[stageId].framesBarsContainerMap[framesBar.emitEventName] = null;
						container.remove();
					}
				}

			}
		}
		

	};


	//获取当前帧
	FramesBar.getCurrentFrame = function(){
		if(currentKeyFrame){
			return currentKeyFrame.frame;
		}
		else{
			return currentFrame;
		}
	};

	//获取所有帧显示栏
	FramesBar.getFramesBars = function(){
		return this.framesBarArr;
	};
	//获取普通帧展示栏
	FramesBar.getCommonFramesBars = function(){
		return this.framesBarArr.filter(function(framesBar){
			return framesBar.emitType == 'none';
		});
	};
	//获取事件触发的帧展示栏
	FramesBar.getEventEmitFramesBars = function(){
		return this.framesBarArr.filter(function(framesBar){
			return framesBar.emitType == 'eventEmit';
		});
	};

	//增加一个帧显示栏
	FramesBar.add = function(sprite,emitType,emitEventName,isListenOnce){
		var id;
		var stageId;
		var newFramesBar;


		//传入的是framesBar
		if(sprite instanceof FramesBar){
			newFramesBar = sprite;
		}
		else{
			id = sprite.id;
			stageId = sprite.stage.id;
			emitType = emitType || 'none';

			//初始化一个新的帧展示栏
			newFramesBar = new FramesBar({
				id:id,
				emitType:emitType,
				emitEventName:emitEventName,
				framesArr:this.framesArr,
				stageId:stageId,
				frameTotalDuration:this.frameTotalDuration,
				frameDuration:this.frameDuration,
				frameLength:this.frameLength,
				isListenOnce:isListenOnce,
				spriteName:sprite.name,
				spriteClassName:sprite.className,
				spriteImgUrl:sprite.imgUrl,
				spriteImgFileName:sprite.imgFileName,
				spriteCustomSetting:sprite.spriteCustomSetting,
				controllerMode:sprite.controllerMode
			});
		}

		//增加到帧展示栏数组
		this.framesBarArr.push(newFramesBar);
		//更新帧展示栏的显示与隐藏
		this.updateFramesBarsVisibility(newFramesBar.stageId);

		//新增帧展示栏事件触发
		$(window).trigger('framesBarAdd',{
			framesBar:newFramesBar
		});

		//跳到底部
		if(newFramesBar.emitType == 'none'){
			this.framesBarContainer.prop('scrollTop', 10000);
		}
		else{
			//todo:事件帧展示栏添加也跳到特定的展示栏位置
		}
		

		return newFramesBar;
	};

	//根据renderId获取帧展示栏对象
	FramesBar.getFramesBarByRenderId = function(renderId){
		var framesBar;
		$(this.framesBarArr).each(function(i,fb){
			if(fb.renderId == renderId){
				framesBar = fb;
			}
		});
		return framesBar;
	};

	FramesBar.isSameFramesBar = function(fb1,fb2){
		return fb1.id == fb2.id && fb1.emitType == fb2.emitType && fb1.emitEventName == fb2.emitEventName;
	};

	FramesBar.isSameTypeFramesBar = function(fb1,fb2){
		return fb1.emitType == fb2.emitType && fb1.emitEventName == fb2.emitEventName;
	};

	//创建右击菜单
	FramesBar.createDropMenu = function(){
		var self = this;

		return new DropMenu({
			container:$('.frames-bar-wraper'),
			//点击回调
			callback:function(index,item){
				var name = item.value;
				//复制关键帧
				if(name == 'copyKeyFrame'){
					//重置被复制的关键帧对象
					cloneKeyFrame = currentKeyFrame;
				}
				//删除关键帧
				else if(name == 'deleteKeyFrame'){

					if(currentKeyFrame){
						if(!window.confirm('是否删除该关键帧？')){
							return;
						}

						//删除当前所选的关键帧
						currentFramesBar.deleteKeyFrameById(currentKeyFrame.id);
						//获取某个索引之前的一个关键帧对象
						var keyFrameBeforeDelete = currentFramesBar.getLastKeyFrame(currentKeyFrame.index);
						//选择被删除关键帧的前一个关键帧
						keyFrameBeforeDelete.select();
					}
				}
				//粘贴复制的关键帧
				else if(name == 'pasteKeyFrame'){
					var frame = currentFrame ? currentFrame : currentKeyFrame.frame;
					debugger;
					var newKeyFrame = currentFramesBar.addKeyFrame(frame.index,cloneKeyFrame.setting);
					newKeyFrame.select();
				}
				//设置动画结束事件
				else if(name == 'setAnimationEndAction'){
					SpriteActionSetting.show('animationEnd',{
						actionEventName:currentFramesBar.animationEndEventName,
						actionJumpNext:currentFramesBar.animationEndJumpNext
					});
				}
				//插入预设动画
				else if (name == 'addPresetAnimation'){
					PresetAnimationEditor.show();
				}
				//删除帧展示栏
				else if(name == 'deleteFramesBarEvent'){
					if(!window.confirm('是否删除该时间轴？')){
						return;
					}
				
					//当前要删除的帧展示栏是事件帧选择栏
					self.removeFramesBarById(currentFramesBar.id,currentFramesBar.emitType,currentFramesBar.emitEventName);
				}
			}
		});
	};
	//更新输入的时长数字
	FramesBar.setFrameDurationInput = function(duration){
		this.durationInput.val(duration);
	};

	FramesBar.getFramesBars = function(){
		return this.framesBarArr;
	};

	//初始化时间标记
	FramesBar.initFramesBarTimeMark = function(){

		var timeline = $('.frames-bar-timeline');


		for(var i = 0; i < 21; i++ ){
			var newFramesMark = $('<li></li>')
				.addClass('time-mark')
				.html(i * 5);

			timeline.append(newFramesMark);

			if(i == 0){
				newFramesMark.css({
					left:-3
				});
			}
			else{
				newFramesMark.css({
					'left':  Math.floor((( i * 5 - 1) * 13 ) + (12 - newFramesMark.width() * 0.8) / 2)
				});
			}
		}	

		timeline.css({
			width:1300
		});
	};


	//删除，释放资源
	FramesBar.remove = function(){
		$.each(this.framesBarArr,function(i,fb){
			fb && fb.remove();
		});
		this.framesBarArr = [];
		currentFramesBar = null;
		currentFrame = null;
		currentKeyFrame = null;
	};
	

	return FramesBar;
});