define(function(require, exports, module){

	var Layout = module.exports = Marionette.LayoutView.extend({
		onBeforeRender:function(){
			window.curView = this;
		}
	});
});
