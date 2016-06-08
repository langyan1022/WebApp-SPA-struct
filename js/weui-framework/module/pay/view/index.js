define(function (require, exports, module) {
    var indexTemp = require("text!../template/index.html");

    module.exports = Weui.View.extend({

        template: indexTemp,

        onRender: function () {

            var view = this;

        }
    });
});
