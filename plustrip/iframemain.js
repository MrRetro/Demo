var __g_i18n_pageBase_Resource__ = {};
(function ($) {
    // 读取透明度
    var _gd = FST_C_C.getC('cache_outline',null,{isCookie:true});
    if(_gd){
        $('#id_if_cover').css({
            "outline": "5000px solid rgba(0,0,0," + _gd + ""
        });
    }
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
        $('#id_if_cover').css("display","none");
    }else{
    }

    function _autoSetFun(extH){
        try{
            var win = window.top || window;
            var ifm = win.document.getElementById("right_frame_id");
            var subWeb = win.document.frames ? win.document.frames["right_frame_id"].document : ifm.contentDocument;
            if (ifm && subWeb) {
                var _oldH = ifm.height;
                var _newH = 0;
                _newH =  $(window).height()>=700?$(window).height():700;
                if($("#right_frame_id").attr('src')=="/html/login.html"){
                    _newH=3350;
                }
                if(_oldH != _newH ){
                    ifm.height = _newH;
                }
                ifm.scrolling = 'no';
            }
        }catch (e){

        }
    };
    function _autoNoLazySetWinHW(extH){
        _autoSetFun(extH);
    };
    var _rst;
    function _autoSetWinHW(extH) {
        if(_rst){
            return;
        }
        _rst = setTimeout(function(){
            _autoSetFun(extH);
            clearTimeout(_rst);
            _rst = null;
        },500);
    };
    function _setWinIframeSrc(sr,extH){
        if(sr){
            var win = window.top || window;
            var ifm = win.document.getElementById("right_frame_id");
            if(ifm){
                ifm.src = sr;
                _autoSetWinHW(extH);
            }
        }
    };
    function _setScrollTo(x,y){
        if(x!=undefined&&y!=undefined){
            var win = window.top || window;
            var ifm = win.document.getElementById("right_frame_id");
            if(ifm){
                if($.scrollTo){
                    $(win).scrollTo(x,y);
                }else{
                    win.scrollTo(x,y);
                }
            }
        }
    };
    //绑定Iframeload事件
    $("#right_frame_id").off("load").on("load",_autoNoLazySetWinHW);
    //注册 TOPWIN 事件
    FST_BSF.TOPWIN = {
        autoSetWinHW:_autoSetWinHW,
        autoNoLazyetWinHW:_autoNoLazySetWinHW,
        setWinIframeSrc:_setWinIframeSrc,
        setScrollTo:_setScrollTo
    };
    var _loginUrl = FST_C_T.g_Site_getLoginUrl();
    var _hallUrl = FST_C_T.g_Site_getHallUrl();
    var _agreementUrl = FST_C_T.g_Site_getAgreementUrl();
    //查询其登陆状态
    var win2 = window.top || window;
    var ifm = win2.document.getElementById("right_frame_id");
    if(ifm){
        //var _ifmSrc = ifm.src +'';
        FST_C.PostInfo("login/getUserInfo.do", null, function (da) {//判断当前登录是否有效
            var isCQk = true;
            if (da&&da.isRtY()) {
                //存放i18数据
                __g_i18n_pageBase_Resource__ = da.getJsonBusiObj()['I18NMSG'];

                if (da.getStateCode() == 1) {
                    ifm.src = FST_C_T.g_Site_getRoot() + _hallUrl + "?login=success";
                    _setScrollTo(0,0);
                } else if (da.getStateCode() == -1) {
                    ifm.src = FST_C_T.g_Site_getRoot() + _agreementUrl+ "?register=" + da.getJsonBusiObj()['registerType'];
                    _setScrollTo(0,0);
                }
            }else{
                ifm.src = FST_C_T.g_Site_getRoot() + _loginUrl;
            }
        },function(){
            ifm.src = FST_C_T.g_Site_getRoot() + _loginUrl;
        });
    }

})(jQuery);
