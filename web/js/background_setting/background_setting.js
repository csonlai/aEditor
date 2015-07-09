//内置动画选择窗口
define(['tmpl','util','color_picker','win_manager'],function(tmpl,Util,ColorPicker,WinManager){
	var TMPL_NAME = 'background_setting';

	//当期那的图片文件名
	var currentImgFileName;

	var currentImgFileUrl;

	var currentWorkId;
	

	var BackgroundSetting = {
		//初始化
		init:function(opt){
			opt = opt || {};

			this.name = 'BackgroundSetting';

			this.headerName = '背景设置';

		},
		//初始化着色器
		initColorPicker:function(){
			var self = this;

			this.backgroundColorSettingInput.colpick({
				layout:'hex',
				colorScheme:'dark',
				color:Util.colorHex(self.backgroundColorSettingInput.val()),
				submit:0,
				onChange:function(colorObj){
					var colorObj = arguments[2];
					var colorRgbaStr = 'rgba(' + colorObj.r + ',' + colorObj.g + ',' + colorObj.b + ',1)';
					self.backgroundColorSettingInput.val(colorRgbaStr);
				}
			});

		},
		setWorkId:function(workId){
			currentWorkId = workId;
		},
		//事件绑定
		bind:function(){
			var self = this;
			//选择图片
			this.backgroundImageSettingInput.on('change',function(evt){
				var reader = new FileReader();
				currentImgFileName = evt.target.files[0].name;

				//设置文件名标签
				self.fileNameLabel.html(currentImgFileName);

				reader.addEventListener('load',function (e) {
					var currentImgBase64Str = e.target.result;
				


					//上传图片文件
					Util.uploadImg(0,currentWorkId,currentImgBase64Str,currentImgFileName,function(url){
						currentImgFileUrl = url;
						//设置preview的图片显示
						self.previewImage.css({
							'background-image':'url(' + url + ')'
						});
					});





				},false);

				reader.readAsDataURL(this.files[0]);
				//置空便于再次选择
				$(evt.target).val('');
			});

		},
		render:function(){
	
			var id = TMPL_NAME + '_' + this.id;
			//菜单模板字符串
			var tmplString = tmpl[TMPL_NAME]({
				id:id
			});	

			//添加新页的html串
			WinManager.add(this.name,tmplString);
			
			//菜单元素
			this.element = $('#' + id);	


			//背景颜色设置输入框
			this.backgroundColorSettingInput = $('.background-color-setting-input');
			//背景图片设置选择框
			this.backgroundImageSettingInput = $('.background-image-setting-file-input');
			//背景图片设置
			this.backgroundImageSetting = $('.background-image-setting');
			//背景颜色设置
			this.backgroundColorSetting = $('.background-color-setting');
			//动画时长控制
			this.previewImage = $('.preview-background-image');
			//确定选择预设动画按钮
			this.confirmBtn = $('.confirm-background-setting-btn');
			//取消选择预设动画按钮
			this.cancelBtn = $('.cancel-background-setting-btn');
			//图片文件名标签
			this.fileNameLabel = $('.background-image-setting-filename');


			//事件绑定
			this.bind();				
			
		},
		setInitInput:function(opt){
			currentImgFileUrl = opt.backgroundImage;
			this.backgroundColorSettingInput.val(opt.backgroundColor || 'rgb(255,255,255)');
			this.fileNameLabel.html(opt.imgFileName || '暂无文件');
		},
		//展示
		show:function(opt){
			var self = this;

			if(!this.element || !this.element.length){
				this.render();
			}

			WinManager.show({
				name:this.name,
				headerName:this.headerName,
				onConfirm:function(){
					
					var colorValue = self.backgroundColorSettingInput.val();
					//触发背景选择事件
					$(window).trigger('stageBackgroundChange',{
						color:colorValue,
						image:currentImgFileUrl,
						imgFileName:currentImgFileName
					});
									
				}
			});

			this.setInitInput(opt);

			//初始化颜色选择器
			this.initColorPicker();
			
		}
	};

	return BackgroundSetting;
});