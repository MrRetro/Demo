//封装一些弹框 公共的js
//权限控制
function power(str) {
    var arry = str.split(',');
    $('.hd-power').each(function () {
        var val = $(this).attr('rel');
        for (var i = 0; i < arry.length; i++) {
            if (val == arry[i]) {
                $(this).removeClass('hd-power');
            }
        }
    });
}