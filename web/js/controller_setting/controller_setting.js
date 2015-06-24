define(['tmpl','util','controller','transition','main_show','win_manager'],function(tmpl,Util,Controller,Transition,MainShow,WinManager){

	var TMPL_SIZE_NAME = 'controller_size_setting';
	var TMPL_LIST_NAME = 'controller_list';
	var TMPL_LIST_ITEM_NAME = 'controller_list_item';

	var ControllerSetting = {};

	//当前选择的元件数据
	var currentControllerData;
	//当前选择的元件
	var currentController;
	//当前所选列表元素
	var currentTarget;

	var controllersMap = {};


	//把元件编辑数据转换为render数据
	function convert2RenderData(controllerEditData){
		//编辑数据的舞台对象
		var	controllerStageData = controllerEditData.localStagesData.stageDataArr[0];
		var controllerSpriteListData = $.extend({},controllerStageData.spriteListData);
		var	controllerFramesBarDataArr = controllerEditData.localFramesBarsData.framesBarDataArr;

		var controllerRenderData = {
			id:controllerEditData.id,
			name:controllerEditData.name,
			stageId:controllerStageData.id,
			eventTransitionArr:[],
			transitionArr:[],
			width:controllerStageData.width,
			height:controllerStageData.height,
			mode:controllerEditData.mode
		};


		$.each(controllerFramesBarDataArr,function(i,framesBarData){
			//关键帧数据
			var keyFramesDataList = framesBarData.keyFramesDataList;
		
			//对应的精灵数据
			var spriteData = controllerSpriteListData[framesBarData.id];
			//有帧展示栏的精灵
			spriteData.markHasFramesBar = true;

			
			var a_obj = {
				id:spriteData.id,
				className:spriteData.className,
				textContent:spriteData.textContent,
				imgUrl:spriteData.imgUrl,
				zIndex:spriteData.zIndex,
				imgFileName:spriteData.imgFileName,
				duration:framesBarData.frameTotalDuration,
				stageId:framesBarData.stageId,
				clickActionJumpNext:spriteData.clickActionJumpNext,
				clickActionEventName:spriteData.clickActionEventName,
				keyframes:Util.keyFrames2css(framesBarData.totalFramesCount,keyFramesDataList),
				animationEndEventName:framesBarData.animationEndEventName,
				animationEndJumpNext:framesBarData.animationEndJumpNext,
				repeatMode:framesBarData.repeatMode,
				repeatTime:framesBarData.repeatTime,
				spriteCustomSetting:spriteData.spriteCustomSetting
			};


			//普通帧展示栏
			if(framesBarData.emitType == 'none'){
				controllerRenderData.transitionArr.push(a_obj);
			}
			//事件帧展示栏
			else{
				var eventTransitionObj = {
					emitEventName:framesBarData.emitEventName,
					isListenOnce:framesBarData.isListenOnce,
					animationObj:a_obj
				};

	
				
				controllerRenderData.eventTransitionArr.push(eventTransitionObj);
			}

		});

		$.each(controllerSpriteListData,function(name,spriteData){
			//没有帧展示栏的精灵
			if (!spriteData.markHasFramesBar) {
				controllerRenderData.transitionArr.push({
					id:spriteData.id,
					className:spriteData.className,
					textContent:spriteData.textContent,
					imgUrl:spriteData.imgUrl,
					zIndex:spriteData.zIndex,
					imgFileName:spriteData.imgFileName,
					clickActionJumpNext:spriteData.clickActionJumpNext,
					clickActionEventName:spriteData.clickActionEventName,
					//用于没有帧展示栏的精灵显示样式
					//spriteCssProperties:$.extend({},spriteData.spriteCssProperties,spriteData.spriteCustomSetting)
					spriteCssProperties:spriteData.spriteCssProperties
				});
			};
		});

		return controllerRenderData;

	};



	//元件尺寸设置窗口
	var BaseSetting = {
		init:function(opt){
			this.name = 'BaseSetting';
			this.headerName = '新建元件';
			opt = opt || {};
		},

		bind:function(){

		},
		render:function(){

			if(!this.element || !this.element.length){
				var id = TMPL_SIZE_NAME + '_' + this.id;
				//菜单模板字符串
				var tmplString = tmpl[TMPL_SIZE_NAME]({
					id:id
				});	
				WinManager.add(this.name,tmplString);

				//元素
				this.element = $('#' + id);	
				//宽度输入框
				this.widthInput = $('.controller-setting-width-input');
				//高度输入框
				this.heightInput = $('.controller-setting-height-input');
				//名字输入框
				this.nameInput = $('.controller-setting-name-input');
				//事件绑定
				this.bind();		
			}
		},
		reset:function(){
			this.widthInput.val('100');
			this.heightInput.val('100');
			this.nameInput.val('');
		},
		show:function(){
			var self = this;

			if(!this.element || !this.element.length){
				this.render();
			}
			
			WinManager.show({
				headerName:this.headerName,
				name:this.name,
				onConfirm:function(){
					
					//触发设定元件宽高事件
					$(window).trigger('confirmControllerSetting',{
						width:self.widthInput.val(),
						height:self.heightInput.val(),
						name:self.nameInput.val()
					});

					self.reset();
				},
				onCancel:function(){
					self.reset();
				}
			});

		}
	};

	//元件选择列表
	var List = {
		init:function(opt){
			opt = opt || {};
			this.headerName = '插入元件';
			this.name = 'ControllerList';
			//所有元件的数据
			this.allControllerData = [];	
			//每页数据大小
			this.PAGE_SIZE = 10;
			//当前页索引
			this.currentPageIndex = 0;
		},
		save:function(){

		},
		//使元件元素在预览区域内居中
		centerControllerElement:function(controllerElement,width,height){
			controllerElement.css({
				'position':'absolute',
				'left':'50%',
				'top':'50%',
				'margin-left':-width / 2,
				'margin-top':-height / 2
			});
		},
		//获取元件列表数据
		getListData:function(page,size,callback){
			if(this.isLoading){
				return;
			}
			// var listDataStr = localStorage.getItem('controllerRenderDataList');
			// var listData = JSON.parse(listDataStr);

			// console.log(listData);

			// var listDataStr = localStorage.getItem('controllerEditDataList');
			// var listData = JSON.parse(listDataStr);
			var self = this;
			this.isLoading = true;
			self.loadingTips.text('加载中...');
			self.loadingTips.show();


			Util.getControllerList(page,size,function(data){
				var listData = data.ctrls;
				var controllerList = [];

				self.isLoading = false;



				//最后一页
				if(data.total_page == data.cur_page){
					self.isEnd = true;
					if(page == 0 && !listData.length){
						self.loadingTips.text('暂无元件数据');
					}
					else{
						self.loadingTips.text('');
					}
					
				}
				else{
					self.loadingTips.hide();
				}
				

				$.each(listData,function(id,c_data){
					if(!c_data.ctrl_data){
						c_data.ctrl_data = JSON.stringify(c_data);
					} 
					
					var controllerEditData = JSON.parse(c_data.ctrl_data);
					controllerEditData.id = c_data._id;
					controllerList.push(controllerEditData);

				
				});

				self.allControllerData = self.allControllerData.concat(controllerList);

				self.currentPageIndex = page;

				callback && callback(controllerList);
					
				
			});

		
		},
		renderList:function(page,size){
			var self = this;
			this.getListData(page,size,function(controllerList){
			
				var listTmplStr = tmpl[TMPL_LIST_ITEM_NAME]({
					controllerList:controllerList
				});	
				//渲染列表 
				self.list.append(listTmplStr);

			});
			

		},
		bind:function(){
			var self = this;

			//点击列表
			$('.controller-list').on('click',function(e){
				var target = $(e.target);

				if(currentTarget){
					currentTarget.removeClass('active');
				}

				//为所选列表元素增加active类
				target.addClass('active');

				currentTarget = target;
				
				$(self.allControllerData).each(function(i,data){
					
					if(data.id == target.data('id')){
						var controllerEditData = data;
				

						if(currentController){
							currentController.remove();
						}
						//编辑数据转换为渲染数据
						var controllerRenderData = convert2RenderData(controllerEditData);

						//清空预览区域
						//self.preview.html('');

						//使用元件渲染数据实例化元件对象
						var controller = new Controller({
							controllerRenderData:controllerRenderData,
							container:self.preview
						});

						var controllerElement = controller.element;
						//使元件元素在预览窗口内居中显示
						self.centerControllerElement(controllerElement,controller.width,controller.height);

						var preview = self.preview;
						var previewWidth = preview.width();
						var previewHeight = preview.height();
						var controllerWidth = controller.width;
						var controllerHeight = controller.height;

						//元件比容器大，按预览容器比例缩放到可完全显示元件的范围
						if(previewWidth < controllerWidth || previewHeight < controllerHeight){
							if(controllerWidth > controllerHeight){
								var wScale = previewWidth / controllerWidth;
								controllerElement.css({
									'-webkit-transform':'scale(' + wScale + ',' + wScale + ')'
								});
							}
							else if(previewHeight < controllerHeight || previewHeight < controllerHeight){
								var hScale = previewHeight / controllerHeight;
								controllerElement.css({
									'-webkit-transform':'scale(' + hScale + ',' + hScale + ')'
								});
							}
						}




						//停止当前元件动画
						if(currentController){
							currentController.remove();
						}

						//播放动画
						controller.playAnimation();

						currentController = controller;
					

					}
				});
			});

			//点击删除元件
			$('.controller-list').on('click','.controller-delete-btn',function(){
				if(!window.confirm('是否删除该元件？')){
					return;
				}
				var target = $(this).closest('.list-group-item');
				var id = target.data('id');
				var controllerData = self.getControllerLocalData(id);
				var scroller = $('.controller-list-wrap');
				//根据id删除元件
				self.deleteControllerById(controllerData.id,function(){

					target.remove();
			
					if(!self.isEnd && Number(scroller.prop('scrollHeight')) <= scroller.height()){
						// 加载下一页数据
						self.loadNextPage();
					}

					alert('删除成功');
				});
			});

			//分页滚动加载
			$('.controller-list-wrap').on('scroll',function(){

				if(self.isEnd) return;

				var scroller = $(this);
				//滚动到底部
				if((scroller.scrollTop() + scroller.height())  >=  Number(scroller.prop('scrollHeight'))){
					// 加载下一页数据
					self.loadNextPage();
				}
			
			});

			//移动上去显示删除按钮
			$('.controller-list').on('mouseover','.list-group-item',function(){
				var item = $(this);
				var deleteBtn = $(item.find('.controller-delete-btn'));

				window.clearTimeout(self.deleteTimeID);

				self.deleteTimeID = window.setTimeout(function(){
					deleteBtn.show();
				},1000);
				
			});

			//移动出去隐藏删除按钮
			$('.controller-list').on('mouseleave','.list-group-item',function(){
				var item = $(this);
				window.clearTimeout(self.deleteTimeID);
				var deleteBtn = $(item.find('.controller-delete-btn'));
				deleteBtn.hide();
				
			});
		},
		//加载下一页数据
		loadNextPage:function(){
			// 加载下一页数据
			this.renderList(this.currentPageIndex + 1,this.PAGE_SIZE);
		},
		//根据id删除元件
		deleteControllerById:function(id,success){
			Util.deleteController(id,function(){
				success && success();
			});
		},
		//根据id获取元件数据
		getControllerLocalData:function(id){
			var controllerEditData;
			$.each(this.allControllerData,function(i,data){
				if(data.id == id){
					controllerEditData = data;
					return false;
				}
			});
			return controllerEditData;
		},
		//更新元件的本地数据
		updateControllerLocalData:function(controllerData){
			for(var i = 0,l = this.allControllerData.length; i < l; i++){
				var data = this.allControllerData[i];
				if(data.id == controllerData.id){
					this.allControllerData[i] = controllerData;
					return;
				}
			}		
		},

		render:function(){
			if(!this.element){
				var id = TMPL_LIST_NAME + '_' + this.id;
				//菜单模板字符串

				var tmplString = tmpl[TMPL_LIST_NAME]({
					id:id
				});	

				WinManager.add(this.name,tmplString);

				//元素
				this.element = $('#' + id);	
				//列表容器
				this.list = $('.controller-list');
				//预览容器
				this.preview = $('.controller-list-preview');
				//加载中标识
				this.loadingTips = $('.controller-list-loading');

				//事件绑定
				this.bind();			
			}			
		},
		// 重置
		reset:function(){

			currentController && currentController.remove();
			currentController = null;
			currentControllerData = null;
			//所有元件的数据
			this.allControllerData = [];	
			//当前页索引
			this.currentPageIndex = 0;

			this.isLoading = false;
			this.isEnd = false;		

			currentTarget = null;

			$('.controller-list').html('');	
		},
		show:function(){
			
			var self = this;

			this.reset();

			if(!this.element){
				this.render();
			}


			WinManager.show({
				name:this.name,
				headerName:this.headerName,
				onConfirm:function(){
					//触发选择元件事件
					$(window).trigger('confirmControllerSelect',{
						controllerRenderData:currentController.controllerRenderData
					});	
					
				},
				onCancel:function(){
				
				}
			});

			this.renderList(0,this.PAGE_SIZE);

		}
	};




	ControllerSetting = {
		BaseSetting:BaseSetting,
		List:List,
		convert2RenderData:convert2RenderData
	};

	return ControllerSetting;

});