//缓动类
define([],function(){

	var Tween = {
		linear:function(t,b,c,d){
			return c*t/d +b;
		},
		easein:function(t,b,c,d){
			return c*(t/=d)*t + b;
		},
		easeout:function(t,b,c,d){
			return -c*(t/=d)*(t-2)+b;
		},
		easeinout:function(t,b,c,d){
			if((t /= d / 2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
	};

	return Tween;
});