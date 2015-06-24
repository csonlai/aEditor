define(['tmpl','util','win_manager'],function(tmpl,Util,WinManager){
	var TMPL_NAME = 'layer-size-setting';

	var currentType;

	//层尺寸设置
	var LayerSizeSetting = {
		init:function(opt){
			opt = opt || {};
			this.name = 'layerSizeSetting';
		},
		bind:function(){
			var self = this;

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


				this.layerWidthInput = $('.layer-size-width-input');	
				this.layerHeightInput = $('.layer-size-height-input');	

				//事件绑定
				this.bind();
			}			
		},
		//初始化输入框的值
		setInitSetting:function(opt){
	
			this.layerWidthInput.val(100);
			this.layerHeightInput.val(100);
		
		},

		show:function(type,opt){
			opt = opt || {};

			currentType = type;

			this.headerName = type == 'layer' ? '图层尺寸设置' : '文本尺寸设置';

			var self = this;

	
			if(!this.element || !this.element.length){
				this.render();
			}


			WinManager.show({
				headerName:this.headerName,
				name:this.name,
				onConfirm:function(){

					//触发选择行为事件
					$(window).trigger('confirmNewLayerSize',{
						layerType:currentType,
						width:self.layerWidthInput.val(),
						height:self.layerHeightInput.val()
					});	
				}
			});
			this.setInitSetting(opt);

		}
	};

	return LayerSizeSetting;

});