define(function (require) {
    var App = window.App = new Weui.Application({
        indexAnchor:Weui.config.CONFIG_INDEX_AUCHOR,
        authAnchor:"",
        authorizer:null
    });

    App.addRegions({
        headerRegion:"#app-header",
        footerRegion:"#app-footer",
        container:"#app-container"
    });


    App.header = new Weui.Header();
    App.headerRegion.show(App.header);

    App.footer = new Weui.Footer();
    App.footerRegion.show(App.footer);
    var $wrapper=$('#wrapper');
    var $scroller=$('#wrapper .scroller');


    var fastClick=require("fastclick");
    fastClick.attach(document.body);

    window.header=window.header||{};
    window.header.height= App.header.getHeight();

    $wrapper.css('height', $(window).height() - window.header.height);
    $scroller.css('min-height', $(window).height() - window.header.height + 1);
    var IScroll=require('iscroll');

    window.scroller = new IScroll('#wrapper');

    $(window).resize(function() {
        $wrapper.css('height', $(window).height() - window.header.height);
        $scroller.css('min-height', $(window).height() - window.header.height + 1);
        window.scroller.refresh();
        var $focusElement = $(":focus,.focus");
        if($focusElement.length>0){
            window.scroller.scrollToElement($focusElement[0]);

        }
    });
    $(document).on('keyboard.hide',function(){
        $wrapper.css('height', $(window).height() - window.header.height);
        $scroller.css('min-height', $(window).height() - window.header.height + 1);
        window.scroller.refresh();
        var $focusElement = $(":focus,.focus");
        if($focusElement.length>0){
            window.scroller.scrollToElement($focusElement[0]);
        }
    });
    $(document).on('keyboard.show',function(e,data){
        var keyboardWidth=data.width;
        $wrapper.css('height', $(window).height() - window.header.height-keyboardWidth);
        $scroller.css('min-height', $(window).height() - window.header.height -keyboardWidth+ 1);
        window.scroller.refresh();
        var $focusElement = $(":focus,.focus");
        if($focusElement.length>0){
            window.scroller.scrollToElement($focusElement[0]);
        }

    });
    if ($.fn.bankInput) {
        //格式化输入银行卡号
        $(document).on('focus', '.bank_account', function() {
            $(this).bankInput();
        });
    }

    $(document).on('input propertychange focus', 'input:visible:not([type=checkbox],[type=radio],[readonly])', function() {
        var $parent = $(this).parent();
        var $clearInput = $(this).siblings(".clear_input");
        var value = $(this).val();
        if ($clearInput.length == 0) {
            $parent.append('<a href="javascript:;" class="clear_input"></a>');
            $clearInput = $(this).siblings(".clear_input");
        }
        if (value.trim().length > 0) {
            $clearInput.show();
        } else {
            $clearInput.hide();
        }

    }).on('blur', 'input:visible:not([type=checkbox],[type=radio]),[readonly]', function() {
        var $clearInput = $(this).siblings(".clear_input");
        $clearInput.hide();
    }).on('click', '.clear_input', function() {
        var $input = $(this).siblings("input");
        $input.val('');
    });
    $.orient_tip();
    App.start();
    App.history.start();

    document.addEventListener("backbutton", function(event){
        App.back();
        event.preventDefault();
    }, false);
});

