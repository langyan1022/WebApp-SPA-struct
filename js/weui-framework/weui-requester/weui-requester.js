define(function(require, exports, module){
	var Storage = require("../weui-storage");
	var _config = require("../weui-config");

	var requestByAjax = require("./weui-requestByAjax");
	var requestByMock = require("./weui-requestByMock");

	var request;
	if(_config.CONFIG_MOCK_SERVER){
		request = requestByMock;
	}else{
		request = requestByAjax;
	}

	var HttpRequester = module.exports = function(){
		this.storage = new Storage();
		this.requestList = [];
	};

	/**
	 * @class Requester
	 * @memberof Nuui
	 * @classdesc 请求器,App.requester即为此类,且App.request方法即为App.requester.request方法
	 */
	_.extend(HttpRequester.prototype, Backbone.Events, {

		/**
		 * @desc 发送请求,option基本是jquery的参数,另外回调函数已经重写
		 * @memberof Nuui.Requester
		 * @func request
		 * @instance
		 * @param {string} url - 请求的url
		 * @param {object} options - 参数
		 * @param {boolean} options.cancelWhenRouting - 该请求是否在页面跳转的时候取消执行回调函数,默认为true<br/>
		 * @param {boolean} options.cache - 该请求结果是否保存到缓存中,后续请求都从缓存中取<br/>
		 * @param {func} options.success(resp,&nbsp;status) - success表示连接成功且业务成功(如错误码为0)之后执行的回调函数<br/>
		 * @param {func} options.connect(resp,&nbsp;status) - connect表示连接成功之后执行的回调函数,和success一起使用时，两者只有一个生效,connect优先级高<br/>
		 * @param {func} options.error(error,&nbsp;status) - error表示connect或者success以外的失败,在connect函数的情况下表示通讯失败之后的回调函数,在success的情况下表示通讯失败或者业务失败之后的回调函数<br/>
		 * @param {func} options.complete(status,&nbsp;resp,&nbsp;error) - 通讯之后无论如何都会执行的回调函数
		 * @example App.request("b.do", {
		 *
						success:function(resp){
							var item = resp.data;
							var el = $("<li class=''>" + data.text + "<>");
							el.appendTo(view.$("#scroller").find("ul"))
						}
					});
		 * 
		 */
		request:function(url, options){
			options = options || {};
			var self = this;

			var deferred = $.Deferred();
			deferred.completeCallbacks = $.Callbacks("once memory");
			deferred.complete = deferred.completeCallbacks.add;
			
			if(options.connect || options.success){
				deferred.done(options.connect || options.success);
			}
			deferred.fail(options.error || this._defaultErrorHandler);
			
			if(options.complete){
				deferred.completeCallbacks.add(options.complete);
			}

			var settings = _.defaults({}, options, {
				url:url,
				type:"POST",
				dataType:"JSON",
				cancelWhenRouting:true,
				traditional:true
			});

			// 原ajax的回调全部设置为空,回调由deffered负责
			settings.success = undefined;
			settings.error = undefined;
			settings.complete = undefined;

			// 添加额外参数
			settings.data = this.attachAdditionalData(options.data);

			// 请求结果缓存
			var cachedData = this.storage.get(url);
			if(cachedData){
				deferred.resolve(cachedData, "connect");
				deferred.completeCallbacks.fireWith("connect", cachedData);
				return deferred;
			}

			// 真正发送请求
			this.trigger("before:request", settings);
			
			var process = request(settings, function(status, resp){
				
				// 将本请求从列表中剔除
				self.requestList = _.without(self.requestList, process);

				// 公用回调
				self._onRequestComplete(status, resp, process, deferred, settings, options);
				self.trigger("after:request", settings);
			});
			
			this.requestList.push(process);
			process.settings = settings;


			return deferred;
		},
		
		// 设置报文处理器
		setRespProcessor:function(processor){
			this._respProcessor = processor;
		},
		
		// 取消所有请求的回调函数,目前有两种情况
		// 1.签退之后,此时强制取消所有请求的回调
		// 2.页面跳转时,只取消settings.cancelWhenRouting为true的
		cancelRequests:function(forceCancelAll){
			_(this.requestList.splice(0)).forEach(function(process){
				if(process && process.cancel && (forceCancelAll || process.settings.cancelWhenRouting)){
					process.cancel();
				}
			});
		},

		_onRequestComplete:function(status, resp, process, deferred, settings, options){
			
			// 已取消
			if(status == "canceled"){
				return;
			}
			
			var error;
			
			if(status === "error"){
				error = {ec:status, em:"请求资源异常"};
			}else if(status === "parsererror"){
				error = {ec:status, em:"响应数据格式异常"};
			}else if(status === "timeout"){
				error = {ec:status, em:"请求超时，请重试"};
			}else if(status === "offline"){
				error = {ec:status, em:"网络连接失败，请检查你的网络设置"};
			}else if(status === "connect"){
				// 已连接成功,且未定义连接成功回调函数
				if(!options.connect){
					// 是否业务失败
					error = this._processResp(resp);
				}
			}else{
				error = {ec:status};
			}
			
			try{
				if(error){
					deferred.reject(error, status);
				}else{
					deferred.resolve(resp, status);
					if(settings.cache == true){
						this.storage.set(settings.url, resp);
					}
				}
				deferred.completeCallbacks.fire(status, resp, error);

			}catch(e){
				console.log(e);
			}
		},
		
		attachAdditionalData:function(data){
//			return _.defaults({}, data, {
//				channelType:channelType
//			});
			return data;
		},

//		handleSessionTimeout:function(code){
//			var msg = "登录超时，请重新登录";
//			if(code == "402"){
//				msg = "用户已在别处重新登录，强制下线! ";
//			}
//			utils.dialog.alert(msg, function(){
//				App.commands.execute("logout", true);
//			})
//		},
		
		_defaultErrorHandler:function(error){
			alert(error.ec + ":" + error.em);
		},
		
		_processResp:function(resp){
			if(resp.ec){
				return {ec:resp.ec, em:resp.em};
			}
			return null;
		}
	});
});
