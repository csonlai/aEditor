define(['tmpl','util','color_picker'],function(tmpl,Util,ColorPicker){
	var TMPL_NAME = 'csseditor';
	//当前图片文件名
	var currentImgFileName;
	var isLock;
	var currentWorkId;
	//css属性编辑器
	var cssEditor = {
		init:function(){
			//所在容器元素
			this.container = $('.css-editor');
			//渲染
			this.render();

			//关键帧属性设置容器
			this.keyFrameSettingContainer = $('.keyframe-setting-container');
			//精灵属性设置容器
			this.spriteSettingContainer = $('.sprite-setting-container');

			//显示/隐藏选择
			this.show_select = $('.show-select');
			//精灵图片数据串文本框
			this.input_img_text = $('.img-select-text-input');
			//图片文件名
			this.input_img_label = $('.img-select-text');
			//精灵图片选择
			this.input_img = $('.img-select-input');
			//尺寸width
			this.input_width = $('.position-width-input');
			//尺寸height
			this.input_height = $('.position-height-input');
			//位置x输入框
			this.input_x = $('.position-x-input');
			//位置y输入框
			this.input_y = $('.position-y-input');
			//背景颜色
			this.input_background_color = $('.background-image-input');
			//选择颜色按钮
			this.select_background_color = $('.select-background-color-btn');
			//倾斜x输入框
			this.input_skewx = $('.skewx-input');
			//倾斜y输入框
			this.input_skewy = $('.skewy-input');

			//缩放输入框
			// this.input_scale = $('.scale-input');
			//旋转z输入框
			this.input_rotatez = $('.rotatez-input');
			//旋转x输入框
			this.input_rotatex = $('.rotatex-input');
			//旋转y输入框
			this.input_rotatey = $('.rotatey-input');
			//视距输入框
			this.input_perspective = $('.perspective-input');
			//透明度输入框
			this.input_opacity = $('.opacity-input');
			//缓动类型选择框
			this.input_easing = $('.ease-select');
			//新增自定义样式
			this.add_custom_setting = $('.add-custom-setting');
			//新增自定义精灵样式
			this.add_sprite_custom_setting = $('.add-sprite-custom-setting');
			//自定义样式列表
			this.custom_style_list = $('.custom-style-list');
			//精灵自定义样式列表
			this.sprite_custom_style_list = $('.sprite-custom-style-list');


			//指定类名输入框
			this.input_class = $('.class-input');
			//指定精灵名输入框
			this.input_name = $('.name-input');
			//精灵缓动类型
			this.input_sprite_easing = $('.sprite-ease-select');
			//填充类型输入框
			this.controllerModeSelect = $('.controller-mode-select');
			this.controllerModeSelect.data('selectedValue','比例缩放');

			this.allInput = $('input',this.container);

			this.allSelect = $('.dropdown-toggle',this.container);

			this.initColorPicker();

			//事件绑定
			this.bind();
			//reset
			this.reset();
		},
		setWorkId:function(workId){
			currentWorkId = workId;
		},

		initColorPicker:function(){
			var self = this;
		
			this.input_background_color.colpick({
				layout:'hex',
				colorScheme:'dark',
				color:Util.colorHex(self.input_background_color.val()),
				submit:0,
				onChange:function(colorObj){
					var colorObj = arguments[2];
					var doNotChange = arguments[5];
					var colorRgbaStr = 'rgba(' + colorObj.r + ',' + colorObj.g + ',' + colorObj.b + ',1)';
				
					self.input_background_color.val(colorRgbaStr);

					if(doNotChange) return;

					self.setKeyFrameSettingWithInputValue();
				}
			});
		},
		//事件绑定
		bind:function(){
			var self = this;


			//点击删除自定义属性
			this.custom_style_list.on('click','.custom-style-delete-btn',function(e){

				if(!window.confirm('是否删除该自定义样式？')){
					return;
				}

				var tr = $(this).closest('tr');
				tr.remove();
				//删除之后更新设定
				self.setKeyFrameSettingWithInputValue();
			});

			this.sprite_custom_style_list.on('click','.custom-style-delete-btn',function(e){
				
				if(!window.confirm('是否删除该自定义样式？')){
					return;
				}

				var tr = $(this).closest('tr');
				tr.remove();
			
				//删除之后更新设定
				self.setSpriteSettingWithInputValue();
			});



			//点击新增css样式
			this.add_custom_setting.on('click',function(){
				self.addCustomStyleItem();
			});
			//点击新增精灵的css样式
			this.add_sprite_custom_setting.on('click',function(){
				self.addSpriteCustomStyleItem();
			});

			//选择了一个下拉菜单项
			this.input_sprite_easing.on('hide.bs.dropdown',function(e){
				//输入框内容更新关键帧设定
				self.setSpriteSettingWithInputValue();
			});

			//选择了一个下拉菜单项
			this.input_easing.on('hide.bs.dropdown',function(e){
				//输入框内容更新关键帧设定
				self.setKeyFrameSettingWithInputValue();
			});


			//选择了一个下拉菜单项
			this.show_select.on('hide.bs.dropdown',function(e){
				//输入框内容更新关键帧设定
				self.setKeyFrameSettingWithInputValue();
			});

			//选择了一个下拉菜单项
			this.controllerModeSelect.on('hide.bs.dropdown',function(e){
				self.setSpriteSettingWithInputValue();
			});
		
			//图片文件选择更改
			this.input_img.on('change',function(evt){
				var reader = new FileReader();
				currentImgFileName = evt.target.files[0].name;
			

		
				reader.addEventListener('load',function (e) {
					var imgData = e.target.result;
					var type = window.currentMode == 'scene' ? 0 : 1;
				
					//上传图片文件
					Util.uploadImg(type,currentWorkId,imgData,currentImgFileName,function(url){
					    //更改图片数据文本框
					    self.input_img_text.val(url);
					    //更改图片文件名
					    self.input_img_label.text(currentImgFileName);
					    //输入框内容更新设定
					    //self.setKeyFrameSettingWithInputValue();
					    self.setSpriteSettingWithInputValue();
					});
				

				},false);
		
				reader.readAsDataURL(this.files[0]);
				//置空便于再次选择
				$(evt.target).val('');
			});

			//监听键盘上下键，改变input的值
			$(document).on('keydown',function(e){
				var target = $(e.target);
				var isOpacityInput = target.hasClass('opacity-input');
				var step = isOpacityInput ? 0.1 : 1;
				var val;

				var keyCode = e.keyCode;
				var focusInput;
				var currentVal;
				if(keyCode == 38 || keyCode == 40){
					focusInput = $('.input-focus');
					if(focusInput.length == 1){
						currentVal = Number(focusInput.val());
						if(!isNaN(currentVal)){
							if(keyCode == 38){
								val = currentVal + step;
								if(isOpacityInput) val = val.toFixed(1);
								focusInput.val(val);
							}
							else{
								val = currentVal - step;
								if(isOpacityInput) val = val.toFixed(1);
								focusInput.val(val);
							}

							self.setKeyFrameSettingWithInputValue();
							
						}

					}
				}
			});


			//右侧栏输入框聚焦
			this.container[0].addEventListener('focus',function(e){
				$(e.target).addClass('input-focus');
			},true);

			//右侧栏输入框退出聚焦
			this.container[0].addEventListener('blur',function(e){
				$(e.target).removeClass('input-focus');
			},true);



			//取消文本框聚焦确定设置关键帧css配置项
			this.keyFrameSettingContainer[0].addEventListener('input',function(e){
			
				if($(e.target).attr('type') == 'file'){
					return;
				}
		
				//输入框内容更新关键帧设定
				self.setKeyFrameSettingWithInputValue();
			},true);

			//取消文本框聚焦确定设置精灵css配置项比例
			this.spriteSettingContainer[0].addEventListener('change',function(e){
				//上次图片的话，等图片上传完成之后再设置	
				if($(e.target).attr('type') == 'file'){
					return;
				}

				//输入框内容更新精灵设定
				self.setSpriteSettingWithInputValue();
			});

			$(window).on('spriteAdd',function(){
				var e = arguments[1];
				var setting = e.sprite.getSetting();
				self.setCurrentKeyFrameSetting(setting);
				self.setSpriteSetting(setting);
			});

			$(window).on('spriteSelect',function(){
				var e = arguments[1];
				var setting = e.selectedSprite.getSetting();
				self.setCurrentKeyFrameSetting(setting);
				self.setSpriteSetting(setting);
				debugger;
				//没有帧展示栏的精灵，不显示缩放模式
				if(!e.selectedSprite.getCommondFramesBar() && !e.selectedSprite.hasEventFramesBar()){
					self.hideControllerModeSelect();
				}
				else{
					self.showControllerModeSelect();
				}
			});

			$(window).on('spriteBackToSingle',function(){
				var e = arguments[1];
				self.hideControllerModeSelect();
			});


			//单文本发生文字改变时，更新编辑框宽度和高度
			$(window).on('spriteSingleTextChange',function(){
				var e = arguments[1];

				self.input_width.val(e.currentWidth);
				self.input_height.val(e.currentHeight);

			});




			//选择帧展示栏，更新对应的精灵类名
			$(window).on('framesBarSelect',function(){
				var e = arguments[1];
				var framesBar = e.selectedFramesBar;


				if(framesBar.isSingle){
					//对单文本精灵禁用比例缩放/固定尺寸选择
					//self.disableControllerModeSelect();
					self.hideControllerModeSelect();
				}
				else{
					//self.enableControllerModeSelect();
					self.showControllerModeSelect();
				}
				debugger;
				//设置该精灵的属性
				self.setSpriteSetting({
					name:framesBar.spriteName,
					className:framesBar.spriteClassName,
					controllerMode:framesBar.controllerMode,
					spriteCustomSetting:framesBar.spriteCustomSetting,
					imgFileName:framesBar.spriteImgFileName,
					imgUrl:framesBar.spriteImgUrl/*,
					perspective:framesBar.spritePerspective*/
				});

				//锁定的话，禁用css编辑器
				if(framesBar.isLock){
					self.disable();
				}
				else{
					self.enable();

					if(framesBar.isSingle){
						self.disableControllerModeSelect();
					}
				}



				isLock = framesBar.isLock;

			});

			//新增关键帧，设置csseditor预设值
			$(window).on('addKeyFrame',function(){
				var e = arguments[1];
				var keyFrame = e.keyFrame;
				self.setCurrentKeyFrameSetting(keyFrame.setting);
			});

			//监听选择关键帧事件
			$(window).on('afterKeyFrameSelect',function(){
				var e = arguments[1];
				//所选关键帧
				var selectedKeyFrame = e.keyFrame;
			
				//设置成所选关键帧的属性
				self.setCurrentKeyFrameSetting(selectedKeyFrame.setting);

				self.show();

				var bgColor = self.input_background_color.val();
				
				if(bgColor != 'transparent'){
					self.input_background_color.colpickSetColor(Util.colorHex(bgColor),undefined,true);
					self.input_background_color.val(bgColor);
				}
				else{
					self.input_background_color.val('transparent');
				}
			});

			//监听选择帧事件
			$(window).on('afterFrameSelect',function(){
				var e = arguments[1];
				//所选关键帧
				var selectedFrame = e.frame;
				var setting = selectedFrame.getCalculatedSetting();
				if(!setting) return;
			
				//设置成所选关键帧的属性
				self.setCurrentKeyFrameSetting(setting);

				//锁定的话，禁用css编辑器
				if(selectedFrame.framesbar.isLock){
					self.disable();
				}
				else{
					self.enable();
				}

				isLock = selectedFrame.framesbar.isLock;

				self.show();

				var bgColor = self.input_background_color.val();
				
				if(bgColor != 'transparent'){
					self.input_background_color.colpickSetColor(Util.colorHex(bgColor),undefined,true);
					self.input_background_color.val(bgColor);
				}
				else{
					self.input_background_color.val('transparent');
				}
			});

			//监听位置更新事件,改变编辑器的输入值
			$(window).on('spritePositionUpdate',function(){
				var e = arguments[1];
				var spriteSetting = e.sprite.getSetting();
				//缓动设置还是用自己的
				spriteSetting.easing = self.currentKeyFrameSetting.easing;
				//设置关键帧属性
				self.setCurrentKeyFrameSetting(spriteSetting);
				//设置精灵属性
				self.setSpriteSetting(spriteSetting);
			});


			//播放动画过程中，不可编辑css属性
			$(window).on('playAnimation',function(){
				self.disable();
			});

			//停止播放动画后，可编辑css属性
			$(window).on('stopAnimation',function(){
				if(!isLock){
					self.enable();
				}
				
			});

			//css编辑器的锁定状态改变
			$(window).on('lockStateChanged',function(){
				var e = arguments[1];
				isLock = e.lock;
				var isCurrentSprite = e.isCurrentSprite;
				//当前帧展示栏的锁和解锁
				if(isCurrentSprite){
					if(isLock){
						self.disable();
					}
					else{
						self.enable();
					}
				}
			});
		},
		hideControllerModeSelect:function(){
			this.controllerModeSelect.closest('.panel-default').hide();
		},
		showControllerModeSelect:function(){
			this.controllerModeSelect.closest('.panel-default').show();
		},
		disableControllerModeSelect:function(){
			this.controllerModeSelect.find('button').prop('disabled',true);
		},
		enableControllerModeSelect:function(){

		},
		//可用
		enable:function(){
			this.allInput.prop('disabled',false);
			this.allSelect.prop('disabled',false);
		},
		//禁用
		disable:function(){
			this.allInput.prop('disabled',true);
			this.allSelect.prop('disabled',true);
		},
		//用文本输入框的内容设置设定
		setKeyFrameSettingWithInputValue:function(){
			var self = this;

			var w = self.input_width.val();

			//输入框的值更新到setting
			//关键帧属性
			var keyFrameSetting = /*self.setCurrentKeyFrameSetting(*/{
				display:self.show_select.data('selectedValue') == '隐藏' ? 'none' : 'block',
				backgroundColor:self.input_background_color.val(),
				//处理宽度是百分比的情况
				//width:w.indexOf('%') > -1 ? w : Number(w),
				width:Number(self.input_width.val()),
				height:Number(self.input_height.val()),
				x:Number(self.input_x.val()),
				y:Number(self.input_y.val()),
				perspective:Number(self.input_perspective.val()),
				// scale:Number(self.input_scale.val()),
				rotateZ:Number(self.input_rotatez.val()),
				rotateX:Number(self.input_rotatex.val()),
				rotateY:Number(self.input_rotatey.val()),
				skewX:Number(self.input_skewx.val()),
				skewY:Number(self.input_skewy.val()),
				opacity:Number(self.input_opacity.val()),
				easing:self.input_easing.data('selectedValue') || 'linear',
				customSetting:self.getCustomSetting()
			}/*);*/
				

			//触发设置关键帧css属性事件
			$(window).trigger('keyFrameSettingChanged',{
				keyFrameSetting:keyFrameSetting
			});
		},
		setSpriteSettingWithInputValue:function(){
			var self = this;

			//元素属性
			var spriteSetting = /*self.setSpriteSetting(*/{
				name:self.input_name.val(),
				className:self.input_class.val(),
				controllerMode:self.controllerModeSelect.data('selectedValue') == '比例缩放' ? 0 : 1,
				//精灵自己的自定义样式
				spriteCustomSetting:self.getCustomSetting(true),
				imgFileName:currentImgFileName,
				imgUrl:self.input_img_text.val()
				//perspective:self.input_perspective.val()
			}/*)*/;	

		
		
			//触发设置精灵css属性事件
			$(window).trigger('spriteSettingChanged',{
				spriteSetting:spriteSetting
			});

		},

		createCustomStyleItem:function(name,val){
			var newStyleItemStr = '<tr><td>\
				<input class="custom-style-name-input form-control" placeholder="属性名" value="' + (typeof name != 'undefined' ? name : "") + '">\
				</td>\
				<td>\
				<input class="custom-style-value-input form-control" placeholder="属性值" value="' + (typeof val != 'undefined' ? val : "") + '">\
				</td>\
				<td>\
				<button class = "custom-style-delete-btn">\
					<span class="glyphicon glyphicon-remove-sign"></span>\
				</button>\
				</td>\
			</li>';

			var newStyleItem = $(newStyleItemStr);

			return newStyleItem;
		},
		//增加一个自定义样式项到列表
		addCustomStyleItem:function(name,val){
			var newStyleItem = this.createCustomStyleItem(name,val);
			this.custom_style_list.append(newStyleItem);
		},
		//增加一个精灵自定义样式项到列表
		addSpriteCustomStyleItem:function(name,val){
			var newStyleItem = this.createCustomStyleItem(name,val);
			this.sprite_custom_style_list.append(newStyleItem);
		},
		//获取自定义设定部分
		getCustomSetting:function(isSprite){
			var domList;
			if(isSprite){
				domList = this.getSpriteCustomStyleItemDomList();
			}
			else{
				domList = this.getCustomStyleItemDomList();
			}
			
			var customSetting = {};

			domList.each(function(i,item){
				var name = $($(item).find('.custom-style-name-input')).val();
				var val = $($(item).find('.custom-style-value-input')).val();

				customSetting[name] = val;
			});

			return customSetting;
		},
		//获取自定义样式项dom列表
		getCustomStyleItemDomList:function(){
			return $('.custom-style-list tr');
		},
		//获取自定义样式项dom列表
		getSpriteCustomStyleItemDomList:function(){
			return $('.sprite-custom-style-list tr');
		},
		render:function(){
			//css编辑器的html串
			var editorTmplStr = tmpl[TMPL_NAME]();
			this.container.html(editorTmplStr);

			this.initAccordion();

		},
		//初始化折叠菜单
		initAccordion:function(){
			$('.accordin-container',this.container).accordion({
				animate: 100,
				collapsible: true,
				heightStyle: "content"
			});
		},
		//设置精灵属性
		setSpriteSetting:function(setting){
			if(typeof setting.name != 'undefined'){
				this.input_name.val(setting.name);
			}

			if(typeof setting.className != 'undefined'){
				this.input_class.val(setting.className);
			}
			if(typeof setting.controllerMode != 'undefined'){
				this.controllerModeSelect.data('selectedValue') == '比例缩放' ? 0 : 1;
			}
		
			//设置输入框
			if(typeof setting.imgUrl != 'undefined'){
				this.input_img_text.val(setting.imgUrl);
			}
			else{
				this.input_img_text.val('');
			}

			if(typeof setting.imgFileName != 'undefined'){
				this.input_img_label.text(setting.imgFileName);
			}
			else{
				this.input_img_label.text('');
			}

			// if(typeof setting.perspective!= 'undefined'){
			// 	this.input_perspective.val(setting.perspective);
			// }

			this.spriteSetting = {
				name:setting.name,
				className:setting.className,
				controllerMode:setting.controllerMode,
				customSetting:setting.spriteCustomSetting,
				imgUrl:setting.imgUrl,
				imgFileName:setting.imgFileName
				//perspective:setting.perspective
			};

			//更新自定义样式属性的输入框
			this.updateCustomSettingInput(setting.spriteCustomSetting,true);

			return this.spriteSetting;
		},
		//设置关键帧当前配置
		setCurrentKeyFrameSetting:function(setting){

			if(typeof setting.backgroundColor != 'undefined'){
				this.input_background_color.val(setting.backgroundColor);
			}	

			if(typeof setting.display != 'undefined'){
				Util.setDropDownListValue(this.show_select,setting.display == 'none' ? '隐藏':'显示');
			}
			if(typeof setting.width != 'undefined'){
				this.input_width.val(setting.width);
			}
			if(typeof setting.height != 'undefined'){
				this.input_height.val(setting.height);
			}
			if(typeof setting.x != 'undefined'){
				this.input_x.val(setting.x);
			}
			if(typeof setting.y != 'undefined'){
				this.input_y.val(setting.y);
			}
			// if(typeof setting.scale != 'undefined'){
			// 	this.input_scale.val(setting.scale);
			// }
			if(typeof setting.rotateZ!= 'undefined'){
				this.input_rotatez.val(setting.rotateZ);
			}
			if(typeof setting.rotateX!= 'undefined'){
				this.input_rotatex.val(setting.rotateX);
			}
			if(typeof setting.rotateY!= 'undefined'){
				this.input_rotatey.val(setting.rotateY);
			}
			
			if(typeof setting.skewX!= 'undefined'){
				this.input_skewx.val(setting.skewX);
			}
			if(typeof setting.skewY!= 'undefined'){
				this.input_skewy.val(setting.skewY);
			}



			if(typeof setting.perspective!= 'undefined'){
				this.input_perspective.val(setting.perspective);
			}

			if(typeof setting.opacity != 'undefined'){
				this.input_opacity.val(setting.opacity);
			}
			if(typeof setting.easing != 'undefined'){
				Util.setDropDownListValue(this.input_easing,setting.easing);
			}


			if(typeof setting.controllerMode != 'undefined'){
				Util.setDropDownListValue(this.controllerModeSelect,setting.controllerMode == 0 ? '比例缩放':'固定尺寸');
			}

			//更新自定义样式属性的输入框
			this.updateCustomSettingInput(setting.customSetting);
			
			//设置当前设定对象
			this.currentKeyFrameSetting = setting;


			return this.currentKeyFrameSetting;
		},
		updateCustomSettingInput:function(customSetting,isSprite){
	
			var self = this;

			if(isSprite){
				this.sprite_custom_style_list.html('');
			}
			else{
				this.custom_style_list.html('');
			}
			

			if(customSetting){
				//插入对应的自定义样式项
				$.each(customSetting,function(name,val){
					if(isSprite){
						self.addSpriteCustomStyleItem(name,val);
					}
					else{
						self.addCustomStyleItem(name,val);
					}
					
				});
			}
		},
		reset:function(){
			//初始化设定
			this.setCurrentKeyFrameSetting({
				display:'block',
				width:0,
				height:0,
				x:0,
				y:0,
				// scale:1,
				rotate:0,
				opacity:1,
				easing:'linear'
			});

			this.setSpriteSetting({
				name:'',
				className:'',
				controllerMode:0
			});
		},
		//获取当前设置
		getCurrentKeyFrameSetting:function(){
			return this.currentKeyFrameSetting;
		},
		getSpriteSetting:function(){
			return this.spriteSetting;
		},
		//展示
		show:function(){
			this.container.show();
		},
		//隐藏
		hide:function(){
			this.container.hide();
		}
	};

	return cssEditor;
});