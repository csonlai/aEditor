define(['handlebars'], function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["background_setting"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "\n<div class=\"background-setting form-inline\">\n    <table>\n        <tr>\n            <td>\n                <label>背景色：</label>\n            </td>\n            <td>\n                <input class=\"background-color-setting-input form-control\" value=\"rgb(255,255,255)\">\n            </td>\n        </tr>\n        <tr>\n            <td>\n                <label>背景图片：</label>\n            </td>\n            <td>\n                <label class=\"background-image-setting-filename\">暂无文件</label>\n                <button class=\"background-image-setting-file-btn btn btn-primary btn-xs\">\n                    图片选择\n                    <input class=\"background-image-setting-file-input\" type=\"file\">\n                </button>\n            </td>\n        </tr>\n    </table>\n\n</div>\n\n";
  },"useData":true});



this["JST"]["dfeditor"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "			<option value=\""
    + escapeExpression(lambda((data && data.key), depth0))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"dfeditor-mask\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n	<div class=\"dfeditor\">\n		<select id=\"animation-list\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.dfAnimation : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "		</select>\n		<button class=\"df-confirm\">确认</buttpo>\n		<button class=\"df-cancel\">取消</button>\n	</div>\n</div>";
},"useData":true});



this["JST"]["dropmenu"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "	<a data-index=\""
    + escapeExpression(lambda((data && data.index), depth0))
    + "\" class=\"drop-menu-item list-group-item\">\n		"
    + escapeExpression(((helper = (helper = helpers.text || (depth0 != null ? depth0.text : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"text","hash":{},"data":data}) : helper)))
    + "\n	</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"drop-menu list-group\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.items : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n";
},"useData":true});



this["JST"]["controller_list"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\n\n<div class=\"controller-list-container\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n	<div class=\"panel panel-default\">\n		<h4 class=\"panel-heading\">元件列表</h4>\n		<div class=\"panel-body\">\n			<div class=\"controller-list-wrap list-group\">\n                <div class=\"controller-list\"></div>\n                <div class=\"controller-list-loading\">加载中...</div>\n            </div>\n\n		</div>\n	</div>\n    <div class=\"controller-list-preview\"></div>\n\n</div>\n\n";
},"useData":true});



this["JST"]["controller_list_item"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<a class=\"list-group-item\" data-id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-name=\""
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\n<button class=\"controller-delete-btn\">\n    <span class=\"glyphicon glyphicon-remove-sign\"></span>\n</button>\n</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.controllerList : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});



this["JST"]["controller_size_setting"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"controller-setting-container\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n	<div class=\"controller-setting form-inline\">\n        <div>\n            <label class=\"controller-setting-label\">名称：</label>\n            <input class=\"controller-setting-name-input form-control need-empty-validate\" placeholder=\"元件名称\">\n\n            <label class=\"controller-setting-label\">宽：</label>\n            <input class=\"controller-setting-width-input form-control need-num-validate need-empty-validate\" value=\"100\" placeholder=\"元件宽度\">\n            \n            <label class=\"controller-setting-label\">高：</label>\n            <input class=\"controller-setting-height-input form-control need-num-validate need-empty-validate\" value=\"120\" placeholder=\"元件高度\">\n        </div>\n	</div>\n</div>\n\n";
},"useData":true});



this["JST"]["csseditor"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"keyframe-setting-container panel panel-primary\">\n\n	<h4 class=\"panel-heading\">关键帧属性</h4>\n	<div class=\"setting-wrap pannel-body\">\n\n\n\n		<div class=\"accordin-container panel panel-default\">\n			<h5 class=\"panel-heading main-heading\">常规</h5>\n			<div class=\"pannel-body form-inline\">\n\n				<table class=\"setting-list\" cellspacing=\"1\">\n					<tr>\n						<td>\n							<div class=\"panel panel-default\">\n								<h6 class=\"panel-heading\">显示/隐藏</h6>	\n								<div class=\"pannel-body\">\n\n									<div class=\"dropdown show-select\">\n										<button class=\"btn btn-default dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" aria-expanded=\"true\">\n											显示\n											<span class=\"caret\"></span>\n										</button>\n\n										<ul class=\"dropdown-menu\" role=\"menu\">\n											<li role=\"presentation\">\n												<a role=\"menuitem\" tabindex=\"-1\">显示</a>\n											</li>\n											<li role=\"presentation\">\n												<a role=\"menuitem\" tabindex=\"-1\">隐藏</a>\n											</li>\n										</ul>\n\n									</div>\n								</div>\n							</div>\n						</td>\n				\n						<td>\n							<!--<div class=\"panel panel-default\">\n								<h6 class=\"panel-heading\">图片</h6>	\n								<div class=\"pannel-body\">\n									<div class=\"img-select-container\">\n										<label class=\"img-select-text\">暂无图片</label>\n										<input class=\"img-select-text-input form-control\" >\n										<button class=\"img-select-input-btn btn btn-primary btn-xs\">\n											选择\n											<input class=\"img-select-input form-control\" type=\"file\" >\n										</button>\n									</div>\n								</div>\n							</div>-->\n						</td>\n					</tr>\n\n\n					<tr>\n						<td>\n							<div class=\"panel panel-default\">\n								<h6 class=\"panel-heading\">背景色</h6>\n								<div class=\"pannel-body\">\n									<input class=\"background-image-input form-control\" value=\"transparent\" placeholder=\"背景色\">\n								</div>\n							</div>\n						</td>\n						<td>\n							<div class=\"panel panel-default\">\n								<h6 class=\"panel-heading\">视距</h6>\n								<div class=\"pannel-body\">\n									<input class=\"perspective-input form-control\" data-input-name='perspective' value='0' placeholder=\"视距\">\n								</div>\n							</div>\n						</td>\n					</tr>\n\n\n\n					<tr>\n						<td>\n							<div class=\"panel panel-default\">\n								<h6 class=\"panel-heading\">透明度</h6>\n								<div class=\"pannel-body\">\n									<input class='opacity-input form-control' value='1' placeholder=\"透明度\">\n								</div>\n							</div>\n						</td>\n\n						<td>\n							<div class=\"panel panel-default\">\n								<h6 class=\"panel-heading\">缓动</h5>\n								<div class=\"pannel-body\">\n									<div class=\"dropdown ease-select\">\n										<button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"ease-select\" data-toggle=\"dropdown\" aria-expanded=\"true\">\n										linear\n										<span class=\"caret\"></span>\n										</button>\n\n										<ul class=\"dropdown-menu\" role=\"menu\">\n					\n											<li role=\"presentation\">\n												<a role=\"menuitem\" tabindex=\"-1\">linear</a>\n											</li>\n\n											<li role=\"presentation\">\n												<a role=\"menuitem\" tabindex=\"-1\">ease</a>\n											</li>\n											<li role=\"presentation\">\n												<a role=\"menuitem\" tabindex=\"-1\">ease-in</a>\n											</li>\n\n											<li role=\"presentation\">\n												<a role=\"menuitem\" tabindex=\"-1\">ease-out</a>\n											</li>\n											<li role=\"presentation\">\n												<a role=\"menuitem\" tabindex=\"-1\">ease-in-out</a>\n											</li>\n											<li role=\"presentation\">\n												<a role=\"menuitem\" tabindex=\"-1\">step-start</a>\n											</li>\n											<li role=\"presentation\">\n												<a role=\"menuitem\" tabindex=\"-1\">step-end</a>\n											</li>\n										</ul>\n									</div>\n\n								</div>\n							</div>\n						</td>\n					</tr>\n				</table>\n			</div>\n		</div>\n	\n\n	\n		<div class=\"accordin-container panel panel-default\">\n			<h5 class=\"panel-heading main-heading\">尺寸</h5>\n			<div class=\"pannel-body\">\n				<table class=\"setting-list\">\n					<tr>\n						<td class=\"panel panel-default\">\n							<h6 class=\"panel-heading\">宽度</h6>\n							<div class=\"pannel-body\">\n								<input class='position-width-input form-control' value='0' placeholder=\"宽度\">\n							</div>\n						</td>\n						<td class=\"panel panel-default\">\n							<h6 class=\"panel-heading\">高度</h6>\n							<div class=\"pannel-body\">\n								<input class='position-height-input form-control' value='0' placeholder=\"高度\">\n							</div>\n						</td>	\n					</tr>\n				</table>\n			</div>\n		</div>\n\n\n\n		<div class=\"accordin-container panel panel-default\">\n			<h5 class=\"panel-heading main-heading\">位置</h5>\n			<div class=\"pannel-body\">\n				<table class=\"setting-list\">\n					<tr>\n						<td class=\"panel panel-default\">\n							<h6 class=\"panel-heading\">X</h6>\n							<div class=\"pannel-body\">\n								<input class='position-x-input form-control' value='0' placeholder=\"X轴位置\">\n							</div>\n						</td>\n						<td class=\"panel panel-default\">\n							<h6 class=\"panel-heading\">Y</h6>\n							<div lass=\"pannel-body\">\n								<input class='position-y-input form-control' value='0' placeholder=\"Y轴位置\">\n							</div>\n						</td>\n					</tr>\n				</table>\n			</div>\n		</div>\n\n\n\n		<div class=\"accordin-container panel panel-default\">\n			<h5 class=\"panel-heading main-heading\">旋转</h5>\n			<div class=\"pannel-body\">\n				<table class=\"setting-list\">\n					<tr>\n						<td class=\"panel panel-default\">\n							<h6 class=\"panel-heading\">rotateX:</h6>\n							<div class=\"pannel-body\">\n								<input class='rotatex-input form-control' value='0' placeholder=\"X轴旋转\">\n							</div>\n						</td>\n						<td class=\"panel panel-default\">\n							<h6 class=\"panel-heading\">rotateY:</h6>\n							<div class=\"pannel-body\">\n								<input class='rotatey-input form-control' value='0' placeholder=\"Y轴旋转\">\n							</div>\n						</td>\n					</tr>\n					<tr>\n						<td class=\"panel panel-default\">\n							<h6 class=\"panel-heading\">rotateZ:</h6>\n							<div class=\"pannel-body\">\n								<input class='rotatez-input form-control' value='0' placeholder=\"Z轴旋转\">\n							</div>\n						</td>\n						<td></td>\n					</tr>\n				</table>\n			</div>\n		</div>\n\n\n		<div class=\"accordin-container panel panel-default\">\n			<h5 class=\"panel-heading main-heading\">倾斜</h5>\n			<div class=\"pannel-body\">\n				<table class=\"setting-list\">\n					<tr>\n						<td class=\"panel panel-default\">\n							<h6 class=\"panel-heading\">skewX:</h6>\n							<div class=\"pannel-body\">\n								<input class='skewx-input form-control' value='0' placeholder=\"X轴倾斜\">\n							</div>\n						</td>\n						<td class=\"panel panel-default\">\n							<h6 class=\"panel-heading\">skewY:</h6>\n							<div class=\"pannel-body\">\n								<input class='skewy-input form-control' value='0' placeholder=\"Y轴倾斜\">\n							</div>\n						</td>\n					</tr>\n				</table>\n			</div>\n		</div>\n\n\n\n		<div class=\"panel panel-default\">\n			<h5 class=\"custom-setting-heading panel-heading main-heading\">\n				<button class=\"add-custom-setting btn btn-default btn-xs\">\n					<span class=\"glyphicon glyphicon-plus\"></span>\n				</button>\n				自定义css属性\n			</h5>\n			<div class=\"pannel-body\">\n				<table class=\"custom-style-list\"></table>\n			</div>\n		</div>\n\n	</div>\n</div>\n\n\n\n<div class=\"sprite-setting-container panel panel-primary\">\n\n	<h4 class=\"panel-heading\">元素属性</h4>\n\n	<div class=\"pannel-body form-inline\">\n\n		<div class=\"setting-wrap\">\n			<table class=\"setting-list\">\n				<tr>\n				\n						<div class=\"panel panel-default\">\n							<h6 class=\"panel-heading\">图片</h6>	\n							<div class=\"pannel-body\">\n								<div class=\"img-select-container\">\n									<label class=\"img-select-text\">暂无图片</label>\n									<input class=\"img-select-text-input form-control\" >\n									<button class=\"img-select-input-btn btn btn-primary btn-xs\">\n										选择\n										<input class=\"img-select-input form-control\" type=\"file\" >\n									</button>\n								</div>\n							</div>\n						</div>\n								\n\n				</tr>\n				<tr>\n					<td class=\"panel panel-default\">\n						<h6 class=\"panel-heading\">名称</h6>\n						<div class=\"pannel-body\">\n							<input class=\"name-input form-control\" placeholder=\"名称\">\n						</div>\n					</td>\n					<td class=\"panel panel-default\">\n						<h6 class=\"panel-heading\">类名</h6>\n						<div class=\"pannel-body\">\n							<input class=\"class-input form-control\" placeholder=\"类名\">\n						</div>\n					</td>	\n				</tr>\n\n				<tr>\n					<td class=\"panel panel-default\">\n						<h6 class=\"panel-heading\">模式</h6>\n						<div class=\"pannel-body\">\n                            <div class=\"dropdown controller-mode-select\">\n                                <button class=\"btn btn-default dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" aria-expanded=\"true\">\n                                比例缩放\n                                <span class=\"caret\"></span>\n                                </button>\n\n                                <ul class=\"dropdown-menu\" role=\"menu\">\n                                    <li role=\"presentation\">\n                                        <a role=\"menuitem\" tabindex=\"-1\">比例缩放</a>\n                                    </li>\n                                    <li role=\"presentation\">\n                                        <a role=\"menuitem\" tabindex=\"-1\">固定尺寸</a>\n                                    </li>\n                                </ul>\n                            </div>\n						</div>\n					</td>\n\n				</tr>\n\n			</table>\n		</div>\n	</div>\n	<div class=\"panel panel-default\">\n		<h5 class=\"custom-setting-heading panel-heading main-heading\">\n			<button class=\"add-sprite-custom-setting btn btn-default btn-xs\">\n				<span class=\"glyphicon glyphicon-plus\"></span>\n			</button>\n			自定义css属性\n		</h5>\n		<div class=\"pannel-body\">\n			<table class=\"sprite-custom-style-list\"></table>\n		</div>\n	</div>\n\n</div>\n\n\n\n\n\n";
  },"useData":true});



this["JST"]["fbf_animation_editor"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"fbf-animation-editor\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <!-- 图片选择和各种选项 -->\n    <div class=\"form-inline\">\n        <table>\n\n            <tr>\n                <td>\n                    <label>名称：</label>\n                </td>\n                <td>\n                    <input class=\"fbf-name-input form-control need-empty-validate\" placeholder=\"元件名称\" >\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    <label>图片选择：</label>\n                </td>\n                <td>\n                    <label class=\"fbf-img-class-name\">暂无图片</label>\n                    <input class=\"fbf-img-input need-img-validate\">\n                    <button class=\"btn btn-primary btn-xs fbf-img-select-btn\">\n                        选择\n                        <input class=\"fbf-img-select\" type=\"file\">\n                    </button>\n                </td>\n            </tr>\n                \n            <tr>\n                <td>\n                    <label>帧数：</label>\n                </td>\n                <td>\n                    <input class=\"fbf-frame-count-input form-control need-num-validate need-empty-validate\" placeholder=\"帧数\">\n                </td>\n            </tr>\n\n            <tr>\n                <td>\n                    <label>方向：</label>\n                </td>\n                <td>\n\n                    <div class=\"dropdown fbf-frame-direction-selector\">\n                        <button class=\"btn btn-default dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" aria-expanded=\"true\">\n                        从左到右\n                        <span class=\"caret\"></span>\n                        </button>\n\n                        <ul class=\"dropdown-menu\" role=\"menu\">\n                            <li role=\"presentation\">\n                                <a role=\"menuitem\" tabindex=\"-1\">从左到右</a>\n                            </li>\n                            <li role=\"presentation\">\n                                <a role=\"menuitem\" tabindex=\"-1\">从上到下</a>\n                            </li>\n                        </ul>\n                    </div>\n\n                </td>\n            </tr>  \n            <tr>\n                <td>\n                    <label>每帧时间间隔：</label>\n                </td>\n                <td>\n                    <input class=\"fbf-frame-duration-input form-control need-num-validate need-empty-validate\" placeholder=\"帧间时间间隔\">\n                </td>\n            </tr>\n\n            <tr>\n                <td>\n                    <label>重复播放：</label>\n                </td>\n                <td>\n                    <input class=\"fbf-animation-repeat-setting\" type=\"checkbox\">\n                    <input class=\"fbf-animation-repeat-count form-control need-num-validate\" placeholder=\"重复次数\">\n                </td>\n            </tr>                        \n        </table>\n    </div>\n\n     <!-- 逐帧动画预览 -->\n    <div class=\"fbf-animation-preview\">\n    </div>\n    <div>\n        \n</div>\n\n";
},"useData":true});



this["JST"]["framesbar"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-emit-type=\""
    + escapeExpression(((helper = (helper = helpers.emitType || (depth0 != null ? depth0.emitType : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"emitType","hash":{},"data":data}) : helper)))
    + "\" data-emit-event-name=\""
    + escapeExpression(((helper = (helper = helpers.emitEventName || (depth0 != null ? depth0.emitEventName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"emitEventName","hash":{},"data":data}) : helper)))
    + "\" class=\"frames-bar-single-wrap\">\n\n	<div class=\"frames-bar-info\">\n		<div class=\"frames-bar-name\">"
    + escapeExpression(((helper = (helper = helpers.spriteName || (depth0 != null ? depth0.spriteName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"spriteName","hash":{},"data":data}) : helper)))
    + "</div>\n		<div class=\"frames-bar-setting-container\">\n			<!--<input type=\"checkbox\" class=\"lock-frames-bar-checkbox glyphicon glyphicon-lock\">\n			<input type=\"checkbox\" class=\"hide-frames-bar-checkbox glyphicon glyphicon-eye-open\">-->\n			<button class=\"delete-frames-bar-button glyphicon glyphicon-remove-sign\"></button> \n		</div>\n	</div>\n	<ol  class=\"frames-bar clearfix\">\n	</ol>\n</div>\n\n";
},"useData":true});



this["JST"]["img_path_setting"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"img-path-setting-mask\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n\n	<div class=\"img-path-setting\">\n        <div>\n            <input class=\"img-path-setting-input\"></input>\n        </div>\n\n	    <!-- 按钮区域 -->\n		<div class=\"img-path-btn-container\">\n			<button class=\"confirm-img-path-btn\">确定</button>\n			<button class=\"cancel-img-path-btn\">取消</button>\n		</div>\n	</div>\n\n</div>";
},"useData":true});



this["JST"]["index"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "";
},"useData":true});



this["JST"]["layer-size-setting"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\r\n<div class=\"layer-size-setting form-inline\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n    <table>\r\n        <tr>\r\n            <td>\r\n                <label>宽度：</label>\r\n            </td>\r\n            <td>\r\n                <input class=\"layer-size-width-input form-control need-num-validate need-empty-validate\" value=\"100\">\r\n            </td>\r\n        </tr>\r\n        <tr>\r\n            <td>\r\n                <label>高度：</label>\r\n            </td>\r\n            <td>\r\n                <input class=\"layer-size-height-input form-control need-num-validate need-empty-validate\" value=\"100\">\r\n            </td>\r\n        </tr>\r\n    </table>\r\n\r\n</div>\r\n\r\n";
},"useData":true});



this["JST"]["pages"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\r\n<li>\r\n	<div id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"page\" data-index=\""
    + escapeExpression(((helper = (helper = helpers.index || (depth0 != null ? depth0.index : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"index","hash":{},"data":data}) : helper)))
    + "\">\r\n		<a class=\"page-del-btn close\">x</a>\r\n	\r\n		<span class=\"page-index\">\r\n			0\r\n		</span>\r\n		<div class=\"page-jump-btn-container\">\r\n			<input class=\"prejump-checkbox glyphicon glyphicon-hand-up\" type=\"checkbox\">  \r\n			<input class=\"replay-checkbox glyphicon glyphicon-repeat\" type=\"checkbox\">\r\n			<input class=\"auto-jump-checkbox glyphicon glyphicon-circle-arrow-down\" type=\"checkbox\">\r\n\r\n		</div>\r\n	</div>\r\n</li>\r\n\r\n";
},"useData":true});



this["JST"]["preset_animation_editor"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "                            <a class=\"list-group-item\" data-name=\""
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.cname || (depth0 != null ? depth0.cname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"cname","hash":{},"data":data}) : helper)))
    + "</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\n<!-- 编辑区域-->\n<div class=\"dfeditor\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"preset-animation-list-container form-inline\">\n        <div class=\"preset-animation-list\">\n            <div class=\"panel panel-default\">\n    \n                <div class=\"panel-body\">\n\n                    <div class=\"preset-animation-ul-list list-group\">\n                        <h3>常规效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.attentionSeekersListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n                        <h3>弹入效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.bouncingEntrancesListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n\n                        <h3>弹出效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.bouncingExitsListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n                        <h3>渐入效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.fadingEntrancesListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n                        <h3>淡出效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.fadingExitsListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n                        <h3>翻转效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.flippersListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n\n                        <h3>飞速效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.lightSpeedListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n\n                        <h3>旋转进入效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rotateEntrancesListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n\n                        <h3>旋转消失效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.rotateExitsListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n                        <h3>滑动进入效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.slideEntranceListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n                        <h3>滑动消失效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.slideExitListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n\n\n                        <h3>放大进入效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.zoomEntrancesListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n                        <h3>缩小消失效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.zoomExitListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n                        <h3>特殊效果</h3>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.specialListConfig : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n                    </div>  \n                    \n\n                </div>\n            </div>\n        </div>\n\n        <div class=\"preset-animation-duration-container\">\n            <label>时长(s)：</label>\n            <input class=\"preset-animation-duration form-control need-empty-validate need-num-validate\" value=\"1\">\n        </div>\n    </div>\n    \n    <div class=\"preset-animation-demo-container\">\n        <div class=\"preset-sprite-demo\"></div>\n    </div>\n</div>\n\n";
},"useData":true});



this["JST"]["sprite-action-setting"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "\n<div class=\"sprite-action-setting\">\n    <div class=\"form-inline\">\n        <div>\n            <table>\n                <tr>\n                    <td>\n                        <label>触发自定义事件：</label>\n                    </td>\n                    <td>\n                        <input class=\"action-event-checkbox\" type=\"checkbox\">\n                  \n                        <input class=\"sprite-action-event-input form-control\" placeholder=\"事件名\">\n                    \n                    </td>\n                </tr>\n\n                <tr class=\"auto-jump-next-setting\">\n                    <td>\n                        <label>跳到下一页：</label>\n                    </td>\n                    <td>\n                        <input class=\"action-jump-next-checkbox\" type=\"checkbox\">\n                    </td>\n                </tr>\n            </table>\n        </div>\n    </div>\n\n</div>\n\n";
  },"useData":true});



this["JST"]["sprite"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "				<div class=\"controller-wrap\">\n				</div>\n";
  },"3":function(depth0,helpers,partials,data) {
  return "				<div class=\"text-wrap\">\n				</div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"sprite-draggable-wrapper\">\n	<div class=\"sprite-resizable-wrapper\">\n		<div id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\"  class=\"sprite\">\n			<div class=\"sprite-img\" style=\"width:100%;height:100%;background-image:url("
    + escapeExpression(((helper = (helper = helpers.imgUrl || (depth0 != null ? depth0.imgUrl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"imgUrl","hash":{},"data":data}) : helper)))
    + ");\">\n			</div>\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.useController : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "	\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isText : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n\n			<div class=\"sprite-class-name-tag\"></div>\n		</div>\n	</div>\n</div>\n";
},"useData":true});



this["JST"]["sprite_event_animation_setting"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\n<div class=\"emit-type-setting\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <table>\n        <tr>\n            <td>\n        	   <label>事件名：</label>\n            </td>\n            <td>\n        	   <input class=\"emit-event-input form-control need-empty-validate\" placeholder=\"动画事件名\">\n            </td>\n        </tr>\n        <tr>\n            <td>\n                <label>只触发一次：</label>\n            </td>\n            <td>\n                <input class=\"sprite-action-once-input\" type=\"checkbox\">\n            </td>\n        </tr>\n    </table>\n</div>\n";
},"useData":true});



this["JST"]["sprite_list_item"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\r\n<a id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"sprite_item list-group-item\" data-stageid=\""
    + escapeExpression(((helper = (helper = helpers.stageId || (depth0 != null ? depth0.stageId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"stageId","hash":{},"data":data}) : helper)))
    + "\">\r\n    <span class=\"sprite-name\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\r\n    <input type=\"checkbox\" class=\"lock-frames-bar-checkbox glyphicon glyphicon-lock\">\r\n    <input type=\"checkbox\" class=\"hide-frames-bar-checkbox glyphicon glyphicon-eye-open\">\r\n    <button class=\"sprite-list-delete-btn btn btn-sm\">\r\n        <span class=\"glyphicon glyphicon-remove-sign\"></span>\r\n    </button>\r\n</a>\r\n";
},"useData":true});



this["JST"]["stages"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "\r\n\r\n<li class=\"stage\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" style=\"width:"
    + escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"width","hash":{},"data":data}) : helper)))
    + "px;height:"
    + escapeExpression(((helper = (helper = helpers.height || (depth0 != null ? depth0.height : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"height","hash":{},"data":data}) : helper)))
    + "px;margin-left:"
    + escapeExpression(((helper = (helper = helpers.marginLeft || (depth0 != null ? depth0.marginLeft : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"marginLeft","hash":{},"data":data}) : helper)))
    + "px;margin-top:"
    + escapeExpression(((helper = (helper = helpers.marginTop || (depth0 != null ? depth0.marginTop : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"marginTop","hash":{},"data":data}) : helper)))
    + "px;\">\r\n\r\n</li>\r\n\r\n\r\n";
},"useData":true});



this["JST"]["timeline"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"timeline\" style=\"width:"
    + escapeExpression(((helper = (helper = helpers.width || (depth0 != null ? depth0.width : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"width","hash":{},"data":data}) : helper)))
    + "px;left:"
    + escapeExpression(((helper = (helper = helpers.left || (depth0 != null ? depth0.left : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"left","hash":{},"data":data}) : helper)))
    + "px;\">"
    + escapeExpression(((helper = (helper = helpers.duration || (depth0 != null ? depth0.duration : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"duration","hash":{},"data":data}) : helper)))
    + "s</div>";
},"useData":true});



this["JST"]["imgs_list"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "    <div class=\"img-container\">\r\n        <img class=\"img-item\" src=\""
    + escapeExpression(lambda(depth0, depth0))
    + "\">\r\n        <button class=\"img-del-btn\"></button>\r\n    </div>\r\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.imgList : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\r\n";
},"useData":true});



this["JST"]["user_images"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "\n<div class=\"user-images form-inline\">\n\n    <div class=\"user-images-all-list  accordin-container pane panel-primary\">\n        <div class=\"user-images-available-size\">0MB</div>\n\n        <h4 class=\"panel-heading current-temp-heading\">当前列表</h4>\n        <div class=\"user-images-work-temp-list pannel-body list-group\" data-name=\"tempwork\">\n        </div>\n        <div class=\"user-images-ctrl-temp-list pannel-body list-group\" data-name=\"tempctrl\">\n        </div>\n\n\n        <h4 class=\"panel-heading\">作品列表</h4>\n        <div class=\"user-images-work-list pannel-body list-group\" data-name=\"work\">\n        </div>\n\n\n        <h4 class=\"panel-heading\">元件列表</h4>\n        <div class=\"user-images-controller-list pannel-body list-group\" data-name=\"ctrl\">\n        </div>\n\n\n    </div>\n\n    <div class=\"user-images-content\">\n        \n    </div>\n\n</div>\n\n";
  },"useData":true});



this["JST"]["user_images_item"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<a class=\"user_images_item list-group-item\" data-id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">\r\n    "
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\r\n</a>";
},"useData":true});



this["JST"]["work_list"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "\n\n<div class=\"work-list-container\">\n    <button class=\"pre-work-list glyphicon glyphicon glyphicon-chevron-left disabled\"></button>\n\n	<div class=\"work-list list-group\">\n\n	</div>\n\n    <button class=\"next-work-list glyphicon glyphicon-chevron-right disabled\"></button>\n\n\n</div>\n\n";
  },"useData":true});



this["JST"]["work_list_item"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "	<a class=\"list-group-item\" id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-name=\""
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\">\n		<button class=\"work-delete-btn glyphicon glyphicon-remove\"></button>\n		"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\n		<div class=\"glyphicon glyphicon-link\"></div>\n	</a>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1;
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.workList : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});

return this["JST"];

});