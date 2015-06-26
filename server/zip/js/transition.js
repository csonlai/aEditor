
(function (window, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([],factory);
    } else {
        window.Transition = factory();
    }
})(this,function(){

    'use strict';

    //动画默认配置项
    var config = {
        duration:2,
        type:"ease-out",
        nextDuration:0,
        use3d:true,
        defaultKeyAnimationName:'key-animation'
    };

    //帧动画名id索引
    var keyframesAnimationId = 0;
    //帧动画style标签id列表
    var keyframesStyleList = [];
    //需要增加px单位的属性名列表
    var needPxNameArr = ['width','height'];
    //是否在移动端打开
    var isMobile = $.os && ($.os.ios || $.os.android);
    //低于android 4.0的系统
    var isUnderAndroid4 = $.os && $.os.android && Number($.os.version.split('.')[0]) < 4;


    //是否需要增加px单位
    function needPxUnit(n){
        for(var i = 0 , l = needPxNameArr.length ; i < l; i++){
            if(needPxNameArr[i] == n){
                return true;
            }
        }
    };

    //初始化css对象,增加transition
    function initCssObj(cssObj,duration,type){

        cssObj["-webkit-transition"] = "all " + duration + "s " 
                                   + type;
        
        return cssObj;
    };

    //生成动画样式类
    function createAnimationStyleObj(animationName,duration,isRepeat,repeatTime){

        return {
            '-webkit-animation-name':animationName,
            '-webkit-animation-duration':(duration * 1000) + 'ms',
            '-webkit-animation-fill-mode':'forwards',
            '-webkit-animation-iteration-count':isRepeat ? (repeatTime ? repeatTime : 'infinite' ) : '1'
        };
    };
    //hack android2.3下需要过滤的3d变形属性,避免3d变形属性导致变形失效的bug
    function filterAndroid23Transform(transformString){
        return transformString.replace(/translateZ\(.*?\)/g,'')
                       .replace(/rotateX\(.*?\)/g,'')
                       .replace(/rotateY\(.*?\)/g,'')
                       .replace(/rotateZ/g,'rotate')
                       .replace(/translateZ\(.*?\)/g,'')
                       .replace(/perspective\(.*?\)/g,'');
    };

    //生成单个动画字符串
    function createSingleFrameString(singleFrameName,singleFrameObj){
        var newSingleFrameObj = {};
        var keyFramesStrArr = [];
        for(var n in singleFrameObj){
            if(singleFrameObj.hasOwnProperty(n)){

                //针对android 2.3过滤transform属性
                if(n == '-webkit-transform' && isUnderAndroid4){
                    singleFrameObj[n] = filterAndroid23Transform(singleFrameObj[n]);
                }

                newSingleFrameObj[n] = singleFrameObj[n];

                //需要px单位并且是数字,手动增加  
                if(needPxUnit(n) && !isNaN(Number(newSingleFrameObj[n]))){
                    newSingleFrameObj[n] += 'px';
                }
                //外部手机端页面,translateX替换成按屏幕比例的x值(如果之后这里涉及元件，元件要特殊处理一下，不能相对于手机屏幕设置宽度)
                // if(n == '-webkit-transform' && isMobile){

                //     var winWidth = window.innerWidth;

                //     newSingleFrameObj[n] = newSingleFrameObj[n].replace(/translateX\((.*?)\)/g,function(str,value){
                //         var value = Number(value.replace('px',''));
                     
                //         return 'translateX(' + ((value / 320) * winWidth) + 'px)';
                //     });
                  
                // }

                keyFramesStrArr.push(n + ':' + newSingleFrameObj[n] + ';');
            }
        }

       return singleFrameName + '{' + keyFramesStrArr.join('') + '}';
    
        // return (singleFrameName + JSON.stringify(newSingleFrameObj))
        //                         .replace(/\"/g,'')
        //                         .replace(/\,/g,';')
        //                         .replace(/\;base64\;/g,';base64,');
    };
    //生成keyframe css动画字符串
    function createKeyframesStyle(keyAnimationName,keyframesObj){
        var frameAnimationStringArr = [];
        

        frameAnimationStringArr.push('@-webkit-keyframes');
        frameAnimationStringArr.push(keyAnimationName);
        frameAnimationStringArr.push('{');

        //生成动画字符串数组
        for(var kn in keyframesObj){
            if(keyframesObj.hasOwnProperty(kn)){
                //生成单个动画字符串
                var singleAnimationStr = createSingleFrameString(kn,keyframesObj[kn]);
                frameAnimationStringArr.push(singleAnimationStr);
                //singleAnimationStr.a_percent = kn.replace('%','');
            }
        }
        //根据百分号排序一下输出
        // frameAnimationStringArr.sort(function(s1,s2){
        //     return s1.a_percent > s2.a_percent;
        // });
        frameAnimationStringArr.push('}');

        //生成动画keyframe串
        var animationStyleString = frameAnimationStringArr.join(' ');
        //生成随机id
        //var id = ~~(Math.random() * 1e8);
        //新的style标签
        var newStyle = $('<style></style>',{
            class:"animation-style"
        });
        newStyle.html(animationStyleString);  

        return newStyle;     
    };

    //单个元素动画
    function SingleTransition(transitionObj){
        this.init(transitionObj);  
    };

    SingleTransition.prototype = {
        init:function(transitionObj){
            this.transitionObj = transitionObj;
            this.keyframesStyleList = [];
        },
        pause:function(){
            var elem = this.transitionObj.elem;
            elem.css({
                '-webkit-animation-play-state':'paused'
            });
        },
        resume:function(){
            var elem = this.transitionObj.elem;
            elem.css({
                '-webkit-animation-play-state':'running'
            });
        },
        stop:function(){
            var elem = this.transitionObj.elem;
            elem.css({
                '-webkit-animation':'none'
            });
            //清除style标签
            this.resetStyle();
            //恢复play-state状态为running，便于下次启动动画播放
            this.resume();
        },
        play:function(){

            console.log('play');
            var transitionObj = this.transitionObj;

            var transitionElem;
            //有现成元素使用现成元素
            if(transitionObj.elem){
                transitionElem = $(transitionObj.elem);
        
            }
            
            //标记为正在应用动画的对象
            transitionElem.addClass('t_sprite');
            var transitionDuration = transitionObj.duration || config.duration;
            var transitionType = transitionObj.type || config.type;
            //是否使用3d
            var use3d = (typeof transitionObj.use3d == "undefined" ? transitionObj.use3d = config.use3d : transitionObj.use3d);

            //keyframes 动画
            if(transitionObj.keyframes){
                //原来的动画id
                var originAnimationId;
                //先删除原来的动画style再新建
                if(originAnimationId = $(transitionObj.elem).data('keyAnimationId')){
                    $('#'+originAnimationId).remove();
                }

                //生成该次动画名
                var keyAnimationName = config.defaultKeyAnimationName + keyframesAnimationId;
                //生成keyframes的样式style标签
                var newStyle = createKeyframesStyle(keyAnimationName,transitionObj.keyframes);
                //设置id 便于删除
                newStyle.attr('id',keyAnimationName);
                $(transitionObj.elem).data('keyAnimationId',keyAnimationName);
                //增加到数组
                this.keyframesStyleList.push(newStyle);
                //把样式增加到head上
                $('head').append(newStyle);


                //应用于元素的动画样式对象
                var cssObj = createAnimationStyleObj(keyAnimationName,transitionObj.duration,transitionObj.repeatMode,transitionObj.repeatTime);

                //设置元素的动画样式
                transitionElem.css(cssObj);

                transitionElem.addClass('running-sprite');

                //修改元素上正在播放的动画的帧展示栏的renderId
                transitionElem.attr('data-playing-framesbar-render-id',transitionObj.playingFramesBarRenderId);
             
                //动画id自增
                keyframesAnimationId++;


            }


            //该动画的结束
            $(transitionObj.elem).off('webkitAnimationEnd');
            $(transitionObj.elem).on('webkitAnimationEnd',function(e){
                e.stopPropagation();
                
                // if(transitionObj.imgFileName == '0.png'){
                //     debugger;
                //     window.bb = transitionObj;
                    
                // }

                var animationName = (e.originalEvent || e)['animationName'];
                var lastCssProperties = transitionObj.keyframes['100%'];

                //单个并行动画结束的回调e
                transitionObj.callback && transitionObj.callback({
                    animationName:animationName
                });

                //hack android 2.3 fill-mode为forwards时不能保持最后样式状态的bug
                if(lastCssProperties && isMobile){
                    $(transitionObj.elem).css(lastCssProperties);
                }

            });

            //动画重复
            $(transitionObj.elem).off('webkitAnimationIteration');
            $(transitionObj.elem).on('webkitAnimationIteration',function(e){
                //避免冒泡影响父元素的行为
                e.stopPropagation();
                //单个并行动画的重复回调
                transitionObj.interationCallback && transitionObj.interationCallback({
                    animationName:e.originalEvent.animationName
                });
            });
                
        },
        //重置style标签
        resetStyle:function(){
            //t_obj_arr = [];
            var keyframesStyleList = this.keyframesStyleList;
            while(keyframesStyleList.length){
                var styleElem = keyframesStyleList.pop();
                $(styleElem).remove();
            }  
        }
    }




    //用于动画处理的对象
    function Transition(opt){
        this.init(opt);
    };

    Transition.prototype = {
        init:function(opt){
            // this.container = opt.container || $('body');
            // this.container.addClass('t-container');

            this.t_obj_arr = [];
            
            this.bind();
        },
        bind:function(){
            var self = this;

            $(window).on('singleLoopAnimationEnd',function(){
                var e = arguments[1];
                var t_obj_arr = self.t_obj_arr;

                var t_obj = e.t_obj;

                //循环执行
                if(t_obj_arr.length > 0){
                    //播放下一个动画
                    self.playNext(t_obj.nextDuration);
                }
                //队列里已经没有动画对象，则执行最终的回调
                else{
                    self.running = false;
                    t_obj.onEnd && t_obj.onEnd();
                    t_obj.onEnd = null;
                }
            });
        },
        playNext:function(nextDuration){
            var t_obj_arr = this.t_obj_arr;
            if(t_obj_arr.length > 0){
                //下一个动画对象
                var next_t_obj = t_obj_arr.shift();

                setTimeout(function(){
                    //播放下一组动画
                    self.playSingleLoop(next_t_obj);

                }, (nextDuration || config.nextDuration) *  1000);
            }
        },
        //播放一组动画
        playSingleLoop:function(t_obj){
            var self = this;
            //该obj的所有transition的队列
            var transitionArr = t_obj.transitionArr || [];
            //并行动画的个数
            var transitionCount = transitionArr.length;
            //已完成的并行动画的个数
            var finishCount = 0;

          

            //遍历需要并发执行的动画列表
            for(var i = 0; i < transitionCount; i++){
                var transitionObj = transitionArr[i];
                //播放单个元素动画
                var st = Transition.playSingle(transitionObj);

                //增加到单个动画对象数组
                self.singleTransitionArr.push(st);



                $(transitionObj.elem).on('webkitAnimationEnd',function(e){
                    //禁止冒泡，避免元件的动画结束事件被元件的父层精灵捕获，导致逻辑错误
                    e.stopPropagation();
                    
                    finishCount ++;

                    //全部并行动画已经执行结束
                    if(finishCount == transitionCount){
                        //console.log(t_obj.totalCallback);
                        //所有并行动画结束的回调
                        t_obj.totalCallback && t_obj.totalCallback();
                        //事件通知
                        $(window).trigger('singleLoopAnimationEnd',{
                            t_obj:t_obj
                        });
                    }
                });
            }
        },
        run:function(){
            var self = this;
            var t_obj_arr = this.t_obj_arr;

            this.running = true;
            this.singleTransitionArr = [];

            //先重置再重新开始
            this.resetStyle();
            //开始播放动画
            if(t_obj_arr.length > 0){
                var t_obj = t_obj_arr.shift();
                self.playSingleLoop(t_obj);
            }
            else{
                this.running = false;
                t_obj.onEnd && t_obj.onEnd();
                t_obj.onEnd = null;               
            }

            return this;
        },
        //重置style标签
        resetStyle:function(){
            $.each(this.singleTransitionArr,function(i,st){
                st.resetStyle();
            });
        },
        add:function(obj){
            this.t_obj_arr.push(obj);

            return this;
        },
        pause:function(){
            $.each(this.singleTransitionArr,function(i,st){
                st.pause();
            });
        },
        resume:function(){
            $.each(this.singleTransitionArr,function(i,st){
                st.resume();
            });
        },
        stop:function(){
            //所有正在播放动画的元素取消动画
            $.each(this.singleTransitionArr,function(i,st){
                st.stop();
            });
            //恢复play-state状态为running，便于下次启动动画播放
            this.resume();
            //清除队列
            this.t_obj_arr = [];
        },
        //获取动画对象数组
        getAnimationObjectArr:function(){
            return this.t_obj_arr;
        },
        end:function(func){
            this.t_obj_arr[t_obj_arr.length - 1].onEnd = func;
            return this;
        },
        isRunning:function(){
            return this.running;
        }

    };

    Transition.playSingle = function(transitionObj){
        var t = new SingleTransition(transitionObj);
        t.play();
        return t;
    };

    Transition.createKeyframesStyle = createKeyframesStyle;
    Transition.createAnimationStyleObj = createAnimationStyleObj;

    return Transition;
});
