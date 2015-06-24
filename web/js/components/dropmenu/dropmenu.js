//右击菜单
define(['tmpl','util'],function(tmpl,Util){
	var TMPL_NAME = 'dropmenu';

	function DropMenu(opt){
		this.init(opt);
	};

	DropMenu.prototype = {
		//初始化
		init:function(opt){
			opt = opt || {};
			//随机id
			this.id = Util.getRandomId();
			//菜单项
			this.items = opt.items || [];
			//菜单展示的容器
			this.container = opt.container || $(document.body);
			//点击回调
			this.callback = opt.callback;
	
		},
		//事件绑定
		bind:function(){
			var self = this;
			//点击任意区域，关闭选择菜单
			$(document.body).on('click',function(){
				self.element.hide();
			});

			//点击菜单项目
			this.element.on('click','.drop-menu-item',function(){
				var target = $(this);
				var index = target.data('index');
				//点击隐藏菜单
				self.hide();
			
				//执行点击菜单项回调
				self.callback && self.callback(index,self.items[index]);
			});
		},
		//设置显示项
		setItems:function(items){

			this.element && this.element.remove();

			var id = TMPL_NAME + '_' + this.id;
			//菜单模板字符串
			var tmplString = tmpl[TMPL_NAME]({
				id:id,
				items:items
			});	
			
			this.items = items;
			//添加新页的html串
			$('body').append(tmplString);
			//菜单元素
			this.element = $('#' + id);	
			//事件绑定
			this.bind();					
		},
		//展示
		show:function(opt){

			opt = opt || {};

			if(opt.items){
				//渲染显示项
				this.setItems(opt.items);
			}

			//设置位置
			this.element.css({
				left:opt.left || 0,
				top:opt.top + 20 || 0
			});
			this.element.show();
		},
		//隐藏
		hide:function(){
			if(this.element){
				this.element.hide();
			}
		}
	}

	return DropMenu;
});