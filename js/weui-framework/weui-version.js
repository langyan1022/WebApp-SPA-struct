(function(window){
	var Nuui = window.Nuui = window.Nuui || {};
	/**
	 * @memberof Nuui
	 * @desc 缓存版本控制
	 * 		可以通过该方法获取到对应文件的版本号<br/>
	 * 		如果没有对应的配置,则获取总体版本号<br/>
	 * 		用于局部文件更新,一般由框架直接将版本行为注入到requirejs中,不需要手工调用
	 * @func version
	 * @static
	 * @param {string} moduleName - 模块名称,其实为文件的绝对路径,但是要省略后缀名<br/>
	 * 							如果是js文件,省略".js"<br/>
	 * 							如果是css文件,省略".css"<br/>
	 * 							如果是html文件,省略".html"<br/>
	 * @returns {string} 版本号
	 * @example Nuui.verison("app/init"); // "version=1.0.0"
	 */
	Nuui.version = (function(){
		var tamp=new Date().getTime();
		var _versions = {
			"all" : "1.0.1",
			"app/init" : "1.0.1",
			"app/main" : "1.0.2",
			"nuui/nuui-native/nuui-web" : "1.0.3",
			"nuui/nuui-config" : "1.0.4",
			"css/main" : "2.0.0",
			"module/index/template/index":"3.0.0"
		};
		
		return function(moduleName){
			var versionAll = _versions["all"] || "";
			var version = _versions[moduleName] || "";
			var version = versionAll > version ? versionAll : version;
			if(version){
				return "version=" + version;
			}else{
				return false;
			}
		};
	})();
	
	// 自动预配置到require中
	if(!window.require){
		window.require = {urlArgs:Nuui.version};
	}

})(window);