/**
 *
 * 2015/4/24.
 * @version 2.0
 */
!function($,$win){
    /******************************************************************
     * 自定义js脚本库 v2.0.0
     * 2015-06
     * 定义格式:
     *      g_*:提供给外部的函数
     *      __*:内部变量或函数
     *      _* :函数体内的变量或配置信息(一般不要重置)
     *      _*_:内部变量或函数或配置信息(一般不要重置)
     * 提供函数:
     *      FST 全局根域
     *         | 内部公共方法区,适当的提供给外部
     *         | CORE 核心域 FST_C.*
     *             | 导入第三方js包库
     *             | $.fn: 扩展
     *             | PostInfo:json格式的ajax请求
     *             | Atp:内部集成了template.js无需额外导入
     *             | Cookie:Cookie
     *             | Cache:缓存
     *             | TOOLS:工具辅助域 FST_C_T.g_*
     *                    | g_*
     *             | TG: UI_tagLib 标签库,用art封装
     *                    | TableGridSetMgr:表格数据统一使用管理器(TGSM)
     *         | PLUGIN 插件域(公共和业务) FST_P.*
     *             | FDP:业务功能弹出层   FST_P_FDP.*
     *             | VERIFY:目前用于公共业务JS验证   FST_P_V.*
     *             | TCD:定时器和倒计时器  FST_P_TCDM.*
     *         | BSF 业务功能特有公共重复使用域 FST_BSF.*
     * 使用技巧:
     *
     ******************************************************************/
    //基础域名空间定义
    if(!$.FST){
        //根域
        $.FST = {};
    }
    if(!$.FST.CORE){
        //公共核心基本域:jsClass,jqueryExt,cookies,caches,Tools,PostInfo,art,TableRd,$.FST.CORE....
        $.FST.CORE = {};
    }
    if(!$.FST.PLUGIN){
        //公共插件域
        $.FST.PLUGIN = {};
    }
    if(!$.FST.BSF){
        //业务功能特有公共重复使用域
        $.FST.BSF = {};
    }

    var __fstCore = {};
    var __fstPlugin = {};
    var __fstBsf = {};

    try{
        /******************************************************************
         * 内部全局变量
         ******************************************************************/
        var _G_FST_VAL = {
            ENUM_regular:{
                pluses:/\+/g,
                digit0$9:/^[0-9]*$/
            },
            //bw默认加密密钥
            _fs_cookie_sw:!0,//cookie启用开关
            _fs_cache_sw:!0,//缓存启用开关
            _fs_console_sw:!1,//日志开关
            ENUM_dataTime_format : {
                Y_M_D: "yyyy-MM-dd",
                Y_M_D$H_M_S: "yyyy-MM-dd hh:mm:ss",
                Y_M_D$H_M_S_S: "yyyy-MM-dd hh:mm:ss.S",
                Y_M_D$Q$E$H_M_S_S: "yyyy-MM-dd q E hh:mm:ss.S",

                Y_M_D_CN: "yyyy年MM月dd日",
                Y_M_D$H_M_S_CN: "yyyy年MM月dd日 hh时mm分ss秒",
                Y_M_D$H_M_S_S_CN: "yyyy年MM月dd日 hh时mm分ss秒S毫秒",
                Y_M_D$Q$EEE$H_M_S_S_CN: "yyyy年MM月dd日 q EEE hh时mm分ss秒S毫秒"
            },
            ENUM_console_type:{
                'LOG':'log',
                'ERROR':'error',
                'WARN':'warn',
                'TRACE':'trace'
            },
            ENUM_prefix:{
                assert:'[Assertion failed] - ',
                ajax:'[Request failed] - ',
                enDecrypt:'[EnDecrypt failed] - ',
                ui_table_grid:'[UIDBTg failed] - ',
                fun_div_op:'[P_FDP failed] - ',
                el_event:'[EL_EVENT failed] - ',
                tcd_p:'[TimerCountDown failed] - ',
                mpop_p:'[MsgPop failed] - '
            },
            ENUM_mask:{
                //loading mask
                LdObj:null,LdId:'LDM_K',
                //fun div pop mask
                FdpObj:null,FdpId:'FDP_K'
            },
            ENUM_M:{
                MBW1:'{M1}',
                MCD3:'{M3}'
            },
            ENUM_art_support_tmps:{}
        };
        //存放引入当前js时传入的参数
        var _G_NO_INIT = {};
        //=================内部公共方法 start  ===================
        /******************************************************************
         * 内部公共方法,仅供内部使用,适当的提供给外部
         ******************************************************************/
        //MASK 遮罩层
        function __getMaskById(id){
            var rt = null;
            var _mk,_mh;
            if(id == _G_FST_VAL.ENUM_mask.LdId){
                rt = _G_FST_VAL.ENUM_mask.LdObj || null;
                if(!rt){
                    _mk = '<div id="loadMaskDvId" _flag="MASK" spv="H" class="fsd_loading_mask"></div>';
                    $("body").append(_mk);
                    _G_FST_VAL.ENUM_mask.LdObj = $("#loadMaskDvId");
                    _mh =  $(document).height()+200;
                    _G_FST_VAL.ENUM_mask.LdObj.css({"height":_mh,"width":'500%'}).hide();
                }
                rt =  _G_FST_VAL.ENUM_mask.LdObj;
            }else if(id == _G_FST_VAL.ENUM_mask.FdpId){
                rt = _G_FST_VAL.ENUM_mask.FdpObj || null;
                if(!rt){
                    _mk = '<div id="funDvOpMaskId" _flag="MASK" spv="H" class="fsd_box_mask"></div>';
                    $("body").append(_mk);
                    _G_FST_VAL.ENUM_mask.FdpObj = $("#funDvOpMaskId");
                    _mh =  $(document).height()+200;
                    _G_FST_VAL.ENUM_mask.FdpObj.css({"height":_mh,"width":'500%'}).hide();
                }
                rt =  _G_FST_VAL.ENUM_mask.FdpObj;
            }else{}
            return rt;
        };
        function __maskShow(id){
            var m = __getMaskById(id);
            if(m){
                var t = m.attr("spv");
                if(t&&t == 'H'){
                    m.attr("spv","S").show();
                }
            }
        };
        function __maskHide(id){
            var m = __getMaskById(id);
            if(m){
                var t = m.attr("spv");
                if(t&&t == 'S'){
                    m.attr("spv","H").hide();
                }
            }
        };
        /**
         * 判断cookie是否启用
         * @returns {string|boolean}
         * @private
         */
        function __cookieIsUse(){
            var _isc = document.cookie;
            return _isc!=undefined && navigator.cookieEnabled ? true:false;
        };
        /**
         * 编码
         * @param s
         * @returns {*}
         * @private
         */
        function __encode(s) {
            s = s+'';
            var t = (s.indexOf("/")!=-1||s.indexOf(".")!=-1) ? true:false;
            if(t&&encodeURIComponent){
                return encodeURIComponent(s);
            }
            if(!t&&escape){
                return escape(s);
            }
            return s;
        };
        /**
         * 解码
         * @param s
         * @returns {*}
         * @private
         */
        function __decode(s) {
            s = s+'';
            var t = (s.indexOf("/")!=-1||s.indexOf(".")!=-1) ? true:false;
            if(t&&decodeURIComponent){
                return decodeURIComponent(s);
            }
            if(!t&&unescape){
                return unescape(s);
            }
            return s;
        };

        function __dataFormat(dt,fmt){
            var o = {
                "M+": dt.getMonth() + 1,
                //月份
                "d+": dt.getDate(),
                //日
                "h+": dt.getHours() % 12 == 0 ? 12 : dt.getHours() % 12,
                //小时
                "H+": dt.getHours(),
                //小时
                "m+": dt.getMinutes(),
                //分
                "s+": dt.getSeconds(),
                //秒
                //"q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S": dt.getMilliseconds() //毫秒
            };
            var uncs = {
                "0": "\u65e5",
                "1": "\u4e00",
                "2": "\u4e8c",
                "3": "\u4e09",
                "4": "\u56db",
                "5": "\u4e94",
                "6": "\u516d"
            };
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
            }

            if (/(q+)/.test(fmt)) {
                var _cjd = Math.floor((this.getMonth() + 3) / 3);
                fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length >= 1) ? "\u7b2c" : "") + uncs[_cjd + ""] + "\u5b63\u5ea6");
            }
            if (/(E+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "\u661f\u671f" : "\u5468") : "") + uncs[dt.getDay() + ""]);
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                }
            }
            return fmt;
        };
        /*
         * 日志打印,如果支持的话 _fs_console_tmPre_sw
         * @param msg
         * @param type
         * @private
         */
        function __console(msg,logType){
            if(!_G_FST_VAL._fs_console_sw){
                return;
            }
            var _cs = window.console || null;
            if(_cs){
                var _fmt = _G_FST_VAL.ENUM_dataTime_format.Y_M_D$H_M_S;
                msg = __dataFormat(new Date(),_fmt) +' -> '+ msg;
                switch (logType){
                    case _G_FST_VAL.ENUM_console_type.LOG:{
                        _cs.log(msg);
                        break;
                    }
                    case _G_FST_VAL.ENUM_console_type.ERROR:{
                        _cs.error(msg);
                        break;
                    }
                    case _G_FST_VAL.ENUM_console_type.WARN:{
                        _cs.warn(msg);
                        break;
                    }
                    case _G_FST_VAL.ENUM_console_type.TRACE:{
                        //用来追踪函数的调用轨迹
                        _cs.trace();
                        break;
                    }
                    default :{
                        _cs.log(msg);
                        break;
                    }
                }
            }
        };

        /*
         * 内部使用的打印一些组件内的提示及调试信息
         * @param msg
         * @param prefixMsg
         * @param logType 有类型时才会打印日志信息
         * @param opts 参数设置: OP: 1 alert;2 console,12 alert并console
         * @private
         */
        function __cpAlert$console(msg,prefixMsg,logType,opts){
            var _msg = (prefixMsg || '[Deal Result] - ')+msg;
            var _op = 12;
            if(opts){
                _op = opts['OP']||12;
            }
            if(logType){
                if(_op==2||_op==12){
                    __console(_msg,logType);
                }
            }
            if(_op==1||_op==12){
                if(typeof JAlert != 'undefined'){
                    JAlert("【CP_TIP】: \n"+_msg);
                }else{
                    alert("【CP_TIP】: \n"+_msg);
                }
            }
        };
        function __cpAlert(msg,prefixMsg){
            //__cpAlert$console(msg,prefixMsg,null,{'OP':1});
        };
        function __cpConsole(msg,prefixMsg,logType){
            //__cpAlert$console(msg,prefixMsg,logType,{'OP':2});
        };
        /*
         * @param {object}obj
         * @param {string}errorMsg  有值会抛出此信息且没有返回值
         * @param {string}prefixMsg
         * @returns {boolean}
         * @private
         */
        function __objIsTrue(boolV,errorMsg,prefixMsg){
            boolV = boolV + '';
            var b,emsg;
            if(boolV === 'false'){
                b = false;
                //当前请求的结果为false
                emsg = prefixMsg+'The results of the current request is false:'+errorMsg;
            }else if(boolV === 'true'){
                b = true;
            }else{
                b = false;
                //当前请求的结果不是boolean值
                emsg = prefixMsg+'The results of the current request is not a boolean value!';
            }
            if(errorMsg&&!b){
                throw new Error(emsg);
            }
            return b;
        };
        function __objIsNull(obj,errorMsg,prefixMsg){
            var b = false;
            var _dt = typeof obj;
            switch (_dt) {
                case 'undefined':
                    b = true;
                    break;
                case 'string':
                    if(!obj&&obj.length==0){
                        b = true;
                    }
                    break;
                case 'boolean':
                    if (!obj) {b = true;}
                    break;
                case 'number':
                    if (isNaN(obj)) {b = true;}
                    break;
                case 'object':{
                    var _s = Object.prototype.toString.call(obj);
                    switch (_s) {
                        case "[object Array]":
                            if( obj.length == 0){
                                b = true;
                            }
                            break;
                        case "[object Date]":
                            break;
                        default:{
                            if (null === obj){
                                b = true;
                            }else{
                                //对象类型的判断
                                b = true;
                                for(var i in obj){
                                    if(obj.hasOwnProperty(i)){
                                        b = false;
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                    break;
                }default :{}
            }
            if(errorMsg&&b){
                throw new Error(prefixMsg+'The current object can not be empty:'+errorMsg);
            }
            return b;
        };

        /**
         * 从一个字符串中解析出对象
         * @param jsonStr
         * @return {*}
         * @private
         */
        function __objectParse(jsonStr){
            var b = null;
            if(jsonStr == undefined || jsonStr == null){
                return {};
            }
            if(typeof jsonStr == 'object'){
                return jsonStr;
            }
            try {
                if($.parseJSON){
                    b = $.parseJSON(jsonStr);
                }
            } catch (e) {
                b = null;
            }
            try {
                if(!b&&JSON.parse){
                    b = JSON.parse(jsonStr);
                }
            } catch (e) {
                b = null;
            }
            try {
                if(!b){
                    b = eval("(" + jsonStr + ")");
                }
            } catch (e) {
                b = null;
            }
            return b;
        };

        /**
         * 从一个对象解析出字符串
         * @param jsonObj
         * @return {*}
         * @private
         */
        function __objectStringify(jsonObj){
            var b = null;
            try {
                if($.toJSON){
                    b = $.toJSON(jsonObj);
                }else if(JSON.stringify){
                    b = JSON.stringify(jsonObj);
                }else{
                }
            } catch (e) {
                b = null;
            }
            return b;
        };
        /**
         * 判断是否对象类型有索引值的{}[]
         * @param obj
         * @returns {boolean}
         * @private
         */
        function __isArrayOrJson(obj){
            var b = false;
            var _dt = typeof obj;
            if(obj&&_dt=='object'){
                for(var i in obj){
                    if(obj.hasOwnProperty(i)){
                        b = true;
                        break;
                    }
                }
            }
            return b;
        };
        /**
         * 判断是否为jquery对象
         * @param obj
         * @private
         */
        function __isJqueryObj(obj){
            var b = false;
            if(obj){
                var t = typeof obj;
                if(t == 'object'){
                    return (obj.selector) || (obj instanceof jQuery);
                }
            }
            return b;
        };
        /**
         * 判断是否存在此ID的元素或jquery对象
         * @param id$jqObj
         * @private
         */
        function __isHavIdElement(id$jqObj){
            var b = false;
            try{
                var _obj = null;
                if(id$jqObj !=undefined&&id$jqObj!=""&&!$.isFunction(id$jqObj)){
                    var t = typeof id$jqObj;
                    if(t == 'string'){
                        _obj = document.getElementById(id$jqObj);
                        b = (_obj!=null&&_obj!=undefined);
                    }else if(t == 'object'){
                        if(__isJqueryObj(id$jqObj)){
                            //如果是jquery对象再判断
                            b = (id$jqObj.length > 0);
                        }
                    }
                }
            }catch (e){
                b=false;
            }
            return b;
        };
        //MASK 遮罩层


        //=================内部公共方法 end  ===================

        //=================注册常用js对象BEAN start  ===================
        /******************************************************************
         * 注册常用js对象BEAN
         ******************************************************************/
        function __getInDataSet(){
            if(this._inDS_){
                return this._inDS_;
            }
            return null;
        };
        function __getInDataAttrSet(){
            if(this._inDSAttrs_){
                return this._inDSAttrs_;
            }
            return null;
        };
        function __get(K){
            if(this._inDS_){
                return this._inDS_[K] || null;
            }else{
                return null;
            }
        };
        function __put(K,V){
            if(K&&this._inDS_){
                this._inDS_[K] = V;
            }
        };
        function __putAll(objPm){
            if(objPm&&this._inDS_){
                if(__isArrayOrJson(objPm)){
                    $.extend(this._inDS_,objPm);
                }
            }
        };
        function __remove(K){
            if(K&&this._inDS_){
                //如果是数组的话只认识K为数字并作为索引下标删除
                delete this._inDS_[K];
            }
        };
        //顶层js对象,继承扩展使用
        var __jsClass = function(opts){
            this.id = (opts?opts.id:null) || (opts?opts.name:null);//主键标识
            this.name = (opts?opts.name:null) || (opts?opts.id:null);
            this._inDS_ = opts&&opts['INDS']?opts['INDS']:{};//内部数据集容器
            this.put = __put;
            this.putAll = __putAll;
            this.get = __get;
            this.remove = __remove;
        };
        //ajax请求的配置对象
        var __ajaxRqCfg = function(){
            this.$_isAsync = true; //异步
            this.$_timeOut = 60000;//超时时间 毫秒,默认1分钟,只有当异步且此值大于0生效
            this.$_rqType = "POST"; //post请求,GET
            this.$_isCache = false; //no cache  设置为 false 将不会从浏览器缓存中加载请求信息。
            /*
             *   "xml": 返回 XML 文档，可用 jQuery 处理。
             *   "html": 返回纯文本 HTML 信息；包含 script 元素。
             *   "script": 返回纯文本 JavaScript 代码。不会自动缓存结果。
             *   "json": 返回 JSON 数据 。
             */
            this.$_dataType = "html"; //html方式返回
            this.$_bsIsChUrl = !0;//是否缓存URL
        };
        if (!this['ReqConfig']) {
            this['ReqConfig'] = __ajaxRqCfg;
        }
        //ajax 请求参数对象
        var __SoPmJo = function(optsObj){
            __jsClass.call(this, $.extend({name:'SoPJ'},optsObj));
            this._inDSEn_ = {};//需要加密的参数
            this._inDSAttrs_ = {};//参数额外属性配置
            this.put = null;
            this.putAll = null;
            this.get = null;
            this.remove = null;
            //获取请求参数集合
            this.getReqParams = __getInDataSet;
            //获取请求参数属性集合
            this.getReqParamsAttrs = __getInDataAttrSet;
            this.getReqNeedEnParams = function(){
                var rt = this._inDSEn_;
                if(rt){
                    return rt;
                }
                return null;
            };
            /*
             * @param key
             * @param val
             * @param isTsEn 此参数传入后台时是否加密
             * @param blockTipId 当前对应元素的ID或统一的块ID,作为字段验证不通过提示块ID
             */
            this.addItem = function(key, val,isTsEn, blockTipId){
                if(arguments.length < 2){
                    _fcTools_._Cp_alert_("入参至少2位!");
                    return;
                }else{
                    key = key+'';
                    this._inDS_[key] = val;
                    var _isTsEn = false;
                    if(isTsEn!=undefined&&isTsEn!=null){
                        _isTsEn = isTsEn;
                    }
                    if(_isTsEn){
                        this._inDSEn_[key] = val;
                    }
                    this._inDSAttrs_[key] = {
                        'V':val,
                        'IS_TS_EN':_isTsEn,
                        'TIP_ID':blockTipId
                    }
                }
            }

        };
        if (!this['SoPmJo']) {
            this['SoPmJo'] = __SoPmJo;
        }
        //ajax 数据返回对象
        var __SoRtJo = function(optsObj){
            __jsClass.call(this, $.extend({'name':'SoRtJ'},optsObj));
            this._noSpotInDS_ = null;//无法识别的返回数据存放
            this.put = null;
            this.putAll = null;
            this.get = null;
            this.remove = null;

            this.getItem = __get;
            this.addItem = __put;
            this.putJsonBusiObj = __putAll;
            this.getJsonBusiObj = __getInDataSet;//获取服务器返回的json数据对象

            //校验是否有效返回
            this.isRtValid = function() {
                var _r = this.getFlag();
                return !_r ? false : true;
            };
            this.isRtY = function() {
                return this.getFlag() === 'Y';
            };

            this.getDBTG_Data = function() {
                return this.getItem("DBGridData");
            };
            this.getDBTG_TotalNum = function() {
                return parseInt(this.getItem("TotalNum") || 0);
            };

            this.getFlag = function() {
                return this.getItem("FLAG");
            };
            this.getStateCode = function() {
                return this.getItem("STATECODE");
            };
            this.getErrorMsg = function() {
                return this.getItem("MSG");
            };
        };
        if (!this['SoRtJo']) {
            this['SoRtJo'] = __SoRtJo;
        }
        //=================注册常用js对象BEAN end  ===================


//----------------------------###############################################----------------------------
        //=================Js import third-party package repository start  ===================
        /******************************************************************
         * 导入不需要重新封装的第三方js包库
         * Jalert.js
         ******************************************************************/
        function __initJalertLib(){
            eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('(5($){$.3={2E:-2D,22:0,28:F,2f:.2C,26:\'#2H\',1W:F,1n:\' \\2G\\2F \',1D:\' \\2y\\2x \',1L:l,11:"{1E}",X:l,M:0,2g:" {1E} \\2w\\2B\\2A\\2z\\2I\\2R\\2Q\\2P\\2U\\2T\\2S\\2L.",7:"7",m:"m",v:"v",9:"9",o:"o",1j:5(d,1z,8,6){$.3.7="7";$.3.m="m";$.3.v="v";$.3.9="9";$.3.o="o";$.3.M=1z?1z:0;4($.3.M>0){4((d+"").1w("{1E}")==-1){d=d+"\\n\\n"+$.3.2g}}4(8==l)8=\'2K\';$.3.14(8,d,l,\'1j\',5(R){4(6)6(R)})},1u:5(d,8,6){$.3.7="7";$.3.m="m";$.3.v="v";$.3.9="9";$.3.o="o";4(8==l)8=\'2J\';$.3.14(8,d,l,\'1u\',5(R){4(6)6(R)})},1d:5(d,t,8,6){$.3.7="7";$.3.m="m";$.3.v="v";$.3.9="9";$.3.o="o";4(8==l)8=\'1Y\';$.3.14(8,d,t,\'1d\',5(R){4(6)6(R)})},J:5(d,8,6,f,a){4(a==l||a==1G){a=1}$.3.7="19"+a;$.3.m="1T"+a;$.3.v="2O"+a;$.3.9="2N"+a;$.3.o="o";4(8==l)8=\'1Y\';$.3.14(8,d,l,\'J\',6,f,a)},24:5(1g){$("#1m"+1g).i();},14:5(8,T,t,c,6,f,a){$.3.E(c,a);$.3.1b(\'W\');q C={2a:l,1o:l,1p:S,1v:S};$("2l").1P(\'<j  s="2M" 1B="2q:21;" k="\'+$.3.7+\'">\'+\'<j s="2p" k="\'+$.3.m+\'"></j>\'+\'<j s="2u"  k="\'+$.3.v+\'">\'+\'<j s="2v" k="\'+$.3.9+\'"></j>\'+\'</j>\'+\'</j>\');4($.3.1L)$("#"+$.3.7).2d($.3.1L);q 25=\'2k\';$("#"+$.3.7).O({2m:25,2e:2s,2r:0,2t:0});$("#"+$.3.m).z(8);$("#"+$.3.m).L("<p>"+$("#"+$.3.m).z()+\'</p><H s="1Z"></H><H s="1U">\');$("#"+$.3.v).2d(c);4(c!=\'J\'){$("#"+$.3.9).z(T.12($.3.11,""));$("#"+$.3.9).L($("#"+$.3.9).z().12(/\\n/g,\'<1R />\'))}1t{q 29=2o.2n(T,".L")?F:P;C=$.3m(C,6);q 1k=C.2a;4(29){$("#"+$.3.9).3q(T,5(b){4(b){1k()}})}1t{$("#"+$.3.9).z(T.12($.3.11,""));$("#"+$.3.9).L($("#"+$.3.9).z());4(1k!=l){1k()}}}4(c!=\'J\'){$("#"+$.3.7).O({1p:$("#"+$.3.7).1x()-20,3p:$("#"+$.3.7).1x()});$.3.1l();$.3.1r(F)}1t{$("#"+$.3.7).O({1p:C.1p+"1s",1v:C.1v+"1s"});$.3.1l();$.3.1r(P)}q 1F=P;Y(c){x\'1j\':$("#"+$.3.9).1y(\'<j s="1A" k="1S"><N c="f" t="\'+$.3.1n+\'" k="h" /></j>\');$("#h").i(5(){$.3.E();6(F)});$("#"+$.3.7).W(S);$("#h").1q();w.1J(\'h\').1M=5(B){q e=B||Q.B||V.1H.1I.V[0];4(e.I==13||e.I==27)$("#h").G(\'i\')};1F=F;u;x\'1u\':$("#"+$.3.9).1y(\'<j s="1A"  k="1S"><N c="f" t="\'+$.3.1n+\'" k="h" /> <N c="f" t="\'+$.3.1D+\'" k="D" /></j>\');$("#h").i(5(){$.3.E();4(6)6(F)});$("#D").i(5(){$.3.E();4(6)6(P)});$("#"+$.3.7).W(S);$("#h").1q();w.1J(\'h\').1M=5(B){q e=B||Q.B||V.1H.1I.V[0];4(e.I==13)$("#h").G(\'i\');4(e.I==27)$("#D").G(\'i\')};u;x\'1d\':$("#"+$.3.9).1P(\'<1R /><N c="z" 3l="30" s="3j" k="K" />\').1y(\'<j s="1A"  k="1S"><N c="f" t="\'+$.3.1n+\'" k="h" /> <N c="f" t="\'+$.3.1D+\'" k="D" /></j>\');4($("#"+$.3.9).L().1w("3i")>=0){$("#K").3k("c","3n")}$("#K").18($("#"+$.3.9).18());$("#h").i(5(){q 1i=$("#K").1i();$.3.E();4(6)6(1i)});$("#D").i(5(){$.3.E();4(6)6(l)});$("#K, #h, #D").3h(5(e){4(e.I==13)$("#h").G(\'i\');4(e.I==27)$("#D").G(\'i\')});4(t)$("#K").1i(t);$("#"+$.3.7).W(S);$("#K").1q().3e();u;x\'J\':q 1C=C.1o;$("#"+$.3.m).L("<p>"+8+\'<H k="1m\'+a+\'"  s="3f"></H><N k="1V\'+a+\'" c="z" 1B="18: 1K;3g: 21;" /></p><H s="1Z"></H><H s="1U">\');4(f!=l||f!=1G){f=",#"+f}1t{f=""}$("#h"+f).i(5(){$.3.E(c,a);4(1C)C.1o(F)});$("#D,#1m"+a+"").i(5(){$.3.E(c,a);4(1C)C.1o(P)});$("#"+$.3.7).W(S);$("#1V"+a+"").1q();w.1J($.3.7).1M=5(B){q e=B||Q.B||V.1H.1I.V[0];4(e.I==13)$("#h"+f).G(\'i\');4(e.I==27)$("#D,#1m"+a+"").G(\'i\')};u}4($.3.1W){3o{Y(c){x"J":$("#1T"+a).2h(5(e){1f=e.1e-$(A).1c().y;17=e.16-$(A).1c().r+13;$(w).1h(5(e){$("#19"+a).O({"y":(e.1e-1f),"r":(e.16-17<=10?10:e.16-17+13)})})});$("#19"+a).1X(5(){$(w).1N("1h")});u;2j:$("#m").2h(5(e){1f=e.1e-$(A).1c().y;17=e.16-$(A).1c().r+13;$(w).1h(5(e){$("#7").O({"y":(e.1e-1f),"r":(e.16-17+13)})})});$("#7").1X(5(){$(w).1N("1h")});u}}31(e){}}4(1F&&$.3.M>0){4($.3.X){2i($.3.X)}$.3.X=33(5(){q U=T;4(U&&U.1w($.3.11)!=-1){U=U.12($.3.11," "+$.3.M+" ");$("#"+$.3.9).z(U);$("#"+$.3.9).L($("#"+$.3.9).z().12(/\\n/g,\'<1R />\'))}$.3.M--;4($.3.M<0){$("#h").G(\'i\')}},2Z)}},E:5(c,a){4($.3.X){2i($.3.X)}Y(c){x"J":$("#19"+a).1Q();u;2j:$("#7").1Q();u}$.3.1b(\'1O\');$.3.1r(P)},1b:5(1a){Y(1a){x\'W\':$.3.1b(\'1O\');$("2l").1P(\'<j k=\'+$.3.o+\'></j>\');$("#"+$.3.o+"").O({2m:\'2k\',2e:2W,r:\'1K\',y:\'1K\',18:\'2V%\',Z:$(w).Z(),2Y:$.3.26,2X:$.3.2f});u;x\'1O\':$("#"+$.3.o+"").1Q();u}},1l:5(){q 15=Q.r||Q;q r=(($(15).Z()/ 2) - ($("#"+$.3.7).3b() /2))+$(15).23()-20;q y=(($(15).18()/ 2) - ($("#"+$.3.7).1x() /2))+$.3.22;4(r<0)r=3a;4(y<0)y=0;4(\'1G\'==3d(w.3c.1B.1v))r=r+$(15).23();$("#"+$.3.7).O({r:r+\'1s\',y:y+\'1s\'});$("#"+$.3.o+"").Z($(w).Z())},1r:5(1a){4($.3.28){Y(1a){x F:$(Q).39(\'2c\',5(){$.3.1l()});u;x P:$(Q).1N(\'2c\');u}}}};A.36=5(d,2b,8,6){$.3.1j(d+\'\',2b,8,6)};A.35=5(d,8,6){$.3.1u(d+\'\',8,6)};A.38=5(d,t,8,6){$.3.1d(d+\'\',t,8,6)};A.37=5(d,8,6,f,a){$.3.J(d+\'\',8,6,f,a)};A.34=5(1g){$.3.24(1g)}})(32);',62,213,'|||alerts|if|function|callback|popup_container|title|popup_message|layerNo||type|message||button||popup_ok|click|div|id|null|popup_title||popup_overlay||var|top|class|value|break|popup_content|document|case|left|text|this|event|_0|popup_cancel|_1|true|trigger|span|keyCode|dialog|popup_prompt|html|autoCtT|input|css|false|window|result|200|msg|_2|arguments|show|autoCtId|switch|height||_4|replace||_3|win|pageY|iDiffY|width|popup_container_|status|_8|offset|prompt|pageX|iDiffX|key|mousemove|val|alert|_6|_5|popup_cancel_|okButton|closeCallBack|minWidth|focus|_7|px|else|confirm|minHeight|indexOf|outerWidth|after|_10|cl_popup_panel|style|_11|cancelButton|_9|isAutoC|undefined|callee|caller|getElementById|0px|dialogClass|onkeydown|unbind|hide|append|remove|br|popup_panel|popup_title_|two|id_cel_hi_|draggable|mouseup|输入|one||none|horizontalOffset|scrollTop|closeDG|pos|overlayColor||repositionOnResize|_13|initCallBack|_12|resize|addClass|zIndex|overlayOpacity|autoMsg|mousedown|clearInterval|default|absolute|BODY|position|g_String_ext_endWith|FST_C_T|cl_popup_title|display|padding|99999|margin|cl_popup_content|cl_popup_message|u79d2|u6d88|u53d6|u52a8|u81ea|u540e|01|75|verticalOffset|u5b9a|u786e|FFF|u5173|确认|提示|u7406|cl_popup_container|popup_message_|popup_content_|u505a|u6216|u95ed|u5904|u5b83|u5176|100|99998|opacity|background|1000||catch|jQuery|setInterval|JDclose|JConfirm|JAlert|JDialog|JPrompt|bind|40|outerHeight|body|typeof|select|popop_err|border|keypress|密码|cl_popup_prompt|attr|size|extend|password|try|maxWidth|load'.split('|'),0,{}))

        };
        __initJalertLib();
        /******************************************************************
         * 导入不需要重新封装的第三方js包库
         * sockjs-client v1.0.3 | http://sockjs.org | MIT license
         ******************************************************************/
        !function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.SockJS=t()}}(function(){var t;return function e(t,n,r){function i(s,a){if(!n[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(o)return o(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var c=n[s]={exports:{}};t[s][0].call(c.exports,function(e){var n=t[s][1][e];return i(n?n:e)},c,c.exports,e,t,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(t,e){(function(n){"use strict";var r=t("./transport-list");e.exports=t("./main")(r),"_sockjs_onload"in n&&setTimeout(n._sockjs_onload,1)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./main":14,"./transport-list":16}],2:[function(t,e){"use strict";function n(){i.call(this),this.initEvent("close",!1,!1),this.wasClean=!1,this.code=0,this.reason=""}var r=t("inherits"),i=t("./event");r(n,i),e.exports=n},{"./event":4,inherits:54}],3:[function(t,e){"use strict";function n(){i.call(this)}var r=t("inherits"),i=t("./eventtarget");r(n,i),n.prototype.removeAllListeners=function(t){t?delete this._listeners[t]:this._listeners={}},n.prototype.once=function(t,e){function n(){r.removeListener(t,n),i||(i=!0,e.apply(this,arguments))}var r=this,i=!1;this.on(t,n)},n.prototype.emit=function(t){var e=this._listeners[t];if(e)for(var n=Array.prototype.slice.call(arguments,1),r=0;r<e.length;r++)e[r].apply(this,n)},n.prototype.on=n.prototype.addListener=i.prototype.addEventListener,n.prototype.removeListener=i.prototype.removeEventListener,e.exports.EventEmitter=n},{"./eventtarget":5,inherits:54}],4:[function(t,e){"use strict";function n(t){this.type=t}n.prototype.initEvent=function(t,e,n){return this.type=t,this.bubbles=e,this.cancelable=n,this.timeStamp=+new Date,this},n.prototype.stopPropagation=function(){},n.prototype.preventDefault=function(){},n.CAPTURING_PHASE=1,n.AT_TARGET=2,n.BUBBLING_PHASE=3,e.exports=n},{}],5:[function(t,e){"use strict";function n(){this._listeners={}}n.prototype.addEventListener=function(t,e){t in this._listeners||(this._listeners[t]=[]);var n=this._listeners[t];-1===n.indexOf(e)&&(n=n.concat([e])),this._listeners[t]=n},n.prototype.removeEventListener=function(t,e){var n=this._listeners[t];if(n){var r=n.indexOf(e);return-1!==r?void(n.length>1?this._listeners[t]=n.slice(0,r).concat(n.slice(r+1)):delete this._listeners[t]):void 0}},n.prototype.dispatchEvent=function(t){var e=t.type,n=Array.prototype.slice.call(arguments,0);if(this["on"+e]&&this["on"+e].apply(this,n),e in this._listeners)for(var r=this._listeners[e],i=0;i<r.length;i++)r[i].apply(this,n)},e.exports=n},{}],6:[function(t,e){"use strict";function n(t){i.call(this),this.initEvent("message",!1,!1),this.data=t}var r=t("inherits"),i=t("./event");r(n,i),e.exports=n},{"./event":4,inherits:54}],7:[function(t,e){"use strict";function n(t){this._transport=t,t.on("message",this._transportMessage.bind(this)),t.on("close",this._transportClose.bind(this))}var r=t("json3"),i=t("./utils/iframe");n.prototype._transportClose=function(t,e){i.postMessage("c",r.stringify([t,e]))},n.prototype._transportMessage=function(t){i.postMessage("t",t)},n.prototype._send=function(t){this._transport.send(t)},n.prototype._close=function(){this._transport.close(),this._transport.removeAllListeners()},e.exports=n},{"./utils/iframe":47,json3:55}],8:[function(t,e){"use strict";var n=t("./utils/url"),r=t("./utils/event"),i=t("json3"),o=t("./facade"),s=t("./info-iframe-receiver"),a=t("./utils/iframe"),u=t("./location");e.exports=function(t,e){var l={};e.forEach(function(t){t.facadeTransport&&(l[t.facadeTransport.transportName]=t.facadeTransport)}),l[s.transportName]=s;var c;t.bootstrap_iframe=function(){var e;a.currentWindowId=u.hash.slice(1);var s=function(r){if(r.source===parent&&("undefined"==typeof c&&(c=r.origin),r.origin===c)){var s;try{s=i.parse(r.data)}catch(f){return}if(s.windowId===a.currentWindowId)switch(s.type){case"s":var h;try{h=i.parse(s.data)}catch(f){break}var d=h[0],p=h[1],v=h[2],m=h[3];if(d!==t.version)throw new Error('Incompatibile SockJS! Main site uses: "'+d+'", the iframe: "'+t.version+'".');if(!n.isOriginEqual(v,u.href)||!n.isOriginEqual(m,u.href))throw new Error("Can't connect to different domain from within an iframe. ("+u.href+", "+v+", "+m+")");e=new o(new l[p](v,m));break;case"m":e._send(s.data);break;case"c":e&&e._close(),e=null}}};r.attachEvent("message",s),a.postMessage("s")}}},{"./facade":7,"./info-iframe-receiver":10,"./location":13,"./utils/event":46,"./utils/iframe":47,"./utils/url":52,debug:void 0,json3:55}],9:[function(t,e){"use strict";function n(t,e){r.call(this);var n=this,i=+new Date;this.xo=new e("GET",t),this.xo.once("finish",function(t,e){var r,a;if(200===t){if(a=+new Date-i,e)try{r=o.parse(e)}catch(u){}s.isObject(r)||(r={})}n.emit("finish",r,a),n.removeAllListeners()})}var r=t("events").EventEmitter,i=t("inherits"),o=t("json3"),s=t("./utils/object");i(n,r),n.prototype.close=function(){this.removeAllListeners(),this.xo.close()},e.exports=n},{"./utils/object":49,debug:void 0,events:3,inherits:54,json3:55}],10:[function(t,e){"use strict";function n(t){var e=this;i.call(this),this.ir=new a(t,s),this.ir.once("finish",function(t,n){e.ir=null,e.emit("message",o.stringify([t,n]))})}var r=t("inherits"),i=t("events").EventEmitter,o=t("json3"),s=t("./transport/sender/xhr-local"),a=t("./info-ajax");r(n,i),n.transportName="iframe-info-receiver",n.prototype.close=function(){this.ir&&(this.ir.close(),this.ir=null),this.removeAllListeners()},e.exports=n},{"./info-ajax":9,"./transport/sender/xhr-local":37,events:3,inherits:54,json3:55}],11:[function(t,e){(function(n){"use strict";function r(t,e){var r=this;i.call(this);var o=function(){var n=r.ifr=new u(l.transportName,e,t);n.once("message",function(t){if(t){var e;try{e=s.parse(t)}catch(n){return r.emit("finish"),void r.close()}var i=e[0],o=e[1];r.emit("finish",i,o)}r.close()}),n.once("close",function(){r.emit("finish"),r.close()})};n.document.body?o():a.attachEvent("load",o)}var i=t("events").EventEmitter,o=t("inherits"),s=t("json3"),a=t("./utils/event"),u=t("./transport/iframe"),l=t("./info-iframe-receiver");o(r,i),r.enabled=function(){return u.enabled()},r.prototype.close=function(){this.ifr&&this.ifr.close(),this.removeAllListeners(),this.ifr=null},e.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./info-iframe-receiver":10,"./transport/iframe":22,"./utils/event":46,debug:void 0,events:3,inherits:54,json3:55}],12:[function(t,e){"use strict";function n(t,e){var n=this;r.call(this),setTimeout(function(){n.doXhr(t,e)},0)}var r=t("events").EventEmitter,i=t("inherits"),o=t("./utils/url"),s=t("./transport/sender/xdr"),a=t("./transport/sender/xhr-cors"),u=t("./transport/sender/xhr-local"),l=t("./transport/sender/xhr-fake"),c=t("./info-iframe"),f=t("./info-ajax");i(n,r),n._getReceiver=function(t,e,n){return n.sameOrigin?new f(e,u):a.enabled?new f(e,a):s.enabled&&n.sameScheme?new f(e,s):c.enabled()?new c(t,e):new f(e,l)},n.prototype.doXhr=function(t,e){var r=this,i=o.addPath(t,"/info");this.xo=n._getReceiver(t,i,e),this.timeoutRef=setTimeout(function(){r._cleanup(!1),r.emit("finish")},n.timeout),this.xo.once("finish",function(t,e){r._cleanup(!0),r.emit("finish",t,e)})},n.prototype._cleanup=function(t){clearTimeout(this.timeoutRef),this.timeoutRef=null,!t&&this.xo&&this.xo.close(),this.xo=null},n.prototype.close=function(){this.removeAllListeners(),this._cleanup(!1)},n.timeout=8e3,e.exports=n},{"./info-ajax":9,"./info-iframe":11,"./transport/sender/xdr":34,"./transport/sender/xhr-cors":35,"./transport/sender/xhr-fake":36,"./transport/sender/xhr-local":37,"./utils/url":52,debug:void 0,events:3,inherits:54}],13:[function(t,e){(function(t){"use strict";e.exports=t.location||{origin:"http://localhost:80",protocol:"http",host:"localhost",port:80,href:"http://localhost/",hash:""}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],14:[function(t,e){(function(n){"use strict";function r(t,e,n){if(!(this instanceof r))return new r(t,e,n);if(arguments.length<1)throw new TypeError("Failed to construct 'SockJS: 1 argument required, but only 0 present");b.call(this),this.readyState=r.CONNECTING,this.extensions="",this.protocol="",n=n||{},n.protocols_whitelist&&m.warn("'protocols_whitelist' is DEPRECATED. Use 'transports' instead."),this._transportsWhitelist=n.transports;var i=n.sessionId||8;if("function"==typeof i)this._generateSessionId=i;else{if("number"!=typeof i)throw new TypeError("If sessionId is used in the options, it needs to be a number or a function.");this._generateSessionId=function(){return l.string(i)}}this._server=n.server||l.numberString(1e3);var o=new s(t);if(!o.host||!o.protocol)throw new SyntaxError("The URL '"+t+"' is invalid");if(o.hash)throw new SyntaxError("The URL must not contain a fragment");if("http:"!==o.protocol&&"https:"!==o.protocol)throw new SyntaxError("The URL's scheme must be either 'http:' or 'https:'. '"+o.protocol+"' is not allowed.");var a="https:"===o.protocol;if("https"===g.protocol&&!a)throw new Error("SecurityError: An insecure SockJS connection may not be initiated from a page loaded over HTTPS");e?Array.isArray(e)||(e=[e]):e=[];var u=e.sort();u.forEach(function(t,e){if(!t)throw new SyntaxError("The protocols entry '"+t+"' is invalid.");if(e<u.length-1&&t===u[e+1])throw new SyntaxError("The protocols entry '"+t+"' is duplicated.")});var c=f.getOrigin(g.href);this._origin=c?c.toLowerCase():null,o.set("pathname",o.pathname.replace(/\/+$/,"")),this.url=o.href,this._urlInfo={nullOrigin:!v.hasDomain(),sameOrigin:f.isOriginEqual(this.url,g.href),sameScheme:f.isSchemeEqual(this.url,g.href)},this._ir=new _(this.url,this._urlInfo),this._ir.once("finish",this._receiveInfo.bind(this))}function i(t){return 1e3===t||t>=3e3&&4999>=t}t("./shims");var o,s=t("url-parse"),a=t("inherits"),u=t("json3"),l=t("./utils/random"),c=t("./utils/escape"),f=t("./utils/url"),h=t("./utils/event"),d=t("./utils/transport"),p=t("./utils/object"),v=t("./utils/browser"),m=t("./utils/log"),y=t("./event/event"),b=t("./event/eventtarget"),g=t("./location"),w=t("./event/close"),x=t("./event/trans-message"),_=t("./info-receiver");a(r,b),r.prototype.close=function(t,e){if(t&&!i(t))throw new Error("InvalidAccessError: Invalid code");if(e&&e.length>123)throw new SyntaxError("reason argument has an invalid length");if(this.readyState!==r.CLOSING&&this.readyState!==r.CLOSED){var n=!0;this._close(t||1e3,e||"Normal closure",n)}},r.prototype.send=function(t){if("string"!=typeof t&&(t=""+t),this.readyState===r.CONNECTING)throw new Error("InvalidStateError: The connection has not been established yet");this.readyState===r.OPEN&&this._transport.send(c.quote(t))},r.version=t("./version"),r.CONNECTING=0,r.OPEN=1,r.CLOSING=2,r.CLOSED=3,r.prototype._receiveInfo=function(t,e){if(this._ir=null,!t)return void this._close(1002,"Cannot connect to server");this._rto=this.countRTO(e),this._transUrl=t.base_url?t.base_url:this.url,t=p.extend(t,this._urlInfo);var n=o.filterToEnabled(this._transportsWhitelist,t);this._transports=n.main,this._connect()},r.prototype._connect=function(){for(var t=this._transports.shift();t;t=this._transports.shift()){if(t.needBody&&(!n.document.body||"undefined"!=typeof n.document.readyState&&"complete"!==n.document.readyState&&"interactive"!==n.document.readyState))return this._transports.unshift(t),void h.attachEvent("load",this._connect.bind(this));var e=this._rto*t.roundTrips||5e3;this._transportTimeoutId=setTimeout(this._transportTimeout.bind(this),e);var r=f.addPath(this._transUrl,"/"+this._server+"/"+this._generateSessionId()),i=new t(r,this._transUrl);return i.on("message",this._transportMessage.bind(this)),i.once("close",this._transportClose.bind(this)),i.transportName=t.transportName,void(this._transport=i)}this._close(2e3,"All transports failed",!1)},r.prototype._transportTimeout=function(){this.readyState===r.CONNECTING&&this._transportClose(2007,"Transport timed out")},r.prototype._transportMessage=function(t){var e,n=this,r=t.slice(0,1),i=t.slice(1);switch(r){case"o":return void this._open();case"h":return void this.dispatchEvent(new y("heartbeat"))}if(i)try{e=u.parse(i)}catch(o){}if("undefined"!=typeof e)switch(r){case"a":Array.isArray(e)&&e.forEach(function(t){n.dispatchEvent(new x(t))});break;case"m":this.dispatchEvent(new x(e));break;case"c":Array.isArray(e)&&2===e.length&&this._close(e[0],e[1],!0)}},r.prototype._transportClose=function(t,e){return this._transport&&(this._transport.removeAllListeners(),this._transport=null,this.transport=null),i(t)||2e3===t||this.readyState!==r.CONNECTING?void this._close(t,e):void this._connect()},r.prototype._open=function(){this.readyState===r.CONNECTING?(this._transportTimeoutId&&(clearTimeout(this._transportTimeoutId),this._transportTimeoutId=null),this.readyState=r.OPEN,this.transport=this._transport.transportName,this.dispatchEvent(new y("open"))):this._close(1006,"Server lost session")},r.prototype._close=function(t,e,n){var i=!1;if(this._ir&&(i=!0,this._ir.close(),this._ir=null),this._transport&&(this._transport.close(),this._transport=null,this.transport=null),this.readyState===r.CLOSED)throw new Error("InvalidStateError: SockJS has already been closed");this.readyState=r.CLOSING,setTimeout(function(){this.readyState=r.CLOSED,i&&this.dispatchEvent(new y("error"));var o=new w("close");o.wasClean=n||!1,o.code=t||1e3,o.reason=e,this.dispatchEvent(o),this.onmessage=this.onclose=this.onerror=null}.bind(this),0)},r.prototype.countRTO=function(t){return t>100?4*t:300+t},e.exports=function(e){return o=d(e),t("./iframe-bootstrap")(r,e),r}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./event/close":2,"./event/event":4,"./event/eventtarget":5,"./event/trans-message":6,"./iframe-bootstrap":8,"./info-receiver":12,"./location":13,"./shims":15,"./utils/browser":44,"./utils/escape":45,"./utils/event":46,"./utils/log":48,"./utils/object":49,"./utils/random":50,"./utils/transport":51,"./utils/url":52,"./version":53,debug:void 0,inherits:54,json3:55,"url-parse":56}],15:[function(){"use strict";function t(t){var e=+t;return e!==e?e=0:0!==e&&e!==1/0&&e!==-(1/0)&&(e=(e>0||-1)*Math.floor(Math.abs(e))),e}function e(t){return t>>>0}function n(){}var r,i=Array.prototype,o=Object.prototype,s=Function.prototype,a=String.prototype,u=i.slice,l=o.toString,c=function(t){return"[object Function]"===o.toString.call(t)},f=function(t){return"[object Array]"===l.call(t)},h=function(t){return"[object String]"===l.call(t)},d=Object.defineProperty&&function(){try{return Object.defineProperty({},"x",{}),!0}catch(t){return!1}}();r=d?function(t,e,n,r){!r&&e in t||Object.defineProperty(t,e,{configurable:!0,enumerable:!1,writable:!0,value:n})}:function(t,e,n,r){!r&&e in t||(t[e]=n)};var p=function(t,e,n){for(var i in e)o.hasOwnProperty.call(e,i)&&r(t,i,e[i],n)},v=function(t){if(null==t)throw new TypeError("can't convert "+t+" to object");return Object(t)};p(s,{bind:function(t){var e=this;if(!c(e))throw new TypeError("Function.prototype.bind called on incompatible "+e);for(var r=u.call(arguments,1),i=function(){if(this instanceof l){var n=e.apply(this,r.concat(u.call(arguments)));return Object(n)===n?n:this}return e.apply(t,r.concat(u.call(arguments)))},o=Math.max(0,e.length-r.length),s=[],a=0;o>a;a++)s.push("$"+a);var l=Function("binder","return function ("+s.join(",")+"){ return binder.apply(this, arguments); }")(i);return e.prototype&&(n.prototype=e.prototype,l.prototype=new n,n.prototype=null),l}}),p(Array,{isArray:f});var m=Object("a"),y="a"!==m[0]||!(0 in m),b=function(t){var e=!0,n=!0;return t&&(t.call("foo",function(t,n,r){"object"!=typeof r&&(e=!1)}),t.call([1],function(){n="string"==typeof this},"x")),!!t&&e&&n};p(i,{forEach:function(t){var e=v(this),n=y&&h(this)?this.split(""):e,r=arguments[1],i=-1,o=n.length>>>0;if(!c(t))throw new TypeError;for(;++i<o;)i in n&&t.call(r,n[i],i,e)}},!b(i.forEach));var g=Array.prototype.indexOf&&-1!==[0,1].indexOf(1,2);p(i,{indexOf:function(e){var n=y&&h(this)?this.split(""):v(this),r=n.length>>>0;if(!r)return-1;var i=0;for(arguments.length>1&&(i=t(arguments[1])),i=i>=0?i:Math.max(0,r+i);r>i;i++)if(i in n&&n[i]===e)return i;return-1}},g);var w=a.split;2!=="ab".split(/(?:ab)*/).length||4!==".".split(/(.?)(.?)/).length||"t"==="tesst".split(/(s)*/)[1]||4!=="test".split(/(?:)/,-1).length||"".split(/.?/).length||".".split(/()()/).length>1?!function(){var t=void 0===/()??/.exec("")[1];a.split=function(n,r){var o=this;if(void 0===n&&0===r)return[];if("[object RegExp]"!==l.call(n))return w.call(this,n,r);var s,a,u,c,f=[],h=(n.ignoreCase?"i":"")+(n.multiline?"m":"")+(n.extended?"x":"")+(n.sticky?"y":""),d=0;for(n=new RegExp(n.source,h+"g"),o+="",t||(s=new RegExp("^"+n.source+"$(?!\\s)",h)),r=void 0===r?-1>>>0:e(r);(a=n.exec(o))&&(u=a.index+a[0].length,!(u>d&&(f.push(o.slice(d,a.index)),!t&&a.length>1&&a[0].replace(s,function(){for(var t=1;t<arguments.length-2;t++)void 0===arguments[t]&&(a[t]=void 0)}),a.length>1&&a.index<o.length&&i.push.apply(f,a.slice(1)),c=a[0].length,d=u,f.length>=r)));)n.lastIndex===a.index&&n.lastIndex++;return d===o.length?(c||!n.test(""))&&f.push(""):f.push(o.slice(d)),f.length>r?f.slice(0,r):f}}():"0".split(void 0,0).length&&(a.split=function(t,e){return void 0===t&&0===e?[]:w.call(this,t,e)});var x="	\n\f\r   ᠎             　\u2028\u2029﻿",_="​",E="["+x+"]",j=new RegExp("^"+E+E+"*"),T=new RegExp(E+E+"*$"),S=a.trim&&(x.trim()||!_.trim());p(a,{trim:function(){if(void 0===this||null===this)throw new TypeError("can't convert "+this+" to object");return String(this).replace(j,"").replace(T,"")}},S);var O=a.substr,C="".substr&&"b"!=="0b".substr(-1);p(a,{substr:function(t,e){return O.call(this,0>t&&(t=this.length+t)<0?0:t,e)}},C)},{}],16:[function(t,e){"use strict";e.exports=[t("./transport/websocket"),t("./transport/xhr-streaming"),t("./transport/xdr-streaming"),t("./transport/eventsource"),t("./transport/lib/iframe-wrap")(t("./transport/eventsource")),t("./transport/htmlfile"),t("./transport/lib/iframe-wrap")(t("./transport/htmlfile")),t("./transport/xhr-polling"),t("./transport/xdr-polling"),t("./transport/lib/iframe-wrap")(t("./transport/xhr-polling")),t("./transport/jsonp-polling")]},{"./transport/eventsource":20,"./transport/htmlfile":21,"./transport/jsonp-polling":23,"./transport/lib/iframe-wrap":26,"./transport/websocket":38,"./transport/xdr-polling":39,"./transport/xdr-streaming":40,"./transport/xhr-polling":41,"./transport/xhr-streaming":42}],17:[function(t,e){(function(n){"use strict";function r(t,e,n,r){var o=this;i.call(this),setTimeout(function(){o._start(t,e,n,r)},0)}var i=t("events").EventEmitter,o=t("inherits"),s=t("../../utils/event"),a=t("../../utils/url"),u=n.XMLHttpRequest;o(r,i),r.prototype._start=function(t,e,n,i){var o=this;try{this.xhr=new u}catch(l){}if(!this.xhr)return this.emit("finish",0,"no xhr support"),void this._cleanup();e=a.addQuery(e,"t="+ +new Date),this.unloadRef=s.unloadAdd(function(){o._cleanup(!0)});try{this.xhr.open(t,e,!0),this.timeout&&"timeout"in this.xhr&&(this.xhr.timeout=this.timeout,this.xhr.ontimeout=function(){o.emit("finish",0,""),o._cleanup(!1)})}catch(c){return this.emit("finish",0,""),void this._cleanup(!1)}if(i&&i.noCredentials||!r.supportsCORS||(this.xhr.withCredentials="true"),i&&i.headers)for(var f in i.headers)this.xhr.setRequestHeader(f,i.headers[f]);this.xhr.onreadystatechange=function(){if(o.xhr){var t,e,n=o.xhr;switch(n.readyState){case 3:try{e=n.status,t=n.responseText}catch(r){}1223===e&&(e=204),200===e&&t&&t.length>0&&o.emit("chunk",e,t);break;case 4:e=n.status,1223===e&&(e=204),(12005===e||12029===e)&&(e=0),o.emit("finish",e,n.responseText),o._cleanup(!1)}}};try{o.xhr.send(n)}catch(c){o.emit("finish",0,""),o._cleanup(!1)}},r.prototype._cleanup=function(t){if(this.xhr){if(this.removeAllListeners(),s.unloadDel(this.unloadRef),this.xhr.onreadystatechange=function(){},this.xhr.ontimeout&&(this.xhr.ontimeout=null),t)try{this.xhr.abort()}catch(e){}this.unloadRef=this.xhr=null}},r.prototype.close=function(){this._cleanup(!0)},r.enabled=!!u;var l=["Active"].concat("Object").join("X");!r.enabled&&l in n&&(u=function(){try{return new n[l]("Microsoft.XMLHTTP")}catch(t){return null}},r.enabled=!!new u);var c=!1;try{c="withCredentials"in new u}catch(f){}r.supportsCORS=c,e.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../utils/event":46,"../../utils/url":52,debug:void 0,events:3,inherits:54}],18:[function(t,e){(function(t){e.exports=t.EventSource}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],19:[function(t,e){(function(t){e.exports=t.WebSocket||t.MozWebSocket}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],20:[function(t,e){"use strict";function n(t){if(!n.enabled())throw new Error("Transport created when disabled");i.call(this,t,"/eventsource",o,s)}var r=t("inherits"),i=t("./lib/ajax-based"),o=t("./receiver/eventsource"),s=t("./sender/xhr-cors"),a=t("eventsource");r(n,i),n.enabled=function(){return!!a},n.transportName="eventsource",n.roundTrips=2,e.exports=n},{"./lib/ajax-based":24,"./receiver/eventsource":29,"./sender/xhr-cors":35,eventsource:18,inherits:54}],21:[function(t,e){"use strict";function n(t){if(!i.enabled)throw new Error("Transport created when disabled");s.call(this,t,"/htmlfile",i,o)}var r=t("inherits"),i=t("./receiver/htmlfile"),o=t("./sender/xhr-local"),s=t("./lib/ajax-based");r(n,s),n.enabled=function(t){return i.enabled&&t.sameOrigin},n.transportName="htmlfile",n.roundTrips=2,e.exports=n},{"./lib/ajax-based":24,"./receiver/htmlfile":30,"./sender/xhr-local":37,inherits:54}],22:[function(t,e){"use strict";function n(t,e,r){if(!n.enabled())throw new Error("Transport created when disabled");o.call(this);var i=this;this.origin=a.getOrigin(r),this.baseUrl=r,this.transUrl=e,this.transport=t,this.windowId=c.string(8);var s=a.addPath(r,"/iframe.html")+"#"+this.windowId;this.iframeObj=u.createIframe(s,function(t){i.emit("close",1006,"Unable to load an iframe ("+t+")"),i.close()}),this.onmessageCallback=this._message.bind(this),l.attachEvent("message",this.onmessageCallback)}var r=t("inherits"),i=t("json3"),o=t("events").EventEmitter,s=t("../version"),a=t("../utils/url"),u=t("../utils/iframe"),l=t("../utils/event"),c=t("../utils/random");r(n,o),n.prototype.close=function(){if(this.removeAllListeners(),this.iframeObj){l.detachEvent("message",this.onmessageCallback);try{this.postMessage("c")}catch(t){}this.iframeObj.cleanup(),this.iframeObj=null,this.onmessageCallback=this.iframeObj=null}},n.prototype._message=function(t){if(a.isOriginEqual(t.origin,this.origin)){var e;try{e=i.parse(t.data)}catch(n){return}if(e.windowId===this.windowId)switch(e.type){case"s":this.iframeObj.loaded(),this.postMessage("s",i.stringify([s,this.transport,this.transUrl,this.baseUrl]));break;case"t":this.emit("message",e.data);break;case"c":var r;try{r=i.parse(e.data)}catch(n){return}this.emit("close",r[0],r[1]),this.close()}}},n.prototype.postMessage=function(t,e){this.iframeObj.post(i.stringify({windowId:this.windowId,type:t,data:e||""}),this.origin)},n.prototype.send=function(t){this.postMessage("m",t)},n.enabled=function(){return u.iframeEnabled},n.transportName="iframe",n.roundTrips=2,e.exports=n},{"../utils/event":46,"../utils/iframe":47,"../utils/random":50,"../utils/url":52,"../version":53,debug:void 0,events:3,inherits:54,json3:55}],23:[function(t,e){(function(n){"use strict";function r(t){if(!r.enabled())throw new Error("Transport created when disabled");o.call(this,t,"/jsonp",a,s)}var i=t("inherits"),o=t("./lib/sender-receiver"),s=t("./receiver/jsonp"),a=t("./sender/jsonp");i(r,o),r.enabled=function(){return!!n.document},r.transportName="jsonp-polling",r.roundTrips=1,r.needBody=!0,e.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./lib/sender-receiver":28,"./receiver/jsonp":31,"./sender/jsonp":33,inherits:54}],24:[function(t,e){"use strict";function n(t){return function(e,n,r){var i={};"string"==typeof n&&(i.headers={"Content-type":"text/plain"});var s=o.addPath(e,"/xhr_send"),a=new t("POST",s,n,i);return a.once("finish",function(t){return a=null,200!==t&&204!==t?r(new Error("http status "+t)):void r()}),function(){a.close(),a=null;var t=new Error("Aborted");t.code=1e3,r(t)}}}function r(t,e,r,i){s.call(this,t,e,n(i),r,i)}var i=t("inherits"),o=t("../../utils/url"),s=t("./sender-receiver");i(r,s),e.exports=r},{"../../utils/url":52,"./sender-receiver":28,debug:void 0,inherits:54}],25:[function(t,e){"use strict";function n(t,e){i.call(this),this.sendBuffer=[],this.sender=e,this.url=t}var r=t("inherits"),i=t("events").EventEmitter;r(n,i),n.prototype.send=function(t){this.sendBuffer.push(t),this.sendStop||this.sendSchedule()},n.prototype.sendScheduleWait=function(){var t,e=this;this.sendStop=function(){e.sendStop=null,clearTimeout(t)},t=setTimeout(function(){e.sendStop=null,e.sendSchedule()},25)},n.prototype.sendSchedule=function(){var t=this;if(this.sendBuffer.length>0){var e="["+this.sendBuffer.join(",")+"]";this.sendStop=this.sender(this.url,e,function(e){t.sendStop=null,e?(t.emit("close",e.code||1006,"Sending error: "+e),t._cleanup()):t.sendScheduleWait()}),this.sendBuffer=[]}},n.prototype._cleanup=function(){this.removeAllListeners()},n.prototype.stop=function(){this._cleanup(),this.sendStop&&(this.sendStop(),this.sendStop=null)},e.exports=n},{debug:void 0,events:3,inherits:54}],26:[function(t,e){(function(n){"use strict";var r=t("inherits"),i=t("../iframe"),o=t("../../utils/object");e.exports=function(t){function e(e,n){i.call(this,t.transportName,e,n)}return r(e,i),e.enabled=function(e,r){if(!n.document)return!1;var s=o.extend({},r);return s.sameOrigin=!0,t.enabled(s)&&i.enabled()},e.transportName="iframe-"+t.transportName,e.needBody=!0,e.roundTrips=i.roundTrips+t.roundTrips-1,e.facadeTransport=t,e}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../utils/object":49,"../iframe":22,inherits:54}],27:[function(t,e){"use strict";function n(t,e,n){i.call(this),this.Receiver=t,this.receiveUrl=e,this.AjaxObject=n,this._scheduleReceiver()}var r=t("inherits"),i=t("events").EventEmitter;r(n,i),n.prototype._scheduleReceiver=function(){var t=this,e=this.poll=new this.Receiver(this.receiveUrl,this.AjaxObject);e.on("message",function(e){t.emit("message",e)}),e.once("close",function(n,r){t.poll=e=null,t.pollIsClosing||("network"===r?t._scheduleReceiver():(t.emit("close",n||1006,r),t.removeAllListeners()))})},n.prototype.abort=function(){this.removeAllListeners(),this.pollIsClosing=!0,this.poll&&this.poll.abort()},e.exports=n},{debug:void 0,events:3,inherits:54}],28:[function(t,e){"use strict";function n(t,e,n,r,a){var u=i.addPath(t,e),l=this;o.call(this,t,n),this.poll=new s(r,u,a),this.poll.on("message",function(t){l.emit("message",t)}),this.poll.once("close",function(t,e){l.poll=null,l.emit("close",t,e),l.close()})}var r=t("inherits"),i=t("../../utils/url"),o=t("./buffered-sender"),s=t("./polling");r(n,o),n.prototype.close=function(){this.removeAllListeners(),this.poll&&(this.poll.abort(),this.poll=null),this.stop()},e.exports=n},{"../../utils/url":52,"./buffered-sender":25,"./polling":27,debug:void 0,inherits:54}],29:[function(t,e){"use strict";function n(t){i.call(this);var e=this,n=this.es=new o(t);n.onmessage=function(t){e.emit("message",decodeURI(t.data))},n.onerror=function(t){var r=2!==n.readyState?"network":"permanent";e._cleanup(),e._close(r)}}var r=t("inherits"),i=t("events").EventEmitter,o=t("eventsource");r(n,i),n.prototype.abort=function(){this._cleanup(),this._close("user")},n.prototype._cleanup=function(){var t=this.es;t&&(t.onmessage=t.onerror=null,t.close(),this.es=null)},n.prototype._close=function(t){var e=this;setTimeout(function(){e.emit("close",null,t),e.removeAllListeners()},200)},e.exports=n},{debug:void 0,events:3,eventsource:18,inherits:54}],30:[function(t,e){(function(n){"use strict";function r(t){a.call(this);var e=this;o.polluteGlobalNamespace(),this.id="a"+u.string(6),t=s.addQuery(t,"c="+decodeURIComponent(o.WPrefix+"."+this.id));var i=r.htmlfileEnabled?o.createHtmlfile:o.createIframe;n[o.WPrefix][this.id]={start:function(){e.iframeObj.loaded()},message:function(t){e.emit("message",t)},stop:function(){e._cleanup(),e._close("network")}},this.iframeObj=i(t,function(){e._cleanup(),e._close("permanent")})}var i=t("inherits"),o=t("../../utils/iframe"),s=t("../../utils/url"),a=t("events").EventEmitter,u=t("../../utils/random");i(r,a),r.prototype.abort=function(){this._cleanup(),this._close("user")},r.prototype._cleanup=function(){this.iframeObj&&(this.iframeObj.cleanup(),this.iframeObj=null),delete n[o.WPrefix][this.id]},r.prototype._close=function(t){this.emit("close",null,t),this.removeAllListeners()},r.htmlfileEnabled=!1;var l=["Active"].concat("Object").join("X");if(l in n)try{r.htmlfileEnabled=!!new n[l]("htmlfile")}catch(c){}r.enabled=r.htmlfileEnabled||o.iframeEnabled,e.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../utils/iframe":47,"../../utils/random":50,"../../utils/url":52,debug:void 0,events:3,inherits:54}],31:[function(t,e){(function(n){"use strict";function r(t){var e=this;l.call(this),i.polluteGlobalNamespace(),this.id="a"+o.string(6);var s=a.addQuery(t,"c="+encodeURIComponent(i.WPrefix+"."+this.id));n[i.WPrefix][this.id]=this._callback.bind(this),this._createScript(s),this.timeoutId=setTimeout(function(){e._abort(new Error("JSONP script loaded abnormally (timeout)"))},r.timeout)}var i=t("../../utils/iframe"),o=t("../../utils/random"),s=t("../../utils/browser"),a=t("../../utils/url"),u=t("inherits"),l=t("events").EventEmitter;u(r,l),r.prototype.abort=function(){if(n[i.WPrefix][this.id]){var t=new Error("JSONP user aborted read");t.code=1e3,this._abort(t)}},r.timeout=35e3,r.scriptErrorTimeout=1e3,r.prototype._callback=function(t){this._cleanup(),this.aborting||(t&&this.emit("message",t),this.emit("close",null,"network"),this.removeAllListeners())},r.prototype._abort=function(t){this._cleanup(),this.aborting=!0,this.emit("close",t.code,t.message),this.removeAllListeners()},r.prototype._cleanup=function(){if(clearTimeout(this.timeoutId),this.script2&&(this.script2.parentNode.removeChild(this.script2),this.script2=null),this.script){var t=this.script;t.parentNode.removeChild(t),t.onreadystatechange=t.onerror=t.onload=t.onclick=null,this.script=null}delete n[i.WPrefix][this.id]},r.prototype._scriptError=function(){var t=this;this.errorTimer||(this.errorTimer=setTimeout(function(){t.loadedOkay||t._abort(new Error("JSONP script loaded abnormally (onerror)"))},r.scriptErrorTimeout))},r.prototype._createScript=function(t){var e,r=this,i=this.script=n.document.createElement("script");if(i.id="a"+o.string(8),i.src=t,i.type="text/javascript",i.charset="UTF-8",i.onerror=this._scriptError.bind(this),i.onload=function(){r._abort(new Error("JSONP script loaded abnormally (onload)"))},i.onreadystatechange=function(){if(/loaded|closed/.test(i.readyState)){if(i&&i.htmlFor&&i.onclick){r.loadedOkay=!0;try{i.onclick()}catch(t){}}i&&r._abort(new Error("JSONP script loaded abnormally (onreadystatechange)"))}},"undefined"==typeof i.async&&n.document.attachEvent)if(s.isOpera())e=this.script2=n.document.createElement("script"),e.text="try{var a = document.getElementById('"+i.id+"'); if(a)a.onerror();}catch(x){};",i.async=e.async=!1;
        else{try{i.htmlFor=i.id,i.event="onclick"}catch(a){}i.async=!0}"undefined"!=typeof i.async&&(i.async=!0);var u=n.document.getElementsByTagName("head")[0];u.insertBefore(i,u.firstChild),e&&u.insertBefore(e,u.firstChild)},e.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../utils/browser":44,"../../utils/iframe":47,"../../utils/random":50,"../../utils/url":52,debug:void 0,events:3,inherits:54}],32:[function(t,e){"use strict";function n(t,e){i.call(this);var n=this;this.bufferPosition=0,this.xo=new e("POST",t,null),this.xo.on("chunk",this._chunkHandler.bind(this)),this.xo.once("finish",function(t,e){n._chunkHandler(t,e),n.xo=null;var r=200===t?"network":"permanent";n.emit("close",null,r),n._cleanup()})}var r=t("inherits"),i=t("events").EventEmitter;r(n,i),n.prototype._chunkHandler=function(t,e){if(200===t&&e)for(var n=-1;;this.bufferPosition+=n+1){var r=e.slice(this.bufferPosition);if(n=r.indexOf("\n"),-1===n)break;var i=r.slice(0,n);i&&this.emit("message",i)}},n.prototype._cleanup=function(){this.removeAllListeners()},n.prototype.abort=function(){this.xo&&(this.xo.close(),this.emit("close",null,"user"),this.xo=null),this._cleanup()},e.exports=n},{debug:void 0,events:3,inherits:54}],33:[function(t,e){(function(n){"use strict";function r(t){try{return n.document.createElement('<iframe name="'+t+'">')}catch(e){var r=n.document.createElement("iframe");return r.name=t,r}}function i(){o=n.document.createElement("form"),o.style.display="none",o.style.position="absolute",o.method="POST",o.enctype="application/x-www-form-urlencoded",o.acceptCharset="UTF-8",s=n.document.createElement("textarea"),s.name="d",o.appendChild(s),n.document.body.appendChild(o)}var o,s,a=t("../../utils/random"),u=t("../../utils/url");e.exports=function(t,e,n){o||i();var l="a"+a.string(8);o.target=l,o.action=u.addQuery(u.addPath(t,"/jsonp_send"),"i="+l);var c=r(l);c.id=l,c.style.display="none",o.appendChild(c);try{s.value=e}catch(f){}o.submit();var h=function(t){c.onerror&&(c.onreadystatechange=c.onerror=c.onload=null,setTimeout(function(){c.parentNode.removeChild(c),c=null},500),s.value="",n(t))};return c.onerror=function(){h()},c.onload=function(){h()},c.onreadystatechange=function(t){"complete"===c.readyState&&h()},function(){h(new Error("Aborted"))}}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../utils/random":50,"../../utils/url":52,debug:void 0}],34:[function(t,e){(function(n){"use strict";function r(t,e,n){var r=this;i.call(this),setTimeout(function(){r._start(t,e,n)},0)}var i=t("events").EventEmitter,o=t("inherits"),s=t("../../utils/event"),a=t("../../utils/browser"),u=t("../../utils/url");o(r,i),r.prototype._start=function(t,e,r){var i=this,o=new n.XDomainRequest;e=u.addQuery(e,"t="+ +new Date),o.onerror=function(){i._error()},o.ontimeout=function(){i._error()},o.onprogress=function(){i.emit("chunk",200,o.responseText)},o.onload=function(){i.emit("finish",200,o.responseText),i._cleanup(!1)},this.xdr=o,this.unloadRef=s.unloadAdd(function(){i._cleanup(!0)});try{this.xdr.open(t,e),this.timeout&&(this.xdr.timeout=this.timeout),this.xdr.send(r)}catch(a){this._error()}},r.prototype._error=function(){this.emit("finish",0,""),this._cleanup(!1)},r.prototype._cleanup=function(t){if(this.xdr){if(this.removeAllListeners(),s.unloadDel(this.unloadRef),this.xdr.ontimeout=this.xdr.onerror=this.xdr.onprogress=this.xdr.onload=null,t)try{this.xdr.abort()}catch(e){}this.unloadRef=this.xdr=null}},r.prototype.close=function(){this._cleanup(!0)},r.enabled=!(!n.XDomainRequest||!a.hasDomain()),e.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../../utils/browser":44,"../../utils/event":46,"../../utils/url":52,debug:void 0,events:3,inherits:54}],35:[function(t,e){"use strict";function n(t,e,n,r){i.call(this,t,e,n,r)}var r=t("inherits"),i=t("../driver/xhr");r(n,i),n.enabled=i.enabled&&i.supportsCORS,e.exports=n},{"../driver/xhr":17,inherits:54}],36:[function(t,e){"use strict";function n(){var t=this;r.call(this),this.to=setTimeout(function(){t.emit("finish",200,"{}")},n.timeout)}var r=t("events").EventEmitter,i=t("inherits");i(n,r),n.prototype.close=function(){clearTimeout(this.to)},n.timeout=2e3,e.exports=n},{events:3,inherits:54}],37:[function(t,e){"use strict";function n(t,e,n){i.call(this,t,e,n,{noCredentials:!0})}var r=t("inherits"),i=t("../driver/xhr");r(n,i),n.enabled=i.enabled,e.exports=n},{"../driver/xhr":17,inherits:54}],38:[function(t,e){"use strict";function n(t){if(!n.enabled())throw new Error("Transport created when disabled");s.call(this);var e=this,o=i.addPath(t,"/websocket");o="https"===o.slice(0,5)?"wss"+o.slice(5):"ws"+o.slice(4),this.url=o,this.ws=new a(this.url),this.ws.onmessage=function(t){e.emit("message",t.data)},this.unloadRef=r.unloadAdd(function(){e.ws.close()}),this.ws.onclose=function(t){e.emit("close",t.code,t.reason),e._cleanup()},this.ws.onerror=function(t){e.emit("close",1006,"WebSocket connection broken"),e._cleanup()}}var r=t("../utils/event"),i=t("../utils/url"),o=t("inherits"),s=t("events").EventEmitter,a=t("./driver/websocket");o(n,s),n.prototype.send=function(t){var e="["+t+"]";this.ws.send(e)},n.prototype.close=function(){this.ws&&this.ws.close(),this._cleanup()},n.prototype._cleanup=function(){var t=this.ws;t&&(t.onmessage=t.onclose=t.onerror=null),r.unloadDel(this.unloadRef),this.unloadRef=this.ws=null,this.removeAllListeners()},n.enabled=function(){return!!a},n.transportName="websocket",n.roundTrips=2,e.exports=n},{"../utils/event":46,"../utils/url":52,"./driver/websocket":19,debug:void 0,events:3,inherits:54}],39:[function(t,e){"use strict";function n(t){if(!a.enabled)throw new Error("Transport created when disabled");i.call(this,t,"/xhr",s,a)}var r=t("inherits"),i=t("./lib/ajax-based"),o=t("./xdr-streaming"),s=t("./receiver/xhr"),a=t("./sender/xdr");r(n,i),n.enabled=o.enabled,n.transportName="xdr-polling",n.roundTrips=2,e.exports=n},{"./lib/ajax-based":24,"./receiver/xhr":32,"./sender/xdr":34,"./xdr-streaming":40,inherits:54}],40:[function(t,e){"use strict";function n(t){if(!s.enabled)throw new Error("Transport created when disabled");i.call(this,t,"/xhr_streaming",o,s)}var r=t("inherits"),i=t("./lib/ajax-based"),o=t("./receiver/xhr"),s=t("./sender/xdr");r(n,i),n.enabled=function(t){return t.cookie_needed||t.nullOrigin?!1:s.enabled&&t.sameScheme},n.transportName="xdr-streaming",n.roundTrips=2,e.exports=n},{"./lib/ajax-based":24,"./receiver/xhr":32,"./sender/xdr":34,inherits:54}],41:[function(t,e){"use strict";function n(t){if(!a.enabled&&!s.enabled)throw new Error("Transport created when disabled");i.call(this,t,"/xhr",o,s)}var r=t("inherits"),i=t("./lib/ajax-based"),o=t("./receiver/xhr"),s=t("./sender/xhr-cors"),a=t("./sender/xhr-local");r(n,i),n.enabled=function(t){return t.nullOrigin?!1:a.enabled&&t.sameOrigin?!0:s.enabled},n.transportName="xhr-polling",n.roundTrips=2,e.exports=n},{"./lib/ajax-based":24,"./receiver/xhr":32,"./sender/xhr-cors":35,"./sender/xhr-local":37,inherits:54}],42:[function(t,e){(function(n){"use strict";function r(t){if(!u.enabled&&!a.enabled)throw new Error("Transport created when disabled");o.call(this,t,"/xhr_streaming",s,a)}var i=t("inherits"),o=t("./lib/ajax-based"),s=t("./receiver/xhr"),a=t("./sender/xhr-cors"),u=t("./sender/xhr-local"),l=t("../utils/browser");i(r,o),r.enabled=function(t){return t.nullOrigin?!1:l.isOpera()?!1:a.enabled},r.transportName="xhr-streaming",r.roundTrips=2,r.needBody=!!n.document,e.exports=r}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"../utils/browser":44,"./lib/ajax-based":24,"./receiver/xhr":32,"./sender/xhr-cors":35,"./sender/xhr-local":37,inherits:54}],43:[function(t,e){(function(t){"use strict";e.exports.randomBytes=t.crypto&&t.crypto.getRandomValues?function(e){var n=new Uint8Array(e);return t.crypto.getRandomValues(n),n}:function(t){for(var e=new Array(t),n=0;t>n;n++)e[n]=Math.floor(256*Math.random());return e}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],44:[function(t,e){(function(t){"use strict";e.exports={isOpera:function(){return t.navigator&&/opera/i.test(t.navigator.userAgent)},isKonqueror:function(){return t.navigator&&/konqueror/i.test(t.navigator.userAgent)},hasDomain:function(){if(!t.document)return!0;try{return!!t.document.domain}catch(e){return!1}}}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],45:[function(t,e){"use strict";var n,r=t("json3"),i=/[\x00-\x1f\ud800-\udfff\ufffe\uffff\u0300-\u0333\u033d-\u0346\u034a-\u034c\u0350-\u0352\u0357-\u0358\u035c-\u0362\u0374\u037e\u0387\u0591-\u05af\u05c4\u0610-\u0617\u0653-\u0654\u0657-\u065b\u065d-\u065e\u06df-\u06e2\u06eb-\u06ec\u0730\u0732-\u0733\u0735-\u0736\u073a\u073d\u073f-\u0741\u0743\u0745\u0747\u07eb-\u07f1\u0951\u0958-\u095f\u09dc-\u09dd\u09df\u0a33\u0a36\u0a59-\u0a5b\u0a5e\u0b5c-\u0b5d\u0e38-\u0e39\u0f43\u0f4d\u0f52\u0f57\u0f5c\u0f69\u0f72-\u0f76\u0f78\u0f80-\u0f83\u0f93\u0f9d\u0fa2\u0fa7\u0fac\u0fb9\u1939-\u193a\u1a17\u1b6b\u1cda-\u1cdb\u1dc0-\u1dcf\u1dfc\u1dfe\u1f71\u1f73\u1f75\u1f77\u1f79\u1f7b\u1f7d\u1fbb\u1fbe\u1fc9\u1fcb\u1fd3\u1fdb\u1fe3\u1feb\u1fee-\u1fef\u1ff9\u1ffb\u1ffd\u2000-\u2001\u20d0-\u20d1\u20d4-\u20d7\u20e7-\u20e9\u2126\u212a-\u212b\u2329-\u232a\u2adc\u302b-\u302c\uaab2-\uaab3\uf900-\ufa0d\ufa10\ufa12\ufa15-\ufa1e\ufa20\ufa22\ufa25-\ufa26\ufa2a-\ufa2d\ufa30-\ufa6d\ufa70-\ufad9\ufb1d\ufb1f\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40-\ufb41\ufb43-\ufb44\ufb46-\ufb4e\ufff0-\uffff]/g,o=function(t){var e,n={},r=[];for(e=0;65536>e;e++)r.push(String.fromCharCode(e));return t.lastIndex=0,r.join("").replace(t,function(t){return n[t]="\\u"+("0000"+t.charCodeAt(0).toString(16)).slice(-4),""}),t.lastIndex=0,n};e.exports={quote:function(t){var e=r.stringify(t);return i.lastIndex=0,i.test(e)?(n||(n=o(i)),e.replace(i,function(t){return n[t]})):e}}},{json3:55}],46:[function(t,e){(function(n){"use strict";var r=t("./random"),i={},o=!1,s=n.chrome&&n.chrome.app&&n.chrome.app.runtime;e.exports={attachEvent:function(t,e){"undefined"!=typeof n.addEventListener?n.addEventListener(t,e,!1):n.document&&n.attachEvent&&(n.document.attachEvent("on"+t,e),n.attachEvent("on"+t,e))},detachEvent:function(t,e){"undefined"!=typeof n.addEventListener?n.removeEventListener(t,e,!1):n.document&&n.detachEvent&&(n.document.detachEvent("on"+t,e),n.detachEvent("on"+t,e))},unloadAdd:function(t){if(s)return null;var e=r.string(8);return i[e]=t,o&&setTimeout(this.triggerUnloadCallbacks,0),e},unloadDel:function(t){t in i&&delete i[t]},triggerUnloadCallbacks:function(){for(var t in i)i[t](),delete i[t]}};var a=function(){o||(o=!0,e.exports.triggerUnloadCallbacks())};s||e.exports.attachEvent("unload",a)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./random":50}],47:[function(t,e){(function(n){"use strict";var r=t("./event"),i=t("json3"),o=t("./browser");e.exports={WPrefix:"_jp",currentWindowId:null,polluteGlobalNamespace:function(){e.exports.WPrefix in n||(n[e.exports.WPrefix]={})},postMessage:function(t,r){n.parent!==n&&n.parent.postMessage(i.stringify({windowId:e.exports.currentWindowId,type:t,data:r||""}),"*")},createIframe:function(t,e){var i,o,s=n.document.createElement("iframe"),a=function(){clearTimeout(i);try{s.onload=null}catch(t){}s.onerror=null},u=function(){s&&(a(),setTimeout(function(){s&&s.parentNode.removeChild(s),s=null},0),r.unloadDel(o))},l=function(t){s&&(u(),e(t))},c=function(t,e){try{setTimeout(function(){s&&s.contentWindow&&s.contentWindow.postMessage(t,e)},0)}catch(n){}};return s.src=t,s.style.display="none",s.style.position="absolute",s.onerror=function(){l("onerror")},s.onload=function(){clearTimeout(i),i=setTimeout(function(){l("onload timeout")},2e3)},n.document.body.appendChild(s),i=setTimeout(function(){l("timeout")},15e3),o=r.unloadAdd(u),{post:c,cleanup:u,loaded:a}},createHtmlfile:function(t,i){var o,s,a,u=["Active"].concat("Object").join("X"),l=new n[u]("htmlfile"),c=function(){clearTimeout(o),a.onerror=null},f=function(){l&&(c(),r.unloadDel(s),a.parentNode.removeChild(a),a=l=null,CollectGarbage())},h=function(t){l&&(f(),i(t))},d=function(t,e){try{setTimeout(function(){a&&a.contentWindow&&a.contentWindow.postMessage(t,e)},0)}catch(n){}};l.open(),l.write('<html><script>document.domain="'+n.document.domain+'";</script></html>'),l.close(),l.parentWindow[e.exports.WPrefix]=n[e.exports.WPrefix];var p=l.createElement("div");return l.body.appendChild(p),a=l.createElement("iframe"),p.appendChild(a),a.src=t,a.onerror=function(){h("onerror")},o=setTimeout(function(){h("timeout")},15e3),s=r.unloadAdd(f),{post:d,cleanup:f,loaded:c}}},e.exports.iframeEnabled=!1,n.document&&(e.exports.iframeEnabled=("function"==typeof n.postMessage||"object"==typeof n.postMessage)&&!o.isKonqueror())}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./browser":44,"./event":46,debug:void 0,json3:55}],48:[function(t,e){(function(t){"use strict";var n={};["log","debug","warn"].forEach(function(e){var r=t.console&&t.console[e]&&t.console[e].apply;n[e]=r?function(){return t.console[e].apply(t.console,arguments)}:"log"===e?function(){}:n.log}),e.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],49:[function(t,e){"use strict";e.exports={isObject:function(t){var e=typeof t;return"function"===e||"object"===e&&!!t},extend:function(t){if(!this.isObject(t))return t;for(var e,n,r=1,i=arguments.length;i>r;r++){e=arguments[r];for(n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])}return t}}},{}],50:[function(t,e){"use strict";var n=t("crypto"),r="abcdefghijklmnopqrstuvwxyz012345";e.exports={string:function(t){for(var e=r.length,i=n.randomBytes(t),o=[],s=0;t>s;s++)o.push(r.substr(i[s]%e,1));return o.join("")},number:function(t){return Math.floor(Math.random()*t)},numberString:function(t){var e=(""+(t-1)).length,n=new Array(e+1).join("0");return(n+this.number(t)).slice(-e)}}},{crypto:43}],51:[function(t,e){"use strict";e.exports=function(t){return{filterToEnabled:function(e,n){var r={main:[],facade:[]};return e?"string"==typeof e&&(e=[e]):e=[],t.forEach(function(t){t&&("websocket"!==t.transportName||n.websocket!==!1)&&(e.length&&-1===e.indexOf(t.transportName)||t.enabled(n)&&(r.main.push(t),t.facadeTransport&&r.facade.push(t.facadeTransport)))}),r}}}},{debug:void 0}],52:[function(t,e){"use strict";var n=t("url-parse");e.exports={getOrigin:function(t){if(!t)return null;var e=new n(t);if("file:"===e.protocol)return null;var r=e.port;return r||(r="https:"===e.protocol?"443":"80"),e.protocol+"//"+e.hostname+":"+r},isOriginEqual:function(t,e){var n=this.getOrigin(t)===this.getOrigin(e);return n},isSchemeEqual:function(t,e){return t.split(":")[0]===e.split(":")[0]},addPath:function(t,e){var n=t.split("?");return n[0]+e+(n[1]?"?"+n[1]:"")},addQuery:function(t,e){return t+(-1===t.indexOf("?")?"?"+e:"&"+e)}}},{debug:void 0,"url-parse":56}],53:[function(t,e){e.exports="1.0.3"},{}],54:[function(t,e){e.exports="function"==typeof Object.create?function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:function(t,e){t.super_=e;var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},{}],55:[function(e,n,r){(function(e){(function(){function i(t,e){function n(t){if(n[t]!==m)return n[t];var i;if("bug-string-char-index"==t)i="a"!="a"[0];else if("json"==t)i=n("json-stringify")&&n("json-parse");else{var s,a='{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';if("json-stringify"==t){var u=e.stringify,c="function"==typeof u&&g;if(c){(s=function(){return 1}).toJSON=s;try{c="0"===u(0)&&"0"===u(new r)&&'""'==u(new o)&&u(b)===m&&u(m)===m&&u()===m&&"1"===u(s)&&"[1]"==u([s])&&"[null]"==u([m])&&"null"==u(null)&&"[null,null,null]"==u([m,b,null])&&u({a:[s,!0,!1,null,"\x00\b\n\f\r	"]})==a&&"1"===u(null,s)&&"[\n 1,\n 2\n]"==u([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==u(new l(-864e13))&&'"+275760-09-13T00:00:00.000Z"'==u(new l(864e13))&&'"-000001-01-01T00:00:00.000Z"'==u(new l(-621987552e5))&&'"1969-12-31T23:59:59.999Z"'==u(new l(-1))}catch(f){c=!1}}i=c}if("json-parse"==t){var h=e.parse;if("function"==typeof h)try{if(0===h("0")&&!h(!1)){s=h(a);var d=5==s.a.length&&1===s.a[0];if(d){try{d=!h('"	"')}catch(f){}if(d)try{d=1!==h("01")}catch(f){}if(d)try{d=1!==h("1.")}catch(f){}}}}catch(f){d=!1}i=d}}return n[t]=!!i}t||(t=u.Object()),e||(e=u.Object());var r=t.Number||u.Number,o=t.String||u.String,a=t.Object||u.Object,l=t.Date||u.Date,c=t.SyntaxError||u.SyntaxError,f=t.TypeError||u.TypeError,h=t.Math||u.Math,d=t.JSON||u.JSON;"object"==typeof d&&d&&(e.stringify=d.stringify,e.parse=d.parse);var p,v,m,y=a.prototype,b=y.toString,g=new l(-0xc782b5b800cec);try{g=-109252==g.getUTCFullYear()&&0===g.getUTCMonth()&&1===g.getUTCDate()&&10==g.getUTCHours()&&37==g.getUTCMinutes()&&6==g.getUTCSeconds()&&708==g.getUTCMilliseconds()}catch(w){}if(!n("json")){var x="[object Function]",_="[object Date]",E="[object Number]",j="[object String]",T="[object Array]",S="[object Boolean]",O=n("bug-string-char-index");if(!g)var C=h.floor,A=[0,31,59,90,120,151,181,212,243,273,304,334],N=function(t,e){return A[e]+365*(t-1970)+C((t-1969+(e=+(e>1)))/4)-C((t-1901+e)/100)+C((t-1601+e)/400)};if((p=y.hasOwnProperty)||(p=function(t){var e,n={};return(n.__proto__=null,n.__proto__={toString:1},n).toString!=b?p=function(t){var e=this.__proto__,n=t in(this.__proto__=null,this);return this.__proto__=e,n}:(e=n.constructor,p=function(t){var n=(this.constructor||e).prototype;return t in this&&!(t in n&&this[t]===n[t])}),n=null,p.call(this,t)}),v=function(t,e){var n,r,i,o=0;(n=function(){this.valueOf=0}).prototype.valueOf=0,r=new n;for(i in r)p.call(r,i)&&o++;return n=r=null,o?v=2==o?function(t,e){var n,r={},i=b.call(t)==x;for(n in t)i&&"prototype"==n||p.call(r,n)||!(r[n]=1)||!p.call(t,n)||e(n)}:function(t,e){var n,r,i=b.call(t)==x;for(n in t)i&&"prototype"==n||!p.call(t,n)||(r="constructor"===n)||e(n);(r||p.call(t,n="constructor"))&&e(n)}:(r=["valueOf","toString","toLocaleString","propertyIsEnumerable","isPrototypeOf","hasOwnProperty","constructor"],v=function(t,e){var n,i,o=b.call(t)==x,a=!o&&"function"!=typeof t.constructor&&s[typeof t.hasOwnProperty]&&t.hasOwnProperty||p;for(n in t)o&&"prototype"==n||!a.call(t,n)||e(n);for(i=r.length;n=r[--i];a.call(t,n)&&e(n));}),v(t,e)},!n("json-stringify")){var k={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},I="000000",P=function(t,e){return(I+(e||0)).slice(-t)},L="\\u00",R=function(t){for(var e='"',n=0,r=t.length,i=!O||r>10,o=i&&(O?t.split(""):t);r>n;n++){var s=t.charCodeAt(n);switch(s){case 8:case 9:case 10:case 12:case 13:case 34:case 92:e+=k[s];break;default:if(32>s){e+=L+P(2,s.toString(16));break}e+=i?o[n]:t.charAt(n)}}return e+'"'},U=function(t,e,n,r,i,o,s){var a,u,l,c,h,d,y,g,w,x,O,A,k,I,L,M;try{a=e[t]}catch(q){}if("object"==typeof a&&a)if(u=b.call(a),u!=_||p.call(a,"toJSON"))"function"==typeof a.toJSON&&(u!=E&&u!=j&&u!=T||p.call(a,"toJSON"))&&(a=a.toJSON(t));else if(a>-1/0&&1/0>a){if(N){for(h=C(a/864e5),l=C(h/365.2425)+1970-1;N(l+1,0)<=h;l++);for(c=C((h-N(l,0))/30.42);N(l,c+1)<=h;c++);h=1+h-N(l,c),d=(a%864e5+864e5)%864e5,y=C(d/36e5)%24,g=C(d/6e4)%60,w=C(d/1e3)%60,x=d%1e3}else l=a.getUTCFullYear(),c=a.getUTCMonth(),h=a.getUTCDate(),y=a.getUTCHours(),g=a.getUTCMinutes(),w=a.getUTCSeconds(),x=a.getUTCMilliseconds();a=(0>=l||l>=1e4?(0>l?"-":"+")+P(6,0>l?-l:l):P(4,l))+"-"+P(2,c+1)+"-"+P(2,h)+"T"+P(2,y)+":"+P(2,g)+":"+P(2,w)+"."+P(3,x)+"Z"}else a=null;if(n&&(a=n.call(e,t,a)),null===a)return"null";if(u=b.call(a),u==S)return""+a;if(u==E)return a>-1/0&&1/0>a?""+a:"null";if(u==j)return R(""+a);if("object"==typeof a){for(I=s.length;I--;)if(s[I]===a)throw f();if(s.push(a),O=[],L=o,o+=i,u==T){for(k=0,I=a.length;I>k;k++)A=U(k,a,n,r,i,o,s),O.push(A===m?"null":A);M=O.length?i?"[\n"+o+O.join(",\n"+o)+"\n"+L+"]":"["+O.join(",")+"]":"[]"}else v(r||a,function(t){var e=U(t,a,n,r,i,o,s);e!==m&&O.push(R(t)+":"+(i?" ":"")+e)}),M=O.length?i?"{\n"+o+O.join(",\n"+o)+"\n"+L+"}":"{"+O.join(",")+"}":"{}";return s.pop(),M}};e.stringify=function(t,e,n){var r,i,o,a;if(s[typeof e]&&e)if((a=b.call(e))==x)i=e;else if(a==T){o={};for(var u,l=0,c=e.length;c>l;u=e[l++],a=b.call(u),(a==j||a==E)&&(o[u]=1));}if(n)if((a=b.call(n))==E){if((n-=n%1)>0)for(r="",n>10&&(n=10);r.length<n;r+=" ");}else a==j&&(r=n.length<=10?n:n.slice(0,10));return U("",(u={},u[""]=t,u),i,o,r,"",[])}}if(!n("json-parse")){var M,q,D=o.fromCharCode,W={92:"\\",34:'"',47:"/",98:"\b",116:"	",110:"\n",102:"\f",114:"\r"},J=function(){throw M=q=null,c()},B=function(){for(var t,e,n,r,i,o=q,s=o.length;s>M;)switch(i=o.charCodeAt(M)){case 9:case 10:case 13:case 32:M++;break;case 123:case 125:case 91:case 93:case 58:case 44:return t=O?o.charAt(M):o[M],M++,t;case 34:for(t="@",M++;s>M;)if(i=o.charCodeAt(M),32>i)J();else if(92==i)switch(i=o.charCodeAt(++M)){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:t+=W[i],M++;break;case 117:for(e=++M,n=M+4;n>M;M++)i=o.charCodeAt(M),i>=48&&57>=i||i>=97&&102>=i||i>=65&&70>=i||J();t+=D("0x"+o.slice(e,M));break;default:J()}else{if(34==i)break;for(i=o.charCodeAt(M),e=M;i>=32&&92!=i&&34!=i;)i=o.charCodeAt(++M);t+=o.slice(e,M)}if(34==o.charCodeAt(M))return M++,t;J();default:if(e=M,45==i&&(r=!0,i=o.charCodeAt(++M)),i>=48&&57>=i){for(48==i&&(i=o.charCodeAt(M+1),i>=48&&57>=i)&&J(),r=!1;s>M&&(i=o.charCodeAt(M),i>=48&&57>=i);M++);if(46==o.charCodeAt(M)){for(n=++M;s>n&&(i=o.charCodeAt(n),i>=48&&57>=i);n++);n==M&&J(),M=n}if(i=o.charCodeAt(M),101==i||69==i){for(i=o.charCodeAt(++M),(43==i||45==i)&&M++,n=M;s>n&&(i=o.charCodeAt(n),i>=48&&57>=i);n++);n==M&&J(),M=n}return+o.slice(e,M)}if(r&&J(),"true"==o.slice(M,M+4))return M+=4,!0;if("false"==o.slice(M,M+5))return M+=5,!1;if("null"==o.slice(M,M+4))return M+=4,null;J()}return"$"},G=function(t){var e,n;if("$"==t&&J(),"string"==typeof t){if("@"==(O?t.charAt(0):t[0]))return t.slice(1);if("["==t){for(e=[];t=B(),"]"!=t;n||(n=!0))n&&(","==t?(t=B(),"]"==t&&J()):J()),","==t&&J(),e.push(G(t));return e}if("{"==t){for(e={};t=B(),"}"!=t;n||(n=!0))n&&(","==t?(t=B(),"}"==t&&J()):J()),(","==t||"string"!=typeof t||"@"!=(O?t.charAt(0):t[0])||":"!=B())&&J(),e[t.slice(1)]=G(B());return e}J()}return t},F=function(t,e,n){var r=H(t,e,n);r===m?delete t[e]:t[e]=r},H=function(t,e,n){var r,i=t[e];if("object"==typeof i&&i)if(b.call(i)==T)for(r=i.length;r--;)F(i,r,n);else v(i,function(t){F(i,t,n)});return n.call(t,e,i)};e.parse=function(t,e){var n,r;return M=0,q=""+t,n=G(B()),"$"!=B()&&J(),M=q=null,e&&b.call(e)==x?H((r={},r[""]=n,r),"",e):n}}}return e.runInContext=i,e}var o="function"==typeof t&&t.amd,s={"function":!0,object:!0},a=s[typeof r]&&r&&!r.nodeType&&r,u=s[typeof window]&&window||this,l=a&&s[typeof n]&&n&&!n.nodeType&&"object"==typeof e&&e;if(!l||l.global!==l&&l.window!==l&&l.self!==l||(u=l),a&&!o)i(u,a);else{var c=u.JSON,f=u.JSON3,h=!1,d=i(u,u.JSON3={noConflict:function(){return h||(h=!0,u.JSON=c,u.JSON3=f,c=f=null),d}});u.JSON={parse:d.parse,stringify:d.stringify}}o&&t(function(){return d})}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],56:[function(t,e){"use strict";function n(t,e,u){if(!(this instanceof n))return new n(t,e,u);var l,c,f,h,d=s.test(t),p=typeof e,v=this,m=0;for("object"!==p&&"string"!==p&&(u=e,e=null),u&&"function"!=typeof u&&(u=o.parse),e=i(e);m<a.length;m++)c=a[m],l=c[0],h=c[1],l!==l?v[h]=t:"string"==typeof l?~(f=t.indexOf(l))&&("number"==typeof c[2]?(v[h]=t.slice(0,f),t=t.slice(f+c[2])):(v[h]=t.slice(f),t=t.slice(0,f))):(f=l.exec(t))&&(v[h]=f[1],t=t.slice(0,t.length-f[0].length)),v[h]=v[h]||(c[3]||"port"===h&&d?e[h]||"":""),c[4]&&(v[h]=v[h].toLowerCase());u&&(v.query=u(v.query)),r(v.port,v.protocol)||(v.host=v.hostname,v.port=""),v.username=v.password="",v.auth&&(c=v.auth.split(":"),v.username=c[0]||"",v.password=c[1]||""),v.href=v.toString()}var r=t("requires-port"),i=t("./lolcation"),o=t("querystringify"),s=/^\/(?!\/)/,a=[["#","hash"],["?","query"],["//","protocol",2,1,1],["/","pathname"],["@","auth",1],[0/0,"host",void 0,1,1],[/\:(\d+)$/,"port"],[0/0,"hostname",void 0,1,1]];n.prototype.set=function(t,e,n){var i=this;return"query"===t?("string"==typeof e&&(e=(n||o.parse)(e)),i[t]=e):"port"===t?(i[t]=e,r(e,i.protocol)?e&&(i.host=i.hostname+":"+e):(i.host=i.hostname,i[t]="")):"hostname"===t?(i[t]=e,i.port&&(e+=":"+i.port),i.host=e):"host"===t?(i[t]=e,/\:\d+/.test(e)&&(e=e.split(":"),i.hostname=e[0],i.port=e[1])):i[t]=e,i.href=i.toString(),i},n.prototype.toString=function(t){t&&"function"==typeof t||(t=o.stringify);var e,n=this,r=n.protocol+"//";return n.username&&(r+=n.username,n.password&&(r+=":"+n.password),r+="@"),r+=n.hostname,n.port&&(r+=":"+n.port),r+=n.pathname,n.query&&(e="object"==typeof n.query?t(n.query):n.query,r+=("?"===e.charAt(0)?"":"?")+e),n.hash&&(r+=n.hash),r},n.qs=o,n.location=i,e.exports=n},{"./lolcation":57,querystringify:58,"requires-port":59}],57:[function(t,e){(function(n){"use strict";var r,i={hash:1,query:1};e.exports=function(e){e=e||n.location||{},r=r||t("./");var o,s={},a=typeof e;if("blob:"===e.protocol)s=new r(unescape(e.pathname),{});else if("string"===a){s=new r(e,{});for(o in i)delete s[o]}else if("object"===a)for(o in e)o in i||(s[o]=e[o]);return s}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./":56}],58:[function(t,e,n){"use strict";function r(t){for(var e,n=/([^=?&]+)=([^&]*)/g,r={};e=n.exec(t);r[decodeURIComponent(e[1])]=decodeURIComponent(e[2]));return r}function i(t,e){e=e||"";var n=[];"string"!=typeof e&&(e="?");for(var r in t)o.call(t,r)&&n.push(encodeURIComponent(r)+"="+encodeURIComponent(t[r]));return n.length?e+n.join("&"):""}var o=Object.prototype.hasOwnProperty;n.stringify=i,n.parse=r},{}],59:[function(t,e){"use strict";e.exports=function(t,e){if(e=e.split(":")[0],t=+t,!t)return!1;switch(e){case"http":case"ws":return 80!==t;case"https":case"wss":return 443!==t;case"ftp":return 22!==t;case"gopher":return 70!==t;case"file":return!1}return 0!==t}},{}]},{},[1])(1)});
        //function __initScrollto(){
        //    (function(l){'use strict';l(['jquery'],function($){var k=$.scrollTo=function(a,b,c){return $(window).scrollTo(a,b,c)};k.defaults={axis:'xy',duration:0,limit:true};function isWin(a){return!a.nodeName||$.inArray(a.nodeName.toLowerCase(),['iframe','#document','html','body'])!==-1}$.fn.scrollTo=function(f,g,h){if(typeof g==='object'){h=g;g=0}if(typeof h==='function'){h={onAfter:h}}if(f==='max'){f=9e9}h=$.extend({},k.defaults,h);g=g||h.duration;var j=h.queue&&h.axis.length>1;if(j){g/=2}h.offset=both(h.offset);h.over=both(h.over);return this.each(function(){if(f===null)return;var d=isWin(this),elem=d?this.contentWindow||window:this,$elem=$(elem),targ=f,attr={},toff;switch(typeof targ){case'number':case'string':if(/^([+-]=?)?\d+(\.\d+)?(px|%)?$/.test(targ)){targ=both(targ);break}targ=d?$(targ):$(targ,elem);if(!targ.length)return;case'object':if(targ.is||targ.style){toff=(targ=$(targ)).offset()}}var e=$.isFunction(h.offset)&&h.offset(elem,targ)||h.offset;$.each(h.axis.split(''),function(i,a){var b=a==='x'?'Left':'Top',pos=b.toLowerCase(),key='scroll'+b,prev=$elem[key](),max=k.max(elem,a);if(toff){attr[key]=toff[pos]+(d?0:prev-$elem.offset()[pos]);if(h.margin){attr[key]-=parseInt(targ.css('margin'+b),10)||0;attr[key]-=parseInt(targ.css('border'+b+'Width'),10)||0}attr[key]+=e[pos]||0;if(h.over[pos]){attr[key]+=targ[a==='x'?'width':'height']()*h.over[pos]}}else{var c=targ[pos];attr[key]=c.slice&&c.slice(-1)==='%'?parseFloat(c)/100*max:c}if(h.limit&&/^\d+$/.test(attr[key])){attr[key]=attr[key]<=0?0:Math.min(attr[key],max)}if(!i&&h.axis.length>1){if(prev===attr[key]){attr={}}else if(j){animate(h.onAfterFirst);attr={}}}});animate(h.onAfter);function animate(a){var b=$.extend({},h,{queue:true,duration:g,complete:a&&function(){a.call(elem,targ,h)}});$elem.animate(attr,b)}})};k.max=function(a,b){var c=b==='x'?'Width':'Height',scroll='scroll'+c;if(!isWin(a))return a[scroll]-$(a)[c.toLowerCase()]();var d='client'+c,doc=a.ownerDocument||a.document,html=doc.documentElement,body=doc.body;return Math.max(html[scroll],body[scroll])-Math.min(html[d],body[d])};function both(a){return $.isFunction(a)||$.isPlainObject(a)?a:{top:a,left:a}}$.Tween.propHooks.scrollLeft=$.Tween.propHooks.scrollTop={get:function(t){return $(t.elem)[t.prop]()},set:function(t){var a=this.get(t);if(t.options.interrupt&&t._last&&t._last!==a){return $(t.elem).stop()}var b=Math.round(t.now);if(a!==b){$(t.elem)[t.prop](b);t._last=this.get(t)}}};return k})}(typeof define==='function'&&define.amd?define:function(a,b){'use strict';if(typeof module!=='undefined'&&module.exports){module.exports=b(require('jquery'))}else{b(jQuery)}}));
        //}
        // __initScrollto();
        //=================Js import third-party package repository end  ===================

        //=================jquery ext start  ===================
        /******************************************************************
         * jquery ext
         * ext_on:绑定事件,并带有设置延时执行功能,在回调函数中的域对象会变(a,b),设置opts参数
         *        其值包含 LDT:所有通过此方法绑定的事件延迟执行的时间,毫秒,必须大于0时生效;
         *                LDW:延迟时,有重复操作的处理方式: 0 按顺序延时处理;1 忽略后续的操作
         ******************************************************************/
        (function($){
            $.fn.extend({
                ext_on:function(event,selector,data,fun,isone,opts){
                    var cfgDef = {
                        LDT:200,//所有通过此方法绑定的事件延迟执行的时间,毫秒,必须大于0时生效
                        LDW:1//延迟时,有重复操作的处理方式: 0 按顺序延时处理;1 忽略后续的操作
                    };
                    var _args = [];
                    var _opts = cfgDef;
                    var _event = event;
                    var _sct = null;
                    var _dt = null;
                    var _fun = null;//业务函数
                    var _one = 0;
                    if($.isFunction(selector)){
                        //如果第二个参数是函数
                        _fun = selector;
                        _one = data;
                        _opts = $.extend(cfgDef,fun);
                    }else if($.isFunction(data)){
                        _sct = selector;
                        _fun = data;
                        _one = fun;
                        _opts = $.extend(cfgDef,isone);
                    }else if($.isFunction(fun)){
                        _sct = selector;
                        _dt = data;
                        _fun = fun;
                        _one = isone;
                        _opts = $.extend(cfgDef,opts);
                    }else{
                        return;
                    }
                    _args[0] = _event;
                    _args[1] = _sct;
                    _args[2] = _dt;
                    _args[3] = null;
                    _args[4] = _one;

                    var _curObj = $(this);
                    var _ish = _fcTools_.g_isHavEleById(_curObj);
                    if(_ish){
                        //如果存在的话
                        //添加事件标记并判断是否已经绑定相同事件
                        var _k = _event+'^'+_sct;
                        var _evs = _curObj.data('_EV_');
                        if(!_evs){
                            _evs = {};
                            _curObj.data('_EV_',_evs);
                        }
                        if(_evs[_k]){
                            //当前元素已经绑定了相同事件,所以自动忽略本次操作
                            _fcTools_._Cp_console_log_('The current element is already bound the same event^selector:'+_k+";so automatically ignore this operation!");
                            return false;
                        }else{
                            _evs[_k] = 1;
                        }
                        _curObj.data('_EV_',_evs);
                    }else{
                        //当前元素不存在
                        _fcTools_._Cp_console_log_('The current element does not exist! Selector:'+_curObj.selector+' '+selector);
                        return false;
                    }
                    var _st,_jqRt;
                    if(_opts.LDT > 0 ){
                        switch (_opts.LDW){
                            case 0:{
                                _args[3] = function(args){
                                    function _innerExe(){
                                        var _st_0,_jqRt_0;
                                        _jqRt_0 = args;
                                        _st_0 = setTimeout(function(){
                                            clearTimeout(_st_0);
                                            _st_0 = null;
                                            //_jqRt_0 jqueryObj;_jqRt_0.target:htmlObj
                                            _fun(_jqRt_0.target,_jqRt_0.currentTarget,_jqRt_0 );
                                        },_opts.LDT);
                                    }
                                    _innerExe();
                                };
                                break;
                            }
                            case 1:{
                                _args[3] = function(args){
                                    if(_st){
                                        //当前事件操作正在执行,所以忽略本次操作!
                                        _fcTools_._Cp_console_log_('Current event is being executed, ignore this operation!', _G_FST_VAL.ENUM_prefix.el_event);
                                        return;
                                    }
                                    _jqRt = args;
                                    _st = setTimeout(function(){
                                        clearTimeout(_st);
                                        _st = null;
                                        //_jqRt jqueryObj bind this Object;_jqRt.target:htmlObj
                                        _fun(_jqRt.target,_jqRt.currentTarget,_jqRt );
                                    },_opts.LDT);
                                };
                                break;
                            }
                        }
                    }else{
                        _args[3] = _fun;
                    }
                    return $.fn.on.apply(this,_args);
                }
            });
        })($);

        //=================jquery ext end  =====================
        //=================Cookies start=====================
        /******************************************************************
         * Cookie 操作,有开关控制
         * cfgDef:{
         *       json:!0,//是否转化成json
         *       expires:0.05,//默认失效天数
         *       path:'',
         *       domain:'',
         *       secure:''
         *   },
         ******************************************************************/
        var __fstCore$Cookie = {
            cfgDef:{
                json:!0,//是否转化成json
                expires:0.05,//默认失效天数
                path:'',
                domain:'',
                secure:''
            },
            __stringifyCookieValue:function(value) {
                return __encode(this.json ? JSON.stringify(value) : (value+""));
            },
            __parseCookieValue:function(s) {
                if (s.indexOf('"') === 0) {
                    s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                }
                try {
                    s = __decode(s.replace(_G_FST_VAL.ENUM_regular.pluses, ' '));
                    return this.json ? __objectParse(s) : s;
                } catch(e) {}
            },
            __read: function(s, converter) {
                var value = this.__parseCookieValue(s);
                return $.isFunction(converter) ? converter(value) : value;
            },
            /*
             * 设置或获取Cookie
             * @param ck
             * @param val
             * @param opts
             */
            fsCookie:function(ck,val,opts){
                var result = null;
                if(__cookieIsUse()){
                    opts = $.extend({}, this.cfgDef, opts);
                    if(!_G_FST_VAL._fs_cookie_sw){
                        return result;
                    }
                    if (val != undefined && !$.isFunction(val)) {
                        if (typeof opts.expires === 'number') {
                            //设置失效时间
                            var days = opts.expires, t = opts.expires = new Date();
                            t.setTime(+t + days * 864e+5);
                        }
                        document.cookie = [
                            __encode(ck), '=', this.__stringifyCookieValue(val),
                            opts.expires ? '; expires=' + opts.expires.toUTCString() : '',
                            opts.path    ? '; path=' + opts.path : '',
                            opts.domain  ? '; domain=' + opts.domain : '',
                            opts.secure  ? '; secure' : ''
                        ].join('');
                    }else{
                        result = ck ? undefined : {};
                        var cookies = document.cookie ? document.cookie.split('; ') : [];
                        for (var i = 0, l = cookies.length; i < l; i++) {
                            var parts = cookies[i].split('=');
                            var name = __decode(parts.shift());
                            var cookie = parts.join('=');

                            if (ck && ck === name) {
                                result = this.__read(cookie, val);
                                break;
                            }
                            if (!ck && (cookie = this.__read(cookie)) !== undefined) {
                                result[name] = cookie;
                            }
                        }
                    }
                }
                return result;
            },
            setCk: function (ck,val,opts) {
                return this.fsCookie(ck,val,opts);
            },
            getCk: function (ck,opts) {
                return this.fsCookie(ck,undefined,opts);
            },
            removeCk:function(ck,opts){
                if(__cookieIsUse()){
                    if (!this.fsCookie(ck)) {
                        return true;
                    }
                    opts = $.extend({}, this.cfgDef, opts, { expires: -1 });
                    if(_G_FST_VAL._fs_cookie_sw){
                        this.fsCookie(ck, '', opts);
                        return !this.fsCookie(ck);
                    }
                }
                return true;
            }
        };
        var _fcCookie_ = __fstCore$Cookie;//内部使用变量
        //=================cookies end=====================

        //=================Caches start=====================
        /******************************************************************
         * 页面数据缓存管理,有开关控制,且可以通过配置直接放入cookie(基本类型数据且非函数对象)中
         * cfgDef:{
         *       _isUse_:!0,//是否启用
         *       isCookie:!1//是否放入cookie中 默认不放入
         *   },
         ******************************************************************/
        __fstCore.Cache = {
            cfgDef:{
                isCookie:!1//是否放入cookie中 默认不放入
            },
            _inDS_ : {},//内部数据存储器
            _fsCache:function(ck,val,opts){
                var rt = null;
                if(_G_FST_VAL._fs_cache_sw){
                    var _k = ck;
                    if(!_k){
                        return rt;
                    }
                    opts = $.extend({},this.cfgDef, opts);
                    if(val != undefined && val != null && !$.isFunction(val)){
                        this._inDS_[_k] = val;
                        if(opts.isCookie){
                            _fcCookie_.fsCookie(_k,val,opts);
                        }
                    }else{
                        //获取
                        rt = this._inDS_[_k] || undefined;
                        if(rt == undefined || val == null){
                            if(opts.isCookie){
                                var _cv = _fcCookie_.fsCookie(_k,undefined);
                                //加载完后放到cache中
                                if(_cv){
                                    this._inDS_[_k] = _cv;
                                    rt = _cv;
                                }
                            }
                        }
                    }
                }
                return rt;
            },
            setC:function(ck,val,gbK,opts){
                var _ck = ck;
                if(gbK){
                    _ck = gbK+'^'+ck;
                }
                return this._fsCache(_ck,val,opts);
            },
            getC:function(ck,gbK,opts){
                var _ck = ck;
                if(gbK){
                    _ck = gbK+'^'+ck;
                }
                return this._fsCache(_ck,undefined,opts);
            },
            containsC:function(ck,gbK,opts){
                var rt = this.getC(ck,gbK,opts);
                if(rt!=undefined){
                    return true;
                }else{
                    return false;
                }
            },
            removeC:function(ck,gbK,_opts){
                if(_G_FST_VAL._fs_cache_sw){
                    var _ck = ck;
                    if(gbK){
                        _ck = gbK+'^'+ck;
                    }
                    var _k = _ck;
                    if(!_k){
                        return false;
                    }
                    var opts = $.extend({},this.cfgDef, _opts);
                    try{
                        this._inDS_[_k] = null;
                        if(opts.isCookie){
                            _fcCookie_.removeCk(_k,opts);
                        }
                        delete this._inDS_[_k];
                    }catch (e){
                        return false;
                    }
                }
                return true;
            }

        };
        var _fcCache_ = __fstCore.Cache;
        //=================Caches end=====================

        //=================TOOLS start=====================
        /******************************************************************
         * 公共的工具辅助类
         *
         ******************************************************************/
        __fstCore.TOOLS = {};
        var _fcTools_ = __fstCore.TOOLS;
        (function($){

            /*
             * 加解密
             * @param {*}vals 处理的值:{},[],有(key:val)的对象类型且key非数字类型
             * @returns {*}
             * @private
             */
            function __enDecrypt(vals){
                var rt = null;
                try{
                    if($.isFunction(vals)){
                        return null;
                    }
                    var t = typeof vals;
                    if( t == "object"){
                        var pm =  vals;
                        var _url = _fcTools_.g_Site_autoAddRoot("baseAct/urlParamsEncrypt.do");
                        $.ajax({
                            type: "POST",
                            url: _url,
                            data: pm,
                            dataType: "html",
                            cache: false,
                            async: false,
                            success:function(dt,stV, rqObj){
                                var _d = _fcTools_.g_Str2ObjectParse(dt);
                                if(_d&&_d['FLAG'] === 'Y' ){
                                    rt = _d['_MDCT_'];
                                }
                            },
                            error:function(rqObj,stV, stT){
                                //失败
                                _fcTools_._Cp_console_(_url+",参数加密失败:"+"\n"+rqObj.status+";"+stV+";"+stT,_G_FST_VAL.ENUM_prefix.enDecrypt);
                            }
                        });
                    }
                }catch (e){
                    rt = null;
                    __cpConsole(e.message,_G_FST_VAL.ENUM_prefix.enDecrypt);
                }
                return rt;
            }

            /**
             * 加密
             * @param val
             * @param mdType
             */
            __fstCore.TOOLS.g_Md_encrypt = function(val){
                return __enDecrypt(val);
            };
            __fstCore.TOOLS.g_Md_URIEncode = function(val){
                return __encode(val);
            };
            __fstCore.TOOLS.g_Md_URIDecode = function(val){
                return __decode(val);
            };
            __fstCore.TOOLS.g_Md_encrypt = function(val){
                return __enDecrypt(val);
            };
            __fstCore.TOOLS.g_Md_encrypt = function(val){
                return __enDecrypt(val);
            };

            __fstCore.TOOLS.g_IsNull = function(obj,errorMsg) {
                return __objIsNull(obj, errorMsg);
            };
            __fstCore.TOOLS.g_IsNotNull = function(obj,errorMsg) {
                return !__objIsNull(obj, errorMsg);
            };
            __fstCore.TOOLS.g_IsTrue = function(boolV,errorMsg) {
                return __objIsTrue(boolV, errorMsg);
            };
            /**
             * 是否是下标索引的对象类型:{}[]
             * @param obj
             * @returns {boolean}
             */
            __fstCore.TOOLS.g_IsArrayOrJsonObj = function(obj) {
                return __isArrayOrJson(obj);
            };
            __fstCore.TOOLS.g_Alert = function(msg,_ct_ss, title, callback){
                if(typeof JAlert != 'undefined'){
                    JAlert(msg,_ct_ss, title, callback);
                }else{
                    alert(msg);
                }
            };
            /*
             * 自定义js库中弹出提示
             * @param msg
             * @param prefixMsg
             * @private
             */
            __fstCore.TOOLS._Cp_alert_ = function(msg,prefixMsg){
                //__cpAlert(msg,prefixMsg);//内部错误信息不提示
            };
            /***以下时调试日志输出函数,在支持并打开的情况下****/
            //__fstCore.TOOLS.ENUM_CONSOLE_TYPE = _G_FST_VAL.ENUM_console_type;
            /*
             * 打印调试日志信息,正式上线后会去掉
             * @param msg
             * @param prefixMsg
             * @param {_G_FST_VAL.ENUM_console_type}logType
             * @private
             */
            __fstCore.TOOLS._Cp_console_ = function(msg,prefixMsg,logType){
                __cpConsole(msg,prefixMsg,logType||_G_FST_VAL.ENUM_console_type.LOG);
            };
            __fstCore.TOOLS._Cp_console_log_ = function(msg,prefixMsg){
                __cpConsole(msg,prefixMsg,_G_FST_VAL.ENUM_console_type.LOG);
            };
            __fstCore.TOOLS._Cp_console_error_ = function(msg,prefixMsg){
                __cpConsole(msg,prefixMsg,_G_FST_VAL.ENUM_console_type.ERROR);
            };
            __fstCore.TOOLS._Cp_console_warn_ = function(msg,prefixMsg){
                __cpConsole(msg,prefixMsg,_G_FST_VAL.ENUM_console_type.WARN);
            };
            __fstCore.TOOLS._Cp_console_trace_ = function(msg,prefixMsg){
                __cpConsole(msg,prefixMsg,_G_FST_VAL.ENUM_console_type.TRACE);
            };
            /*************************************************/
            /**
             * @param {object}obj
             * @param {string}jsClass
             * @returns {boolean}
             */
            __fstCore.TOOLS.g_isJsClass = function(obj, jsClass){
                if(obj&&jsClass){
                    var _nm = (obj.name || obj.id || null)+'';
                    return _nm===jsClass;
                }else{
                    return false;
                }
            };
            /**
             * 是否是数字(包含小数)
             * @param s
             * @return {*}
             */
            __fstCore.TOOLS.g_isNumeric = function(s){
                return $.isNumeric(s);
            };
            /*
             * 获取原生数字值
             * @param {Object}_numStr
             * @param {Number}decPlaces 保留小数点后几位,不四舍五入,如果有小数的话
             * @return {Number}
             */
            __fstCore.TOOLS.g_getNumber = function(_numStr,decPlaces) {
                _numStr = _numStr+"";
                if(decPlaces&&_numStr.indexOf(".") != -1){
                    return new Number(_numStr.substring(0,_numStr.indexOf(".")+(decPlaces+1)));
                }else{
                    return new Number(_numStr);
                }
            };
            /**
             * 格式化数字金额用逗号隔开保留n小数
             * @param s
             * @param n
             * @return {*}
             */
            __fstCore.TOOLS.g_numToCurrency = function(s,n){
                n = n > 0 && n <= 20 ? n : 2;
                s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
                var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
                var t = "";
                for (i = 0; i < l.length; i++) {
                    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
                }
                return t.split("").reverse().join("") + "." + r;
            };
            /*
             * 字符串占位替换:"1232{0}3423,{1}"
             * @param str
             * @param repVals 替换值数组
             * @param nullV 如果有值的话,碰到空值时替换
             */
            __fstCore.TOOLS.g_u_replacePh = function(str, repVals, nullV) {
                var rt = str;
                if (rt && repVals) {
                    for (var i = 0; i < repVals.length; i++) {
                        var rv = repVals[i];
                        rt = rt.replace("{" + i + "}", rv);
                    }
                    if (nullV != undefined) {
                        rt = rt.replace(new RegExp("{[0-9]+}", "gm"), nullV);
                    }
                }
                return rt;
            };

            __fstCore.TOOLS.g_isArray = function(array){
                return $.isArray(array);
            };
            __fstCore.TOOLS.g_inArray = function(val,array,fromIndex){
                return $.inArray(val,array,fromIndex);
            };
            __fstCore.TOOLS.g_isBoolean = function(b){
                b = b+'';
                b = b.toLowerCase();
                if(b === 'false' || b === 'true'){
                    return true;
                }else{
                    return false;
                }
            };
            /**
             * 测试对象是否是纯粹的对象（通过 "{}" 或者 "new Object" 创建的）
             * @param s
             * @return {*}
             */
            __fstCore.TOOLS.g_isPlainObject = function(s){
                return $.isPlainObject(s);
            };
            /**
             * 校验是否全由纯数字组成(不含小数)
             * @param s
             * @returns {boolean}
             */
            __fstCore.TOOLS.g_isDigit = function(s) {
                if (s == undefined || s == null) {
                    return false;
                }
                s = '' + s;
                if(s.length == 0){
                    return false;
                }
                if (s.substring(0, 1) == '-' && s.length > 1) {
                    s = s.substring(1, s.length)
                }
                if (!_G_FST_VAL.ENUM_regular.digit0$9.exec(s)) return false;
                return true;
            };
            __fstCore.TOOLS.g_u_getMousePosition = function (evt){
                var xPos,yPos;
                evt = evt || window.event;
                if(evt.pageX||evt.pageY){
                    xPos=evt.pageX;
                    yPos=evt.pageY;
                } else {
                    xPos=evt.clientX+document.body.scrollLeft -document.body.clientLeft;
                    yPos=evt.clientY+document.body.scrollTop-document.body.clientTop;
                }
                //alert(xPos+":"+yPos);
                return {"X":xPos,"Y":yPos};
            };
            __fstCore.TOOLS.g_getHtmlObjById = function (id){
                if(document){
                    return document.getElementById(id);
                }
                return null;
            };
            __fstCore.TOOLS.g_getHtmlObjById_top = function (id){
                if(document){
                    return window.top.document.getElementById(id);
                }
                return null;
            };
            __fstCore.TOOLS.g_String_ext_contains = function(str, comStr) {
                comStr = comStr+"";
                str = str + "";
                if (comStr == "" || !str) {
                    return false;
                }
                return str.indexOf(comStr) >= 0 ? true : false;
            };
            __fstCore.TOOLS.g_String_ext_startWith = function(str, comStr) {
                comStr = comStr+"";
                str = str + "";
                if (comStr == "" || !str) {
                    return false;
                }
                var _s = str.substr(0, comStr.length);
                return _s === comStr;
            };
            __fstCore.TOOLS.g_String_ext_endWith = function(str, comStr) {
                comStr = comStr+"";
                str = str + "";
                if (comStr == "" || !str) {
                    return false;
                }
                var _s = str.substr(str.length - comStr.length);
                return _s === comStr;
            };
            __fstCore.TOOLS.g_String_ext_replaceFirst = function(str, searchValue, replaceValue) {
                searchValue = searchValue+"";
                str = str + "";
                if (!str) {
                    return str;
                }
                return str.replace(searchValue, replaceValue);
            };
            __fstCore.TOOLS.g_String_ext_replaceEnd = function(str, searchValue, replaceValue) {
                searchValue = searchValue+"";
                str = str + "";
                if (!str) {
                    return str;
                }
                var tempStr = str.substr(0, str.length - 1);
                return tempStr + str.substr(str.length - 1).replace(searchValue, replaceValue);
            };
            __fstCore.TOOLS.g_String_ext_replaceAll = function(str, searchValue, replaceValue) {
                searchValue = searchValue+"";
                str = str + "";
                if (!str) {
                    return str;
                }
                return str.replace(new RegExp(searchValue, "gm"), replaceValue);
            };

            /**
             * 对Date的扩展,格式符可以是中文:yyyy年，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
             * 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
             * Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
             * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
             * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
             * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
             * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
             */
            __fstCore.TOOLS.g_Date_ext_format = function(dt, fmt) {
                return __dataFormat(dt, fmt);
            };
            __fstCore.TOOLS.g_Str2ObjectParse = function(jsonStr) {
                return __objectParse(jsonStr);
            };
            __fstCore.TOOLS.g_Object2Stringify = function(jsonObj) {
                return __objectStringify(jsonObj);
            };
            __fstCore.TOOLS.g_isJqueryObj = function(obj) {
                return __isJqueryObj(obj);
            };
            /**
             * 页面上是否存在此元素
             * @param id$jqObj
             * @return {*}
             */
            __fstCore.TOOLS.g_isHavEleById = function(id$jqObj) {
                return __isHavIdElement(id$jqObj);
            };

            /*
             * 复制信息到剪贴板中Clipboard
             * @param {string}cpEventId 复制按钮或元素Id 绑定zclip复制事件
             * @param {string}areTxtId 被复制元素ID
             * @param {string}_okMsgPrefix 复制成功后提示消息前缀
             * @param {string}_path
             * @param {function}afterCopyFun 复制成功后的回调函数
             * @param {function}beforeCopyFun 复制前的回调函数
             * @param {function}copyFun copy函数
             * @param {boolean}clickAfterB :是否执行原来的click事件
             * @param {boolean}setHandCursorB :是否设置鼠标为手型
             * @param {boolean}setCSSEffectsB
             */
            __fstCore.TOOLS.g_copyToClipboard = function(cpEventId,areTxtId,_okMsgPrefix,_path,afterCopyFun,beforeCopyFun,copyFun,clickAfterB,setHandCursorB,setCSSEffectsB) {
                try{
                    if(_fcTools_.g_isHavEleById(cpEventId)){
                        var _params = {
                            path: _path || '/html/static/js/plugs/ZeroClipboard.swf',
                            beforeCopy:beforeCopyFun||null,
                            copy:copyFun || (function(){
                                if(copyFun){
                                    return copyFun;
                                }else{
                                    return $("#"+areTxtId).val();
                                }
                            }),
                            afterCopy:afterCopyFun||null,
                            clickAfter:clickAfterB||true,
                            setHandCursor:setHandCursorB||true,
                            setCSSEffects:setCSSEffectsB||true,
                            okMsgPrefix:(_okMsgPrefix  ? _okMsgPrefix + '内容已成功被复制到剪贴板中':'内容已成功被复制到剪贴板中')
                        };
                        $("#"+cpEventId).attr('rv','e-zclip').zclip(_params);

                    }
                }catch (e){}
            };
            /*
             * 剪贴板复制功能的元素 功能设置
             * @param {string}type :show hide remove
             * @param id :被绑定复制功能的元素ID cpEventId
             */
            __fstCore.TOOLS.g_copyClipboardFunSet = function(type,id){
                if(type == 'show'||type == 'hide'||type == 'remove'){
                    if(_fcTools_.g_isHavEleById(id)){
                        $("#"+id).zclip(type);
                    }
                }
            };
            //域名,domain获取操作......
            __fstCore.TOOLS.g_Site_getRoot = function(){
                var _url = _fcTools_.g_Site_getUrlLocalHref();
                var _cp = _fcTools_.g_Site_getContextPath(_url);
                return _cp||'';
            };
            //获取当前本地href
            __fstCore.TOOLS.g_Site_getUrlLocalHref = function(win){
                if (win) {
                    return win.location.href;
                } else {
                    return window.location.href;
                }
            };
            //获取项目根目录
            __fstCore.TOOLS.g_Site_getContextPath = function() {
                var pathName = _fcTools_.g_Site_getPathname();
                var index = pathName.substr(1).indexOf("/");
                var rt = pathName.substr(0, index + 1);
                if (_fcTools_.g_String_ext_startWith(rt, "/indexAct") || _fcTools_.g_String_ext_startWith(rt, "/html")) {
                    rt = "";
                }
                return rt;
            };
            // /html/aa/g.html
            __fstCore.TOOLS.g_Site_getPathname = function() {
                return document.location.pathname;
            };
            //http
            __fstCore.TOOLS.g_Site_getProtocol = function() {
                return document.location.protocol;
            };
            //protocol+host
            __fstCore.TOOLS.g_Site_getOrigin = function() {
                return document.location.origin;
            };
            /*
             * 获取域名
             * @return {string}
             */
            __fstCore.TOOLS.g_Site_getDomain = function() {
                return document.domain;
            };
            __fstCore.TOOLS.g_Site_getHost = function(win) {
                if (win) {
                    return win.location.host;
                } else {
                    return window.location.host;
                }
            };
            __fstCore.TOOLS.g_Site_getPort = function(win) {
                if (win) {
                    return win.location.port;
                } else {
                    return window.location.port;
                }
            };
            //http://localhost:8011/S11/
            __fstCore.TOOLS.g_Site_getFullUrl = function() {
                return this.g_Site_getProtocol() + "//" + this.g_Site_getHost() + this.g_Site_getRoot();
            };
            __fstCore.TOOLS.g_Site_getRegUrl = function() {
                return "/reg.html";
            };
            __fstCore.TOOLS.g_Site_getLoginUrl = function() {
                return "/html/login.html";
            };
            __fstCore.TOOLS.g_Site_getHallUrl = function() {
                return "/html/hall/hall.html";
            };
            __fstCore.TOOLS.g_Site_getAgreementUrl = function() {
                return "/html/login/useragree.html";
            };
            //此方法可以不调用,因为有定时器定时执行
            __fstCore.TOOLS.g_TopWin_autoSetHW = function(extH) {
                var win = window.top || window;
                if(win&&win.FST_BSF&&win.FST_BSF.TOPWIN){
                    win.FST_BSF.TOPWIN.autoSetWinHW(extH);
                }
            };
            __fstCore.TOOLS.g_TopWin_autoNoLazySetWinHW = function(extH) {
                var win = window.top || window;
                if(win&&win.FST_BSF&&win.FST_BSF.TOPWIN){
                    win.FST_BSF.TOPWIN.autoNoLazyetWinHW(extH);
                }
            };
            __fstCore.TOOLS.g_TopWin_removeQk = function() {
                var win = window.top || window;
                if(win&&win.FST_BSF&&win.FST_BSF.TOPWIN){
                    win.FST_BSF.TOPWIN.removeQk();
                }
            };
            //只设置src不刷新页面
            __fstCore.TOOLS.g_TopWin_setWinIframeSrc = function(sr,extH) {
                var win = window.top || window;
                if(win&&win.FST_BSF&&win.FST_BSF.TOPWIN){
                    win.FST_BSF.TOPWIN.setWinIframeSrc(sr,extH);
                }
            };

            //取窗口可视范围的高度
            __fstCore.TOOLS.g_TopWin_getClientHeight = function() {
                var win = window.top || window;
                var clientHeight=0;
                if(win.document.body.clientHeight&&win.document.documentElement.clientHeight){
                    clientHeight=(win.document.body.clientHeight<win.document.documentElement.clientHeight)?win.document.body.clientHeight:win.document.documentElement.clientHeight;
                }else{
                    clientHeight=(win.document.body.clientHeight>win.document.documentElement.clientHeight)?win.document.body.clientHeight:win.document.documentElement.clientHeight;
                }
                return clientHeight;
            };

            //取窗口滚动条高度
            __fstCore.TOOLS.g_TopWin_getScrollTop = function() {
                var win = window.top || window;
                var scrollTop=0;
                if(jQuery){
                    scrollTop = $(win).scrollTop();
                }else{
                    if(win.document.documentElement&&win.document.documentElement.scrollTop){
                        scrollTop=win.document.documentElement.scrollTop;
                    }else if(document.body){
                        scrollTop=win.document.body.scrollTop;
                    }
                }
                return scrollTop;
            };

            //取文档内容实际高度
            __fstCore.TOOLS.g_TopWin_getScrollHeight = function() {
                var win = window.top || window;
                return Math.max(win.document.body.scrollHeight,win.document.documentElement.scrollHeight);
            };
            //取窗口滚动条底部高度
            __fstCore.TOOLS.g_TopWin_getScrollBottom = function() {
                return this.g_TopWin_getScrollHeight()-this.g_TopWin_getScrollTop()-this.g_TopWin_getClientHeight();
            };
            /*
             * 调整滚动条位置
             * @param x 默认0
             * @param y 默认0
             * @param {boolean}isThis 是否当前窗体 ,默认top
             */
            __fstCore.TOOLS.g_TopWin_setScrollTo = function(x,y,isThis) {
                var _x = 0,_y=0;
                if(x != undefined && x != null){
                    _x = x;
                }
                if(y != undefined && y != null){
                    _y = y;
                }
                var win = window.top;
                if(isThis){
                    win = window;
                    if($.scrollTo){
                        $(win).scrollTo(_x,_y);
                    }else{
                        win.scrollTo(_x,_y);
                    }
                }else{
                    if(win&&win.FST_BSF&&win.FST_BSF.TOPWIN){
                        win.FST_BSF.TOPWIN.setScrollTo(_x,_y);
                    }
                }
            };
            __fstCore.TOOLS.g_Site_autoAddRoot = function(path) {
                var _rt = path;
                if (!path) {
                    return _rt;
                }
                if (!_fcTools_.g_String_ext_startWith(path, this.g_Site_getRoot()) || !_fcTools_.g_String_ext_startWith(path, this.g_Site_getRoot().substr(1))) {

                    if (_fcTools_.g_String_ext_startWith(path, "/")) {
                        _rt = _fcTools_.g_Site_getRoot() + path;
                    } else {
                        _rt = _fcTools_.g_Site_getRoot() + "/" + path;
                    }
                }
                return _rt;
            };
            __fstCore.TOOLS.g_c_base_getIframeUrl = function() {
                return this.g_Site_getRoot()+"/";
            };
            /*
             * 页面直接跳转
             * @param {string}url
             * @param {Array}params
             */
            __fstCore.TOOLS.g_u_page_redirect = function(url, win) {
                var _url = url;
                if (url == undefined || url == null) {
                    return;
                }
                if (win != undefined) {
                    win.location.href = _url;
                } else {
                    window.location.href = _url;
                }
            };
            /**
             * 初始化时间控件时间
             * @param startDate:业务起始时间
             * @param endDate:业务结束时间
             * @return {Array}dateArr
             */
            __fstCore.TOOLS.g_u_StartAndEndDate = function() {
                // var hourStr = "06:00:00";
                var hourStr = "00:00:00";
                var startTime = new Date();
                //if(startTime.getHours()>=0 && startTime.getHours()<6){
                //	var startTime_millistconds = startTime.getTime()-1000*60*60*24;
                //	startTime.setTime(startTime_millistconds);
                //}
                var startYear = startTime.getFullYear();
                var startMon = startTime.getMonth() + 1;
                var startDay = startTime.getDate();
                var startDate = startYear + "-" + (startMon < 10 ? "0" + startMon : startMon) + "-" + (startDay < 10 ? "0" + startDay : startDay) + " " + hourStr;

                var endTime = new Date(startTime.getTime() + 1 * 24 * 60 * 60 * 1000);
                var endYear = endTime.getFullYear();
                var endMon = endTime.getMonth() + 1;
                var endDay = endTime.getDate();
                var endDate = endYear + "-" + (endMon < 10 ? "0" + endMon : endMon) + "-" + (endDay < 10 ? "0" + endDay : endDay) + " " + hourStr;

                var dateArr = new Array();
                dateArr[0] = startDate;
                dateArr[1] = endDate;
                dateArr[2] = startDate.substring(0, 10);
                dateArr[3] = endDate.substring(0, 10);;
                return dateArr;
            };

            /**
             * focus事件
             * 处理placeholder兼容浏览器显示
             */
            __fstCore.TOOLS.g_u_onfocusSetInput = function(obj,phVal){
                if($(obj).val() === phVal){
                    $(obj).val("");
                }
            };
            /**
             * blur事件
             * 处理placeholder兼容浏览器显示
             */
            __fstCore.TOOLS.g_u_onblurSetInput = function(obj,phVal) {
                if($(obj).val() == ""){
                    $(obj).val(phVal);
                }
            };
            /**
             * 判断是否支持placeholder
             * @return {boolean}
             */
            __fstCore.TOOLS.g_u_isPlaceholderSupport = function() {
                return document ? ('placeholder' in document.createElement('input')):false;
            };

            /*
             * 获取 href 属性中跟在问号后面的部分
             * @param win
             * @return {string}
             */
            __fstCore.TOOLS.g_u_getUrlSearch = function(win) {
                if (win != undefined) {
                    return win.location.search;
                } else {
                    return window.location.search;
                }
            };
            /*
             * 获取请求的URL参数值
             * @param ustr
             * @return {object}
             */
            __fstCore.TOOLS.g_u_getUrlParams = function(ustr) {
                var url = ustr;
                if (url == undefined || url == null) {
                    url = this.g_u_getUrlSearch(); //获取url中"?"符后的字串
                }
                var theRequest = new Object();
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    var strs = str.split("&");
                    for (var i = 0; i < strs.length; i++) {
                        //                theRequest[strs[i].split("=")[0]]=encodeURIComponent(strs[i].split("=")[1]);
                        theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
                    }
                }
                return theRequest;
            };
            /*
             * 打开一个新的模式对话框窗口
             * @param url 一个可选的字符串，声明了要在新窗口中显示的文档的 URL。如果省略了这个参数，或者它的值是空字符串，那么新窗口就不会显示任何文档。
             * @param vArguments 用来向对话框传递参数。传递的参数类型不限，包括数组等。对话框通过window.dialogArguments来取得传递进来的参数
             * @param sFeatures 用来描述对话框的外观等信息，可以使用以下的一个或几个，用分号“;”隔开。
             *           1.dialogHeight :对话框高度，不小于100px，ＩＥ４中dialogHeight 和 dialogWidth 默认的单位是em，而ＩＥ５中是px，为方便其见，在定义modal方式的对话框时，用px做单位。
             *           2.dialogWidth: 对话框宽度。
             *           3.dialogLeft: 离屏幕左的距离。
             *           4.dialogTop: 离屏幕上的距离。
             *           5.center: {yes | no | 1 | 0 }：窗口是否居中，默认yes，但仍可以指定高度和宽度。
             *           6.help: {yes | no | 1 | 0 }：是否显示帮助按钮，默认yes。
             *           7.resizable: {yes | no | 1 | 0 } ［ＩＥ５＋］：是否可被改变大小。默认no。
             *           8.status: {yes | no | 1 | 0 } ［IE5+］：是否显示状态栏。默认为yes[ Modeless]或no[Modal]。
             *           9.scroll:{ yes | no | 1 | 0 | on | off }：指明对话框是否显示滚动条。默认为yes。
             *           下面几个属性是用在HTA中的，在一般的网页中一般不使用。
             *           10.dialogHide:{ yes | no | 1 | 0 | on | off }：在打印或者打印预览时对话框是否隐藏。默认为no。
             *           11.edge:{ sunken | raised }：指明对话框的边框样式。默认为raised。
             *           12.unadorned:{ yes | no | 1 | 0 | on | off }：默认为no。
             */
            __fstCore.TOOLS.g_u_page_win_showModalDialog = function(url, vArguments, sFeatures,openName) {
                //兼容谷歌浏览器
                if(window.showModalDialog){
                    return window.showModalDialog(url, vArguments, sFeatures);
                }else{
                    if(window.open){
                        //vArguments = name
                        if(openName){
                            var iWidth = 700;
                            var iHeight = 450;
                        }else{
                            var iWidth = 1200;
                            var iHeight = 700;
                        }
                        //dialogHeight=400px;dialogWidth=700px;resizable=0;scroll=no
                        sFeatures=sFeatures.replace("dialogWidth","width").replace("dialogHeight","height");
                        var iTop = (window.screen.availHeight - 30 - iHeight) / 2;
                        var iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
                        var win = window.open(url, openName, "width=" + iWidth + ", height=" + iHeight + ",top=" + iTop + ",left=" + iLeft + ",toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no,alwaysRaised=yes,depended=yes");
                        return win;
                    }
                }
                return null;
            };

            /**
             * 获取带小数数字,会四舍五入
             * @param {Object}_numStr
             * @param {number}_digits 保留小数的位数
             */
            __fstCore.TOOLS.g_u_getDecimal = function(_numStr, _digits) {
                if (this.g_isNumeric(_numStr)) {
                    _numStr = this.g_getNumber(_numStr)
                    return _numStr.toFixed(_digits);
                } else {
                    var _num = this.g_getNumber(_numStr);
                    if (_num != null) {
                        return _num.toFixed(_digits);
                    }
                }
                return _numStr;
            };
            /*
             * 精确安全除法
             * @param num1
             * @param num2
             * @return {Number}
             */
            __fstCore.TOOLS.g_u_math_div = function(num1, num2) {
                var t1 = 0,
                    t2 = 0,
                    r1, r2;
                num1 = num1 + "";
                num2 = num2 + "";
                try {
                    t1 = num1.split(".")[1].length;
                } catch (e) {}
                try {
                    t2 = num2.split(".")[1].length;
                } catch (e) {}
                with(Math) {
                    r1 = Number(num1.replace(".", ""));
                    r2 = Number(num2.replace(".", ""));
                    return __fstCore.TOOLS.g_u_math_mul((r1 / r2), Math.pow(10, t2 - t1));
                }
            };
            /*
             * 精确安全乘法
             * @param num1
             * @param num2
             * @return {number}
             */
            __fstCore.TOOLS.g_u_math_mul = function(num1, num2) {
                var m = 0,
                    s1 = num1 + "",
                    s2 = num2 + "";
                try {
                    m += s1.split(".")[1].length;
                } catch (e) {}
                try {
                    m += s2.split(".")[1].length;
                } catch (e) {}
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
            };
            /*
             * 精确安全加法
             * @param num1
             * @param num2
             * @return {number}
             */
            __fstCore.TOOLS.g_u_math_add = function(num1, num2) {
                var r1, r2, m;
                try {
                    r1 = (num1 + "").split(".")[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = (num2 + "").split(".")[1].length;
                } catch (e) {
                    r2 = 0;
                }
                m = Math.pow(10, Math.max(r1, r2));
                return (num1 * m + num2 * m) / m;
            };
            /**
             * 精确安全减法
             * @param {number}num1
             * @param {number}num2
             * @return {number}
             */
            __fstCore.TOOLS.g_u_math_sub = function(num1, num2) {
                var r1, r2, m, n;
                try {
                    r1 = (num1 + "").split(".")[1].length
                } catch (e) {
                    r1 = 0
                }
                try {
                    r2 = (num2 + "").split(".")[1].length
                } catch (e) {
                    r2 = 0
                }
                m = Math.pow(10, Math.max(r1, r2));
                //动态控制精度长度
                n = (r1 >= r2) ? r1 : r2;
                return ((num1 * m - num2 * m) / m).toFixed(n);
            };

            //在右侧补充指定num的值:"1234" [ ,1,2,3,4]
            __fstCore.TOOLS.g_Array_ext_addValByRight = function(_array, limit, repVal) {
                var arrays = [];
                if (this.g_isArray(_array)) {
                    arrays = arrays.concat(_array);
                    var _repVal = '';
                    if (repVal) {
                        _repVal = repVal;
                    }
                    if (limit && limit > 0) {
                        var rel = arrays.length; //实际数组的大小
                        if (limit > rel) {
                            for (var i = 0; i < limit - rel; i++) {
                                arrays.push(_repVal);
                            }
                        } else if (limit < rel) {
                            //[1,2,3,4,5] 2
                            arrays.splice(limit, rel - limit);
                        } else {}
                    }
                }
                return arrays;
            };

            //在左侧补充指定num的值:"1234" [ ,1,2,3,4]
            __fstCore.TOOLS.g_Array_ext_addValByLeft = function(array, limit, repVal) {
                if (array) {
                    var _repVal = '';
                    if (repVal) {
                        _repVal = repVal;
                    }
                    if (limit && limit > 0) {
                        var rel = array.length; //实际数组的大小
                        if (limit > rel) {
                            for (var i = 0; i < limit - rel; i++) {
                                array.unshift(_repVal);
                            }
                        } else if (limit < rel) {
                            //[1,2,3,4,5] 2
                            array.splice(limit, rel - limit);
                        } else {}
                    }
                }
                return array;
            };
            /*
             * 单字符分割数据,并在左侧补充指定num的相同值:"1234" [ ,1,2,3,4]
             * @param str
             * @param {number}limit 总共大小,不足的话以repVal向左侧添加
             * @param {object}repVal
             * @return {Array}
             */
            __fstCore.TOOLS.g_u_splitByLeft = function(str, limit, repVal) {
                var _str = str + "";
                var _repVal = ''; //默认空值
                if (str) {
                    if (repVal) {
                        _repVal = repVal;
                    }
                    var rt = _str.split('');
                    if (limit && limit > 0) {
                        var rel = rt.length; //实际被分割的大小
                        if (limit > rel) {
                            for (var i = 0; i < limit - rel; i++) {
                                rt.unshift(_repVal);
                            }
                        } else if (limit < rel) {
                            rt = rt.slice(0, limit);
                        } else {}
                    }
                    return rt;
                }
                return null;
            };
            /*
             * 单字符分割数据,并在右侧补充指定num数量的相同值:"1234" [1,2,3,4,]
             * @param str
             * @param {number}limit 总共大小,不足的话以repVal向右侧添加
             * @param {object}repVal
             * @return {Array}
             */
            __fstCore.TOOLS.g_u_splitByRight = function(str, limit, repVal) {
                var _str = str + "";
                var _repVal = ''; //默认空值
                if (str) {
                    if (repVal) {
                        _repVal = repVal;
                    }
                    var rt = _str.split('');
                    if (limit && limit > 0) {
                        var rel = rt.length; //实际被分割的大小
                        if (limit > rel) {
                            for (var i = 0; i < limit - rel; i++) {
                                rt.push(_repVal);
                            }
                        } else if (limit < rel) {
                            rt = rt.slice(0, limit);
                        } else {}
                    }
                    return rt;
                }
                return null;
            };
            /*
             * 单字符分割数据,并在左右补充指定num数量的相同值:"123" [,1,2,3,]
             * @param str
             * @param sepStr 分隔符
             * @param left
             * @param right
             * @param repVal
             */
            __fstCore.TOOLS.g_u_splitByAbout = function(str, sepStr, left, right, repVal) {
                var _str = str + "";
                var _repVal = ''; //默认空值
                var _sepStr = ',';
                if (str) {
                    if (repVal != undefined && repVal != null) {
                        _repVal = repVal;
                    }
                    if (sepStr != undefined && sepStr != null) {
                        _sepStr = sepStr;
                    }
                    var rt = _str.split(_sepStr);
                    if (left && left > 0) {
                        for (var i = 0; i < left; i++) {
                            rt.unshift(_repVal);
                        }
                    }
                    if (right && right > 0) {
                        for (var i = 0; i < right; i++) {
                            rt.push(_repVal);
                        }
                    }
                    return rt;
                }
                return null;
            };
            /**
             * //按指定的位数分批分割数据并返回数组:"1234567" [12+instr,34+instr,56+instr,7+instr]
             * @param str
             * @param num
             * @param instr  加入的数组中显示
             * @return {Array}
             */
            __fstCore.TOOLS.g_u_splitByNumAndInstr = function(str, num,instr) {
                var _str = str + "";
                if (str && num && num > 0) {
                    var rt = [];
                    var s = _str.length / num;
                    if ((s + "").indexOf(".") != -1) {
                        s += 1;
                    }
                    for (var i = 0; i < s; i++) {
                        rt.push(_str.substr(i, num)+instr);
                        _str = _str.substr(num - 1);
                    }
                    return rt;
                }
                return _str.split('');
            };
            /**
             * //按指定的位数分批分割数据并返回数组:"1234567" [12,34,56,7]
             * @param str
             * @param num
             * @return {Array}
             */
            __fstCore.TOOLS.g_u_splitByNum = function(str, num) {
                var _str = str + "";
                if (str && num && num > 0) {
                    var rt = [];
                    var s = _str.length / num;
                    if ((s + "").indexOf(".") != -1) {
                        s += 1;
                    }
                    for (var i = 0; i < s; i++) {
                        rt.push(_str.substr(i, num));
                        _str = _str.substr(num - 1);
                    }
                    return rt;
                }
                return _str.split('');
            };

            __fstCore.TOOLS.g_Object_length = function(obj) {
                if (!obj) {
                    return -1;
                }
                if(_fcTools_.g_isArray(obj)){
                    return obj.length;
                }
                if(_fcTools_.g_isPlainObject(obj)){
                    //如果是对象
                    var n =0;
                    for(var i in obj){
                        if(!$.isFunction(i)){
                            n++;
                        }
                    }
                    return n;
                }
                return ("" + obj).length;
            };

            /**
             * 去除字符串或数组中多余的前面0:"022"="22"
             * @param str$Array
             * @return {*}
             */
            __fstCore.TOOLS.g_u_trimFrontZero = function(str$Array) {
                var rt = str$Array;
                if (rt) {
                    var a = __fstCore.TOOLS.g_isArray(str$Array);
                    if (!a) {
                        //默认字符串或数字
                        return rt.replace(/\b(0+)/gi, "");
                    } else {
                        for (var i = 0; i < rt.length; i++) {
                            var rv = rt[i];
                            rt[i] = rv.replace(/\b(0+)/gi, "");
                        }
                    }
                }
                return rt;
            };
            /*
             * object类型的深度复制
             * @param areObj 被复制的对象 数组或对象
             * @param isDeep 被复制的对象 是否深复制,默认深复制
             * @return {*}
             */
            __fstCore.TOOLS.g_Object_Clone = function(areObj,isDeep) {
                var rt;
                if(areObj){
                    var _isDeep = true;
                    if(isDeep){
                        _isDeep = isDeep ? true:false;
                    }
                    if($.isArray(areObj)){
                        if(_isDeep){
                            rt = $.extend(_isDeep,[],areObj);
                        }else{
                            rt = $.extend([],areObj);
                        }
                    }else{
                        if(_isDeep){
                            rt = $.extend(_isDeep,{},areObj);
                        }else{
                            rt = $.extend({},areObj);
                        }
                    }
                }else{
                    rt =  areObj;
                }
                return areObj;
            };

            /*
             * 随机数:可均衡获取0-(seed-1)随机整数
             * @param {number}seed
             * @return {number}
             */
            __fstCore.TOOLS.g_u_random_floor = function(seed) {
                if (seed != undefined && seed != null) {
                    return Math.floor(Math.random() * seed);
                } else {
                    return -1;
                }
            };

            __fstCore.TOOLS.g_I18nMsg_pageBase = function (code,params){
                if (code == undefined || code == null || code == ""){
                    return "ERROR:code must be passed correctly!";
                }
                if($.isNumeric(code.substring(0, 1))){
                    return code;
                }
                var _pageBase = "__g_i18n_pageBase_Resource__";
                _rtVal = eval(_pageBase + "." + code);
                if(!_rtVal){
                    return code;
                }else{
                    return _rtVal;
                }
            }

            //=================TOOLS end==========================
        })($);

        //=================PostInfo start=====================
        /******************************************************************
         * 统一的ajax请求,对同样请求的url做短时间内重复提交处理
         *
         ******************************************************************/
        /*
         * @param url
         * @param rqPms
         * @param callBackOk 服务器正常返回请求数据
         * @param callBackError 服务器无法正常返回请求数据
         * @param _reqConfig
         * @return {*}
         * @constructor
         */
        __fstCore.PostInfo = function (url, rqPms, callBackOk,callBackError,_reqConfig) {
            var rtSoRtJo = null;
            var rqPmData = null;//请求参数
            //请求参数url不能为空
            _fcTools_.g_IsNull(url,'url');
            url = _fcTools_.g_Site_autoAddRoot(url);
            //url中不允许传递参数,如需要请在rqPms设置
            _fcTools_.g_IsTrue(!_fcTools_.g_String_ext_contains(url,'?'),'url is not allowed to pass parameters, such as the need to set in the rqPms!');
            if(rqPms){
                if(!_fcTools_.g_isJsClass(rqPms,'SoPJ')){
                    //请使用SoPmJo对象传入参数
                    _fcTools_._Cp_alert_('Please use SoPmJo object passed parameters!',_G_FST_VAL.ENUM_prefix.ajax);
                    return rtSoRtJo;
                }
            }
            if(!rqPms){
                rqPms = new SoPmJo();
            }
            var _reqCfg = null;
            if (_reqConfig != undefined && _reqConfig != null) {
                _reqCfg = _reqConfig;
            } else {
                _reqCfg = new ReqConfig();
            }
            var _chReq = 'R^'+url;
            if(_reqCfg.$_bsIsChUrl){
                //1.校验同样的请求间隔时间是否太短或是否正在执行中
                if(_fcCache_.containsC(_chReq)){
                    //同样的请求正在执行中,所以忽略本次请求,并稍后再试
                    _fcTools_._Cp_console_log_('The same request is being executed, so ignore this request and try again later!',_G_FST_VAL.ENUM_prefix.ajax);
                    return rtSoRtJo;
                }else{
                    _fcCache_.setC(_chReq,1);
                }
            }

            //2.开始判断是否要加密某些参数
            var mdPms = rqPms.getReqNeedEnParams();
            if(_fcTools_.g_IsNotNull(mdPms)){
                var mp = FST_C_T.g_Md_encrypt(mdPms);
                if(mp){
                    $.extend(rqPms._inDS_,mp);
                    rqPms.addItem("_MD_",true);//需要解密
                }
            }
            rqPmData = rqPms.getReqParams();
            var myDate = new Date();
            var mytime1;
            var mytime2;
            //开始请求
            $.ajax({
                type: _reqCfg.$_rqType,
                url: url,
                data: rqPmData,
                dataType: _reqCfg.$_dataType,
                cache: _reqCfg.$_isCache,
                async: _reqCfg.$_isAsync,
                timeout: _reqCfg.$_timeOut,
                beforeSend:function(rqObj,opts){
                    //请求之前
                    //加载 loading样式
                    mytime1=myDate.toLocaleTimeString();
                    __maskShow(_G_FST_VAL.ENUM_mask.LdId);
                },
                success:function(dt,stV, rqObj){
                    mytime2=myDate.toLocaleTimeString();
                    if(true){
                    }
                    //成功
                    var _json = _fcTools_.g_Str2ObjectParse(dt);
                    if(!_json){
                        _json = dt;
                    }
                    rtSoRtJo = new SoRtJo();
                    rtSoRtJo.putJsonBusiObj(_json);
                    //1.处理登陆信息
                    if (rtSoRtJo.getStateCode() == '-111') {
                        //账号被踢
                        var _wtop = window.top.document.getElementById("right_frame_id") || null;
                        if(_wtop){
                            var isrc = _wtop.src+'';
                            if(isrc.indexOf("index.html")!=-1){
                                JAlert(rtSoRtJo.getErrorMsg(),15,null,function(b){
                                    FST_C_T.g_TopWin_setWinIframeSrc(FST_C_T.g_Site_getRoot() + "/html/login.html");
                                });
                            }else{
                                FST_C_T.g_TopWin_setWinIframeSrc(FST_C_T.g_Site_getRoot() + "/html/login.html");
                            }
                            //_wtop.scrolling = 'no';
                        }else{
                            window.top.location.href = FST_C_T.g_Site_getRoot() + "/";
                        }
                        //rtSoRtJo = null;
                        return null;

                    }else if(rtSoRtJo.getStateCode() == '-112'){
                        //平台休市
                        var _wtop = window.top.document.getElementById("right_frame_id") || null;
                        if(_wtop){
                            var isrc = _wtop.src+'';
                            if(isrc.indexOf("index.html")!=-1){
                                JAlert(rtSoRtJo.getErrorMsg(),15,null,function(){
                                    FST_C_T.g_TopWin_setWinIframeSrc(FST_C_T.g_Site_getRoot() + "/html/login.html");
                                });
                            }else{
                                FST_C_T.g_TopWin_setWinIframeSrc(FST_C_T.g_Site_getRoot() + "/html/login.html");
                            }
                            // _wtop.scrolling = 'auto';
                        }else{
                            window.top.location.href = FST_C_T.g_Site_getRoot() + "/";
                        }
                        //rtSoRtJo = null;
                        return null;
                    }else{
                    }

                    if(callBackOk){
                        callBackOk(rtSoRtJo);
                    }
                },
                error:function(rqObj,stV, stRpT){
                    //失败
                    _fcTools_._Cp_console_log_("PostInfo:"+url+"\n"+rqObj.status+";"+stV+";"+stRpT,_G_FST_VAL.ENUM_prefix.ajax);
                    if(callBackError){
                        callBackError();
                    }
                },
                complete:function(rqObj, stV){
                    //完成以后
                    //清除当前请求的缓存
                    if(_reqCfg.$_bsIsChUrl){
                        _fcCache_.removeC(_chReq);
                    }
                    //隐藏 loading样式
                    __maskHide(_G_FST_VAL.ENUM_mask.LdId);

                }
            });
            return rtSoRtJo;
        };

        /*
         * Repeat synchronization request
         * 重复同步请求(用于请求服务器返回异常情况),并且在正常PostInfo请求后
         * @param {string}url
         * @param rqPms
         * @param {number}reqNum
         * @constructor
         */
        __fstCore.RepeatSynPostInfo = function(url, rqPms,reqNum){
            var rt = null;
            try{
                if(url&&reqNum){
                    var _url = _fcTools_.g_Site_autoAddRoot(url);
                    var _reqCfg = new ReqConfig();
                    _reqCfg.$_isAsync = false;
                    if(!rqPms || !_fcTools_.g_isJsClass(rqPms,'SoPJ')){
                        rqPms = new SoPmJo();
                    }
                    var _rqPmData = rqPms.getReqParams();
                    var _isC = true;
                    for(var t = 0 ; t < reqNum;t++){
                        if(!_isC){
                            break;
                        }
                        $.ajax({
                            type: _reqCfg.$_rqType,
                            url: _url,
                            data: _rqPmData,
                            dataType: _reqCfg.$_dataType,
                            cache: _reqCfg.$_isCache,
                            async: _reqCfg.$_isAsync,
                            timeout: _reqCfg.$_timeOut,
                            success:function(dt,stV, rqObj){
                                //成功
                                var _json = _fcTools_.g_Str2ObjectParse(dt);
                                if(!_json){
                                    _json = dt;
                                }
                                rt = new SoRtJo();
                                rt.putJsonBusiObj(_json);
                                //处理登陆信息
                                if (rt.getStateCode() == '-111') {
                                    //账号被踢
                                    rt = null;
                                    _isC = false;
                                }else if(rt.getStateCode() == '-112'){
                                    //平台休市
                                    rt = null;
                                    _isC = false;
                                }else{
                                    if(rt.isRtValid()){
                                        _isC = false;
                                    }
                                }
                            },
                            error:function(rqObj,stV, stRpT){
                                //失败
                                _fcTools_._Cp_console_log_("RepeatSynPostInfo:"+url+"\n"+rqObj.status+";"+stV+";"+stRpT,_G_FST_VAL.ENUM_prefix.ajax);
                                rt = null;
                                _isC = false;
                            }
                        });
                    }
                }
            }catch (e){
                rt = null;
            }
            return rt;
        };
        //=================PostInfo end  ===================

        //=================art start  =====================
        /******************************************************************
         * arttemplate 插件封装
         *
         ******************************************************************/
        (function($){
            //内嵌template.js
            function __initTemplateJs(){
                !function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(y)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return m+=a.split(/\n/).length-1,k&&(a=a.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),a&&(a=s[1]+b(a)+s[2]+"\n"),a}function f(b){var c=m;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return m++,"$line="+m+";"})),0===b.indexOf("=")){var e=l&&!/^=[=#]/.test(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=s[1]+b+s[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!p[a]){var b;b="print"===a?u:"include"===a?v:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,w+=a+"="+b+",",p[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,l=d.escape,m=1,p={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},q="".trim,s=q?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],t=q?"$out+=text;return $out;":"$out.push(text);",u="function(){var text=''.concat.apply('',arguments);"+t+"}",v="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+t+"}",w="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),x=s[0],y="return new String("+s[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?x+=e(b):(x+=f(b),c&&(x+=e(c)))});var z=w+x+y;g&&(z="try{"+z+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var A=new Function("$data","$filename",z);return A.prototype=n,A}catch(B){throw B.temp="function anonymous($data,$filename) {"+z+"}",B}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;d>c;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(j){return j.filename=h||"anonymous",j.name="Syntax Error",p(j)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g,y=/^$|,+/;e.openTag="{{",e.closeTag="}}";var z=function(a,b){var c=b.split(":"),d=c.shift(),e=c.join(":")||"";return e&&(e=", "+e),"$helpers."+d+"("+a+e+")"};e.parser=function(a){a=a.replace(/^\s/,"");var b=a.split(" "),c=b.shift(),e=b.join(" ");switch(c){case"if":a="if("+e+"){";break;case"else":b="if"===b.shift()?" if("+b.join(" ")+")":"",a="}else"+b+"{";break;case"/if":a="}";break;case"each":var f=b[0]||"$data",g=b[1]||"as",h=b[2]||"$value",i=b[3]||"$index",j=h+","+i;"as"!==g&&(f="[]"),a="$each("+f+",function("+j+"){";break;case"/each":a="});";break;case"echo":a="print("+e+");";break;case"print":case"include":a=c+"("+b.join(",")+");";break;default:if(/^\s*\|\s*[\w\$]/.test(e)){var k=!0;0===a.indexOf("#")&&(a=a.substr(1),k=!1);for(var l=0,m=a.split("|"),n=m.length,o=m[l++];n>l;l++)o=z(o,m[l]);a=(k?"=":"=#")+o}else a=d.helpers[c]?"=#"+c+"("+b.join(",")+");":"="+a}return a},"function"==typeof define?define(function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d,window.template=d}();
            }
            __initTemplateJs();
            if (typeof template == 'undefined') {
                _fcTools_._Cp_alert_('template.js is not found!');
            }
            function __atp_compile(source, options) {
                return template.compile(source, options);
            }
            function __atp_helper(name, callback) {
                var rt = template.helper(name, callback);
                if (rt) {
                    return rt;
                }
                return null;
            }
            function __atp_config(name, value) {
                var rt = template.config(name, value);
                if (rt) {
                    return rt;
                }
                return null;
            }
            //*************************************************************************/
            //向art中注册公共辅助方法
            //获取集合数据长度
            __atp_helper("$ext_Array_length", function(arrays) {
                try {
                    return arrays.length;
                } catch (e) {}
                return -1;
            });
            //目前用于投注,取html标签的text或value值._sp分隔符,默认为$
            __atp_helper("$ext_getTOrV", function(_valStr, getIdx, _sp) {
                if (!_sp) {
                    _sp = "$";
                }
                _valStr = _valStr + "";
                if (!_valStr) {
                    return _valStr;
                } else {
                    if (_valStr.indexOf(_sp) == -1) {
                        return _valStr;
                    }
                    var _getIdx = getIdx; // parseInt(getIdx+"");
                    var _ss = _valStr.split(_sp);
                    if (_getIdx != undefined && _getIdx != null && _getIdx >= 0 && _getIdx < _ss.length) {
                        return _ss[_getIdx];
                    }
                }
                return _valStr;
            });
            //_str 原始值,_eqStr比对值,_repStr替换.当_str===_eqStr,用_repStr替换
            __atp_helper("$ext_eq_replace", function(_str, _eqStr, _repStr) {
                return _str === _eqStr ? _repStr : _str;
            });
            //空值替换
            __atp_helper("$ext_nullReplace", function(obj, str) {
                if (obj != undefined && obj != null) {
                    return obj;
                } else {
                    return str;
                }
            });
            //国际化
            __atp_helper("$ext_g_I18nMsg_pageBase", function(obj,_val) {
                if (obj != undefined && obj != null) {
                    if (_val != undefined && _val != null) {
                        var obj_val = _fcTools_.g_I18nMsg_pageBase(obj);
                        if(!obj_val){
                            return _val;
                        }
                        var obj_val_str = obj_val.substring(1,obj_val.length-1);
                        var arr = obj_val_str.split(",");
                        var val_list = {};
                        for(var i=0;i<arr.length;i++){
                            var str = arr[i].split(":");
                            val_list[str[0]] = str[1];
                        }
                        return val_list[_val];
                    }else{
                        return _fcTools_.g_I18nMsg_pageBase(obj);
                    }
                }
            });
            //国际化拼接
            __atp_helper("$ext_g_I18nMsg_pageBasePinJie", function(obj,obj2,string) {
                if (obj != undefined && obj != null && obj2 != undefined && obj2 != null && string != undefined && string != null) {
                    return _fcTools_.g_I18nMsg_pageBase(obj+string+obj2);
                }
            });
            __atp_helper("$ext_subStr", function(_str, start, length,suffixStr) {
                var __str = _str+'';
                if(_str&&length&&__str.length > length ){
                    return __str.substr(start, length) + (suffixStr ? suffixStr : '');
                }else{
                    return _str;
                }
            });
            /**
             * 对日期进行格式化，
             * @param date 要格式化的日期
             * @param format 进行格式化的模式字符串
             * y:年 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
             * @return String
             */
            __atp_helper("$ext_dateFormat", function(_dtStr, format) {
                if(!_dtStr){
                    return "";
                }
                if (!format){
                    format = "yyyy-MM-dd HH:mm:ss";
                }
                format = format.replace("#", ' ');
                if (_dtStr.indexOf(".") != -1) {
                    _dtStr = _dtStr.substr(0, _dtStr.indexOf("."));
                }
                var date = new Date(_dtStr.replace(/-/gm, "/"));
                return __fstCore.TOOLS.g_Date_ext_format(date, format);
            });
            //UBB替换
            __atp_helper("$ext_ubb2Html", function(content) {
                return content.replace(/\[b\]([^\[]*?)\[\/b\]/igm, '<b>$1</b>').replace(/\[i\]([^\[]*?)\[\/i\]/igm, '<i>$1</i>').replace(/\[u\]([^\[]*?)\[\/u\]/igm, '<u>$1</u>').replace(/\[url=([^\]]*)\]([^\[]*?)\[\/url\]/igm, '<a href="$1">$2</a>').replace(/\[img\]([^\[]*?)\[\/img\]/igm, '<img src="$1" />');
            });
            //去掉所有的html标记
            __atp_helper("$ext_delHtmlTag", function(content) {
                return (content+"").replace(/<[^>]+>/g,'');
            });
            //给数字保留小数位  可传保留位数
            __atp_helper("$ext_toFixed", function(content,num) {
                return parseFloat(content).toFixed(parseInt(num));
            });
            //从传入的集合中匹配数据
            __atp_helper("$ext_getVBySet", function(objSet,key,nullRp) {
                var rt = key;
                if(objSet&&key){
                    if(typeof objSet == 'object' && !$.isFunction(objSet)){
                        return objSet[key]||nullRp||key;
                    }
                }
                return rt;
            });
            //格式化数字金额用逗号隔开保留4小数
            __atp_helper("$ext_g_Number_format_currency", function(obj) {
                if (obj != undefined && obj != null) {
                    return FST_C_T.g_numToCurrency(obj,4);
                }else{
                    return null;
                }
            });
            __atp_helper("$ext_g_Number_format_currency_exp", function(_str, start, length,suffixStr) {
                var __str = _str+'';
                var strFormat = '';
                if(_str&&length&&__str.length > length ){
                    strFormat = __str.substr(start, length) + (suffixStr ? suffixStr : '');
                }else{
                    strFormat = _str;
                }
                if (strFormat != undefined && strFormat != null) {
                    return FST_C_T.g_numToCurrency(strFormat,4);
                }else{
                    return null;
                }
            });
            //*************************************************************************/

            /******************************
             * 自定义art编译缓存
             * 1.默认设置不用插件中的缓存
             * 2.封装define cache
             *******************************/
            __atp_config("cache", false);
            __fstCore.Atp_cfg_getIsEscape = function() {
                return template.defaults.escape;
            };
            __fstCore.Atp_cfg_setIsEscape = function(b) {
                return template.defaults.escape = b || false;
            };
            /*
             * 查找模版区域并赋值
             * @param {string} id 唯一标识ID
             * @param {object} data json对象
             * @param {string} sourceStr 当id不是jsId时必传
             * @param {string} targetEleId 被赋值的元素ID
             * @constructor
             */
            __fstCore.Atp = function(id, data, sourceStr, targetEleId){
                var _rHtml = null;
                var _gp = 'ART';
                try {
                    var _rendFun = _fcCache_.getC(id,_gp);
                    if (!_rendFun) {
                        var _r = null;
                        var _cp;
                        if ("object" == typeof document) {
                            var c = document.getElementById(id);
                            if (c) {
                                //如果是jsid并且找到则返回
                                _r = (c.value || c.innerHTML).replace(/^\s*|\s*$/g, "");
                                _cp = __atp_compile(_r);
                                _fcCache_.setC(id,_cp,_gp);
                                _rendFun = _cp;
                            }
                        }
                        if (!_rendFun) {
                            if(sourceStr) {
                                _r = sourceStr.replace(/^\s*|\s*$/g, "");
                                _cp = __atp_compile(_r);
                                _fcCache_.setC(id,_cp,_gp);
                                _rendFun = _cp;
                            }
                        }
                        if (!_rendFun) {
//                            _fcTools_._Cp_alert_(id+':'+sourceStr+' is not compile!');
                            return _rHtml;
                        }
                    }
                    _rHtml = _rendFun(data);
                    if (targetEleId) {
                        if ("object" == typeof document) {
                            var _y = document.getElementById(targetEleId);
                            if (_y) {
                                $("#"+targetEleId).html(_rHtml);
                            }
                        }
                    }
                } catch (e) {
                    _fcCache_.removeC(id,_gp);
                    _rHtml = null;
                }
                return _rHtml;
            };
            //=================art end  =====================
        })($);

        //=================UI TAGLIB start  =====================
        /******************************************************************
         * UI 页面标签 插件封装
         * TableGridSetMgr:表格标签
         *
         ******************************************************************/
        __fstCore.TG = {};
        var _fcUITgs_ = __fstCore.TG;
        (function($){
            _G_FST_VAL.ENUM_art_support_tmps['tbgrid_head_body_box'] =
                '<div id="Tg_div_{{PkId}}" class="dataTables_wrapper no-footer">'
                +'<table border="1" cellspacing="0" cellpadding="" class="mainTab col-md-10" id="Tg_{{PkId}}" style="width:{{tbWidth}}">'
                +'<thead>'
                +'    <tr>'
                +'      {{each DBGridDataHCols as DGdhc j}}'
                +'          {{if DBGridDataHColAttrs[DGdhc].isBsdC}}'
                +'              <th id="{{DGdhc}}" style="display:{{DBGridDataHColAttrs[DGdhc].isHide ? "none" : "table-cell" }};width:{{DBGridDataHColAttrs[DGdhc].colW}};">{{DBGridDataHColAttrs[DGdhc].name}}</th>'
                +'          {{else}}'
                //序号
                +'              {{if DGdhc == "Sp_BSD_Seq"}}<th id="{{DGdhc}}" style="width:{{DBGridDataHColAttrs[DGdhc].colW}};">\u5e8f\u53f7</th>{{/if}}'
                //选择
                +'              {{if DGdhc == "Sp_BSD_Ms"}}<th id="{{DGdhc}}" style="width:{{DBGridDataHColAttrs[DGdhc].colW}};"><input type="checkbox" id="Sp_BSD_Ms_all"></th>{{/if}}'
                +'          {{/if}}'
                +'      {{/each}}'
                +'    </tr>'
                +'</thead>'
                +'<tbody id="Tg_data_{{PkId}}" >'
                +'    <tr>'

                +'    </tr>'
                +'</tbody>'
                +'<tfoot id="Tg_foot_{{PkId}}" align="right"  >'

                +'</tfoot>'
                +'</table>'
                +'</div>';

            _G_FST_VAL.ENUM_art_support_tmps['tbgrid_foot'] =
                '    <tr >'
                +'        <td class="text-r" colspan="{{RealColNum}}">'
                +'            共 <span id="{{PkId}}_pgc">{{PageCount}}</span> 页 {{TotalNum}} 条 ,&nbsp;'
                +'            第 <input type="text" class="level3" id="Tg_goToPage_{{PkId}}" value="{{CurrPage}}" style="width:55px;text-align: center;height: 23px;margin-left: 0.5%;box-shadow: 0 0 0 #A5A7A7;cursor: text;position: relative;top: 0px;line-height: 23px;display: inline-block;text-indent: initial;font-size: 16px;"  title="\u5f53\u524d\u7b2c{{CurrPage}}\u9875"/> 页'
                +'            <a tag="goto" pkId="{{PkId}}" title="\u76f4\u63a5\u5b9a\u4f4d\u9875" onclick="FST_C_UTG_TGSM.TableRowData_turnPage(this)" style="cursor:pointer">Go</a>&nbsp;'
                +'            <a tag="first" pkId="{{PkId}}" title="\u9996\u9875" onclick="FST_C_UTG_TGSM.TableRowData_turnPage(this)" style="cursor:pointer">首页</a>'
                +'            <a tag="previous" id="guding" pkId="{{PkId}}" title="\u4e0a\u4e00\u9875" onclick="FST_C_UTG_TGSM.TableRowData_turnPage(this)" style="cursor:pointer">上一页</a>'
                +'            <a tag="next" pkId="{{PkId}}" title="\u4e0b\u4e00\u9875" onclick="FST_C_UTG_TGSM.TableRowData_turnPage(this)" style="cursor:pointer">下一页</a>'
                +'            <a tag="last" pkId="{{PkId}}" title="\u672b\u9875" onclick="FST_C_UTG_TGSM.TableRowData_turnPage(this)" style="cursor:pointer">末页</a>'
                +'        </td>'
                +'   </tr>';

            _G_FST_VAL.ENUM_art_support_tmps['tbgrid_data'] =
                '{{if DBGridData == null || DBGridData.length == 0}}'
                +'    <tr >'
                +'          <td colspan="{{RealColNum}}" align="center" >'
                //无数据, 请检查!
                +'             <label style="color: red" id="Tg_DataDivTips_{{PkId}}">\u65e0\u6570\u636e\u002c\u8bf7\u68c0\u67e5\u0021</label> '
                +'          </td>'
                +'    </tr>'
                +'{{else}}'
                +'{{each DBGridData as DGd i}}'
                +'    <tr class="text-c">'
                +'       {{each DBGridDataHCols as DGdhc k}}'
                +'          {{if DBGridDataHColAttrs[DGdhc].isBsdC}}'
                +'               <td id="{{DGdhc}}" spv="{{DBGridDataHColAttrs[DGdhc].txtSize ? DGd[DGdhc] :"" }}" title="{{DBGridDataHColAttrs[DGdhc].titleStr ? DBGridDataHColAttrs[DGdhc].titleStr  : DBGridDataHColAttrs[DGdhc].isTitle ? DGd[DGdhc]:"" }}" style="display:{{DBGridDataHColAttrs[DGdhc].isHide ? "none" : "table-cell" }};{{$ext_nullReplace DBGridDataHColAttrs[DGdhc].dtCss,""}}" >'
                +'                   {{if DBGridDataHColAttrs[DGdhc].isEscape}}'
                +'                      {{if DBGridDataHColAttrs[DGdhc].isInternate == true}}    '
                +'                          {{if DBGridDataHColAttrs[DGdhc].namelist}}'
                +'                              <span id="{{DGdhc}}_span_{{i}}" value ="{{DGd[DGdhc]}}" name="{{DGdhc}}_span">{{$ext_g_I18nMsg_pageBase DBGridDataHColAttrs[DGdhc].namelist,DGd[DGdhc]}}</span>'
                +'                          {{else}}'
                +'                              {{$ext_g_I18nMsg_pageBase DBGridDataHColAttrs[DGdhc].nameTs+"_"+DGd[DGdhc]}}'
                +'                          {{/if}}'
                +'                      {{else}}    '
                +'                          {{if DBGridDataHColAttrs[DGdhc].format == true}}    '
                +'                             {{$ext_g_Number_format_currency_exp DGd[DGdhc],0,DBGridDataHColAttrs[DGdhc].txtSize,"..."}}'
                +'                          {{else}}    '
                +'                              {{$ext_subStr DGd[DGdhc],0,DBGridDataHColAttrs[DGdhc].txtSize,"..."}}'
                +'                          {{/if }}'
                +'                      {{/if }}'
                +'                   {{else}}'
                +'                       {{if DBGridDataHColAttrs[DGdhc].type == "a"}}                 '
                +'                          {{if DGd[DGdhc] != null}}'
                +'                               <a id="{{DGdhc}}_a_{{i+1}}" name="{{DGdhc}}_a">{{$ext_subStr DGd[DGdhc],0,DBGridDataHColAttrs[DGdhc].txtSize,"..."}}</a>'
                +'                          {{else}}'
                // +'                              <a id="{{DGdhc}}_a_{{i+1}}" name="{{DGdhc}}_a" style="color: #09c">{{$ext_g_I18nMsg_pageBase DGdhc}}</a>'
                +'                              <a id="{{DGdhc}}_a_{{i+1}}" name="{{DGdhc}}_a" class="c-lb">{{$ext_g_I18nMsg_pageBase DGdhc}}</a>'
                +'                          {{/if }}'
                +'                       {{else if DBGridDataHColAttrs[DGdhc].type == "button"}}                 '
                +'                          {{if DGd[DGdhc] != null}}'
                +'                           <input type="button" id="{{DGdhc}}_b_{{i+1}}" name="{{DGdhc}}_b" value="{{$ext_subStr DGd[DGdhc],0,DBGridDataHColAttrs[DGdhc].txtSize,"..."}}"> '
                +'                          {{else}}'
                +'                         <input type="button" id="{{DGdhc}}_b_{{i+1}}" name="{{DGdhc}}_b" value="{{$ext_g_I18nMsg_pageBase DGdhc}}"> '
                +'                          {{/if }}'
                +'                       {{else if DBGridDataHColAttrs[DGdhc].type == "checkbox"}}                 '
                +'                         <input type="checkbox" id="{{DGdhc}}_c_{{i+1}}" name="{{DGdhc}}_c" value="{{$ext_subStr DGd[DGdhc],0,DBGridDataHColAttrs[DGdhc].txtSize,"..."}}">'
                +'                        {{else}}'
                +'                          {{$ext_subStr {{#DGd[DGdhc]}},0,DBGridDataHColAttrs[DGdhc].txtSize,"..."}}'
                +'                        {{/if }}'
                +'                   {{/if}}'
                +'               </td>'
                +'          {{else}}'
                +'              {{if DGdhc == "Sp_BSD_Seq"}}<td id="{{DGdhc}}">{{i+1}}</td>{{/if}}'
                +'              {{if DGdhc == "Sp_BSD_Ms" }}<td id="{{DGdhc}}"><input type="checkbox" name="{{DGdhc}}_ck" title="\u9009\u4e2d\u5f53\u524d\u884c"/></td>{{/if}}'
                +'          {{/if}}'
                +'       {{/each}}'
                +'    </tr>'
                +'{{/each}}'
                +'{{/if}}';

            _initTableGridSetMgr();
            function _initTableGridSetMgr(){
                //表格统一管理器
                __fstCore.TG.TableGridSetMgr = {
                    _inDSC_ : [],//内部数据缓存存储器
                    put : function(pk,tbObj) {
                        this._inDSC_[pk] = tbObj;
                        return tbObj;
                    },
                    //有缓存时是否要清除并重新初始化
                    get : function(pk, isClear$ReInit,flag) {
                        var result = this._inDSC_[pk];
                        if(isClear$ReInit){
                            this._inDSC_[pk] = null;
                            result = null;
                        }
                        if (!result) {
                            if(document){
                                var obj = document.getElementById(pk) || document.all[pk] || null;
                                if (!obj) return null;
                                if(flag){
                                    result = new TableRowData(pk,flag);
                                }else{
                                    result = new TableRowData(pk);
                                }
                                this.put(pk,result);
                            }
                        }
                        return result;
                    },
                    TableRowData_turnPage:function(pEleObj){
                        if(!pEleObj){
                            return;
                        }
                        var pkId = pEleObj.getAttribute("pkId");
                        var tag = pEleObj.getAttribute("tag");
                        var tgObj = this.get(pkId);
                        if(tgObj){
                            tgObj.turnPage(tag);
                        }
                    },
                    refreshDt:function(pk,isRefLastStayPage){
                        var result = this._inDSC_[pk];
                        if(result){
                            if(isRefLastStayPage&&result.refLastStayPage){
                                result.refLastStayPage();
                            }else{
                                if(result.refresh){
                                    result.refresh();
                                }
                            }
                        }
                    }

                };
                /**
                 * 表格数据集组件 构造方法
                 * @param pkId show Div Id
                 * @constructor
                 */
                function TableRowData(pkId,flag) {
                    //内部私有属性
                    var __$PRIVATE_V$__ = {
                        DBGridPK : pkId,//公有属性
                        tbDivId : "Tg_div_" + pkId,//模版中表格divId
                        tbTableId : "Tg_" + pkId,
                        tbFootDivId : "Tg_foot_" + pkId,
                        tbDataDivId : "Tg_data_"+ pkId,
                        tbGoToPageId : "Tg_goToPage_" + pkId,
                        tbDataDivTipsId : "Tg_DataDivTips_" + pkId,
                        //样式
                        tbWidth : '',// '100%' '200px'
                        //tbHeight : null,

                        //非数据列设置
                        isRowSequence : false,//是否显示序号
                        isMutilSelect : false,//是否显示checkBox

                        //分页设置
                        pageSize : 15,//每页显示的大小
                        currPage : 1, //当前页数
                        pageCount : 1, //总页数 get
                        totalNum : 0, //数据总数 get

                        //数据列元素设置
                        columns : [], //表头列 [code]
                        colAttrs : {},//列字段关联的完整属性{code:{name:'',colW:'10%',isEscape:boolean,isHide:boolean,isSort:boolean}...
                        sortColSet : {},//有排序的数据列数据存放

                        //设置查询条件
                        isHasCond : false, //是否有业务查询条件
                        queryCond : new SoPmJo(), //查询条件对象
                        query_dataAction : '',//查询action
                        callBackAfterHasData : null,//数据出来以后的回调函数

                        //设置事件绑定 通过委托方式,只要绑定一次即可
                        rowColTdsEvent : {
                            'RN':0,//执行次数
                            'EVENT':null,//事件类型
                            'FUN':null,//回调执行函数对象
                            'IS_MS_FAIL':true,
                            'IS_SEQ_FAIL':true,
                            'AP_COLS':null,//指定列生效[]
                            'EXT_ON_CFG':null//{}
                        },
                        isShowFoot : true //显示分页
                    };
                    if(flag){
                        __$PRIVATE_V$__.tbFootDivId = '';
                    }
                    //===============提供属性的get,set 私有方法 public================
                    var __$PRIVATE_M$__ = {}; //内部方法
                    __$PRIVATE_M$__._getColAttrs = function(code){
                        if(code){
                            return __$PRIVATE_V$__.colAttrs[code];
                        }else{
                            return __$PRIVATE_V$__.colAttrs;//{}
                        }
                    };
                    __$PRIVATE_M$__._setColAttrs = function(isDataC,code, name,isHide,type,isInternate,format,namelist,dcCss,isTitleDef,titleStr,txtSize,isSort,isEscape,colWidth,colHeight){
                        __$PRIVATE_V$__.colAttrs[code] = {
                            'isBsdC': isDataC ,//是否业务数据列 boolean;非数据列使用
                            'name':_fcTools_.g_I18nMsg_pageBase(name),
                            'nameTs':name,
                            'isHide':isHide,//boolean
                            'type':type,
                            'isInternate':isInternate,
                            'namelist':namelist,
                            'format':format,
                            'dtCss':dcCss || null,
                            'isTitle':isTitleDef,
                            'titleStr':titleStr||null,
                            'txtSize':txtSize||0,
                            'isSort':isSort,//boolean
                            'isEscape':isEscape,//boolean
                            'colW':colWidth,
                            'colH':''
                        }
                    };
                    __$PRIVATE_M$__._getSortColSet = function(code){
                        if(code){
                            return __$PRIVATE_V$__.sortColSet[code];
                        }else{
                            return __$PRIVATE_V$__.sortColSet;//{}
                        }
                    };
                    __$PRIVATE_M$__._setRowColTdsEvent = function(event,dealFun,assignCols,failMs,failSeq,extOnCfg){
                        __$PRIVATE_V$__.rowColTdsEvent.EVENT = event;
                        __$PRIVATE_V$__.rowColTdsEvent.FUN = dealFun;
                        __$PRIVATE_V$__.rowColTdsEvent.IS_MS_FAIL = failMs!=undefined?failMs : true;
                        __$PRIVATE_V$__.rowColTdsEvent.IS_SEQ_FAIL = failSeq!=undefined?failSeq : true;
                        __$PRIVATE_V$__.rowColTdsEvent.AP_COLS = assignCols || null;
                        __$PRIVATE_V$__.rowColTdsEvent.EXT_ON_CFG = extOnCfg || null;
                    };

                    __$PRIVATE_M$__.__checkParamsIsPass = function(){
                        var rt = false;
                        var dbPkId = _selfAttr.DBGridPK || null;
                        if (!dbPkId) {
                            _fcTools_._Cp_alert_("DBGridPK is not null!");
                            return rt;
                        }
                        var obj = _selfAttr;
                        var msg = "Id:" + dbPkId + ",";
                        if (!obj.colAttrs || obj.colAttrs.length == 0) {
                            _fcTools_._Cp_alert_(msg + "colAttrs is not null!");
                            return rt;
                        }
                        if (!obj.query_dataAction) {
                            _fcTools_._Cp_alert_(msg + "query_dataAction is not null!");
                            return rt;
                        }
                        if (!obj.pageSize || obj.pageSize <= 0) {
                            _fcTools_._Cp_alert_(msg + "pageSize is not null!");
                            return rt;
                        }
                        if (obj.currPage == undefined || obj.currPage <= 0) {
                            _fcTools_._Cp_alert_(msg + "currPage is not null!");
                            return rt;
                        }
                        if (obj.pageCount == undefined  || obj.pageCount <= 0) {
                            _fcTools_._Cp_alert_(msg + "pageCount is not null!");
                            return rt;
                        }
                        if (obj.totalNum == undefined  || obj.totalNum < 0) {
                            _fcTools_._Cp_alert_(msg + "totalNum is not null!");
                            return rt;
                        }
                        return true;
                    };

                    var _selfAttr = __$PRIVATE_V$__;
                    var _selfMethod = __$PRIVATE_M$__;

                    //===============================
                    /*
                     * 添加表头列
                     * @param {string}code
                     * @param {string}name
                     * @param {boolean}isHide (标题列显示类型设置)默认false
                     * @param {string}type
                     * @param {boolean}isInternate (标题列显示类型设置)默认false
                     * @param {boolean}format (数字转换成金额格式)默认false
                     * @param {string}namelist (国际化数据list)
                     * @param {object}dataColCss 当前数据列的样式 :"color:red;width:20" 或 "className"
                     * @param {boolean}isTitleDef :是否在数据列上显示title默认数据列的值;默认不显示任何信息
                     * @param {string}titleStr :自定义title值  优先级最高
                     * @param {number}txtSize :列中固定显示字符长度
                     * @param {boolean}isSort 是否出现排序功能 默认false
                     * @param {boolean}isEscape 是否编码输出HTML字符:true 当字符串输出,默认true
                     * @param {string}colWidth :'50%' '20px'
                     * @param {string}colHeight :'100px'(暂时不用)
                     * @param {string}type :a button checkbox 类标签的封装(可以使用)
                     */
                    this.addColAttr = function(code, name,isHide,type,isInternate,format,namelist,dataColCss,isTitleDef,titleStr,txtSize,isSort,isEscape,colWidth,colHeight) {
                        var _isEscape = __fstCore.Atp_cfg_getIsEscape();
                        if (isEscape!=undefined&&isEscape!=null) {
                            _isEscape = isEscape;
                        }
                        var _isHide = false;
                        if (isHide!=undefined&&isHide!=null) {
                            _isHide = isHide;
                        }
                        var _type = '';
                        if (type!=undefined&&type!=null) {
                            _type = type;
                            _isEscape = false;
                        }
                        var _isInternate = false;
                        if (isInternate!=undefined&&isInternate!=null) {
                            _isInternate = isInternate;
                        }
                        var _namelist = "";
                        if (namelist!=undefined&&namelist!=null) {
                            _namelist = namelist;
                        }
                        var _format = false;
                        if (format!=undefined&&format!=null) {
                            _format = format;
                        }
                        var _txtSize = 0;//显示全部
                        if (txtSize!=undefined&&txtSize!=null) {
                            _txtSize = txtSize;
                        }
                        var _colW = '';
                        if(colWidth!=undefined&&colWidth!=null){
                            if(_fcTools_.g_isDigit(colWidth)){
                                _colW = colWidth+'px';
                            }else{
                                _colW = colWidth;
                            }
                        }
                        var _isSort = false;
                        if (isSort!=undefined&&isSort!=null) {
                            _isSort = isSort;
                        }
                        var _isTitleDef = false;
                        if (isTitleDef!=undefined&&isTitleDef!=null) {
                            _isTitleDef = isTitleDef;
                        }
                        var _dcCss;
                        var _dcClass;
                        if (dataColCss!=undefined&&dataColCss!=null) {
                            dataColCss = dataColCss+'';
                            if(dataColCss.indexOf(":")!=-1){
                                _dcCss = dataColCss;
                            }else{
                                _dcClass = dataColCss;
                            }
                        }
                        _selfAttr.columns.push(code);
                        _selfMethod._setColAttrs(true,code, name,_isHide,_type,_isInternate,_format,_namelist,_dcCss,_isTitleDef,titleStr,_txtSize,_isSort,_isEscape,_colW);
                    };

                    /**
                     * 设置是否出现序号的非数据列
                     */
                    this.setRowSequence = function() {
                        var c = _selfAttr.columns;
                        // if(c != null && c.length != 1){
                        //     //设置序号的非数据列时必须在数据列之前第一步做
                        //     _fcTools_._Cp_alert_('Must be done before the first data column appears when you set the number of non-data columns!');
                        //     return;
                        // }else{
                            _selfAttr.columns.push('Sp_BSD_Seq');
                            _selfMethod._setColAttrs(false,'Sp_BSD_Seq', '序号',null,true,false,false,true,'40px',null);
                            _selfAttr.isRowSequence = true;
                        // }
                    };

                    /**
                     * 设置是否出现选择的非数据列
                     */
                    this.setMutilSelect = function() {
                        var c = _selfAttr.columns;
                        // if(c != null && c.length != 0){
                        //     //设置选择的非数据列时必须在数据列之前第二步做
                        //     _fcTools_._Cp_alert_('Must be done before the second data column appears when you set the selected non-data columns!');
                        //     return;
                        // }else{
                            _selfAttr.columns.push('Sp_BSD_Ms');
                            _selfMethod._setColAttrs(false,'Sp_BSD_Ms', '',true,null,false,false,true,'5px',null);
                            _selfAttr.isMutilSelect = true;
                        // }
                    };

                    /**
                     * 设置数据表格的总 宽高
                     * @param {string}width '50%' '100px'
                     * @param {string}height '100px'
                     */
                    this.setTgWidthAndHeight = function(width, height) {
                        var _width = '';
                        if(width!=undefined&&width!=null){
                            if(_fcTools_.g_isDigit(width)){
                                _width = width+'px';
                            }else{
                                _width = width;
                            }
                        }
                        if(_width){
                            _selfAttr.tbWidth  = _width;
                        }
                    };
                    /**
                     * 设置每页大小
                     * @param {number} pageSize
                     */
                    this.setPageSize = function(pageSize) {
                        if(_fcTools_.g_isDigit(pageSize) && pageSize > 0){
                            _selfAttr.pageSize  = pageSize;
                        }
                    };
                    /**
                     * @param {number} currPage
                     * @constructor
                     */
                    this.setCurrPage = function(currPage) {
                        if(_fcTools_.g_isDigit(currPage) && currPage > 0){
                            _selfAttr.currPage = currPage;
                        }
                    };
                    /**
                     * @param {string}queryDataDo
                     */
                    this.setQueryAction = function(queryDataDo) {
                        _selfAttr.query_dataAction = queryDataDo;
                    };
                    /*
                     * 设置查询条件
                     * @param {string} key
                     * @param {!function} val
                     * @param {string} blockTipId
                     */
                    this.setQueryConds = function(key, val,blockTipId) {
                        _selfAttr.queryCond.addItem(key,val,blockTipId);
                        _selfAttr.isHasCond  = true;
                    };

                    /**
                     * 设置底部分页显示 默认true显示 false不显示
                     * @param flag
                     */
                    this.setQueryShowFoot = function (flag) {
                        _selfAttr.isShowFoot = flag;
                    }

                    __$PRIVATE_M$__._getRealColNum = function () {
                        return _selfAttr.columns.length;
                    };
                    __$PRIVATE_M$__.__drawGridBox = function(){
                        var pkId = _selfAttr.DBGridPK;

                        //解析数据表格模版
                        var tgHtml, tgFootHtml;
                        try {
                            var jsonObj = {};
                            jsonObj['PkId'] = pkId;
                            jsonObj['IsMuSel'] = _selfAttr.isMutilSelect;//是否显示选择列
                            jsonObj['IsRowSeq'] = _selfAttr.isRowSequence;//是否显示序号列
                            jsonObj['RealColNum'] = _selfMethod._getRealColNum();//实际的列数

                            jsonObj['tbWidth'] = _selfAttr.tbWidth;
                            //jsonObj['tbHeight'] = _selfMethod.tbHeight;
                            jsonObj['CurrPage'] = _selfAttr.currPage;//当前页面,默认1
                            jsonObj['PageCount'] = _selfAttr.pageCount;//页面总数,默认1
                            jsonObj['TotalNum'] = _selfAttr.totalNum;//数据总数,默认0

                            jsonObj['DBGridDataHCols'] = _selfAttr.columns;//列code
                            jsonObj['DBGridDataHColAttrs'] = _selfAttr.colAttrs;//列属性

                            var _json = jsonObj;
                            //表头
                            tgHtml = __fstCore.Atp("_tbgrid_head_body_box_str", _json, _G_FST_VAL.ENUM_art_support_tmps.tbgrid_head_body_box);
                            //底部
                            if(_selfAttr.isShowFoot){
                                tgFootHtml = __fstCore.Atp("_tbgrid_foot_str", _json, _G_FST_VAL.ENUM_art_support_tmps.tbgrid_foot);
                            }


                        } catch (e) {
                            tgHtml = _G_FST_VAL.ENUM_prefix.ui_table_grid + "drawGridBox head and body:" + e.message;
                            if(_selfAttr.isShowFoot) {
                                tgFootHtml = _G_FST_VAL.ENUM_prefix.ui_table_grid + "drawGridBox foot:" + e.message;
                            }
                        }
                        $("#"+ pkId).html(tgHtml);
                        var _curTgF = document.all[_selfAttr.tbFootDivId];
                        if (_curTgF) {
                            //如果有显示底部操作区则显示
                            $("#"+_selfAttr.tbFootDivId).html(tgFootHtml);
                        }

                    };
                    __$PRIVATE_M$__.__fillGridData = function(){
                        if(!_selfMethod.__checkParamsIsPass()){
                            return;
                        }
                        var _qda = _selfAttr.query_dataAction;
                        var _qCond = _selfAttr.queryCond;
                        var _qCondParam;
                        if (!_qCond) {
                            _qCondParam = new SoPmJo();
                        } else {
                            _qCondParam = _qCond;
                        }
                        //判断是否已经画出foot
                        var _curTgF = document.all[_selfAttr.tbFootDivId];
                        //判断是否已经画出data
                        var _curTgD = document.all[_selfAttr.tbDataDivId];
                        if(_curTgD){
                            var tgFootHtml;
                            var tgDataHtml;
                            var _tn = _selfAttr.totalNum;
                            //查询数据总数

                            // __fstCore.PostInfo(_qda, _qCondParam, function (ss) {
                            //     _selfAttr.totalNum = ss.getJsonBusiObj().TotalNum;
                            // },null,{$_isAsync:false});
                            // var newCurrPage = Math.ceil(_selfAttr.totalNum/_selfAttr.pageSize);
                            // if(_selfAttr.currPage>newCurrPage && newCurrPage!=0){
                            //     _selfAttr.currPage = newCurrPage;
                            // }
                            _qCondParam.addItem("$QUERYTYPE", "ONCEDATA");
                            _qCondParam.addItem("$STARTINDEX", _selfAttr.pageSize * (_selfAttr.currPage - 1) + 1);
                            _qCondParam.addItem("$ENDINDEX", _selfAttr.pageSize * ((_selfAttr.currPage - 1) + 1));
                            __fstCore.PostInfo(_qda, _qCondParam, function (_jsonDc) {
                                if(!_jsonDc || !_jsonDc.isRtY()){
                                    _fcTools_._Cp_alert_('Get DBGridData error!',_G_FST_VAL.ENUM_prefix.ui_table_grid);
                                    return;
                                }
                                //fill foot
                                try {
                                    if (_jsonDc.isRtValid()) {
                                        _tn = _jsonDc.getDBTG_TotalNum();
                                        _selfAttr.totalNum = _tn;
                                        var isInteg = (_tn % _selfAttr.pageSize) == 0 ? true : false; //是否整数
                                        var forCount = parseInt(_tn / _selfAttr.pageSize) + (isInteg ? 0 : 1); //总循环次数
                                        _selfAttr.pageCount = forCount > 0 ? forCount : 1;
                                    }
                                    _jsonDc.addItem('PkId', pkId);
                                    _jsonDc.addItem('IsMuSel', _selfAttr.isMutilSelect);
                                    _jsonDc.addItem('IsRowSeq', _selfAttr.isRowSequence);
                                    _jsonDc.addItem('RealColNum', _selfMethod._getRealColNum());

                                    _jsonDc.addItem('tbWidth', _selfAttr.tbWidth);
                                    //_jsonDc.addItem('tbHeight', _selfAttr.tbHeight);

                                    _jsonDc.addItem('CurrPage', _selfAttr.currPage);
                                    _jsonDc.addItem('TotalNum', _selfAttr.totalNum);
                                    _jsonDc.addItem('PageCount', _selfAttr.pageCount);

                                    _jsonDc.addItem('DBGridDataHCols', _selfAttr.columns);
                                    _jsonDc.addItem('DBGridDataHColAttrs', _selfAttr.colAttrs);
                                    if(_selfAttr.isShowFoot) {
                                        tgFootHtml = __fstCore.Atp("_tbgrid_foot_str", _jsonDc.getJsonBusiObj(), _G_FST_VAL.ENUM_art_support_tmps.tbgrid_foot);
                                    }
                                } catch (e) {
                                    if(_selfAttr.isShowFoot) {
                                        tgFootHtml = _G_FST_VAL.ENUM_prefix.ui_table_grid + "fillGridData foot:" + e.message;
                                    }
                                }
                                var _curTgF = document.all[_selfAttr.tbFootDivId];
                                if (_curTgF) {
                                    //如果有显示底部操作区则显示
                                    $("#"+_selfAttr.tbFootDivId).html(tgFootHtml);
                                }
                                //FILL DATA
                                var b = true;
                                try {
                                    _jsonDc.addItem('DBGridData', _jsonDc.getDBTG_Data());
                                    tgDataHtml = __fstCore.Atp("_tbgrid_data_str", _jsonDc.getJsonBusiObj(), _G_FST_VAL.ENUM_art_support_tmps.tbgrid_data);
                                } catch (e) {
                                    tgDataHtml =  _G_FST_VAL.ENUM_prefix.ui_table_grid +"fillGridData data:" + e.message;
                                    b = false;
                                }
                                $("#" + _selfAttr.tbDataDivId).html(tgDataHtml);
                                if(b){
                                    //数据出来以后 绑定行列的委托事件
                                    if(_selfAttr.rowColTdsEvent.FUN && _selfAttr.rowColTdsEvent.RN == 0){
                                        _selfMethod._bindRowColTdsEvent();
                                    }
                                    //数据出来以后调用回调函数
                                    if (_selfAttr.callBackAfterHasData) {
                                        _selfAttr.callBackAfterHasData(_jsonDc.getJsonBusiObj());
                                    }

                                    //延迟1秒关闭loading
                                    setTimeout(function(){
                                        FST_C_DL.dialog_close("layui-layer-loading");
                                    },1000);
                                }
                            });
                        } else {
                            _fcTools_._Cp_alert_(_G_FST_VAL.ENUM_prefix.ui_table_grid + "No location foot or data table DIV ! id:" + pkId);
                            return;
                        }
                    };
                    this.turnPage = function(tag){
                        var _gtObj = document.all[_selfAttr.tbGoToPageId] || null;
                        if (!_gtObj) {
                            return;
                        }
                        var tbRdObj = _selfAttr;
                        var _cur_pgCount = $("#"+pkId+"_pgc").html();
                        if(_cur_pgCount) {
                            _cur_pgCount = FST_C_T.g_getNumber(_cur_pgCount)
                            if(tbRdObj.pageCount != _cur_pgCount) {
                                tbRdObj.pageCount = _cur_pgCount;
                            }
                        }

                        var pageIndex = 0;
                        if (tag == "first") {
                            pageIndex = 1;
                        } else if (tag == "previous") {
                            pageIndex = tbRdObj.currPage - 1;
                        } else if (tag == "next") {
                            pageIndex = tbRdObj.currPage + 1;
                        } else if (tag == "last") {
                            pageIndex = tbRdObj.pageCount;
                        } else if (tag == "goto") {
                            var s = _gtObj.value;
                            if (!_fcTools_.g_isDigit(s)) {
                                //跳转页的值只能是纯数字
                                _fcTools_.g_Alert("跳转页的值只能是纯数字!");
                                _gtObj.value = tbRdObj.currPage;
                                _gtObj.focus();
                                return;
                            }
                            pageIndex = parseInt(s);
                        } else {
                            return;
                        }
                        if (pageIndex < 1) {
                            pageIndex = 1;
                        } else if (pageIndex > tbRdObj.pageCount) {
                            pageIndex = tbRdObj.pageCount;
                        } else {}
                        _gtObj.value = pageIndex;
                        if (pageIndex == tbRdObj.currPage) {
                            return;
                        }
                        //开始请求数据
                        tbRdObj.currPage = pageIndex;
                        _selfMethod.__fillGridData();
                    };
                    this.refresh = function (delCnt) {
                        FST_C_DL.layer_loading();
                        if(!_selfMethod.__checkParamsIsPass()){
                            return;
                        }
                        ////如果有业务查询条件,恢复到默认值
                        var _isHasCond = _selfAttr.isHasCond;
                        if (_isHasCond) {
                            _selfAttr.currPage = 1;
                            _selfAttr.pageCount = 1;
                            _selfAttr.totalNum = 0;
                        }else{
                            if (delCnt){//删除表格数据时才进入
                                _selfAttr.totalNum = _selfAttr.totalNum - delCnt;
                                var newCurrPage = Math.ceil(_selfAttr.totalNum/_selfAttr.pageSize);
                                if(_selfAttr.currPage>newCurrPage && newCurrPage!=0){
                                    _selfAttr.currPage = newCurrPage;
                                }
                            }
                        }

                        //构建页面及数据
                        _selfMethod.__drawGridBox();//画出数据表格主体
                        _selfMethod.__fillGridData();//填充数据

                        if($("#Sp_BSD_Ms_all")){
                            $("#Sp_BSD_Ms_all").on("click",function () {
                                var selFlag = $(this).prop("checked");
                                $("input[name='Sp_BSD_Ms_ck']").each(function () {
                                    $(this).prop("checked",selFlag);
                                });
                            });
                        }
                    };
                    //当取消需要保留当前页面时调用刷新
                    this.refreshByCancel = function () {
                        if(!_selfMethod.__checkParamsIsPass()){
                            return;
                        }
                        //构建页面及数据
                        _selfMethod.__drawGridBox();//画出数据表格主体
                        _selfMethod.__fillGridData();//填充数据
                    };
                    //刷新最后停留显示页码
                    this.refLastStayPage = function(){
                        _selfMethod.__fillGridData();
                    };
                    this.setCallBackAfterHasData = function(callBack){
                        if ($.isFunction(callBack)) {
                            _selfAttr.callBackAfterHasData = callBack;
                        }
                    };
                    //事件绑定
                    /*
                     * 绑定行列TD的业务数据事件
                     * @param {string}event jq事件类型
                     * @param {function}dealFun (单一的非事件集合的绑定)处理回调函数
                     * @param {Array}assignCols :指定列生效['NAME'],有值时failMs,failSeq默认不生效
                     * @param {boolean}failMs 对选择列失效:true 失效,默认失效
                     * @param {boolean}failSeq 对序号列失效:true 失效,默认失效
                     * @param {object}extOnCfg 使用ext_on的配置信息,true 使用其默认的配置信息
                     */
                    this.setBsdRowColTdsEvent = function(event,dealFun,assignCols,failMs,failSeq,extOnCfg){
                        if(event&& $.isFunction(dealFun)){
                            var _extOnCfg = null;
                            if(extOnCfg == true){
                                _extOnCfg = {};
                            }
                            _selfMethod._setRowColTdsEvent(event,dealFun,assignCols,failMs,failSeq,_extOnCfg);
                        }
                    };
                    _selfMethod._bindRowColTdsEvent = function(){
                        if(_selfAttr.rowColTdsEvent.RN != 0){
                            return;
                        }else{
                            _selfAttr.rowColTdsEvent.RN++;
                        }
                        if(!_selfAttr.rowColTdsEvent.EXT_ON_CFG){
                            $("#"+_selfAttr.DBGridPK).on(_selfAttr.rowColTdsEvent.EVENT,'tbody tr',_entrust);
                        }else{
                            $("#"+_selfAttr.DBGridPK).ext_on(_selfAttr.rowColTdsEvent.EVENT,'tbody tr',_entrust);
                        }
                        function _entrust(obj){
                            var _b = true;
                            var _noMs = _selfAttr.rowColTdsEvent.IS_MS_FAIL;
                            var _noSeq = _selfAttr.rowColTdsEvent.IS_SEQ_FAIL;
                            var _curTgId = obj.target.id;//当前点击的TD code
                            var _curTgNm = obj.target.tagName;
                            if(_curTgNm != 'TD'){
                                _b = false;
                            }else{
                                //过滤是否有指定列生效
                                var _apCols = _selfAttr.rowColTdsEvent.AP_COLS;
                                if(_apCols&& _fcTools_.g_isArray(_apCols)){
                                    _b = false;
                                    for(var j = 0 ;j<_apCols.length;j++){
                                        //必须是正式的数据列并且是显示出来的
                                        var _apCol = _apCols[j];
                                        var _colS = _selfAttr.colAttrs[_apCol] || null;
                                        if(_colS&&!_colS.isHide&&_apCol===_curTgId){
                                            _b = true;
                                            break;
                                        }
                                    }
                                }else{
                                    //过滤非数据列是否生效
                                    if(_noMs && _curTgId === 'Sp_BSD_Ms'){
                                        _b = false;
                                    }
                                    if(_noSeq && _curTgId === 'Sp_BSD_Seq'){
                                        _b = false;
                                    }
                                }
                            }

                            if(_b){
                                var _htmlObj = obj.currentTarget;
                                var _curVC = {
                                    'C':'',//CODE
                                    'N':'',
                                    'V':''//TEXT
                                };
                                var _rowV = [];//行列中的值
                                var _rowC = [];//行列中的数据CODE
                                var _rowN = [];
                                var _cells = _htmlObj.cells;
                                if(_cells){
                                    for(var i = 0 ; i < _cells.length;i++){
                                        var _rId = _cells[i].id + '';
                                        var _rv = '';
                                        var _rn = '';
                                        if(_rId === 'Sp_BSD_Ms'){
                                            //选择列的checkbox
                                            _rv = _cells[i].firstChild.checked;
                                        }else{
                                            //如果显示的是固定长度,则取spv的值
                                            var _spv = _cells[i].getAttribute('spv') || null;
                                            _rv = _spv ? _spv : (_cells[i].innerHTML || _cells[i].innerText);
                                        }
                                        var c =  _selfAttr.colAttrs[_rId];
                                        if(c){
                                            _rn = c.name;
                                        }
                                        var __v = $.trim(_rv);
                                        if(_curTgId === _rId){
                                            //当前点击区域列的值
                                            _curVC.C = _rId;
                                            _curVC.N = _rn;
                                            _curVC.V = __v;
                                        }
                                        _rowV.push(__v);
                                        _rowC.push(_rId);
                                        _rowN.push(_rn);
                                    }
                                }
                                //{ag0:AGE},[1,true,nm0,ag0,sx0],[Sp_BSD_Seq,Sp_BSD_Ms,NAME,AGE,SEX],['姓名']
                                _selfAttr.rowColTdsEvent.FUN(_curVC,_rowV,_rowC,_rowN);
                            }
                        }
                    }

                }


            };


        })($);
        //=================UI TAGLIB end  =====================


        //=================PLUGIN start  =====================
        //业务功能div弹出层(FUN_DIV_OP)
        __fstPlugin.FDP = {
            _inDSC_ : [],//内部数据缓存存储器
            _boxStr:
            ' <div class="fsd_box" id="{IDK}_fsd_box">'
            +'<div class="{DIF_CSS}" >'
            +'      <div class="fsd_bx_cm" id="{IDK}_fsd_bx_cm">'
            //内容存放
            +'      </div>'
            +'</div>'
            +'</div>',
            _clearFD:function(idKey){
                var b = this._inDSC_[idKey];
                if(b){
                    b.empty().remove();
                    this._inDSC_[idKey] = null;
                    delete this._inDSC_[idKey];
                }
            },
            /*
             * 显示DIV
             * @param idKey
             * @param loadURLOrC 可以传url或组装好的html
             * @param opts
             */
            showFD:function(idKey,loadURLOrC,opts){
                if(!idKey||!loadURLOrC){
                    _fcTools_._Cp_alert_('Missing parameter values required!',_G_FST_VAL.ENUM_prefix.fun_div_op);
                    return;
                }
                var _cfg = {
                    boxStyle:1,//div弹出样式类型:1 普通大小的如站内信,提现 ;2 充值
                    initCallBack:null,//初始化成功后回调函数
                    closeCallBack:null//关闭时的回调函数
                };
                _cfg = $.extend(_cfg,opts);
                //遮罩层显示
                __maskShow(_G_FST_VAL.ENUM_mask.FdpId);
                //设置功能页面内容
                var _cd = this._inDSC_[idKey];
                if(_cd){
                    _cd.show();
                }else{
                    //判断loadURLOrC类型:html内容串;url
                    var _isUrl = _fcTools_.g_String_ext_endWith(loadURLOrC,".html")?true:false;
                    var _initCbf = _cfg.initCallBack;
                    var _closeCbf = _cfg.closeCallBack;
                    //创建对应的内容显示层
                    var _showDvObj = null;
                    var sd = this._boxStr;
                    sd = _fcTools_.g_String_ext_replaceAll(sd,"{IDK}",idKey);
                    //设置显示位置及样式
                    var _top = 32;//固定高度距离
                    var _left = 0;//计算
                    var _w = 0;
                    var _h = 0;
                    var _boxCs = "";
                    var boxSt = _cfg.boxStyle;
                    //根据样式类型
                    if(boxSt == 1){
                        _w = 569;
                        _h = 534;
                        _boxCs = 'fsd_box_bg_1';
                    }else if(boxSt == 2){
                        _w = 1000;
                        _h = 505;
                        _boxCs = 'fsd_box_bg_2';
                    }
                    sd = _fcTools_.g_String_ext_replaceAll(sd,"{DIF_CSS}",_boxCs);
                    $("body").append(sd);
                    _showDvObj = $("#"+idKey+"_fsd_box");

                    var wH = $(window.top||window).height();//获取浏览器显示区域的高度
                    var wW = $(window).width();// 获取浏览器显示区域的宽度
                    if(!_w || _w <= 0 || _w > wW){
                        _w = wW-100;
                    }
                    if(!_h || _h <= 0 || _h > wH){
                        _h = wH-100;
                    }
                    _top = (wH -_h)/2;//document.body.scrollTop + wH/1.6-box;
                    _top += _fcTools_.g_TopWin_getScrollTop() ;

                    _left = (wW -_w)/2;
                    _showDvObj.css({top:_top,width:_w,height:_h,left:_left}).show();
                    //加载内容
                    if(_isUrl){
                        _showDvObj.find("#"+idKey+"_fsd_bx_cm").load(loadURLOrC,function(b){
                            if(b){
                                //成功之后设置标题和关闭
                                _isAutoAndSet(true);
                            }
                        });
                    }else{
                        _showDvObj.find("#"+idKey+"_fsd_bx_cm").html(loadURLOrC);
                        _isAutoAndSet(true);
                    }
                    this._inDSC_[idKey] = _showDvObj;
                }
                function _isAutoAndSet(b){
                    //如果有按钮设置为关闭功能时,打上spv标记
                    _showDvObj.find("[name='FDP_CLOSE']").attr("spv",idKey);
                    //绑定事件委托事件
                    _bindElEvents();
                    if(b && _initCbf){
                        //初始化成功后的回调函数
                        _initCbf(b,_showDvObj);
                    }
                }
                function _bindElEvents(){
                    //绑定关闭事件(委托给当前的document上),默认需找[name='FDP_CLOSE']
                    _showDvObj.find("[name='FDP_CLOSE']").attr("fdid",idKey);
                    _showDvObj.ext_on("click","[name='FDP_CLOSE']",function(t){
                        _fdpSelf._clearFD(idKey);
                        //隐藏遮罩层
                        __maskHide(_G_FST_VAL.ENUM_mask.FdpId);
                        if(_closeCbf){
                            //关闭的回调函数
                            _closeCbf(_showDvObj);
                        }
                    });
                }
                var _fdpSelf = this;
            },
            closeFD:function(idKey){
                $("[name='FDP_CLOSE'][fdid='"+idKey+"']").click();
            }
        };
        //后台业务菜单按钮起多页(creatFrament())
        __fstPlugin.CREATEFRAME = {};
        var _createFrame =  __fstPlugin.CREATEFRAME;
        (function($){
            _createFrame.min_titleList = function(){
                var topWindow=$(window.document);
                var show_nav=topWindow.find("#min_title_list");
                var aLi=show_nav.find("li");
            };
            _createFrame.tabNavallwidth1 = function(){
                var taballwidth=0,
                    $tabNav = $(".secheadernav",document),
                    $tabNavWp = $(".col-md-12",document),
                    $tabNavitem = $(".secheadernav li",document),
                    $tabNavmore =$(".Hui-tabNav-more",document);
                if (!$tabNav[0]){return}
                $tabNavitem.each(function(index, element) {
                    taballwidth+=Number(parseFloat($(this).width()+20))});
                $tabNav.width(taballwidth+25);
                var w = $tabNavWp.width();
                if(taballwidth+25>w){
                    $tabNavmore.show()}
                else{
                    $tabNavmore.hide();
                    // $tabNav.css({'margin-left':0})
                }
            };
            _createFrame.creatIframe = function(href,titleName,id){
                var bStopIndex=0;
                var flag = false;
                var targetObj ;
                var topWindow=$(window.document);
                var show_navLi=topWindow.find("#min_title_list li");
                show_navLi.each(function() {
                    var cur_src = href.split("?")[0];
                    if($(this).find('a').attr("data-href")!=undefined){
                        var cur_href = $(this).find('a').attr("data-href").split("?")[0];
                    }
                    if(cur_src==cur_href){
                        bStopIndex=show_navLi.index($(this));
                        flag = true;
                        targetObj = $(this);
                        return false;
                    }
                });
                if(flag){
                    targetObj.dblclick();
                }

                var topWindow=$(window.document);
                var show_nav=topWindow.find('#min_title_list');
                show_nav.find('li').removeClass("active");
                var iframe_box=topWindow.find('#iframe_box');
                show_nav.append('<li id='+id+'_title class="active"><a data-href="'+href+'">'+titleName+'</a><i class="close"></i></li>');
                _createFrame.tabNavallwidth1();
                var iframeBox=iframe_box.find('.show_iframe');
                iframeBox.hide();
                iframe_box.append('<div class="show_iframe marg"><div class="loading"></div><div class="tableopa" id='+id+' src='+href+'></div></div>');
                var showBox=iframe_box.find('.show_iframe:visible');
                showBox.find('.loading').hide();
                showBox.find("#"+id).load(href);
                // showBox.find('iframe').load(function(){
                //     showBox.find('.loading').hide();
                //     showBox.find('iframe').find("#centerIframe").load(href);
                // });
            };
            _createFrame.close_rightTip = function(){
                var topWindow=$(window.document);
                var show_navLi=topWindow.find('#min_title_list li');
                show_navLi.each(function() {
                    var aCloseIndex=$(this).index();
                    var iframe_box=$("#iframe_box");
                    if(aCloseIndex>0){
                        $(this).remove();
                        $('#iframe_box').find('.show_iframe').eq(aCloseIndex).remove();
                        // num==0?num=0:num--;
                        $("#min_title_list li").removeClass("active").eq(aCloseIndex-1).addClass("active");
                        iframe_box.find(".show_iframe").hide().eq(aCloseIndex-1).show();
                        _createFrame.tabNavallwidth1();
                    }else{
                        //return false;
                    }
                });
            };
            _createFrame.close_TipByTitle = function(titleName){
                var topWindow=$(window.document);
                var show_navLi=topWindow.find('#min_title_list li');
                show_navLi.each(function() {
                    var str=$.trim($(this).find("a").html());
                    if (str==titleName){
                        $(this).dblclick();
                    }
                });
            };
        })($);
        //后台根据拼音获取首字母方法(GETPINYIN())
        __fstPlugin.GETPINYIN = {};
        var _getPinYin =  __fstPlugin.GETPINYIN;
        (function($){
            var strChineseFirstPY =                 "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";
            var oMultiDiff={"19969":"DZ","19975":"WM","19988":"QJ","20048":"YL","20056":"SC","20060":"NM",         "20094":"QG","20127":"QJ","20167":"QC","20193":"YG","20250":"KH","20256":"ZC","20282":"SC","20285":"QJG","20291":"TD","20314":"YD","20340":"NE","20375":"TD","20389":"YJ","20391":"CZ","20415":"PB","20446":"YS","20447":"SQ","20504":"TC","20608":"KG","20854":"QJ","20857":"ZC","20911":"PF","20504":"TC","20608":"KG","20854":"QJ","20857":"ZC","20911":"PF","20985":"AW","21032":"PB","21048":"XQ","21049":"SC","21089":"YS","21119":"JC","21242":"SB","21273":"SC","21305":"YP","21306":"QO","21330":"ZC","21333":"SDC","21345":"QK","21378":"CA","21397":"SC","21414":"XS","21442":"SC","21477":"JG","21480":"TD","21484":"ZS","21494":"YX","21505":"YX","21512":"HG","21523":"XH","21537":"PB","21542":"PF","21549":"KH","21571":"E","21574":"DA","21588":"TD","21589":"O","21618":"ZC","21621":"KHA","21632":"ZJ","21654":"KG","21679":"LKG","21683":"KH","21710":"A","21719":"YH","21734":"WOE","21769":"A","21780":"WN","21804":"XH","21834":"A","21899":"ZD","21903":"RN","21908":"WO","21939":"ZC","21956":"SA","21964":"YA","21970":"TD","22003":"A","22031":"JG","22040":"XS","22060":"ZC","22066":"ZC","22079":"MH","22129":"XJ","22179":"XA","22237":"NJ","22244":"TD","22280":"JQ","22300":"YH","22313":"XW","22331":"YQ","22343":"YJ","22351":"PH","22395":"DC","22412":"TD","22484":"PB","22500":"PB","22534":"ZD","22549":"DH","22561":"PB","22612":"TD","22771":"KQ","22831":"HB","22841":"JG","22855":"QJ","22865":"XQ","23013":"ML","23081":"WM","23487":"SX","23558":"QJ","23561":"YW","23586":"YW","23614":"YW","23615":"SN","23631":"PB","23646":"ZS","23663":"ZT","23673":"YG","23762":"TD","23769":"ZS","23780":"QJ","23884":"QK","24055":"XH","24113":"DC","24162":"ZC","24191":"GA","24273":"QJ","24324":"NL","24377":"TD","24378":"QJ","24439":"PF","24554":"ZS","24683":"TD","24694":"WE","24733":"LK","24925":"TN","25094":"ZG","25100":"XQ","25103":"XH","25153":"PB","25170":"PB","25179":"KG","25203":"PB","25240":"ZS","25282":"FB","25303":"NA","25324":"KG","25341":"ZY","25373":"WZ","25375":"XJ","25384":"A","25457":"A","25528":"SD","25530":"SC","25552":"TD","25774":"ZC","25874":"ZC","26044":"YW","26080":"WM","26292":"PB","26333":"PB","26355":"ZY","26366":"CZ","26397":"ZC","26399":"QJ","26415":"ZS","26451":"SB","26526":"ZC","26552":"JG","26561":"TD","26588":"JG","26597":"CZ","26629":"ZS","26638":"YL","26646":"XQ","26653":"KG","26657":"XJ","26727":"HG","26894":"ZC","26937":"ZS","26946":"ZC","26999":"KJ","27099":"KJ","27449":"YQ","27481":"XS","27542":"ZS","27663":"ZS","27748":"TS","27784":"SC","27788":"ZD","27795":"TD","27812":"O","27850":"PB","27852":"MB","27895":"SL","27898":"PL","27973":"QJ","27981":"KH","27986":"HX","27994":"XJ","28044":"YC","28065":"WG","28177":"SM","28267":"QJ","28291":"KH","28337":"ZQ","28463":"TL","28548":"DC","28601":"TD","28689":"PB","28805":"JG","28820":"QG","28846":"PB","28952":"TD","28975":"ZC","29100":"A","29325":"QJ","29575":"SL","29602":"FB","30010":"TD","30044":"CX","30058":"PF","30091":"YSP","30111":"YN","30229":"XJ","30427":"SC","30465":"SX","30631":"YQ","30655":"QJ","30684":"QJG","30707":"SD","30729":"XH","30796":"LG","30917":"PB","31074":"NM","31085":"JZ","31109":"SC","31181":"ZC","31192":"MLB","31293":"JQ","31400":"YX","31584":"YJ","31896":"ZN","31909":"ZY","31995":"XJ","32321":"PF","32327":"ZY","32418":"HG","32420":"XQ","32421":"HG","32438":"LG","32473":"GJ","32488":"TD","32521":"QJ","32527":"PB","32562":"ZSQ","32564":"JZ","32735":"ZD","32793":"PB","33071":"PF","33098":"XL","33100":"YA","33152":"PB","33261":"CX","33324":"BP","33333":"TD","33406":"YA","33426":"WM","33432":"PB","33445":"JG","33486":"ZN","33493":"TS","33507":"QJ","33540":"QJ","33544":"ZC","33564":"XQ","33617":"YT","33632":"QJ","33636":"XH","33637":"YX","33694":"WG","33705":"PF","33728":"YW","33882":"SR","34067":"WM","34074":"YW","34121":"QJ","34255":"ZC","34259":"XL","34425":"JH","34430":"XH","34485":"KH","34503":"YS","34532":"HG","34552":"XS","34558":"YE","34593":"ZL","34660":"YQ","34892":"XH","34928":"SC","34999":"QJ","35048":"PB","35059":"SC","35098":"ZC","35203":"TQ","35265":"JX","35299":"JX","35782":"SZ","35828":"YS","35830":"E","35843":"TD","35895":"YG","35977":"MH","36158":"JG","36228":"QJ","36426":"XQ","36466":"DC","36710":"JC","36711":"ZYG","36767":"PB","36866":"SK","36951":"YW","37034":"YX","37063":"XH","37218":"ZC","37325":"ZC","38063":"PB","38079":"TD","38085":"QY","38107":"DC","38116":"TD","38123":"YD","38224":"HG","38241":"XTC","38271":"ZC","38415":"YE","38426":"KH","38461":"YD","38463":"AE","38466":"PB","38477":"XJ","38518":"YT","38551":"WK","38585":"ZC","38704":"XS","38739":"LJ","38761":"GJ","38808":"SQ","39048":"JG","39049":"XJ","39052":"HG","39076":"CZ","39271":"XT",    "39534":"TD","39552":"TD","39584":"PB","39647":"SB","39730":"LG","39748":"TPB","40109":"ZQ","40479":"ND",      "40516":"HG","40536":"HG","40583":"QJ","40765":"YQ","40784":"QJ","40840":"YK","40863":"QJG"};
            //参数,中文字符串
            //返回值:拼音首字母串数组
            _getPinYin.makePy = function(str){
                if(typeof(str) != "string")
                    throw new Error(-1,"函数makePy需要字符串类型参数!");
                var arrResult = new Array(); //保存中间结果的数组
                for(var i=0,len=str.length;i<len;i++){
                    //获得unicode码
                    var ch = str.charAt(i);
                    //检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
                    arrResult.push(checkCh(ch));
                }
                //处理arrResult,返回所有可能的拼音首字母串数组
                return mkRslt(arrResult);
            };
            function checkCh(ch){
                var uni = ch.charCodeAt(0);
                //如果不在汉字处理范围之内,返回原字符,也可以调用自己的处理函数
                if(uni > 40869 || uni < 19968)
                    return ch; //dealWithOthers(ch);
                        //检查是否是多音字,是按多音字处理,不是就直接在strChineseFirstPY字符串中找对应的首字母
                        //return (oMultiDiff[uni]?oMultiDiff[uni]:(strChineseFirstPY.charAt(uni-19968)));
                    return strChineseFirstPY.charAt(uni - 19968).toLowerCase();
            }
            function mkRslt(arr){
                var arrRslt = [""];
                for(var i=0,len=arr.length;i<len;i++){
                    var str = arr[i];
                    var strlen = str.length;
                    if(strlen == 1){
                        for(var k=0;k<arrRslt.length;k++){
                            arrRslt[k] += str;
                        }
                    }else{
                        var tmpArr = arrRslt.slice(0);
                        arrRslt = [];
                        for(k=0;k<strlen;k++){
                            //复制一个相同的arrRslt
                            var tmp = tmpArr.slice(0);
                            //把当前字符str[k]添加到每个元素末尾
                            for(var j=0;j<tmp.length;j++){
                                tmp[j] += str.charAt(k);
                            }
                            //把复制并修改后的数组连接到arrRslt上
                            arrRslt = arrRslt.concat(tmp);
                        }
                    }
                }
                return arrRslt;
            }
        })($);
        //后台弹出框按钮封装(layer)
        __fstPlugin.LAYER = {};
        var _LAYER =  __fstPlugin.LAYER;
        (function($){
            _LAYER.dialog_layer = function(title,url,w,h,shadeClose,callback,callBackError){
                if (title == null || title == '') {
                    title=false;
                };
                if (url == null || url == '') {
                    url="404.html";
                };
                if (w == null || w == '') {
                    w=800;
                };
                if (h == null || h == '') {
                    h=($(window).height() - 50);
                };
                if (!shadeClose){
                    shadeClose = true;
                }
                if(typeof(callback) != 'function'){
                    layer.open({
                        type: 1,
                        area: [w+'px', h +'px'],
                        fix: false, //不固定
                        maxmin: true,
                        shadeClose: false,
                        shade:0.4,
                        title: title,
                        content: url
                    });
                }else{
                    layer.open({
                        type: 1,
                        area: [w+'px', h +'px'],
                        fix: false, //不固定
                        maxmin: true,
                        shadeClose: false,
                        shade:0.4,
                        title: title,
                        content: url,
                        success: function(result){
                            callback(result);
                        },
                        end:function () {
                            if(callBackError){
                                callBackError();
                            }
                        }
                    });
                }
            };
            _LAYER.dialog_layer_url = function(title,url,w,h,shadeClose,callback,callBackError){
                if (title == null || title == '') {
                    title=false;
                };
                if (url == null || url == '') {
                    url="404.html";
                };
                if (w == null || w == '') {
                    w=800;
                };
                if (h == null || h == '') {
                    h=($(window).height() - 50);
                };
                if (!shadeClose){
                    shadeClose = false;
                }
                if(typeof(callback) != 'function'){
                    layer.open({
                        type: 2,
                        area: [w+'px', h +'px'],
                        fix: false, //不固定
                        maxmin: true,
                        shadeClose: false,
                        shade:0.4,
                        title: title,
                        content: url
                    });
                }else{
                    layer.open({
                        type: 2,
                        area: [w+'px', h +'px'],
                        fix: false, //不固定
                        maxmin: true,
                        shadeClose: false,
                        shade:0.4,
                        title: title,
                        content: url,
                        success: function(result){
                            callback(result);
                        },
                        end:function () {
                            if(callBackError){
                                callBackError();
                            }
                        }
                    });
                }
            };
            _LAYER.dialog_confirm = function(content,title,shadeClose,callback){
                if(!title){
                    title = _fcTools_.g_I18nMsg_pageBase("com_MESSAGE");
                }
                if (!shadeClose){
                    shadeClose = false;
                }
                layer.confirm(content,{
                    icon: 1,
                    shadeClose: false,
                    closeBtn: 1,
                    title: title
                },function (result) {
                    layer.msg('', {
                        time: 1
                    });
                    callback(result);
                });
            };
            /**
             * 公共提示框
             * @param content 提示内容
             * @param title 标题
             * @param iconType 图标类型 0:警告,1:正确，2：错误，3：问号，4：锁头，5：哭脸，6：笑脸
             * @param shadeClose 点其他范围关闭提示框
             * @param callback 回调函数
             */
            _LAYER.dialog_alert = function(content,title,iconType,shadeClose,callback){
                if(!title){
                    title = _fcTools_.g_I18nMsg_pageBase("com_MESSAGE");
                }
                if (!iconType){
                    iconType = 1;
                }
                if (!shadeClose){
                    shadeClose = false;
                }

                if(typeof(callback) != 'function'){
                    layer.alert(content, {
                        icon: iconType,
                        shadeClose: false,
                        closeBtn: 1,
                        title: title
                    });
                }else{
                    layer.alert(content, {
                        icon: iconType,
                        shadeClose: false,
                        closeBtn: 1,
                        title: title,
                        end: function(result){
                            callback(result);
                        }
                    });
                }
            };
            _LAYER.dialog_close = function(loadId){
                if(!loadId){
                    $(".layui-layer-close1").click();
                }else {
                    $("."+loadId).remove();
                }
            };
            /**
             * 加载数据loading
             * @param styleId 0代表加载的风格，支持0-2
             * @param shade false透明 true全遮挡
             */
            _LAYER.layer_loading = function(styleId,shade){
                if(styleId==null || styleId==''){
                    styleId = 0;
                }
                if(shade==null || shade==''){
                    shade = false;
                }
                layer.load(styleId, {shade: shade});
            }

        })($);
        //业务功能前台公共JS验证
        __fstPlugin.VERIFY = {};
        var _fpVerify =  __fstPlugin.VERIFY;
        (function($){
            //校验JS规则
            /**
             * 普通密码校验 (密码：由6~14位由英文字母,数字,特殊字符组成，且必须以英文字母开头)
             * @param str
             * @return {boolean}
             */
            _fpVerify.v_bind_pwdCheck = function(str){
                if(str == undefined || str == null){
                    return false;
                }
                var re = /^[a-zA-Z0-9+=\-_@#~,.\[\]()!%^*$]{6,20}$/;
                //var re = /^[a-zA-Z]{1}[a-zA-Z0-9+=\-_@#~,.\[\]()!%^*$]{5,19}$/;
                //var re=/^\w{6,10}$/;
                if (!re.exec(str)){
                    return false;
                }
                return true;
            };

            /**
             * 用户名校验 (账号：长度在6~12位之间，由英文字母及数字组成，且必须以英文字母开头)
             * @param str
             * @return {boolean}
             */
            _fpVerify.v_bind_userCheck = function(str){
                if(str == undefined || str == null){
                    return false;
                }
                //var re = /^[a-zA-Z]{1}[a-zA-Z0-9]{5,11}$/;
                var re=/^[\w]{6,12}$/;
                if (!re.exec(str)){
                    return false;
                }
                return true;
            };

            /**
             * 昵称校验 (昵称：长度在2~10位之间，由中文、英文字母及数字组成，且必须以中文或英文字母开头)
             * @param str
             * @return {boolean}
             */
            _fpVerify.v_bind_nickCheck = function(str){
                if(str == undefined || str == null){
                    return false;
                }
                var re = /^[\u4e00-\u9fa5a-zA-Z]{1}[\u4e00-\u9fa5a-zA-Z0-9]{1,9}$/;
                if (!re.exec(str)){
                    return false;
                }
                return true;
            };


            /**
             * 邮箱校验
             * @param str
             * @return {boolean}
             */
            _fpVerify.v_bind_emailCheck = function(str){
                if(str == undefined || str == null){
                    return false;
                }
                var re = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+){1,63}\.[a-z0-9]{2,}$/;
                if (!re.exec(str)){
                    return false;
                }
                return true;
            };

            /**
             * qq校验，最少5位，最多20位
             * @param str
             * @return {boolean}
             */
            _fpVerify.v_bind_qqCheck = function(str){
                if(str == undefined || str == null || str == ''){
                    return true;
                }
                var re = /^[1-9]\d{4,19}$/;
                if (!re.exec(str)){
                    return false;
                }
                return true;
            };

            /**
             * 手机号码校验
             * @param str
             * @return {boolean}
             */
            // _fpVerify.v_bind_mobileCheck = function(str){
            //     if(str == undefined || str == null  || str == ''){
            //         return true;
            //     }
            //     var re = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
            //     if (!re.exec(str)){
            //         return false;
            //     }
            //     return true;
            // };
            /**
             * 手机号码校验(兼容国外,验证正整数即可)
             * @param str
             * @return {boolean}
             */
            _fpVerify.v_bind_mobileCheck = function(str){
                if(str == undefined || str == null  || str == ''){
                    return true;
                }
                var re = /^[1-9]*[1-9][0-9]*$/;
                if (!re.exec(str)){
                    return false;
                }
                return true;
            };

            /**
             * 新密码与确认密码校验
             * @param str1,str2
             * @return {boolean}
             */
            _fpVerify.v_bind_npwd_spwd_Check = function(str1,str2){
                if(str2 == undefined || str2 == null){
                    return false;
                }
                if (str2 != str1){
                    return false;
                }
                return true;
            };
            /**
             * 银行卡号校验
             *
             *  //银行卡号校验
             // Luhm校验规则：16位银行卡号（19位通用）:
             // 1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
             // 2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
             // 3.将加法和加上校验位能被 10 整除。
             * @param bankno
             * @return {boolean}
             */
            _fpVerify.v_bind_bankCheck= function(bankno){
                if (bankno.length < 16 || bankno.length > 19) {
                    //$("#banknoInfo").html("银行卡号长度必须在16到19之间");
                    return false;
                }
                var num = /^\d*$/;  //全数字
                if (!num.exec(bankno)) {
                    //$("#banknoInfo").html("银行卡号必须全为数字");
                    return false;
                }
                return true;
            };
            /**
             * 金额格式判断
             * @param amount
             * @return {boolean}
             */
            _fpVerify.v_judge_amount= function(amount){

            };
            /**
             * 真实姓名校验  检查是否为有效的真实姓名，只能含有中文或大写的英文字母
             * @param realName
             * @return {boolean}
             */
            _fpVerify.v_judge_realName= function(realName){
                if(realName==""&&realName!=null){
                    return false;
                }
                var str = $.trim(realName);
                //判断是否为全英文大写或全中文，可以包含空格
                var reg = /^[a-zA-Z \u4e00-\u9fa5 ·]+$/;
//                var reg = /[\u4E00-\u9FA5]{2,5}(?:·[\u4E00-\u9FA5]{2,5})*;
                if(reg.test(str)){
                    return true;
                }
                return false;
            };

            /**
             * 收银员、导购员账号校验 (账号：长度在1~12位之间，由英文字母及数字组成)
             * @param str
             * @return {boolean}
             */
            _fpVerify.v_staff_userCheck = function(str){
                if(str == undefined || str == null){
                    return false;
                }
                var re=/^[\w]{1,12}$/;
                if (!re.exec(str)){
                    return false;
                }
                return true;
            };
            /**
             * 门店账号：长度在6~10位之间，由英文字母及数字组成
             */
            _fpVerify.v_store_userCheck = function(str){
                if(str == undefined || str == null){
                    return false;
                }
                var re=/^[\w]{6,10}$/;
                if (!re.exec(str)){
                    return false;
                }
                return true;
            };

            /**
             * 会员账号校验 (账号：长度在1~17位之间，由英文字母及数字组成)
             * @param str
             * @return {boolean}
             */
            _fpVerify.v_memberNo_Check = function(str){
                if(str == undefined || str == null){
                    return false;
                }
                var re=/^[\w]{1,17}$/;
                if (!re.exec(str)){
                    return false;
                }
                return true;
            };

            /**
             * 收银员 密码校验 (密码：由6~10位由英文字母,数字,特殊字符组成)
             * @param str
             * @return {boolean}
             */
            _fpVerify.v_staff_pwdCheck = function(str){
                if(str == undefined || str == null){
                    return false;
                }
                var re = /^[a-zA-Z0-9+=\-_@#~,.\[\]()!%^*$]{6,10}$/;
                if (!re.exec(str)){
                    return false;
                }
                return true;
            };

            /**
             *账户管理 密码校验 (密码：由6~32位由英文字母,数字,特殊字符组成)
             * @param str
             * @return {boolean}
             */
            _fpVerify.v_account_pwdCheck = function(str){
                if(str == undefined || str == null){
                    return false;
                }
                var re = /^[a-zA-Z0-9+=\-_@#~,.\[\]()!%^*$]{6,32}$/;
                if (!re.exec(str)){
                    return false;
                }
                return true;
            };



            /**
             * 佣金：数字即可，长度最大6位
             * @param str
             * @return {boolean}
             */
            _fpVerify.v_isNonnegativeNumber = function(str){
                if(!str){
                    return true;
                }
                if(str.length>6){
                    return false;
                }
                return ($.isNumeric(str) && Number(str) >= 0);
            };

            /**
             * 正则验证用户信息:公共错误提示,仅当正则验证 return false 才调用此方法
             * @param {Object} err_type : 当前调用正则校验的js方法尾部：例如：v_bind_pwdCheck 此时传入的err_type = "pwdCheck"
             */
            _fpVerify.v_error_commMSG= function(err_type){
                var errMSG = "";
                switch (err_type){
                    case "pwdCheck":{
                        errMSG = "密码：由6~20位英文字母,数字,特殊字符组成";//，且必须以英文字母开头
                        break;
                    }
                    case "userCheck":{
                        errMSG = "账号：长度在6~12位之间，由英文字母及数字下划线组成";
                        break;
                    }
                    case "nickCheck":{
                        errMSG = "昵称：长度在2~10位之间，由中文、英文字母及数字组成，且必须以中文或英文字母开头";
                        break;
                    }
                    case "emailCheck":{
                        errMSG = "请输入正确格式的邮箱";
                        break;
                    }
                    case "qqCheck":{
                        errMSG = "QQ账号为纯数字组合，长度在5~20之间";
                        break;
                    }
                    case "mobileCheck":{
                        errMSG = "请输入正确格式的11位手机号码";
                        break;
                    }
                    default:{
                        errMSG = "请检查数据是否规范";
                        break;
                    }
                }
                return errMSG;
            };
        })($);

        //定时器和倒计时器
        __fstPlugin.TCD = {};
        (function($){
            _initTimerCountDownMgr();
            function _initTimerCountDownMgr(){
                //统一的管理器
                __fstPlugin.TCD.TimerCountDownMgr = {
                    _inDSC_ : [],//内部数据缓存存储器
                    _put : function(pk,tbObj) {
                        this._inDSC_[pk] = tbObj;
                        return tbObj;
                    },
                    _remove:function(pk){
                        if(pk){
                            var obj = this._inDSC_[pk];
                            if(obj&& obj.stop){
                                obj.stop();
                            }
                            this._inDSC_[pk] = null;
                            delete this._inDSC_[pk];
                        }
                    },
                    //有缓存时是否要清除并重新初始化
                    _get : function(pk, isClear$ReInit,type,opts) {
                        var result = this._inDSC_[pk];
                        if(isClear$ReInit){
                            this._remove(pk);
                            result = null;
                        }
                        if (!result) {
                            if(type == 'TM'){
                                result = new FsTime(pk,opts);
                            }else if(type == 'CD'){
                                result = new FsCountDown(pk,opts);
                            }
                            if(result){
                                this._put(pk,result);
                            }
                        }else{
                            __cpAlert("Currently pk time object already exists, you can set 'isClear$ReInit = true'!");
                        }
                        return result;
                    },
                    getTimer:function(pk,isClear$ReInit,_interval, _callFun, _numLimit, _lazyTime,_stopback,_isRfExe){
                        return this._get(pk,isClear$ReInit,'TM',{
                            lazyTime:_lazyTime,
                            numLimit:_numLimit,
                            interval:_interval,
                            callback: _callFun,//每次间隔时间执行
                            stopback:_stopback,//如果有指定次数时停止执行
                            isRfExe:_isRfExe
                        });
                    },
                    getCountDown:function(pk,isClear$ReInit,_cdTimeSS,_stopCallFun,_stopCallFunPms,_tFIds,_intervalCallback,_interval,_lazyTime,_isRfExe) {
                        var _cfg = {
                            countDownTime:_cdTimeSS,
                            stopCallback: _stopCallFun,
                            stopCallbackPms: _stopCallFunPms,
                            intervalCallback:_intervalCallback,
                            isRfExe:_isRfExe,
                            tFormatIds: {
                                DD:  null,//天
                                HH:  null,//时
                                MM:  null,//分
                                SS:  null//秒
                            }
                        };
                        if(_tFIds){
                            _cfg.tFormatIds.DD = _tFIds[0] ? _tFIds[0]:null;
                            _cfg.tFormatIds.HH = _tFIds[1] ? _tFIds[1]:null;
                            _cfg.tFormatIds.MM = _tFIds[2] ? _tFIds[2]:null;
                            _cfg.tFormatIds.SS = _tFIds[3] ? _tFIds[3]:null;
                        }
                        if(_interval){
                            _cfg.interval = _interval;
                        }
                        if(_lazyTime){
                            _cfg.lazyTime = _lazyTime;
                        }
                        return this._get(pk,isClear$ReInit,'CD',_cfg);
                    },
                    stop$clear:function(pk){
                        if(pk){
                            this._remove(pk);
                        }
                    }
                };
                function FsTime(pk,opts){
                    this.cfgDef = {
                        id:pk,
                        lazyTime: 0,//每次启动执行的延迟时间
                        numLimit: 0,//次数限制,0不限制
                        interval: 5000, //间隔时间 毫秒,默认5秒
                        callback: null,
                        stopback:null,
                        //是否启动时立即执行
                        isRfExe:!0
                    };
                    this.cfgInner = {
                        //以下配置默认,不能重置
                        _lazyId: null,
                        _mId: null,
                        //0 停止,1 启动并运行 ,2 回调函数正在执行中
                        _state: 0,
                        _exeNum: 0 //执行次数累计
                    };
                    this.stop = function(){
                        if (selfCfgInner._lazyId) {
                            clearInterval(selfCfgInner._lazyId);
                        }
                        if (selfCfgInner._mId) {
                            clearInterval(selfCfgInner._mId);
                        }

                        if (selfCfgInner._state != 2 && selfCfgDef.stopback) {
                            selfCfgInner._state = 2;
                            selfCfgDef.stopback();
                            selfCfgInner._state = 1;
                        }
                        selfCfgInner._lazyId = null;
                        selfCfgInner._mId = null;
                        selfCfgInner._state = 0;
                        selfCfgInner._exeNum = 0;
                        if(selfCfgDef.stopback){
                            selfCfgDef.stopback();
                        }
                        _fcTools_._Cp_console_("fs_timer :[" + selfCfgDef.id + "] stop work...");
                    };
                    // Only used by internal code to call the callback
                    function _internalCallback(isInitFg){
                        var st = selfCfgInner._state;
                        var _en = selfCfgInner._exeNum;
                        var _nl = selfCfgDef.numLimit;
                        try {
                            if ((!isInitFg && st == 0) || (_nl > 0 && _en > 0 && _en >= _nl)) {
                                //如果超过次数限制或被动停止,则停止定时器任务
                                self.stop();
                                return;
                            }
                            if (st != 2 && selfCfgDef.callback) {
                                selfCfgInner._state = 2;
                                selfCfgDef.callback();
                                selfCfgInner._state = 1;
                            }
                        } catch (e) {
                            _fcTools_._Cp_console_error_("fs_timer :[" + selfCfgDef.id + "] internalCallback deal fail:"+ e.message,_G_FST_VAL.ENUM_prefix.tcd_p);
                        } finally {
                            selfCfgInner._exeNum++;
                            _fcTools_._Cp_console_("fs_timer :[" + selfCfgDef.id + "] internalCallback deal num:"+ selfCfgInner._exeNum);
                        }
                    };
                    function _start(){
                        if (selfCfgInner._lazyId) {
                            clearInterval(selfCfgInner._lazyId);
                            selfCfgInner._lazyId = null;
                        }
                        if (selfCfgInner._state == 1) {
                            return true;
                        }else if (selfCfgInner._state == 0) {
                            if(selfCfgDef.isRfExe){
                                _internalCallback(true);
                            }
                            selfCfgInner._mId = setInterval(_internalCallback, selfCfgDef.interval);
                            selfCfgInner._state = 1;
                            _fcTools_._Cp_console_("fs_timer :[" + selfCfgDef.id + "] start[lazyTime=" + selfCfgDef.lazyTime + "] work...");
                            return true;
                        }else{
                            _fcTools_._Cp_console_("fs_timer :[" + selfCfgDef.id + "] of state is not 1 or 0");
                        }
                        return false;
                    };
                    //重启
                    this.reStart = function(_interval, _numLimit, _lazyTime,_isRfExe){
                        self.stop();
                        if (_interval != undefined) {
                            selfCfgDef.interval = _interval || 5000;
                        }
                        if (_numLimit != undefined) {
                            selfCfgDef.numLimit = _numLimit || 0;
                        }
                        if (_lazyTime != undefined) {
                            selfCfgDef.lazyTime = _lazyTime || 0;
                        }
                        if (_isRfExe != undefined) {
                            selfCfgDef.isRfExe = _isRfExe;
                        }
                        _fcTools_._Cp_console_("fs_timer :[" + selfCfgDef.id + "] ready to restart[lazyTime=" + selfCfgDef.lazyTime + "] work...");
                        if (selfCfgDef.lazyTime > 0) {
                            //是否延迟执行
                            selfCfgInner._lazyId = setTimeout(_start, selfCfgDef.lazyTime);
                        } else {
                            _start();
                        }
                    };
                    var self = this;
                    var selfCfgDef = self.cfgDef;
                    var selfCfgInner = self.cfgInner;
                    $.extend(selfCfgDef,opts);
                    if (selfCfgDef.lazyTime > 0) {
                        //是否延迟执行
                        selfCfgInner._lazyId = setTimeout(_start, selfCfgDef.lazyTime);
                    } else {
                        _start();
                    }
                };

                function FsCountDown(pk,opts){
                    this.cfgDef = {
                        id:pk,
                        //每次启动执行的延迟时间
                        lazyTime: 0,
                        //倒计时总秒数
                        countDownTime: -1,
                        //间隔时间 毫秒,默认1秒
                        interval: 1000,
                        //是否启动时立即执行
                        isRfExe:!0,
                        //分区域显示ID,如果没有的话,在回调函数中自定义设置
                        tFormatIds:{
                            DD:null,//天
                            HH:null,//时
                            MM:null,//分
                            SS:null//秒
                        },
                        //每次倒计时结束间隔时的回调函数
                        stopCallback: null,
                        stopCallbackPms: null,
                        //每隔interval秒执行函数
                        intervalCallback:null
                    };
                    this.cfgInner = {
                        //以下配置默认,不能重置
                        _lazyId: null,
                        _mId: null,
                        //0 停止初始状态,1 启动并运行,2 回调函数正在执行中
                        _state: 0
                    };
                    this.stop = function(){
                        if (selfCfgInner._lazyId) {
                            clearInterval(selfCfgInner._lazyId);
                        }
                        if (selfCfgInner._mId) {
                            clearInterval(selfCfgInner._mId);
                        }
                        selfCfgInner._lazyId = null;
                        selfCfgInner._mId = null;
                        selfCfgInner._state = 0;
                        _fcTools_._Cp_console_("fs_count_down :[" + selfCfgDef.id + "] stop work...");
                    };
                    // Only used by internal code to call the callback
                    function _internalCallback(isInitFg){
                        var cdt = selfCfgDef.countDownTime;
                        var st = selfCfgInner._state;
                        _fcTools_._Cp_console_("fs_count_down :countDownTime[" + selfCfgDef.id + "]:" + cdt);
                        var h = Math.floor(cdt / 60 / 60);
                        var d = parseInt(h / 24);
                        var m = Math.floor((cdt - h * 60 * 60) / 60);
                        var s = Math.floor((cdt - h * 60 * 60 - m * 60));
                        h = (h + "").length == 1 ? "0" + h : h;
                        m = (m + "").length == 1 ? "0" + m : m;
                        s = (s + "").length == 1 ? "0" + s : s;
                        try{
                            var tfs = selfCfgDef.tFormatIds;
                            if(tfs){
                                if(tfs.DD){
                                    $("#" + tfs.DD).html(d);
                                }
                                if(tfs.HH){
                                    $("#" + tfs.HH).html(h);
                                    $("#" + tfs.HH+"1").html(h);
                                }
                                if(tfs.MM) {
                                    $("#" + tfs.MM).html(m);
                                    $("#" + tfs.MM+"1").html(m);
                                }
                                if(tfs.SS){
                                    $("#" + tfs.SS).html(s);
                                    $("#" + tfs.SS+"1").html(s);
                                }
                            }
                            //每次间隔interval执行的回调
                            if( selfCfgDef.intervalCallback){
                                selfCfgDef.intervalCallback([d,h,m,s]);
                            }
                            selfCfgDef.countDownTime = selfCfgDef.countDownTime - (selfCfgDef.interval/1000);
                            if ((!isInitFg && st == 0)  || selfCfgDef.countDownTime < 0) {
                                self.stop();
                                //每一次倒计时结束时的回调
                                if (st != 2 && selfCfgDef.stopCallback) {
                                    selfCfgInner._state = 2;
                                    selfCfgDef.stopCallback(selfCfgDef.stopCallbackPms);
                                    if(selfCfgInner._state == 2){
                                        selfCfgInner._state = st;
                                    }
                                }
                            }
                        }catch (e){
                            _fcTools_._Cp_console_error_("fs_count_down :[" + selfCfgDef.id + "] internalCallback deal fail:"+ e.message,_G_FST_VAL.ENUM_prefix.tcd_p);
                        }
                    };
                    function _start(){
                        if (selfCfgDef._lazyId) {
                            clearInterval(selfCfgDef._lazyId);
                            selfCfgInner._lazyId = null;
                        }
                        if (selfCfgDef.countDownTime < 0) {
                            _fcTools_._Cp_console_("fs_count_down :[" + selfCfgDef.id + "] countDownTime is not < 0!");
                            self.stop();
                            return false;
                        }
                        if (selfCfgInner._state === 1) {
                            return true;
                        }else if (selfCfgInner._state === 0) {
                            if(selfCfgDef.isRfExe){
                                _internalCallback(true);
                            }
                            selfCfgInner._mId = setInterval(_internalCallback, selfCfgDef.interval); //默认一秒
                            selfCfgInner._state = 1;
                            _fcTools_._Cp_console_("fs_count_down :[" + selfCfgDef.id + "] start[countDownTime="+selfCfgDef.countDownTime+";lazyTime=" + selfCfgDef.lazyTime + "] work...");
                            return true;
                        }
                        return false;
                    };
                    this.reStart = function(_cdTimeSS, _stopCallBPms, _lazyTime,_interval,_isRfExe) {
                        self.stop();
                        if (_cdTimeSS != undefined) {
                            selfCfgDef.countDownTime = _cdTimeSS || -1;
                        }
                        if (_stopCallBPms != undefined) {
                            selfCfgDef.stopCallbackPms = _stopCallBPms;
                        }
                        if (_lazyTime != undefined) {
                            selfCfgDef.lazyTime = _lazyTime || 0;
                        }
                        if (_interval != undefined) {
                            selfCfgDef.interval = _interval || 1000;
                        }
                        if (_isRfExe != undefined) {
                            selfCfgDef.isRfExe = _isRfExe;
                        }
                        _fcTools_._Cp_console_("fs_count_down :[" + selfCfgDef.id + "] ready to restart[countDownTime="+selfCfgDef.countDownTime+";lazyTime=" + selfCfgDef.lazyTime + "] work...");
                        if (selfCfgDef.lazyTime > 0) {
                            //是否延迟执行
                            selfCfgInner._lazyId = setTimeout(_start, selfCfgDef.lazyTime);
                        } else {
                            _start();
                        }
                        return true;
                    };
                    var self = this;
                    var selfCfgDef = self.cfgDef;
                    var selfCfgInner = self.cfgInner;
                    $.extend(selfCfgDef,opts);
                    if (selfCfgDef.lazyTime > 0) {
                        //是否延迟执行
                        selfCfgInner._lazyId = setTimeout(_start, selfCfgDef.lazyTime);
                    } else {
                        _start();
                    }
                };
            }

        })($);
        //消息弹窗
        __fstPlugin.MPOP = {};
        (function($){
            _initMsgPopMgr();
            function _initMsgPopMgr(){
                //统一的消息弹窗管理器,每一个pk只能有一个对象
                __fstPlugin.MPOP.MsgPopMgr = {
                    _inDSC_ : [],//内部数据缓存存储器
                    _put : function(pk,tbObj) {
                        this._inDSC_[pk] = tbObj;
                        return tbObj;
                    },
                    _remove:function(pk){
                        if(pk){
                            var obj = this._inDSC_[pk];
                            if(obj&& obj.stop){
                                obj.stop();
                            }
                            this._inDSC_[pk] = null;
                            delete this._inDSC_[pk];
                        }
                    },
                    _get : function(pk, isClear$ReInit,type,opts) {
                        var result = this._inDSC_[pk];
                        if(isClear$ReInit){
                            this._remove(pk);
                            result = null;
                        }
                        if (!result) {
                            if(type == 'BRC'){
                                result = new FsBrcPop(pk,opts);
                            }
                            if(result){
                                this._put(pk,result);
                            }
                        }else{
                            __cpAlert("Currently pk time object already exists, you can set 'isClear$ReInit = true'!");
                        }
                        return result;
                    },
                    getBrcPop:function(pk,isClear$ReInit,opts){
                        return this._get(pk,isClear$ReInit,"BRC",opts);
                    },
                    stop$clear:function(pk){
                        this._remove(pk);
                    }
                };
                function FsBrcPop(pk,opts){
                    this.cfgDef = {
                        id:pk,
                        //每个消息之间自动隐藏和显示的间隔时间毫秒
                        interval: 5000,
                        //并发时最多存放消息的数量,超过自动忽略
                        cpNum:15,
                        //是否启动时立即执行
                        isRfExe:!0
                    };
                    this.cfgInner = {
                        //以下配置默认,不能重置
                        _msgDvObj:  null,//消息div对象
                        _msgQueue:  [],//消息队列
                        _isStartTQ:  !1,//任务队列是否已经启动
                        _idTQ:  null,//任务队列定时任务ID
                        _lastOcState:  !1,//记录最后一次消息状态.显示或关闭的标记:true 显示,false 关闭
                        _isFrames:  !1//是否有frames嵌套,有的话显示再最顶层的windows中
                    };
                    function _showOrHideDv(tp){
                        if(tp == 1){
                            //显示
                            selfCfgInner._msgDvObj.slideDown('slow');
                        }else{
                            selfCfgInner._msgDvObj.slideUp('slow');
                        }
                    };
                    //核心队列任务处理
                    function _dealMsgTask(){
                        if(selfCfgInner._msgQueue){
                            var ms = selfCfgInner._msgQueue.length;
                            if(ms > 0){
                                if(selfCfgInner._lastOcState){
                                    //如果最后一次是显示,则关闭,并且删除任务队列信息[0]
                                    selfCfgInner._msgQueue.shift();//删除第一个元素
                                    _showOrHideDv(0);
                                    selfCfgInner._lastOcState = false;
                                }else{
                                    //如果最后一次是关闭,则显示任务队列信息[0]
                                    selfCfgInner._msgDvObj.find("div[id="+selfCfgDef.id+"_fs_brc_popContent]").html(selfCfgInner._msgQueue[0]).attr("title",selfCfgInner._msgQueue[0]);
                                    selfCfgInner._msgDvObj.find("label[id="+selfCfgDef.id+"_fs_brc_popRemain]").attr("title",ms?'Left '+ms+' data':'');
                                    _showOrHideDv(1);
                                    selfCfgInner._lastOcState = true;
                                }
                            }
                        }else{
                            //停止任务队列及相关
                            self.stop();
                            FST_C_T._Cp_console_("BCR_POP:["+selfCfgDef.id+"] message has been processing ends automatically triggered stop operation!");
                        }
                    };
                    function _start(){
                        if(!selfCfgInner._isStartTQ){
                            selfCfgInner._isStartTQ = true;
                            //创建消息DIV
                            var idK = selfCfgDef.id;
                            //这里取最外层窗体数据,如果有iframe嵌套的话
                            var _pop = null;
                            var _frames = window.top.frames;
                            if(_frames||_frames.length>0){
                                selfCfgInner._isFrames = true;
                                _pop = $('body',window.top.document).find("#"+idK+"_fs_brc_pop").html();
                            }else{
                                selfCfgInner._isFrames = false;
                                _pop = $("#"+idK+"_fs_pop").html();
                            }
                            if(!_pop){
                                //如果没得到的话新建
                                var md =
                                    ' <div id="{IDK}_fs_brc_pop" class="fs_brc_pop" >'
                                    +'<div class="fs_brc_popHead">'
                                    +'    <a id="{IDK}_fs_brc_popClose" class="fs_brc_popClose" title="关闭">关闭</a>'
                                    +'    <label id="{IDK}_fs_brc_popRemain">系统消息</label>'
                                    +'</div>'
                                    +'<div id="{IDK}_fs_brc_popContent" class="fs_brc_popContent">'
                                    +'暂无'//内容
                                    +'</div>'
                                    +'</div>';
                                md = FST_C_T.g_String_ext_replaceAll(md,"{IDK}",idK);
                                var _popObj_ = null;
                                if(selfCfgInner._isFrames){
                                    $('body',window.top.document).append(md);
                                    _popObj_ = $('body',window.top.document).find("#"+idK+"_fs_brc_pop");
                                }else{
                                    $("body").append(md);
                                    _popObj_ = $("#"+idK+"_fs_brc_pop");
                                }
                                selfCfgInner._msgDvObj = _popObj_;
                                //绑定事件
                                selfCfgInner._msgDvObj.find("a[id="+idK+"_fs_brc_popClose]").on("click",function(){
                                    //关闭
                                    _dealMsgTask();
                                });
                                //初始化隐藏
                                selfCfgInner._msgDvObj.hide();
                            }
                            if(selfCfgDef.isRfExe){
                                _dealMsgTask();
                            }
                            if(selfCfgInner._idTQ){
                                clearInterval(selfCfgInner._idTQ);
                                selfCfgInner._idTQ = null;
                            }
                            selfCfgInner._idTQ = setInterval(_dealMsgTask,selfCfgDef.interval);
                        }else{
                            FST_C_T._Cp_console_("BCR_POP:["+selfCfgDef.id+"] it has been activated!");
                        }
                    };
                    this.addMsgInfo = function(msgStr){
                        if(selfCfgInner._msgQueue&&selfCfgInner._msgQueue.length < selfCfgDef.cpNum){
                            selfCfgInner._msgQueue.push(msgStr);
                            //有消息放入时,启动队列
                            _start();
                        }else{
                            FST_C_T._Cp_console_("BCR_POP:["+selfCfgDef.id+"] the number of concurrent already full!");
                        }
                    };
                    this.stop = function(){
                        if(selfCfgInner._idTQ){
                            clearInterval(selfCfgInner._idTQ);
                            selfCfgInner._idTQ = null;
                        }
                        if(selfCfgInner._isStartTQ){
                            _showOrHideDv(0);
                            selfCfgInner._isStartTQ = false;
                            selfCfgInner._msgQueue = null;
                            selfCfgInner._msgQueue = [];
                            selfCfgInner._lastOcState = false;
                        }
                    };
                    var self = this;
                    var selfCfgDef = self.cfgDef;
                    var selfCfgInner = self.cfgInner;
                    $.extend(selfCfgDef,opts);
                };
            };
        })($);

        //业务效果:滑块,滚动
        __fstPlugin.EFCT = {};
        (function($){
            _initEffectMgr();
            function _initEffectMgr(){
                __fstPlugin.EFCT.EffectMgr = {
                    _inDSC_ : [],//内部数据缓存存储器
                    _put : function(pk,tbObj) {
                        this._inDSC_[pk] = tbObj;
                        return tbObj;
                    },
                    _remove:function(pk){
                        if(pk){
                            var obj = this._inDSC_[pk];
                            if(obj&& obj.stop){
                                obj.stop();
                            }
                            this._inDSC_[pk] = null;
                            delete this._inDSC_[pk];
                        }
                    },
                    _get : function(pk, isClear$ReInit,type,opts) {
                        var result = this._inDSC_[pk];
                        if(isClear$ReInit){
                            this._remove(pk);
                            result = null;
                        }
                        if (!result) {
                            if(type == 'SDER'){
                                result = new FsSlider(pk,opts);
                            }else if(type == 'SC_DC'){
                                result = new FsScrollDc(pk,opts);
                            }
                            if(result){
                                this._put(pk,result);
                            }
                        }else{
                            __cpAlert("Currently pk time object already exists, you can set 'isClear$ReInit = true'!");
                            result = null;
                        }
                        return result;
                    },
                    getSlider:function(pk,isClear$ReInit,barSP,barHk,gradus,step,defRecIdx,showDiv,setDisplayFun,layerPm){
                        layerPm=layerPm||false;//元素是否在上一层次\
                        var _win_top_dc=window.top.document;
                        var _opts = {};
                        if(layerPm){
                            _opts['SD_DISPLAYOBJ'] = $("#"+(showDiv?showDiv:"showDiv"),_win_top_dc)||null;
                            _opts['SD_BAR_SP_ID'] = barSP||null;
                            _opts['SD_BAR_SP'] = $("#"+(barSP?barSP:"barSP"),_win_top_dc);
                            _opts['SD_BAR_SP_JS'] =  _fcTools_.g_getHtmlObjById_top(_opts.SD_BAR_SP_ID);

                            _opts['SD_BAR_HK_ID'] = barHk || null;
                            _opts['SD_BAR_HK'] = $("#"+(barHk?barHk:"bar"),_win_top_dc);
                            _opts['SD_BAR_HK_JS'] = _fcTools_.g_getHtmlObjById_top(_opts.SD_BAR_HK_ID);

                            _opts['SD_GRADUATES'] = gradus||null;
                            _opts['SD_STEP'] =  step ? (step>0 ? step:-1):-1;
                            _opts['SD_GD_IDX'] = defRecIdx ? (defRecIdx>0 ? defRecIdx:0):0;
                            _opts['LAYER_PM'] = layerPm;
                        }else{
                            _opts['SD_DISPLAYOBJ'] = $("#"+(showDiv?showDiv:"showDiv"))||null;
                            _opts['SD_BAR_SP_ID'] = barSP||null;
                            _opts['SD_BAR_SP'] = $("#"+(barSP?barSP:"barSP"));
                            _opts['SD_BAR_SP_JS'] =  _fcTools_.g_getHtmlObjById(_opts.SD_BAR_SP_ID);

                            _opts['SD_BAR_HK_ID'] = barHk || null;
                            _opts['SD_BAR_HK'] = $("#"+(barHk?barHk:"bar"));
                            _opts['SD_BAR_HK_JS'] = _fcTools_.g_getHtmlObjById(_opts.SD_BAR_HK_ID);

                            _opts['SD_GRADUATES'] = gradus||null;
                            _opts['SD_STEP'] =  step ? (step>0 ? step:-1):-1;
                            _opts['SD_GD_IDX'] = defRecIdx ? (defRecIdx>0 ? defRecIdx:0):0;
                            _opts['LAYER_PM'] = layerPm;
                        }
                        _opts['SD_HK_LEFT'] = 0;

                        _opts['SD_SETDISPLAY_FUN'] =  setDisplayFun || null;
                        return this._get(pk,isClear$ReInit,"SDER",_opts);
                    },
                    /**
                     *
                     * @param pk
                     * @param isClear$ReInit
                     * @param upH 向上切换高度
                     * @param speed 延时时间 ms
                     * @param delay 切换时间 ms
                     * @param elementId 元素id
                     * @param isStartTT 是否有超过指定条数的数据 并启动轮播
                     */
                    getScrollDc:function(pk,isClear$ReInit,upH, speed,delay,elementId,isStartTT){
                        var _opts = {};
                        _opts['cutoverH'] = upH;
                        _opts['eleId'] = elementId||null;
                        _opts['delayT'] = delay;
                        _opts['speedT'] =  speed;
                        _opts['isStartCs'] = isStartTT||false;
                        return this._get(pk,isClear$ReInit,"SC_DC",_opts);
                    },
                    stop$clear:function(pk){
                        this._remove(pk);
                    }
                };
                function FsScrollDc(pk,opts){
                    this.cfgDef = {
                        id:pk,
                        cutoverH:  null,
                        eleId:  null,
                        delayT:  3000,
                        speedT:  50,
                        isStartCs: false

                    };
                    this.cfgInner = {
                        //以下配置默认,不能重置
                        _stId:null,
                        _dtId:null,
                        _isOnmouseF : false,
                        _isRun : false,//是否启动运行
                        _isNeedStop : false//是否需要停止执行
                    };
                    function _SC_DownCarousel(){
                        selfCfgInner._isRun = true;
                        selfCfgInner._isOnmouseF = false;
                        var o = document.getElementById(selfCfgDef.eleId);
                        o.innerHTML += o.innerHTML;
                        o.style.marginTop = 0;
                        if(!o.onmouseover){
                            o.onmouseover = function(){
                                selfCfgInner._isOnmouseF = true;
                            };
                        }
                        if(!o.onmouseout){
                            o.onmouseout = function(){
                                selfCfgInner._isOnmouseF = false;
                            };
                        }

                        //启动
                        function start(){
                            clearInterval(selfCfgInner._stId);
                            clearTimeout(selfCfgInner._dtId);
                            if(selfCfgInner._isNeedStop){
                                //停止之前的滚动
                                selfCfgInner._isNeedStop = false;
                                selfCfgInner._isRun = false;
                                return;
                            }
                            selfCfgInner._stId = setInterval(scrolling, selfCfgDef.speedT);
                            if (!selfCfgInner._isOnmouseF) {
                                o.style.marginTop = parseInt(o.style.marginTop) - 1 + "px";
                            }
                        };
                        //执行滚动函数
                        function scrolling(){
                            if (parseInt(o.style.marginTop) % selfCfgDef.cutoverH != 0) {
                                o.style.marginTop = parseInt(o.style.marginTop) - 1 + "px";
                                if (Math.abs(parseInt(o.style.marginTop)) >= o.scrollHeight / 2) {
                                    o.style.marginTop = 0;
                                }
                            }else {
                                clearInterval(selfCfgInner._stId);
                                clearTimeout(selfCfgInner._dtId);
                                selfCfgInner._dtId = setTimeout(start, selfCfgDef.delayT);
                            }
                        };
                        selfCfgInner._dtId  = setTimeout(start,  selfCfgDef.delayT);
                    };
                    this.reStart = function(_isStartTT){
                        selfCfgDef.isStartCs = _isStartTT||false;
                        if(!selfCfgDef.isStartCs){
                            return;
                        }
                        if(!selfCfgInner._isRun){
                            //开始新一轮的操作
                            _SC_DownCarousel(selfCfgDef.id,selfCfgDef.cutoverH, selfCfgDef.speedT, selfCfgDef.delayT, selfCfgDef.eleId);
                            return false;
                        }
                        //通知前一次滚动停止
                        selfCfgInner._isNeedStop = true;
                        //等待前一次滚动结束
                        var _n=0;
                        var _wt = setInterval(function(){
                            if(_n >= 1){
                                clearInterval(_wt);
                                _SC_DownCarousel();
                                return false;
                            }
                            if(!selfCfgInner._isNeedStop){
                                //开始新一轮的操作
                                clearInterval(_wt);
                                _SC_DownCarousel();
                                return false;
                            }
                            _n++;
                        }, 1000);
                    };

                    this.stop = function(){
                        //通知前一次滚动停止
//                        selfCfgInner._isNeedStop = true;
                    };

                    var self = this;
                    var selfCfgDef = self.cfgDef;
                    var selfCfgInner = self.cfgInner;
                    $.extend(selfCfgDef,opts);
                    _SC_DownCarousel();
                };
                function FsSlider(pk,opts){
                    this.cfgDef = {
                        id:pk,
                        SD_DISPLAYOBJ : null,//选取值显示对象
                        SD_BAR_SP_ID : null,//滑块区域对象ID
                        SD_BAR_SP :  null,//滑块区域对象
                        SD_BAR_SP_JS : null,

                        SD_BAR_HK_ID :null,
                        SD_BAR_HK :  null,//滑块图标对象
                        SD_BAR_HK_JS :null,

                        SD_GRADUATES : null,//索引值[{"SR":1,"SR_BONUS":123.3,"RB":"0.1%","RB_LV":1}]
                        SD_STEP : -1,//步值,设置滑块的位置,要计算的
                        SD_GD_IDX : 0,//记录当前滑块索引值,可以初始化默认索引值
                        SD_HK_LEFT : 0,//记录滑块离左侧的距离

                        SD_SETDISPLAY_FUN : null,//设置选取值显示,如果不传的话,默认格式显示
                        LAYER_PM:null//设置元素是不是上一个层 false 同层，true 上一层
                    };

                    this.cfgInner = {
                        //以下配置默认,不能重置
                        _hkMaxL : 0//滑块最大可滑长度
                    };

                    //设置滑块移动位置
                    function _innerSetHkPos(hkLf){
                        try{
                            //判断滑块是否越界,超过设置为最大或最小值
                            if(hkLf <= 0){
                                hkLf = 0;
                            }
                            if(hkLf > selfCfgInner._hkMaxL){
                                hkLf = selfCfgInner._hkMaxL;
                            }
                            //获取索引值 取整(四舍五入)
                            var __hkLastGd = Math.round(hkLf/selfCfgDef.SD_STEP);
                            //判断处理索引值是否越界
                            if(__hkLastGd < 0){
                                __hkLastGd = 0;
                            }
                            if(__hkLastGd >= selfCfgDef.SD_GRADUATES.length){
                                __hkLastGd =  selfCfgDef.SD_GRADUATES.length-1;
                            }
                            //if((hkLf%self.SD_STEP)){
                            //    return;
                            //}
                            //设置滑块左侧距离长度即停留的位置
                            selfCfgDef.SD_BAR_HK_JS.style.left = hkLf + "px";
                            selfCfgDef.SD_GD_IDX = __hkLastGd;
                            selfCfgDef.SD_HK_LEFT = hkLf;
                            //如果出入自定义设置显示值函数,优先执行
                            if(selfCfgDef.SD_SETDISPLAY_FUN){
                                selfCfgDef.SD_SETDISPLAY_FUN(selfCfgDef);
                            }else{
                                //默认格式显示
                                if(selfCfgDef.SD_DISPLAYOBJ){
                                    var gd = selfCfgDef.SD_GRADUATES[__hkLastGd];
                                    selfCfgDef.SD_DISPLAYOBJ.text(gd['SR'] + "/" + gd['RB']+" " +gd['SR_BONUS']+" " +gd['RB_LV'] );
                                }
                            }
                        }catch (e){
                            alert(e.message);
                        }
                    }

                    //初始化启动
                    function _start(layer_pm){
                        //校验部分参数是否合法
                        if(!selfCfgDef.SD_GRADUATES||selfCfgDef.SD_GRADUATES.length==0){
                            _fcTools_.g_Alert("传入的刻度索引值不正确!");
                            return;
                        }
                        if(!selfCfgDef.SD_DISPLAYOBJ && !selfCfgDef.SD_SETDISPLAY_FUN){
                            _fcTools_.g_Alert("参数showDiv和setDisplayFun至少传入一个!");
                            return;
                        }
                        //计算步值 取整(四舍五入)
                        if(selfCfgDef.SD_STEP == -1){
                            selfCfgDef.SD_STEP = Math.floor((selfCfgInner._hkMaxL/selfCfgDef.SD_GRADUATES.length)*1000)/1000;
                        }
                        if(selfCfgDef.SD_GRADUATES.length * selfCfgDef.SD_STEP  > selfCfgInner._hkMaxL){
                            _fcTools_.g_Alert("传入的刻度索引值大小不能大于滑块区域的宽度!");
                            return;
                        }
                        var win_or_doc =document;//层级判断
                        if(layer_pm){
                            win_or_doc =window.top.document;
                        }else{
                            win_or_doc =document;
                        }
                        selfCfgDef.SD_BAR_HK.on({
                            "mousedown":function(event){
                                var mp = _fcTools_.g_u_getMousePosition(event);
                                //滑块离左侧浏览器页面(或客户区)的水平坐标
                                var disX = mp.X - selfCfgDef.SD_BAR_HK_JS.offsetLeft;


                                win_or_doc.onmousemove = function(_event){
                                    mp = _fcTools_.g_u_getMousePosition(_event);
                                    var hkLf = mp.X - disX;//滑块离左侧边界的距离
                                    _innerSetHkPos(hkLf);
                                    return false;
                                };
                                win_or_doc.onmouseup = function(){
                                    win_or_doc.onmousemove = null;
                                    win_or_doc.onmouseup = null;
                                };
                                return false;
                            },
                            "click":function(event){
                                event.stopPropagation();
                                event.cancelBubble = true;
                            }
                        });
                        //设置默认值
                        self.setHkStayPos();
                    }
                    //设置滑块停留位置:"+"  "-"
                    this.setHkStayPos = function(opType){
                        var _opType = "DEF";
                        if(opType){
                            _opType = opType;
                        }
                        switch (_opType){
                            case "DEF":{
                                //设置滑块默认停留
                                var defHkLf = selfCfgDef.SD_GD_IDX * selfCfgDef.SD_STEP;
                                if(selfCfgDef.SD_GD_IDX!=0 && selfCfgDef.SD_GD_IDX >= selfCfgDef.SD_GRADUATES.length){
                                    _innerSetHkPos(defHkLf+5);
                                }else{
                                    _innerSetHkPos(defHkLf);
                                }
                                break;
                            }
                            case "+":{
                                //var defHkLf = (++self.SD_GD_IDX) * self.SD_STEP;
                                var defHkLf = selfCfgDef.SD_HK_LEFT + selfCfgDef.SD_STEP;
                                _innerSetHkPos(defHkLf);
                                break;
                            }
                            case "-":{
                                //var defHkLf = (--self.SD_GD_IDX) * self.SD_STEP;
                                var defHkLf = selfCfgDef.SD_HK_LEFT - selfCfgDef.SD_STEP;
                                _innerSetHkPos(defHkLf);
                                break;
                            }
                        }
                    };
                    this.stop = function(){

                    };
                    var self = this;
                    var selfCfgDef = self.cfgDef;
                    var selfCfgInner = self.cfgInner;
                    $.extend(selfCfgDef,opts);
                    self.cfgInner._hkMaxL = selfCfgDef.SD_BAR_SP_JS.offsetWidth-selfCfgDef.SD_BAR_HK_JS.offsetWidth;
                    _start(selfCfgDef.LAYER_PM);
                };
            }
        })($);

        /**金额输入框功能气泡提示
         * ObjID input的ID
         * @type {{}}
         */
        __fstPlugin.BUBBLE = {};
        var _fpBubble = __fstPlugin.BUBBLE;
        (function ($) {
            _fpBubble.commBubble = function(ObjID){
                //气泡提示
                $('#'+ObjID).poshytip({
                    className: 'tip-yellowsimple',
                    showOn: 'focus',
                    alignTo: 'target',
                    alignX: 'inner-left',
                    offsetX: 0,
                    offsetY: 8,
                    showTimeout: 100
                });
                $('#'+ObjID).on('input propertychange',function(){
                    var showTxt='输入金额';
                    if($('#'+ObjID).val()>0){
                        $('.tip-yellowsimple .tip-inner').html($('#'+ObjID).val());
                    }else{
                        $('#'+ObjID).attr('title',showTxt);
                        $('.tip-yellowsimple .tip-inner').html(showTxt);
                    }
                });
            }
        })($);

        /**
         * Creates a Ping instance.
         * @returns {Ping}
         * @constructor
         */
        __fstPlugin.IP_PING = function() {};
        var _fpIpping = __fstPlugin.IP_PING;
        /**
         * Pings source and triggers a callback when completed.
         * @param source Source of the website or server.
         * @param callback Callback function to trigger when completed.
         */
        _fpIpping.prototype.ping = function(source, callback) {
            this.img = new Image();
            var start = new Date();
            this.img.onload = this.img.onerror = pingCheck;
            /**
             * Times ping and triggers callback.
             */
            function pingCheck() {
                var pong = new Date() - start;

                if (typeof callback === "function") {
                    callback(pong);
                }
            };
            this.img.src = "//" + source + "/?" + (+new Date()); // Trigger image load with cache buster
        };
        //=================PLUGIN end  =====================

    }catch (e){
        console.log('Core js lib init error:'+e.message);
    }
    if(!this.FST){
        $.FST.CORE = __fstCore;
        $.FST.PLUGIN = __fstPlugin;
        $.FST.BSF = __fstBsf;
        //this.FST = $.FST;
        this.FST_C = $.FST.CORE;
        this.FST_C_C = $.FST.CORE.Cache;

        this.FST_C_T = $.FST.CORE.TOOLS;
        // this.FST_C_UTG = $.FST.CORE.TG;
        this.FST_C_UTG_TGSM = $.FST.CORE.TG.TableGridSetMgr;

        //this.FST_P = $.FST.PLUGIN;
        this.FST_P_FDP = $.FST.PLUGIN.FDP;//功能弹窗

        this.FST_C_DL = $.FST.PLUGIN.LAYER;
        this.FST_C_F = $.FST.PLUGIN.CREATEFRAME;
        this.FST_C_PY = $.FST.PLUGIN.GETPINYIN;

        this.FST_P_V = $.FST.PLUGIN.VERIFY;
        //定时器和倒计时器统一调用管理器
        this.FST_P_TCDM = $.FST.PLUGIN.TCD.TimerCountDownMgr;
        //消息弹窗管理器,目前只有右下角
        this.FST_P_MPOPM = $.FST.PLUGIN.MPOP.MsgPopMgr;
        //业务效果:滑块,滚动(向上,向左)
        this.FST_P_EFCT = $.FST.PLUGIN.EFCT.EffectMgr;
        //金额输入框功能气泡提示
        this.FST_P_BB = $.FST.PLUGIN.BUBBLE;
        //网络测速
        this.FST_IPPING = $.FST.PLUGIN.IP_PING;

        this.FST_BSF =  $.FST.BSF;

    }
}(jQuery,window);
//删除元素
function HideElement(obj){
    obj.remove();
}
