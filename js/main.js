require.config({

    waitSeconds:0,
    baseUrl:"./js/weui-framework/",

    paths:{
        "underscore":"libs/underscore",
        "backbone":"libs/backbone",
        "marionette":"libs/backbone.marionette",
        "text":"libs/require.text",
        "style":"libs/require.css",
        "jquery":"libs/jquery-2.1.4",
        "common":"libs/common",
        "jquery-weui":"libs/jquery-weui",
        "validate":"libs/jquery.validate.min",
        "passwordWidget":'libs/password-widget.min',
        "iscroll":"libs/iscroll",
        "simpleStorage":"libs/simpleStorage",
        "pace":"libs/pace",
        "fastclick":"libs/fastclick"
    },

    shim:{
        "backbone":{deps:["underscore", "jquery"]},
        "marionette":{deps:["backbone"]},
        "jquery-weui":{deps:["jquery"]},
        "validate":{deps:["jquery"]},
        "passwordWidget":{deps:["jquery"]},
        "common":{}
    }
});

require(["underscore", "jquery","backbone","marionette","jquery-weui","validate","passwordWidget","common"],function(){
    require(["weui"], function(weui){
        window.Weui = window.Weui || {};
        $.extend(window.Weui, weui);
        require(["../init"]);
    });
});

