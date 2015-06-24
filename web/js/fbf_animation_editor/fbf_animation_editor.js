define(['tmpl','util','transition','win_manager'],function(tmpl,Util,Transition,WinManager){
	var TMPL_NAME = 'fbf_animation_editor';

	//var currentImgBase64Str;
	var currentImgUrl;
	var currentImgFileName;

	var currentSingleTransition;
	var currentWorkId;


	//逐帧动画编辑器
	var FbfAnimationEditor = {
		init:function(opt){
			opt = opt || {};
			this.name = 'FbfAnimationEditor';
			this.headerName = '新建逐帧动画元件';

		},
		bind:function(){
			var self = this;
			//选择图片
			this.fbfImgSelect.on('change',function(e){
				var reader = new FileReader();

				var fileObj = this.files[0];
			
				//文件名
				currentImgFileName = fileObj.name;
				self.fbfImgFileName.text(currentImgFileName);
				self.fbfImgInput.val(currentImgFileName);

				reader.addEventListener('load',function (e) {
					//当前选择的图片的base64串
					var currentImgBase64Str = e.target.result;

					//上传图片文件
					Util.uploadImg(1,currentWorkId,currentImgBase64Str,currentImgFileName,function(url){
						currentImgUrl = url;
					});

				},false);

				reader.readAsDataURL(fileObj);
				//置空便于再次选择
				$(e.target).val('');
			});

			//点击预览
			this.previewBtn.on('click',function(){

				self.getPreviewAnimationObj(function(animationObj){
					var elem = animationObj.elem;

					self.fbfPreviewContainer.html('');
					self.fbfPreviewContainer.append(elem);
					
					if(currentSingleTransition){
						currentSingleTransition.stop();
					}
					//播放单个元素的动画
					currentSingleTransition = Transition.playSingle(animationObj);
				});

			});

			//开启/关闭 重复播放
			this.fbfAnimationRepeatSetting.on('change',function(){
				var checkVal = this.checked;

				if(checkVal){
					self.fbfAnimationRpeatCount.show();
				}
				else{
					self.fbfAnimationRpeatCount.hide();
				}
			});


		},
		setWorkId:function(workId){
			currentWorkId = workId;
		},
		//新建一个demo动画对象
		getPreviewAnimationObj:function(callback){

			var self = this;
			var frameCount = Number(this.fbfFrameCountinput.val());
			var frameDirection = this.fbfFrameDirectionSelector.data('selectedValue') == '从上到下' ? 'utd' : 'ltr';
			var frameDuration = Number(this.fbfFrameDurationInput.val());
			var repeatMode = this.fbfAnimationRepeatSetting.prop('checked');
			var repeatTime = self.fbfAnimationRpeatCount.val();
	
			var img = $('<img>');
			// var frameDirection = opt.frameDirection;
			// var frameCount = opt.frameCount;
			// var frameDuration = opt.frameDuration;
			
			img.on('load',function(){
				var width = this.width/2;
				var height = this.height/2;
				var w,h;
				//demo元素
				var demoElement = $('<div class="fbf-animation-demo"></div>');
				//从左到右
				if(frameDirection == 'ltr'){
					w = width / frameCount;
					h = height;
				}
				//从上到下
				else{
					w = width;
					h = height / frameCount;
				}

				demoElement.css({
					width:w,
					height:h,
					'margin-left':-w/2,
					'margin-top':-h/2
				});

				var keyFrames = {};

				for(var i = 0;i < frameCount;i ++){
					var percent = i * (100/frameCount) + '%';
					keyFrames[percent] = {
						'width':w,
						'height':h,
						'background-position': frameDirection == 'ltr' ? (i * -w) + 'px 0' : '0 ' + (i * -h) + 'px',
						'background-image':'url(' + currentImgUrl + ')',
						'background-size':width + 'px ' + height + 'px',
						'-webkit-animation-timing-function':'step-end'
					};

					if(i == frameCount - 1 ){
						keyFrames['100%'] = keyFrames[percent];
					}
				}

				//生成的动画对象
				var animationObj = {
					elem:demoElement,
					keyframes:keyFrames,
					duration:frameDuration * frameCount,
					repeatMode:repeatMode,
					repeatTime:repeatTime
				};
		
				callback &&  callback(animationObj);
			});

			img.on('error',function(){
				callback &&  callback();
			});



			//设置图片获取图片尺寸
			img.prop('src',currentImgUrl);


		},

		render:function(){
			if(!this.element || !this.element.length){
				var id = TMPL_NAME + '_' + this.id;
				//菜单模板字符串

				var tmplString = tmpl[TMPL_NAME]({
					id:id
				});	
				//添加新页的html串
				WinManager.add(this.name,tmplString);	
				//元素
				this.element = $('#' + id);		
				//元件名称
				this.fbfNameInput = $('.fbf-name-input');
				//选择图片
				this.fbfImgSelect = $('.fbf-img-select');
				//图片文件名输入框
				this.fbfImgInput = $('.fbf-img-input');
				//图片文件名
				this.fbfImgFileName = $('.fbf-img-class-name');
				//帧数
				this.fbfFrameCountinput = $('.fbf-frame-count-input');
				//帧方向
				this.fbfFrameDirectionSelector = $('.fbf-frame-direction-selector');
				//帧间隔
				this.fbfFrameDurationInput = $('.fbf-frame-duration-input');
				//预览区域
				this.fbfPreviewContainer = $('.fbf-animation-preview');
				//确定按钮
				this.confirmSpriteActionBtn = $('.confirm-sprite-action-btn');
				//取消
				this.cancelSpriteActionBtn = $('.cancel-sprite-action-btn');
				//是否重复的设置
				this.fbfAnimationRepeatSetting = $('.fbf-animation-repeat-setting');
				//重复次数的设置
				this.fbfAnimationRpeatCount = $('.fbf-animation-repeat-count');

				//预览按钮
				this.previewBtn = $('<button class="btn btn-info btn-sm">预览</button>').addClass('fbf-preview-animation-btn');

		
			}			
		},
		reset:function(){
			this.fbfNameInput.val('');
			this.fbfImgInput.val('');
			this.fbfImgFileName.html('');
			this.fbfFrameCountinput.val('');
			this.fbfFrameDurationInput.val('');
			this.fbfAnimationRepeatSetting.prop('checked',false);
			this.fbfAnimationRpeatCount.val('');
			this.fbfAnimationRpeatCount.hide();
		},

		show:function(){
			var self = this;

			if(!this.element || !this.element.length){
				this.render();
				WinManager.addBtns(this.name,[this.previewBtn]);
				this.bind();
			}

			WinManager.show({
				headerName:this.headerName,
				name:this.name,
				onConfirm:function(){debugger;
					//名称
					var name = self.fbfNameInput.val();

					self.getPreviewAnimationObj(function(animationObj){

						//触发选择逐帧动画事件
						$(window).trigger('fbfAnimationSelect',{
							name:name,
							animationObj:animationObj,
							spriteOpt:{
								imgFileName:currentImgFileName,
								imgUrl : currentImgUrl,
								width:animationObj.elem.width(),
								height:animationObj.elem.height()
							}
						});

						console.log(name);
					});

					self.reset();

					
				},
				onCancel:function(){
					if(currentSingleTransition){
						currentSingleTransition.stop();
					}	
					self.reset();	

				}
			});


		}
	};

	return FbfAnimationEditor;

});