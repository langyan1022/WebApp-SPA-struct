define(function(require, exports, module){

	var requestByAjax = module.exports = function(settings, callback){
		var canceled = false;
		var xhr = $.ajax(settings);

		xhr.done(function(resp, status, xhr){
			if(!canceled){
				callback("connect", resp);
			}
		});

		xhr.fail(function(xhr, status, errorThrown){
			if(!canceled){
				callback(status);
			}
		});

		var result = {};
		result.cancel = function(){
			canceled = true;
			callback("canceled");
		};
		result.abort = function(){
			xhr.abort();
		};
		return result;
	};

});
