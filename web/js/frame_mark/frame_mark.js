//精灵元素
define(['tmpl','util'],function(tmpl,Util,Controller){

	function FrameMark(opt){
		this.init(opt);
	};

	FrameMark.prototype = {
		//初始化
		init:function(opt){
			this.setData(opt);

			//渲染
			this.render();
			//事件绑定
			this.bind();
			//更新开始位置x轴坐标
			this.stop();
			//开始位置
			this.updateStartPosition();	
			//更新结束位置x轴坐标
			this.updateEndPosition();	
			//更新剩余时长
			this.updateLastDuration();	
			//更新当前位置
			this.updateCurrentPosition(this.startPosition);
		},
		setData:function(opt){
			//id
			this.id = opt.id;
			//舞台id
			this.stageId = opt.stageId;
			//容器
			this.container = opt.container;
			//每帧显示长度
			this.frameLength = opt.frameLength + 1;
			//每帧时长
			this.frameDuration = opt.frameDuration;
			//总帧数
			this.totalFramesCount = opt.totalFramesCount;
			//是否暂停状态
			this.isPaused = false;

		},
		//获取数据
		getData:function(){
		},
		updateStartPosition:function(){
			this.startPosition = (this.frameLength - this.element.width()) / 2;
		},
		//获取当前标记元素所在位置
		getCurrentMarkElementPosition:function(){
			return this.element.offset().left - this.container.offset().left;
		},
		//获取的当前所在帧索引
		getCurrentIndex:function(){
			var currentMarkPosition = this.getCurrentMarkElementPosition();
			return Math.max(0,Math.floor(currentMarkPosition / this.frameLength));
		},
		//更新位置（取消动画)
		updateCurrentPosition:function(currentPosition){
			this.currentPosition = currentPosition;

			this.element.css({
				'-webkit-transition':'none',
				'-webkit-transform':'translateX(' + this.currentPosition + 'px) translateZ(0)'
			});

			this.isPaused = false;

			

		},
		//同时更新帧标记的时长和总帧数
		updateTotalDurationAndFramesCount:function(frameTotalDuration,totalFramesCount){
			this.frameTotalDuration = frameTotalDuration;
			this.totalFramesCount = totalFramesCount;

			this.updateEndPosition();
		},
		//根据当前帧索引决定更新位置
		updateCurrentPositionByFrameIndex:function(frameIndex){
			//超过长度就不update了
			//if(frameIndex >= this.totalFramesCount) return;
			if(frameIndex >= this.totalFramesCount) frameIndex = this.totalFramesCount - 1;

			var baseLength = frameIndex * this.frameLength;
			var newPosition = baseLength + (this.frameLength - this.element.width()) / 2;

			this.updateCurrentPosition(newPosition);
		},
		//播放帧标记动画
		play:function(){
			var self = this;

			if(!this.isPaused){
				this.stop();
			}
			this.updateLastDuration();
			//这里延迟10ms会造成一点点延迟，以后看看能否用其他方法fix这里，既能顺利播放动画页不延迟
			setTimeout(function(){
				//播放transition动画
				self.element.css({
					'-webkit-transition':'all '+ self.lastDuration + 's linear',
					'-webkit-transform':'translateX(' + self.endPosition + 'px)'
				});
			},10);

			this.isPaused = false;
		
		},
		//暂停
		pause:function(){
			//当前标记所在位置
			this.updateCurrentPosition(this.element.offset().left - this.container.offset().left);
			this.isPaused = true;
		},
		//停止
		stop:function(){
			//当前标记所在位置
			this.updateCurrentPosition(this.startPosition);
		},

		updateEndPosition:function(){
			this.endPosition = this.startPosition + this.frameLength * (this.totalFramesCount - 1);
	
		},
		//更新剩余时长
		updateLastDuration:function(){
			//剩余时长
			this.lastDuration = ((this.endPosition - this.currentPosition) / this.frameLength) * this.frameDuration;
		},
		//事件绑定
		bind:function(){
			var self = this;
			this.element.on('webkitTransitionEnd',function(){
				//去掉动画
				self.element.css({
					'-webkit-transition':'none',
				});
			});

		},
		getFrameMarkElement:function(){
			return this.element;
		},
		//渲染
		render:function(){
			this.element = $('<div></div>',{
				id:'frame_mark_' + Util.getRandomId(),
				class:'frames-process-mark'
			});

			this.container.append(this.element);
		},
		//移除
		remove:function(){
			var element = this.getFrameMarkElement();
			element.remove();
		}
	};

	return FrameMark;
});