define(function(require, exports, module){

	var headerTemp = require("text!./weui-header.html");

	var Header = module.exports = Marionette.ItemView.extend({

		template:headerTemp,

		tagName:"header",
		
		onRender: function(){
			var view = this;
			
			view.$title = view.$(".weui_nav_title");
			view.$leftButton = view.$(".weui_header_left");
			view.$rightButton = view.$(".weui_header_right");
			
			// 左右按钮tap时触发对应的自定义buttonclick事件
			view.$leftButton.on("click", function(){
				view.triggerButtonLeftClick();
				return false;
			});
			view.$rightButton.on("click", function(){
				view.triggerButtonRightClick();
				return false;
			});
			
			// 自定义buttonclick触发时执行exec方法
			view.on("button:left:click", this.execLeftButtonHandler);
			view.on("button:right:click", this.execRightButtonHandler);


			
		},
		color:"235,80,35",
		contents:{
			"@back":"<i class='weui_nav_back'></i>",
			"@exit":"<i class='weui_nav_close'></i>",
			"@user":"<i class='weui_nav_user'></i>"
		},

		leftButtonHandler:null,
		rightButtonHandler:null,

		leftButtonCallback:null,
		rightButtonCallback:null,

		defaultHandler:function(content){
			if(content == "@exit"){
				return function(){
					confirm("你真的要退出吗?");
				}
			}

			if(content == "@back"){
				return function(){
					App.back();
				};
			}
		},

		triggerButtonLeftClick:function(){
			this.trigger("button:left:click");
		},
		
		triggerButtonRightClick:function(){
			this.trigger("button:right:click");
		},

		execLeftButtonHandler:function(){
			var handle = this.leftButtonHandler;
			if(!handle)
				handle = this.defaultHandler(this.leftButtonContent);
			if(handle)
				handle();
		},

		execRightButtonHandler:function(){
			var handle = this.rightButtonHandler;
			if(!handle)
				handle = this.defaultHandler(this.rightButtonContent);
			if(handle)
				handle();
		},
		execLeftButtonCallback:function(data){

			var handle = this.leftButtonCallback;

			if(handle)
				handle(data);
		},
		execRightButtonCallback:function(data){
			var handle = this.rightButtonCallback;

			if(handle)
				handle(data);
		},

		reset:function(options){
			var view = this;
			if(options!=0){
				view.$el.show();
				this.title = options.title;

				this.leftButtonHandler = options.leftButtonHandler;
				this.leftButtonContent = options.leftButtonContent;

				this.rightButtonContent = options.rightButtonContent;
				this.rightButtonHandler = options.rightButtonHandler;

				this.leftButtonCallback=options.leftButtonCallback;
				this.rightButtonCallback=options.rightButtonCallback;

				this.$title.html(options.title || "");
				this.$leftButton.html(this.contents[options.leftButtonContent] || "");
				this.$rightButton.html(this.contents[options.rightButtonContent] || "");
			}
			else{
				view.$el.hide();
			}

		},
		getHeight:function(){
			return this.$el.height();
		}
	});
});
