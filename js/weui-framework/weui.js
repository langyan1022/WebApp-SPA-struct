define(function(require, exports, module){

	exports.Application = require("./weui-app");
	exports.Controller = require("./weui-controller");
	exports.Router = require("./weui-router");
	exports.Storage = require("./weui-storage");
	exports.View = require("./weui-view");
	exports.Layout = require("./weui-layout");

	exports.Header = require("./weui-header/weui-header");
	exports.Footer = require("./weui-footer/weui-footer");
	
	exports.config = require("./weui-config");
});
