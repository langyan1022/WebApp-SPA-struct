define(function (require, exports, module) {
    var indexTemp = require("text!../template/test.html");

    module.exports = Weui.View.extend({

        template: indexTemp,

        onRender: function () {
            var view = this;
        }
    });
});
