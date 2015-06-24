//舞台切换动画配置对象
define([],function(){

	var StageTransitionConfig = {
		'移动':{
			
			utd:{
				down:{
					outClass:'pt-page-moveToTop',
					inClass:'pt-page-moveFromBottom'
					
				},
				up:{
					outClass:'pt-page-moveToBottom',
					inClass:'pt-page-moveFromTop'
					
				}
			},
			ltr:{
				down:{
					outClass:'pt-page-moveToLeft',
					inClass:'pt-page-moveFromRight'
					
				},
				up:{
					outClass:'pt-page-moveToRight',
					inClass:'pt-page-moveFromLeft'
					
				}
			}
			
		},
		'渐变移动':{
			utd:{
				down:{
					outClass:'pt-page-moveToTopFade',
					inClass:'pt-page-moveFromBottomFade'
					
				},
				up:{
					outClass:'pt-page-moveToBottomFade',
					inClass:'pt-page-moveFromTopFade'
					
				}	
			},
			ltr:{
				down:{
					outClass:'pt-page-moveToLeftFade',
					inClass:'pt-page-moveFromRightFade'
					
				},
				up:{
					outClass:'pt-page-moveToRightFade',
					inClass:'pt-page-moveFromLeftFade'
					
				}				
			}		
		},
		'缩放':{
			utd:{
				down:{
					outClass:'pt-page-scaleDown',
					inClass:'pt-page-moveFromBottom pt-page-ontop'
					
				},
				up:{
					outClass:'pt-page-scaleDown',
					inClass:'pt-page-moveFromTop pt-page-ontop'
					
				}	
			},
			ltr:{
				down:{
					outClass:'pt-page-scaleDown',
					inClass:'pt-page-moveFromRight pt-page-ontop'
					
				},
				up:{
					outClass:'pt-page-scaleDown',
					inClass:'pt-page-moveFromLeft pt-page-ontop'
					
				}					
			}		
		},
		'旋转':{
			utd:{
			
				down:{
					outClass:'pt-page-rotateRoomTopOut pt-page-ontop',
					inClass:'pt-page-rotateRoomTopIn'
					
				},
				up:{
					outClass:'pt-page-rotateRoomBottomOut pt-page-ontop',
					inClass:'pt-page-rotateRoomBottomIn'
					
				}		
			},
			ltr:{
			
				down:{
					outClass:'pt-page-rotateRoomLeftOut pt-page-ontop',
					inClass:'pt-page-rotateRoomLeftIn'
					
				},
				up:{
					outClass:'pt-page-rotateRoomRightOut pt-page-ontop',
					inClass:'pt-page-rotateRoomRightIn'
					
				}		
			}	
		
		}
	};


	return StageTransitionConfig;
});