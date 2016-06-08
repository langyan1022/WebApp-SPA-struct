define(function(require, exports, module){

	var Router = require("./weui-router");

	var ModuleLoader = module.exports = Router.extend({
		initialize:function(){
			this.moduleStates = {};
			this.route(":dir/:file/*func", "handle");
		},

		handle:function(dir, file){
			var modulePath = "module/" + dir + "/controller/" + file;
			if(this.moduleStates[modulePath]){
				return;
			}

			var fragment = Backbone.history.fragment;
			var hashChanged = false;

			var onRequireSuccess = _.bind(function(Controller){
				this.moduleStates[modulePath] = true;
				if(_.isFunction(Controller)){
					new Controller(dir + "/" + file + "/");
				}
				if(!hashChanged){
					Backbone.history.loadUrl(fragment);
				}
				this.triggerMethod("after:load");
			}, this);

			var onRequireError = _.bind(function(error){
				this.moduleStates[modulePath] = true;
				this.triggerMethod("after:load", error);
				throw error;
			}, this);

			this.triggerMethod("before:load");
			require([modulePath], onRequireSuccess, onRequireError);

			Backbone.history.once("beforeRoute", function(){
				hashChanged = true;
			});
		}
	});

});
