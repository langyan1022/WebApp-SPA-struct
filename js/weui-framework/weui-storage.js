define(function(require, exports, module){
	var simpleStorage=null;

	/**
	 * @class Storage
	 * @memberof Nuui
	 * @classdesc json实现的简单存储器,使用中App.storage即为此类型
	 * @example var storage = new Nuui.Storage();
	 * storage.set("a", "123");
	 * storage.get("a"); // 123
	 */
	var Storage = module.exports = function(){
		//this.db = {};
	};

	_.extend(Storage.prototype, {
		
		/**
		 * @desc 根据key获取value
		 * @memberof Nuui.Storage
		 * @func get
		 * @instance
		 * @param {string} key - value的key值
		 * @returns {?} key值对应的value
		 */
		get:function(key){
			return simpleStorage.get(key);

		},

		/**
		 * @desc 将value设置到key值中
		 * @memberof Nuui.Storage
		 * @func set
		 * @instance
		 * @param {string} key - value的key值
		 * @param {?} value - value
		 */
		set:function(key, value,options){
			simpleStorage.set(key, value, options);
		},

		hasKey:function(key){
		   return simpleStorage.hasKey(key);
		},
		/**
		 * @desc 按照key值清除value
		 * @memberof Nuui.Storage
		 * @func remove
		 * @instance
		 * @param {string} key - value的key值
		 * @returns {?}
		 *     true - value was deleted
		 *     false - value was not found
		 *     Error object - value was not deleted because of an error. See error.code for explanation
		 */
		remove:function(key){
			return simpleStorage.deleteKey(key);
		},
		
		/**
		 * @desc 清除所有内容
		 * @memberof Nuui.Storage
		 * @func clear
		 * @instance
		 */
		clear:function(){
			simpleStorage.flush()
		},
		getDB:function(){
			return simpleStorage;
		}
	});

});
