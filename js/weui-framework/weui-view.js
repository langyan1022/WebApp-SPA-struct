define(function(require, exports, module){

	var View = module.exports = Marionette.ItemView.extend({
		className:"app-page",
		
		onBeforeRender:function(){
			window.curView = this;
		}
	});
});