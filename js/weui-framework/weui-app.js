define(function(require, exports, module){
	var ModuleLoader = require("./weui-moduleLoader");
	var Storage = require("./weui-storage");

	var Requester = require("./weui-requester/weui-requester");

	var pace=require('pace');
	/**
	 * @class Application
	 * @memberof Nuui
	 * @classdesc 应用类,继承自Backbone.Marionette.Application
	 * @param {object} config - 配置
	 * @param {string} config.indexAuchor - index的锚点,如果没有任何锚点会跳转到这个锚点<br/>
	 * @param {func} config.authorizer - 在enableAuth为true的情况下,鉴别请求是否为已授权请求的方法<br/>
	 * @param {string} config.authAuchor - 访问锚点在未授权的情况下跳转的锚点<br/>
	 * 											 可以结合实际情况实现访问任意页面时先登录后访问
	 * @example var App = window.App = new Nuui.Application({
	 * 	indexAnchor:"index/index/index",
	 * 	authAnchor:"login/login/index",
	 * 	authorizer:function(){
	 * 		if(!App.storage.get("isUserLoggedIn")){
	 * 			return false;
	 * 		}
	 * 		return true;
	 * 	}
	 * });
	 * 
	 */
	var Application = module.exports = Marionette.Application.extend({
		
		constructor:function(config){
			this._config = _.extend({}, this._defaultConfig, config);
			
			// history
			this.history = Backbone.history;
			this.browseList = [];
			
			// 初始化request
			this.requester = new Requester();
			// 代理request方法
			this.request = _.bind(this.requester.request, this.requester);
			
			// 模块读取器
			this.loader = new ModuleLoader();

			
			// 存储
			this.storage = new Storage();
			
			// 初始化所有事件
			this._initEvents();
			
			Marionette.Application.apply(this, arguments);
		},
		
		_defaultConfig:{
			indexAnchor:null,
			authAnchor:null,
			authorizer:null
		},
		
		_config:{},
		
		_initEvents:function(){
			// 路由时记录url列表
			this.listenTo(this.history, "route", function(){
				var fragment = this.history.fragment;
				if(this.browseList[0] == fragment){
					return;
				}
				this.browseList.unshift(this.history.fragment);
			});
			
			// 在跳转之前注入事件
			// 未登录之前访问其他网址跳转到登陆页
			this.history.on("beforeRoute", _.bind(this._authorize, this));
			
			// 跳转时中断原页面所有请求
			this.history.on("beforeRoute", _.bind(this._cancelRequests, this));
			this.history.on("beforeRoute", function(){
				$("body.ios").css("-webkit-overflow-scrolling","");
				pace.start();
				//$("body").css("height",Nuui.clientHeight);
			});



			this.loader.on("before:load", function(){
				pace.restart();
			});
			this.loader.on("after:load", function () {
				//pace.done();
			});
			

			this.requester.on("before:request",function () {
				pace.restart();
			});
		
			this.requester.on("after:request", function () {
				//pace.done();
			});
			// 路径引导到首页
			this.history.route(/^\s*$/, _.bind(function(){
				this.navigate(this._config.indexAnchor, {
					trigger:true,
					replace:true
				});
			}, this));
			
		},
		
		_authorize:function(event){
			if(event.router === this.loader){
				return;
			}
			var router = event.router;
			var authorizer = router.authorizer || this._config.authorizer;

			if(authorizer && authorizer.call(router, event.fragment, event.name, event.args) === false){
				event.preventDefault();
				event.stopImmediatePropagation();
				var returnURL = encodeURIComponent(event.fragment);
				this.navigate(this._config.authAnchor + "?returnURL=" + returnURL, {
					trigger:true,
					replace:true
				});
			}
		},
		
		_cancelRequests:function(event){
			if(event.isImmediatePropagationStopped()){
				return;
			}
			this.requester.cancelRequests(false);
		},
		
		/**
		 * @desc 按照navigate的路线后退一个锚点
		 * @memberof Nuui.Application
		 * @func back
		 * @instance
		 * @param {int} pos - 后退pos个锚点,默认为1
		 */
		back:function(pos){
			if(pos == null){
				pos = 1;
			}
			if(pos >= 1 && pos < this.browseList.length){
				var url = this.browseList[pos];
				this.browseList = this.browseList.slice(pos + 1);
				this.navigate(url, true);
			}
		},

		/**
		 * @desc 访问一个锚点
		 * @memberof Nuui.Application
		 * @func navigate
		 * @instance
		 * @param {string} fragment - 锚点路径
		 * @param {object} options - 同Backbone.History.navigate的option,一般送true,会把跳转的锚点记录到history中
		 */
		navigate:function(fragment, options){
			return this.history.navigate(fragment, options);
		},

		/**
		 * @desc 重新加载当前锚点
		 * @memberof Nuui.Application
		 * @func navigate
		 * @instance
		 */
		reload:function(){
			this.history.loadUrl(this.history.fragment);
		}
	});
});
