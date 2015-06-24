define(['tmpl','util'],function(tmpl,Util){
	var TMPL_NAME = 'img_path_setting';

	//精灵点击行为设置
	var ImgPathSetting = {
		init:function(opt){
			opt = opt || {};
			//随机id
			this.id = Util.getRandomId();
			//所在容器
			this.container = opt.container || $(document.body);

		},
		bind:function(){
			var self = this;

			//点击确定
			this.imgPathConfirm.on('click',function(){
				self.hide();
				//触发图片路径选择事件
				$(window).trigger('imgPathConfirm',{
					imgPath:self.imgPathInput.val()
				});
			});
			//点击取消
			this.imgPathCancel.on('click',function(){
				self.hide();
			});

		},

		render:function(){
			if(!this.element || !this.element.length){
				var id = TMPL_NAME + '_' + this.id;
				//菜单模板字符串

				var tmplString = tmpl[TMPL_NAME]({
					id:id
				});	
				//添加新页的html串
				this.container.append(tmplString);	
				//元素
				this.element = $('#' + id);	

				this.imgPathInput = $('.img-path-setting-input');
				this.imgPathConfirm = $('.confirm-img-path-btn');
				this.imgPathCancel = $('.cancel-img-path-btn');	

				//事件绑定
				this.bind();
			}			
		},
		show:function(){
			if(!this.element || !this.element.length){
				this.render();
			}
			this.element.show();

		},
		hide:function(){
			this.element.hide();
		}
	};

	return ImgPathSetting;

});