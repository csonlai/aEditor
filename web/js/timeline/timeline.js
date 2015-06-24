//动画时间轴
define(['tmpl','util'],function(tmpl,Util){
	var TMPL_NAME = 'timeline';

	function Timeline(opt){
		this.init(opt);
	};

	Timeline.prototype = {
		//初始化 
		init:function(opt){
			//随机id
			this.id = opt.id || Util.getRandomId();
			//时间轴时长(s)
			this.duration = opt.duration || 1;
			//每0.1s所占长度(px)
			this.perLength = opt.perLength || 5;
			//所占宽度
			this.width = this.perLength * 10 * this.duration;
			//所属帧
			this.frame = opt.frame;
			//关键帧列表
			this.keyframes = opt.keyframes;
			//左起坐标
			this.left = this.perLength * this.frame.index;
			//渲染
			this.render();

		},
		//渲染 
		render:function(){

			var id = TMPL_NAME + '_' + this.id;
			 //所属帧展示栏
			var framesbar = this.frame.framesbar;
			var framesBarElement = framesbar.getFramesBarElement();
			//时间轴模板字符串
			var tmplString = tmpl[TMPL_NAME]({
				id:id,
				duration:this.duration,
				width:this.width,
				left:this.left
			});	
			//添加新页的html串
			framesBarElement.append(tmplString);	
		}
	};


	return Timeline;

});