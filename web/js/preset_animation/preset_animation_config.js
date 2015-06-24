//预设动画配置对象
define([],function(){
	//配置对象
	var presetAnimationConfig = {};
	//bounce动画
	var bounce = presetAnimationConfig['bounce'] = {
		'70%': {
			customSetting:{
				'-webkit-animation-timing-function': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)'
			},
			'y':-15
		},
		'90%': {
			'y': -4
		}		
	};

	bounce['40%'] = bounce['43%'] = {
		customSetting:{
			'-webkit-animation-timing-function': 'cubic-bezier(0.755, 0.050, 0.855, 0.060)'
		},
		'y':-30
	};

	bounce['0%'] = bounce['20%'] = bounce['53%'] = bounce['80%'] = bounce['100%'] = {
		customSetting:{
			'-webkit-animation-timing-function':'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
		},
		'y': 0
	};



	//swing动画
	presetAnimationConfig['swing'] = {
		'0%':{
			rotateZ:0
		},
		'20%': {
			rotateZ:15
		},
		'40%': {
			rotateZ:-10
		},
		'60%': {
			rotateZ:5
		},
		'80%': {
			rotateZ:-5
		},
		'100%': {
			rotateZ:0
		}		
	};



	//flash动画
	var flash = presetAnimationConfig['flash'] = {};
	flash['0%'] = flash['50%'] = flash['100%'] = {
		opacity:1,
		easing:'ease'
	};

	flash['25%'] = flash['75%'] = {
		opacity:0,
		easing:'ease'
	};



	//pulse动画
	presetAnimationConfig['pulse'] = {
		'0%':{
			scale:1
		},
		'50%':{
			scale:1.05
		},
		'100%':{
			scale:1
		}
	};


	//rubberBand动画
	presetAnimationConfig['rubberBand'] = {
		'0%': {
			scale:1
		},
		'30%':{
			scaleX:1.25,
			scaleY:0.75
		},
		'40%':{
			scaleX:0.75,
			scaleY:1.25
		},
		'50%':{
			scaleX:1.15,
			scaleY:0.85
		},
		'65%':{
			scaleX:.95,
			scaleY:1.05
		},
		'75%':{
			scaleX:1.05,
			scaleY:.95
		},
		'100%':{
			scale:1
		}
	};


	//shake动画
	var shake = presetAnimationConfig['shake'] = {
		'0%':{
			x:0		
		}

	};

	shake['10%'] = shake['30%'] = shake['50%'] = shake['70%'] = shake['90%'] = {
		x:-10
	};

	shake['20%'] = shake['40%'] = shake['60%'] = shake['80%'] = {
		x:10
	};

	shake['100%'] = {
		x:0
	};

	//tada动画 tofixed
	var tada = presetAnimationConfig['tada'] = {
		'0%':{
			scale:1
		}
	};


	tada['10%'] = tada['20%'] = {
		scaleX:.9,
		scaleY:.9,
		scaleZ:.9,
		rotateZ:-3
	};

	tada['30%'] = tada['50%'] = tada['70%'] = tada['90%'] = {
		scaleX:1.1,
		scaleY:1.1,
		scaleZ:1.1,
		rotateZ:3
	};
	tada['40%'] = tada['60%'] = tada['80%'] = {
		scaleX:1.1,
		scaleY:1.1,
		scaleZ:1.1,
		rotateZ:-3
	};
	tada['100%'] = {
		scaleX:1,
		scaleY:1,
		scaleZ:1,
		rotateZ:0
	};

	//wobble动画
	presetAnimationConfig['wobble'] = {
		'15%':{
			x:-25,
			rotateZ:-5
		},
		'30%':{
			x:20,
			rotateZ:3
		},
		'45%':{
			x:-15,
			rotateZ:-3
		},
		'60%':{
			x:10,
			rotateZ:2
		},
		'75%':{
			x:-5,
			rotateZ:-1
		},
		'100%':{
			x:0,
			rotateZ:0
		}
	};

	//jello动画
	presetAnimationConfig['jello'] = {

	};

	//bounceIn动画 tofixed
	presetAnimationConfig['bounceIn'] = {
		'0%':{
			opacity:0,
			scaleX:.3,
			scaleY:.3,
			scaleZ:.3,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'20%':{
			scaleX:1.1,
			scaleY:1.1,
			scaleZ:1.1,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'40%':{
			scaleX:.9,
			scaleY:.9,
			scaleZ:.9,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'60%':{
			opacity:1,
			scaleX:1.03,
			scaleY:1.03,
			scaleZ:1.03,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'80%':{
			scaleX:.97,
			scaleY:.97,
			scaleZ:.97,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'100%':{
			
			scaleX:1,
			scaleY:1,
			scaleZ:1
		}		
	};

	//bounceInDown动画 tofixed
	presetAnimationConfig['bounceInDown'] = {
		'0%':{
			opacity:0,
			y:-3000,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'60%':{
			opacity:1,
			y:25,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'75%':{
			y:-10,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'90%':{
			y:5,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'100%':{
			y:0
		}
	};

	//bounceInLeft动画 tofixed
	presetAnimationConfig['bounceInLeft'] = {
		'0%':{
			opacity:0,
			x:-3000,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'60%':{
			opacity:1,
			x:25,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'75%':{
			x:-10,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'90%':{
			x:5,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'100%':{
			x:0
		}		
	};

	//bounceInLeft动画 tofixed
	presetAnimationConfig['bounceInRight'] = {
		'0%':{
			opacity:0,
			x:3000,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'60%':{
			opacity:1,
			x:-25,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'75%':{
			x:10,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'90%':{
			x:-5,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'100%':{
			x:0
		}		
	};

	//bounceInUp动画 tofixed
	presetAnimationConfig['bounceInUp'] = {
		'0%':{
			opacity:0,
			y:3000,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'60%':{
			opacity:1,
			y:-25,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'75%':{
			y:10,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'90%':{
			y:-5,
			customSetting:{
				'-webkit-transition-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
			}
		},
		'100%':{
			y:0
		}		
	};

	//bounceOut动画
	presetAnimationConfig['bounceOut'] = {
		'20%':{
			scaleX:.9,
			scaleY:.9,
			scaleZ:.9
		},
		'50%':{
			opacity:1,
			scaleX:1.1,
			scaleY:1.1,
			scaleZ:1.1
		},	
		'55%':{
			scaleX:1.1,
			scaleY:1.1,
			scaleZ:1.1
		},	
		'100%':{
			opacity:0,
			scaleX:.3,
			scaleY:.3,
			scaleZ:.3
		}
  	};


  	//bounceOutDown动画
  	presetAnimationConfig['bounceOutDown'] = {
		'20%': {
			y:10
		},

		'40%':{
			opacity:1,
			y:-20
		},
		'45%':{
			opacity:1,
			y:-20
		},
		'100%':{
			opacity:0,
			y:2000
		}
  	};



  	//bounceOutLeft动画
  	presetAnimationConfig['bounceOutLeft'] = {
		'20%': {
			x:20
		},
		'100%':{
			opacity:0,
			x:-2000
		}
  	};



  	//bounceOutRight动画
  	presetAnimationConfig['bounceOutRight'] = {
		'20%': {
			x:-20
		},
		'100%':{
			opacity:0,
			x:2000
		}
  	};


  	//bounceOutUp动画
  	presetAnimationConfig['bounceOutUp'] = {
		'20%': {
			y:-10
		},

		'40%':{
			opacity:1,
			y:20
		},
		'45%':{
			y:20
		},
		'100%':{
			opacity:0,
			y:-2000
		}
  	};

  	//bounceOutUp动画
  	presetAnimationConfig['fadeIn'] = {
		'0%': {
			opacity:0
		},
		'100%':{
			opacity:1
		}
  	};  	

  	//fadeInDown动画 tofixed
  	presetAnimationConfig['fadeInDown'] = {
		'0%': {
			opacity:0,
			y:-100
		},
		'100%':{
			opacity:1,
			y:0
		} 
  	}; 


  	//fadeInLeft动画 tofixed
  	presetAnimationConfig['fadeInLeft'] = {
		'0%': {
			opacity:0,
			x:-100
		},
		'100%':{
			opacity:1,
			y:0
		} 
  	}; 


  	//fadeInRight动画 tofixed
  	presetAnimationConfig['fadeInRight'] = {
		'0%': {
			opacity:0,
			x:100
		},
		'100%':{
			opacity:1
		} 
  	}; 


  	//fadeInUp动画
  	presetAnimationConfig['fadeInUp'] = {
		'0%': {
			opacity:0,
			y:100
		},
		'100%':{
			opacity:1,
			y:0
		} 
  	}; 

  	//fadeOut动画
  	presetAnimationConfig['fadeOut'] = {
		'0%': {
			opacity:1
		},
		'100%':{
			opacity:0
		} 
  	}; 


  	//fadeOutLeft动画
  	presetAnimationConfig['fadeOutLeft'] = {
		'0%': {
			opacity:1
		},
		'100%':{
			opacity:0,
			x:-100
		} 
  	};

  	//fadeOutRight动画
  	presetAnimationConfig['fadeOutRight'] = {
		'0%': {
			opacity:1
		},
		'100%':{
			opacity:0,
			x:100
		} 
  	};

  	//fadeOutUp动画
  	presetAnimationConfig['fadeOutUp'] = {
		'0%': {
			opacity:1
		},
		'100%':{
			opacity:0,
			y:-100
		} 
  	};

  	//fadeOutDown动画
  	presetAnimationConfig['fadeOutDown'] = {
		'0%': {
			opacity:1
		},
		'100%':{
			opacity:0,
			y:100
		} 
  	};


  	//flip动画 tofixed
  	presetAnimationConfig['flip'] = {

		'0%': {
			rotateY:-360,
			perspective:400,
			customSetting:{
				'-webkit-animation-timing-function': 'ease-out'
			}
		},
		'40%':{
			z:150,
			rotateY:-190,
			perspective:400,
			customSetting:{
				'-webkit-animation-timing-function': 'ease-out'
			}
		},
		'50%':{
			z:150,
			rotateY:-170,
			perspective:400,
			customSetting:{
				'-webkit-animation-timing-function': 'ease-in'
			}
		},
		'80%':{
			scaleX:.95,
			scaleY:.95,  
			scaleZ:.95,
			perspective:400,
			customSetting:{
				'-webkit-animation-timing-function': 'ease-in'
			}
		},
		'100%':{
			perspective:400
		}      
  	}; 

  	//flipInX动画 tofixed
  	presetAnimationConfig['flipInX'] = {
  		'0%':{
  			opacity: 0,
  			perspective:400,
  			rotateX:90,
 			customSetting:{
				'-webkit-animation-timing-function': 'ease-in'
			}
  		},
  		'40%':{
  			perspective:400,
  			rotateX:-20,
 			customSetting:{
				'-webkit-animation-timing-function': 'ease-in'
			}
  		},
   		'60%':{
   			opacity: 1,
  			perspective:400,
  			rotateX:10
  		},
    	'80%':{
  			perspective:400,
  			rotateX:-5
  		},
    	'100%':{
  			perspective:400
  		}
  	};

  	//flipInY动画 tofixed
  	presetAnimationConfig['flipInY'] = {
  		'0%':{
  			opacity: 0,
  			perspective:400,
  			rotateY:90
  		},
  		'40%':{
  			perspective:400,
  			rotateY:-20
  		},
   		'60%':{
   			opacity: 1,
  			perspective:400,
  			rotateY:10
  		},
    	'80%':{
  			perspective:400,
  			rotateY:-5
  		},
    	'100%':{
  			perspective:400
  		}
  	};

  	//lightSpeedIn动画 tofixed
  	presetAnimationConfig['lightSpeedIn'] = {

  		'0%':{
  			opacity:0,
  			x:100,
  			skewX:-30
  		},
  		'60%':{
  			opacity:1,
  			skewX:20
  		},  	
  		'80%':{
  			skewX:-5
  		},  
  		'100%':{
  			opacity:1
  		}  
  	};

  	//lightSpeedOut动画 tofixed
  	presetAnimationConfig['lightSpeedOut'] = {

  		'0%':{
  			opacity:1
  		},
  		'100%':{
  			x:100,
  			opacity:0,
  			skewX:30
  		}  
  	};

  	//rotateIn动画 tofixed
  	presetAnimationConfig['rotateIn'] = {

  		'0%':{
  			opacity:0,
  			rotateZ:200
  		},
  		'100%':{
  			opacity:1,
  			rotateZ:0
  		}  
  	};


  	//rotateInDownLeft动画 
  	presetAnimationConfig['rotateInDownLeft'] = {

  		'0%':{
  			rotateZ:-45,
  			opacity:0,
  			customSetting:{
  				'-webkit-transform-origin': 'left bottom'
  			}
  		},
  		'100%':{
  			opacity:1,
  			customSetting:{
  				'-webkit-transform-origin': 'left bottom'
  			}
  		}  
  	};


  	//rotateInDownRight动画
  	presetAnimationConfig['rotateInDownRight'] = {

  		'0%':{
  			rotateZ:45,
  			opacity:0,
  			customSetting:{
  				'-webkit-transform-origin': 'right bottom'
  			}
  		},
  		'100%':{
  			opacity:1,
  			customSetting:{
  				'-webkit-transform-origin': 'right bottom'
  			}
  		}  
  	};


  	//rotateInUpLeft动画 
  	presetAnimationConfig['rotateInUpLeft'] = {

  		'0%':{
  			rotateZ:45,
  			opacity:0,
  			customSetting:{
  				'-webkit-transform-origin': 'left bottom'
  			}
  		},
  		'100%':{
  			opacity:1,
  			customSetting:{
  				'-webkit-transform-origin': 'left bottom'
  			}
  		}  
  	};

  	//rotateInUpRight动画 
  	presetAnimationConfig['rotateInUpRight'] = {

  		'0%':{
  			rotateZ:-90,
  			opacity:0,
  			customSetting:{
  				'-webkit-transform-origin': 'right bottom'
  			}
  		},
  		'100%':{
  			opacity:1,
  			customSetting:{
  				'-webkit-transform-origin': 'right bottom'
  			}
  		}  
  	};

  	//rotateOut动画 tofixed
  	presetAnimationConfig['rotateOut'] = {
  		'0%':{
  			opacity: 1
  		},
  		'100%':{
  			opacity: 0,
  			rotateZ:-200
  		}
  	};


  	//rotateOutDownLeft动画 
  	presetAnimationConfig['rotateOutDownLeft'] = {
  		'0%':{
  			opacity: 1,
   			customSetting:{
  				'-webkit-transform-origin': 'left bottom'
  			}
  		},
  		'100%':{
  			opacity: 0,
  			rotateZ:45,
   			customSetting:{
  				'-webkit-transform-origin': 'left bottom'
  			}
  		}
  	};  	

  	//rotateOutDownRight动画
  	presetAnimationConfig['rotateOutDownRight'] = {
  		'0%':{
  			opacity: 1,
   			customSetting:{
  				'-webkit-transform-origin': 'right bottom'
  			}
  		},
  		'100%':{
  			opacity: 0,
  			rotateZ:-45,
   			customSetting:{
  				'-webkit-transform-origin': 'right bottom'
  			}
  		}
  	};  

  	//rotateOutDownRight动画
  	presetAnimationConfig['rotateOutUpLeft'] = {
  		'0%':{
  			opacity: 1,
   			customSetting:{
  				'-webkit-transform-origin': 'left bottom'
  			}
  		},
  		'100%':{
  			opacity: 0,
  			rotateZ:-45,
   			customSetting:{
  				'-webkit-transform-origin': 'left bottom'
  			}
  		}
  	}; 



  	//rotateOutUpRight动画
  	presetAnimationConfig['rotateOutUpRight'] = {
  		'0%':{
  			opacity: 1,
   			customSetting:{
  				'-webkit-transform-origin': 'right bottom'
  			}
  		},
  		'100%':{
  			opacity: 0,
  			rotateZ:90,
   			customSetting:{
  				'-webkit-transform-origin': 'right bottom'
  			}
  		}
  	};

  	//hinge动画
  	var hinge = presetAnimationConfig['hinge'] = {
  		'0%':{
  			opacity: 1,
   			customSetting:{
  				'-webkit-transform-origin': 'top left',
  				'-webkit-animation-timing-function': 'ease-in-out'
  			}
  		},
  		'100%':{
    		y:700,
    		opacity: 0
  		}
  	};

  	hinge['20%'] = hinge['60%'] = {
  		rotateZ:80,
		customSetting:{
			'-webkit-transform-origin': 'top left',
			'-webkit-animation-timing-function': 'ease-in-out'
		}  		
  	};

  	hinge['40%'] = hinge['80%'] = {
  		rotateZ:60,
  		opacity: 1,
		customSetting:{
			'-webkit-transform-origin': 'top left',
			'-webkit-animation-timing-function': 'ease-in-out'
		}  		
  	};

  	// rollIn动画
	presetAnimationConfig['rollIn'] = {
  		'0%':{
  			opacity: 0,
  			x:-100,
  			rotateZ:-120
  		},
  		'100%':{
    		opacity: 1
  		}
  	};


  	// rollOut动画
	presetAnimationConfig['rollOut'] = {
  		'0%':{
  			opacity: 1
  		},
  		'100%':{
    		opacity: 0,
    		x:100,
    		rotateZ:120
  		}
  	};

  	// zoomIn动画 tofixed
	presetAnimationConfig['zoomIn'] = {
  		'0%':{
  			opacity: 0,
  			scaleX:.3,
  			scaleY:.3,
  			scaleZ:.3
  		},
  		'50%':{
    		opacity: 1
  		}
  	};


  	// zoomInDown动画 tofixed
	presetAnimationConfig['zoomInDown'] = {
  		'0%':{
  			opacity: 0,
  			scaleX:.1,
  			scaleY:.1,
  			scaleZ:.1,
  			y:-1000,
			customSetting:{
				'-webkit-animation-timing-function': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
			}  
  		},
  		'60%':{
    		opacity: 1,
  			scaleX:.475,
  			scaleY:.475,
  			scaleZ:.475,
  			y:60,
			customSetting:{
				'-webkit-animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.320, 1)'
			}
		},
  		'100%':{
    		opacity: 1,
  			scaleX:1,
  			scaleY:1,
  			scaleZ:1,
  			y:0 
 
  		}
  	};



  	// zoomInLeft动画 tofixed
	presetAnimationConfig['zoomInLeft'] = {
  		'0%':{
  			opacity: 0,
  			scaleX:.1,
  			scaleY:.1,
  			scaleZ:.1,
  			x:-1000,
			customSetting:{
				'-webkit-animation-timing-function': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
			}  
  		},
  		'60%':{
    		opacity: 1,
  			scaleX:.475,
  			scaleY:.475,
  			scaleZ:.475,
  			x:10,
			customSetting:{
				'-webkit-animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.320, 1)'
			}
		},
  		'100%':{
    		opacity: 1,
  			scaleX:1,
  			scaleY:1,
  			scaleZ:1,
  			y:0 
 
  		}
  	};


  	//zoomInRight动画 tofixed
	presetAnimationConfig['zoomInRight'] = {
  		'0%':{
  			opacity: 0,
  			scaleX:.1,
  			scaleY:.1,
  			scaleZ:.1,
  			x:1000,
			customSetting:{
				'-webkit-animation-timing-function': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
			}  
  		},
  		'60%':{
    		opacity: 1,
  			scaleX:.475,
  			scaleY:.475,
  			scaleZ:.475,
  			x:10,
			customSetting:{
				'-webkit-animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.320, 1)'
			}
		},
  		'100%':{
    		opacity: 1,
  			scaleX:1,
  			scaleY:1,
  			scaleZ:1,
  			y:0 
 
  		}
  	};

  	// zoomInUp动画 tofixed
	presetAnimationConfig['zoomInUp'] = {
  		'0%':{
  			opacity: 0,
  			scaleX:.1,
  			scaleY:.1,
  			scaleZ:.1,
  			y:1000,
			customSetting:{
				'-webkit-animation-timing-function': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
			}  
  		},
  		'60%':{
    		opacity: 1,
  			scaleX:.475,
  			scaleY:.475,
  			scaleZ:.475,
  			y:-60,
			customSetting:{
				'-webkit-animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.320, 1)'
			}
		},
  		'100%':{
    		opacity: 1,
  			scaleX:1,
  			scaleY:1,
  			scaleZ:1,
  			y:0 
 
  		}
  	};


  	// zoomOut动画 tofixed
	presetAnimationConfig['zoomOut'] = {

		'0%':{
			opacity:1
		},
		'50%':{
			opacity: 0,
			scaleX:.3,
			scaleY:.3,
			scaleZ:.3
		},
		'100%':{
			opacity:0
		}
  	};


  	// zoomOutDown动画 tofixed
	presetAnimationConfig['zoomOutDown'] = {

		'40%':{
			opacity: 1,
			scaleX:.475,
			scaleY:.475,
			scaleZ:.475,
			y:-60,
			customSetting:{
				'-webkit-animation-timing-function': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
			}
		},
		'100%':{
			opacity:0,
			y:2000,
			scaleX:.1,
			scaleY:.1,
			scaleZ:.1,
			customSetting:{
				'-webkit-transform-origin': 'center bottom',
				'-webkit-animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.320, 1)'
			}
		}
  	};

  	// zoomOutLeft动画 tofixed
	presetAnimationConfig['zoomOutLeft'] = {

		'40%':{
			opacity: 1,
			scaleX:.475,
			scaleY:.475,
			scaleZ:.475,
			x:42
		},
		'100%':{
			opacity:0,
			x:-2000,
			scaleX:.1,
			scaleY:.1,
			scaleZ:.1,
			customSetting:{
				'-webkit-transform-origin': 'left center'
			}
		}
  	};


  	// zoomOutRight动画 tofixed
	presetAnimationConfig['zoomOutRight'] = {

		'40%':{
			opacity: 1,
			scaleX:.475,
			scaleY:.475,
			scaleZ:.475,
			x:-42
		},
		'100%':{
			opacity:0,
			x:2000,
			scaleX:.1,
			scaleY:.1,
			scaleZ:.1,
			customSetting:{
				'-webkit-transform-origin': 'right center'
			}
		}
  	};

  	// zoomOutUp动画 tofixed
	presetAnimationConfig['zoomOutUp'] = {

		'40%':{
			opacity: 1,
			scaleX:.475,
			scaleY:.475,
			scaleZ:.475,
			y:60,
			customSetting:{
				'-webkit-animation-timing-function': 'cubic-bezier(0.550, 0.055, 0.675, 0.190)'
			}
		},
		'100%':{
			opacity:0,
			y:-2000,
			scaleX:.1,
			scaleY:.1,
			scaleZ:.1,
			customSetting:{
				'-webkit-transform-origin': 'center bottom',
				'-webkit-animation-timing-function': 'cubic-bezier(0.175, 0.885, 0.320, 1)'
			}
		}
  	};



  	// slideInLeft动画 tofixed
	presetAnimationConfig['slideInLeft'] = {

		'0%':{
			y:-100
		},
		'100%':{
			y:0
		}
  	};

  	// slideInDown动画 tofixed
	presetAnimationConfig['slideInLeft'] = {

		'0%':{
			x:-100
		},
		'100%':{
			x:0
		}
  	};


  	// slideInRight动画 tofixed
	presetAnimationConfig['slideInRight'] = {

		'0%':{
			x:100
		},
		'100%':{
			x:0
		}
  	};


  	// slideInUp动画 tofixed
	presetAnimationConfig['slideInUp'] = {

		'0%':{
			y:100
		},
		'100%':{
			y:0
		}
  	};


  	// slideOutDown动画 tofixed
	presetAnimationConfig['slideOutDown'] = {

		'0%':{
			y:0
		},
		'100%':{
			y:100
		}
  	};


  	// slideOutLeft动画 tofixed
	presetAnimationConfig['slideOutLeft'] = {

		'0%':{
			x:0
		},
		'100%':{
			x:-100
		}
  	};

  	// slideOutRight动画 tofixed
	presetAnimationConfig['slideOutRight'] = {

		'0%':{
			x:0
		},
		'100%':{
			x:100
		}
  	};

  	// slideOutUp动画 tofixed
	presetAnimationConfig['slideOutUp'] = {

		'0%':{
			y:0
		},
		'100%':{
			y:-100
		}
  	};

	return presetAnimationConfig;
});