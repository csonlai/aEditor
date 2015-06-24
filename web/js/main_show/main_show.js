
define(['tmpl','util','main_page'],function(tmpl,Util,MainPage){

	var MainShow = {
		init:function(opt){
			opt = opt || {};
			this.showArea = $('.main-show-area');
			this.container = opt.container || $('.main-show-container');
			this.closeBtn = opt.closeBtn || $('.main-show-close-btn');
			
			this.width = opt.width || 320;
			this.height = opt.height || 480;

			this.fixShowArea();
		
			this.bind();

			MainPage.init();

			
		},
		bind:function(){
			var self = this;
			
			this.closeBtn.on('click',function(){
				self.hide();
			});

		},	
		//设置展示区的尺寸
		fixShowArea:function(){
			
			this.showArea.css({
				width:this.width,
				height:this.height,
				left:'50%',
				top:'50%',
				'margin-left':-this.width / 2,
				'margin-top':-this.height / 2
			});
		},
		show:function(obj,showClassName){
			
			MainPage.showClassName(showClassName);
			MainPage.create(obj);
			this.container.show();
		},

		hide:function(){
			MainPage.remove();
			this.container.hide();
		}

	};

	return MainShow;


});