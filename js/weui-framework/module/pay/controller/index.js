define(function(require, exports, module){
    var IndexView = require("../view/index");
    var TestView = require("../view/test");
    module.exports = Weui.Controller.extend({
        actions: {
            "index": "index",
            "test": "test"
        },
        index:function(){
            App.header.reset({
                title: "首页",
                rightButtonContent:"@exit",
                leftButtonContent:"@user",
                leftButtonHandler:function(){

                },
                rightButtonHandler:function(){

                }

            });

            App.footer.reset(1);
            App.container.show(new IndexView());
        },
        test:function () {
            App.header.reset({
                title: "测试页",
                rightButtonContent:"@exit",
                leftButtonHandler:function(){

                },
                rightButtonHandler:function(){

                }

            });

            App.footer.reset(2);
            App.container.show(new TestView());
        }

    });

})

