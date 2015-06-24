define(['tmpl','util','win_manager'],function(tmpl,Util,WinManager){

	var TMPL_NAME = 'sprite_event_animation_setting';
	//为精灵设置监听某个事件播放的动画
	var SpriteEventAnimationSetting = {
		init:function(opt){
			opt = opt || {};
			this.name = 'SpriteEventAnimationSetting';
			this.headerName = '添加事件动画';
		},

		render:function(){
			if(!this.element || !this.element.length){
				//所在容器
				this.container = $(document.body);

				var id = TMPL_NAME + '_' + this.id;
				//菜单模板字符串
				var tmplString = tmpl[TMPL_NAME]({
					id:id
				});	
				//添加新页的html串
				WinManager.add(this.name,tmplString);


				//元素
				this.element = $('#' + id);	

				this.emitEventContainer = $('.emit-event-container');

				this.emitEventInput = $('.emit-event-input');

				this.eventListenOnceInput = $('.sprite-action-once-input');			
			}
		},
		reset:function(){
			this.emitEventInput.val('');
			this.eventListenOnceInput.prop('checked',false);
		},
		show:function(opt){

			var self = this;

			if(!this.element || !this.element.length){
				this.render(opt);
			}

			WinManager.show({
				name:this.name,
				headerName:this.headerName,
				onConfirm:function(){
					//动画触发类型改变事件触发通知
					$(window).trigger('spriteAnimationEventListenChanged',{
						emitEventName:self.emitEventInput.val(),
						isListenOnce: self.eventListenOnceInput.prop('checked')
					});		
					self.reset();			
				},
				onCancel:function(){
					self.reset();
				}
			});

		}
	};



	return SpriteEventAnimationSetting;

});