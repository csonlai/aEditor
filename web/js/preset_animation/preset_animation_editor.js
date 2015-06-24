//内置动画选择窗口
define(['tmpl','util','preset_animation_config','win_manager'],function(tmpl,Util,preset_animation_config,WinManager){
	var TMPL_NAME = 'preset_animation_editor';
	//当前动画名
	var currentAnimationClass;
	//当前列表选中项
	var currentTarget;

	//常规动画列表选项
	var attentionSeekersListConfig = [{
		name:'bounce',
		cname:'弹跳'
	},{
		name:'swing',
		cname:'摇摆'
	},{
		name:'flash',
		cname:'闪烁'
	},{
		name:'pulse',
		cname:'脉动'
	},{
		name:'rubberBand',
		cname:'橡皮筋'
	},{
		name:'shake',
		cname:'颤抖'
	},{
		name:'tada',
		cname:'摇摆弹出'

	},{
		name:'wobble',
		cname:'晃动'
	}];

	//弹跳进入相关动画
	var bouncingEntrancesListConfig = [{
		name:'bounceIn',
		cname:'弹入'
	},{
		name:'bounceInDown',
		cname:'从上弹入'
	},{
		name:'bounceInLeft',
		cname:'从左弹入'
	},{
		name:'bounceInRight',
		cname:'从右弹入'
	},{
		name:'bounceInUp',
		cname:'从下弹入'
	}];

	//弹跳退出相关动画
	var bouncingExitsListConfig = [{
		name:'bounceOut',
		cname:'弹出'
	},{
		name:'bounceOutLeft',
		cname:'从左弹出'
	},{
		name:'bounceOutRight',
		cname:'从右弹出'
	},{
		name:'bounceOutUp',
		cname:'从上弹出'
	},{
		name:'bounceOutDown',
		cname:'从下弹出'
	}];

	//渐变进入相关动画
	var fadingEntrancesListConfig = [{
		name:'fadeIn',
		cname:'淡入'
	},{
		name:'fadeInDown',
		cname:'从上淡入'
	},{
		name:'fadeInLeft',
		cname:'从左淡入'
	},{
		name:'fadeInUp',
		cname:'从下淡入'
	},{
		name:'fadeInRight',
		cname:'从右淡入'
	}];

	//渐变退出相关动画
	var fadingExitsListConfig = [{
		name:'fadeOut',
		cname:'淡出'
	},{
		name:'fadeOutLeft',
		cname:'向左淡出'
	},{
		name:'fadeOutRight',
		cname:'向右淡出'
	},{
		name:'fadeOutUp',
		cname:'向上淡出'
	},{
		name:'fadeOutDown',
		cname:'向下淡出'
	}];

	var flippersListConfig = [{
		name:'flip',
		cname:'翻转'
	},{
		name:'flipInX',
		cname:'X轴翻转'
	},{
		name:'flipInY',
		cname:'Y轴翻转'
	}];

	var lightSpeedListConfig = [{
		name:'lightSpeedIn',
		cname:'飞速进入'
	},{
		name:'lightSpeedOut',
		cname:'飞速离开'
	}];


	var rotateEntrancesListConfig = [{
		name:'rotateIn',
		cname:'旋转进入'
	},{
		name:'rotateInDownLeft',
		cname:'左下旋转进入'
	},{
		name:'rotateInDownRight',
		cname:'右下旋转进入'
	},{
		name:'rotateInUpLeft',
		cname:'右上旋转进入'
	},{
		name:'rotateInUpRight',
		cname:'左上旋转进入'
	}];

	var rotateExitsListConfig = [{
		name:'rotateOut',
		cname:'旋转消失'
	},{
		name:'rotateOutDownLeft',
		cname:'右下旋转消失'
	},{
		name:'rotateOutDownRight',
		cname:'左下旋转消失'
	},{
		name:'rotateOutUpLeft',
		cname:'左上旋转消失'
	},{
		name:'rotateOutUpRight',
		cname:'右上旋转消失'
	}];

	var slideEntranceListConfig = [{
		name:'slideInDown',
		cname:'从上滑动进入'
	},{
		name:'slideInLeft',
		cname:'从左滑动进入'
	},{
		name:'slideInRight',
		cname:'从右滑动进入'
	},{
		name:'slideInUp',
		cname:'从下滑动进入'
	}];

	var slideExitListConfig = [{
		name:'slideOutDown',
		cname:'向下滑动消失'
	},{
		name:'slideOutLeft',
		cname:'向左滑动消失'
	},{
		name:'slideOutRight',
		cname:'向右滑动消失'
	},{
		name:'slideOutUp',
		cname:'向上滑动消失'
	}];

	var zoomEntrancesListConfig = [{
		name:'zoomIn',
		cname:'放大进入'
	},{
		name:'zoomInDown',
		cname:'从上放大进入'
	},{
		name:'zoomInLeft',
		cname:'从左放大进入'
	},{
		name:'zoomInRight',
		cname:'从右放大进入'
	},{
		name:'zoomInUp',
		cname:'从下放大进入'
	}];

	var zoomExitListConfig = [{
		name:'zoomOut',
		cname:'缩小消失'
	},{
		name:'zoomOutDown',
		cname:'向下缩小消失'
	},{
		name:'zoomOutLeft',
		cname:'向左缩小消失'
	},{
		name:'zoomOutRight',
		cname:'向右缩小消失'
	},{
		name:'zoomOutUp',
		cname:'向上缩小消失'
	}];

	var specialListConfig = [{
		name:'hinge',
		cname:'转轴'
	},{
		name:'rollIn',
		cname:'滚动进入'
	},{
		name:'rollOut',
		cname:'滚动消失'
	}];




	var PresetAnimationEditor = {
		//初始化
		init:function(opt){
			opt = opt || {};
			this.name = 'PresetAnimationEditor';
			this.headerName = '插入预设动画';

		},
		//事件绑定
		bind:function(){
			var self = this;
			//点击预览动画
			// this.previewBtn.on('click',function(){
			// 	var animationClass = self.presetAnimationSelector.val();
			// 	var animationDuration = self.previewDuration.val();
			// 	self.setAnimation(animationClass,animationDuration);
			// });
			//示例元素动画结束之后取消animated样式类和对应动画的样式类
			this.previewDemo.on('webkitAnimationEnd',function(){
				$(this).removeClass(currentAnimationClass);
				$(this).removeClass('animated');
			});

			this.presetAnimationList.on('click',function(e){
				var target = $(e.target);
				self.select(target);

			});

		},
		//选中一个项
		select:function(target){
			if(currentTarget){
				currentTarget.removeClass('active');
			}
			target.addClass('active');
			currentTarget = target;

			var animationClass = target.data('name');
			var animationDuration = this.previewDuration.val();
			this.setAnimation(animationClass,animationDuration);
		},
		//确定选择一个动画
		confirmAnimation:function(){

			//动画选择事件通知
			$(window).trigger('animationConfirm',{
				//耗时
				duration:this.previewDuration.val(),
				//动画名
				animationName:currentAnimationClass
			});

		},
		//为示例设置动画
		setAnimation:function(animationClass,duration){
			if(currentAnimationClass){
				$(this.previewDemo).removeClass(currentAnimationClass);
			}

			currentAnimationClass = animationClass;
			this.previewDemo.addClass(animationClass);
			this.previewDemo.addClass('animated');
			this.previewDemo.css({
				'-webkit-animation-duration':duration + 's'
			});
		},
		render:function(){
		
			var id = TMPL_NAME + '_' + this.id;
			//菜单模板字符串
			var tmplString = tmpl[TMPL_NAME]({
				id:id,
				attentionSeekersListConfig:attentionSeekersListConfig,
				bouncingEntrancesListConfig:bouncingEntrancesListConfig,
				bouncingExitsListConfig:bouncingExitsListConfig,
				fadingEntrancesListConfig:fadingEntrancesListConfig,
				fadingExitsListConfig:fadingExitsListConfig,
				flippersListConfig:flippersListConfig,
				lightSpeedListConfig:lightSpeedListConfig,
				rotateEntrancesListConfig:rotateEntrancesListConfig,
				rotateExitsListConfig:rotateExitsListConfig,
				slideEntranceListConfig:slideEntranceListConfig,
				slideExitListConfig:slideExitListConfig,
				zoomEntrancesListConfig:zoomEntrancesListConfig,
				zoomExitListConfig:zoomExitListConfig,
				specialListConfig:specialListConfig
			});	
			//添加新页的html串
			WinManager.add(this.name,tmplString);

			//动画预览按钮
			//this.previewBtn = $('<button>预览</button>').addClass('preset-animation-preview');

			//WinManager.addBtns(this.name,[this.previewBtn]);

			//预览的精灵示例
			this.previewDemo = $('.preset-sprite-demo');
			//预设动画选择菜单
			//this.presetAnimationSelector = $('.select-preset-animation');	
			//预设动画选择列表
			this.presetAnimationList = $('.preset-animation-ul-list');
			//动画时长控制
			this.previewDuration = $('.preset-animation-duration');
			//确定选择预设动画按钮
			this.confirmBtn = $('.confirm-preset-animation');
			//取消选择预设动画按钮
			this.cancelBtn = $('.cancel-preset-animation');
			//事件绑定
			this.bind();				
			
		},
		//展示
		show:function(){

			var self = this;

			if(!this.element || !this.element.length){
				this.render();
			}

			WinManager.show({
				name:this.name,
				headerName:this.headerName,
				onConfirm:function(){
					self.confirmAnimation();				
				}
			});

			//打开选择第一个选项
			var firstTargetItem = this.presetAnimationList.find('.list-group-item')[0];
			this.select($(firstTargetItem));
		}
	};

	return PresetAnimationEditor;
});