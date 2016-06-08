define(function(require, exports, module){

	var footerTemp = require("text!./weui-footer.html");

	/**
	 * @class Footer
	 * @memberof Weui
	 * @classdesc 继承自Backbone.Marionette.ItemView,应用尾部的实现
	 * 		App.footer即为此类
	 */
	module.exports = Marionette.ItemView.extend({
		tagName:"footer",
		// 如果是native,尾部没有东西
		template:footerTemp,

		/**
		 * @desc 重新设置自己的内容
		 * @memberof Weui.Footer
		 * @func reset
		 * @instance
		 * @param {int} index - 0 - 隐藏<br/>
		 * 						1 - 高亮第一个<br/>
		 * 						2 - 高亮第二个<br/>
		 * 						3 - 高亮第三个<br/>
		 * 						4 - 高亮第四个
		 */
		reset:function(index){
			var view=this;

			if(index){
				if(index==0){
					view.$el.hide();
				}else{
					index=index-1;
					view.$('.weui_tabbar_item').removeClass('weui_bar_item_on');
					view.$('.weui_tabbar_item:eq('+index+')').addClass('weui_bar_item_on');
				}
			}else{
				view.$el.hide();
			}
		},

		onRender:function(){
			var view = this;
			view.on("footer:click", this.onTagClick);

			view.$(".weui_tabbar_item").on("click", function(){
				view.trigger("footer:click", $(this).index());


				return false;
			});
		},
		
		onTagClick:function(index){

			var view = this;
			view.$('.weui_tabbar_item').removeClass('weui_bar_item_on');
			view.$('.weui_tabbar_item:eq('+index+')').addClass('weui_bar_item_on');
			var $tab=view.$('.weui_tabbar_item:eq('+index+')');

			if($tab.length>0){
				var href=$tab.data('href');
				if(href&&href.trim()!=''){
					App.navigate(href,true);
				}
			}
		}
	});
});
