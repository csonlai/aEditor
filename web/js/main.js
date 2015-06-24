require.config({
	paths:{
		//基础部分
		'jquery':'./base/jquery',
		'jquery-event-swipe':'./base/jquery-event-swipe',
		'jquery-ui':'./base/jquery-ui',
		'color_picker':'./util/jq_color_picker',
		'preset_animation_config':'./preset_animation/preset_animation_config',
		'preset_animation_editor':'./preset_animation/preset_animation_editor',
		'controller_setting':'./controller_setting/controller_setting',
		'tween':"./util/tween",
		'drag':'./util/drag',
		'drag_live':'./util/drag_live',
		'rotatable':'./util/rotatable',
		'handlebars':'./base/handlebars',
		'tmpl':'./templates/templates',
		//页面部分
		'index':'./index/index',
		'pages':'./pages/pages',
		'stages':'./stages/stages',
		'framesbar':'./framesbar/framesbar',
		'sprite':'./sprite/sprite',
		'controller':'./controller/controller',
		'util':'./util/util',
		'timeline':'./timeline/timeline',
		'transition':'./transition/transition',
		'csseditor':'./csseditor/csseditor',
		'main_show':'./main_show/main_show',
		'user_images':'./user_images/user_images',
		//组件部分
		'dropmenu':'./components/dropmenu/dropmenu',
		'sprite_event_animation_setting':'./sprite_event_animation_setting/sprite_event_animation_setting',
		'sprite-action-setting':'./sprite-action-setting/sprite-action-setting',
		'frame_mark':'./frame_mark/frame_mark',
		'fbf_animation_editor':'./fbf_animation_editor/fbf_animation_editor',
		'img_path_setting':'./img_path_setting/img_path_setting',
		'background_setting':'./background_setting/background_setting',
		'win_manager':'./win_manager/win_manager',
		'keyframe':'./keyframe/keyframe',
		'frame':'./frame/frame',
		'work_list':'./work_list/work_list',
		'stage_transition_config':'./stages/stage_transition_config',
		'main_page':'./main_page/main_page',
		'layer-size-setting':'./layer-size-setting/layer-size-setting',
		'sprite_list':'./sprite_list/sprite_list'


		

	}
});

require(['index'], function(index) {
    index.init();
});