define(function (require, exports, module) {

    var requestByAjax = require("./weui-requestByAjax");

    var requestByMock = module.exports = function(originalSettings, callback){
        var settings = _.clone(originalSettings);
        var tamp=new Date().getTime();
        settings.type = "GET";
        settings.url = "mock/" + settings.url + ".json?t="+tamp;

        return requestByAjax(settings, callback);
    };
});