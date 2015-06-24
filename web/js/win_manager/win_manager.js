define(['tmpl','util'],function(tmpl,Util){

	var winMap = {};
	var btnMap = {};

	var currentContent;
	var currentName;


	//空值检查
	function emptyValidate(val){
		if (val.trim() === '') {
			return false;
		}

		return true;
	}
	//数字检查
	function numValidate(val){
		if(isNaN(Number(val))){
			return false;
		}
		return true;
	}

	//图片检查
	function imgValidate(val){
		if(!emptyValidate(val)){
			return false;
		}
		if(!/\.(jpeg|jpg|png|gif)$/i.test(val)){
			return false;
		}
		return true;
	}


	//元件尺寸设置窗口
	var WinManager = {
		init:function(opt){
			opt = opt || {};

			this.confirmBtn = $('.win-confirm-btn');
			this.cancelBtn = $('.win-cancel-btn');

			this.winHeader = $('.win-header');
			//所在容器
			this.winContainer = opt.winContainer || $('.win-container');
			this.winMask = opt.winMask || $('.win-mask');
			this.winBtnContainer = opt.winBtnContainer || $('.win-btn-container');
			//验证词
			this.winValidateWord = $('.win-validate-word');

		},
		centerWinContainer:function(){
			var width = this.winContainer.width();
			var height = this.winContainer.height();
			this.winContainer.css({
				'margin-left':width / -2,
				'margin-top': height / -2
			});
		},
		addBtns:function(name,btnList){
			var self = this;
			btnMap[name] = btnList;
		
			$.each(btnList,function(i,btn){
				 btn.insertBefore(self.confirmBtn);
			});
			
		},
		add:function(name,content){
			var wrap = $('<div></div>',{
				class:'win-content-single-wrap'
			});
			wrap.append(content);

			winMap[name] = wrap;

			wrap.insertAfter(this.winHeader);
		},

		validate:function(word,func,vClassName){
			var validate = true;
			var winValidateWord = this.winValidateWord;
			var inputs = currentContent.find('input.' + vClassName);
	
			$.each(inputs,function(i,input){
				input = $(input);
				
				//对应检查
				if(!func(input.val())){
					input.focus();
					input.addClass('warning');
					winValidateWord.html(word);
					validate = false;
				}
			});	
			return validate;
		},
		//非空检查
		emptyValidate:function(){
			return this.validate('输入值不能为空',emptyValidate,'need-empty-validate');
		},
		//数字检查
		numValidate:function(){
			return this.validate('输入值必须为数字',numValidate,'need-num-validate');
		},
		//图片检查
		imgValidate:function(){
			return this.validate('请选择一张图片',imgValidate,'need-img-validate');
		},
		//表单验证
		inputValidate:function(){
			this.resetValidateState();

			//空值检查
			if(!this.emptyValidate()){
				return false;
			}
			//数字检查
			if(!this.numValidate()){
				return false;
			}		
			//图片检查
			if(!this.imgValidate()){
				return false;
			}




			return true;
		},
		resetValidateState:function(){
			var inputs = currentContent.find('input.warning');	
			$.each(inputs,function(i,input){
				input = $(input);
				input.removeClass('warning');
			});	
			this.winValidateWord.html('');	
		},
		bind:function(opt){
			var self = this;

			this.onConfirm = function(){
				//表单验证
				if(!self.inputValidate()){
					return;
				}

				opt.onConfirm && opt.onConfirm();
				self.hide();

			};

			this.onCancel = function(){
				opt.onCancel && opt.onCancel();
				self.hide();
			};

			//点击确定
			this.confirmBtn.on('click',this.onConfirm);
			//点击取消
			this.cancelBtn.on('click',this.onCancel);
		},

		showBtns:function(name){
			var btnList = btnMap[name];

			$.each(btnList,function(i,btn){
				btn.show();
			});
		},
		hideBtns:function(name){
			var btnList = btnMap[name];
			if(btnList && btnList.length){
				$.each(btnList,function(i,btn){
					btn.hide();
				});
			}
		},

		show:function(opt){

			currentName = opt.name;
		
			var content = winMap[currentName];
		
			//展示内容
			if(content){
				currentContent = content;
				currentContent.show();
			}
			//设置标题
			this.winHeader.html(opt.headerName);

			this.bind(opt);
			this.winMask.show();

			this.centerWinContainer();
		},
		hide:function(){
			if(currentContent){
				currentContent.hide();
			}
			if(currentName){
				this.hideBtns(currentName);
			}
			this.confirmBtn.off('click',this.onConfirm);
			this.cancelBtn.off('click',this.onCancel);
			this.winMask.hide();
			this.resetValidateState();
		}
	};


	return WinManager;

});