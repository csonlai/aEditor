define(['tmpl','util','controller','win_manager'],function(tmpl,Util,Controller,WinManager){
	var TMPL_NAME = 'sprite-action-setting';

	var currentType;

	//精灵点击行为设置
	var SpriteActionSetting = {
		init:function(opt){
			opt = opt || {};
			this.name = 'spriteActionSetting';
		},
		bind:function(){
			var self = this;

			//根据是否选择触发事件行为，改变事件输入框显示/隐藏
			this.actionEventCheckBox.on('change',function(){
				if($(this).prop('checked')){
					self.spriteActionEventInput.show();
				}
				else{
					self.spriteActionEventInput.val('');
					self.spriteActionEventInput.hide();
				}
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
				WinManager.add(this.name,tmplString);
				//元素
				this.element = $('#' + id);		

				//this.spriteActionSelect = $('.sprite-action-select');
				// this.spriteActionEventName = $('.sprite-action-event-name');	
				this.spriteActionEventInput = $('.sprite-action-event-input');	

				this.actionEventCheckBox = $('.action-event-checkbox');
				this.actionJumpNextCheckBox = $('.action-jump-next-checkbox');

				this.autoJumpNextSetting = $('.auto-jump-next-setting');
				
			

				//事件绑定
				this.bind();
			}			
		},
		//初始化输入框的值
		setInitSetting:function(opt){
	
			this.actionEventCheckBox.prop('checked',opt.actionEventName ? true : false);

			if(opt.actionEventName){
				this.spriteActionEventInput.show();
			}
			else{
				this.spriteActionEventInput.hide();
			}
			
			this.spriteActionEventInput.val(opt.actionEventName);

			this.actionJumpNextCheckBox.prop('checked',opt.actionJumpNext ? true : false);
		
		},

		show:function(type,opt){
			opt = opt || {};

			this.headerName = (type == 'animationEnd') ? '动画结束行为设置' : (type == 'stageAction') ? '翻页行为设置' : '点击行为设置';

			var self = this;

			currentType = type;

			if(!this.element || !this.element.length){
				this.render();
			}

			if(type == 'stageAction'){
				this.autoJumpNextSetting.hide();
			}
			else{
				this.autoJumpNextSetting.show();
			}

			WinManager.show({
				headerName:this.headerName,
				name:this.name,
				onConfirm:function(){
					var actionEventName;
					var actionEmitEvent = self.actionEventCheckBox.prop('checked');

					if(actionEmitEvent){
						//用户输入的自定义事件名
						actionEventName = self.spriteActionEventInput.val();
						if(!actionEventName){
							alert('请输入事件名！');
							return;
						}
					}


					//触发选择行为事件
					$(window).trigger('confirmAction',{
						actionEmitType:currentType,
						// actionType:actionType,
						actionEmitEvent:actionEmitEvent,
						actionJumpNext:self.actionJumpNextCheckBox.prop('checked'),
						actionEventName:actionEventName
					});	
				}
			});
			this.setInitSetting(opt);

		}
	};

	return SpriteActionSetting;

});