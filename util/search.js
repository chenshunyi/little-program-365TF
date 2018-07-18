var until = require('../util/util.js');

//get search list data
function getSearchList(that, keyword) {
    //根据设置url请求基本参数
    if(that.data.pagetype == 'newhouse') {
        var url = until.config.Newhouse_Search;
        var ajaxparam = {
            'type': 'newhouse',
            'v': '6.3.5',
            'version': '6.3.5',
            'client': 'tf'
        }
    } else if (that.data.pagetype == 'secondhouse') {
        var url = until.config.Secondhouse_Search;
        var ajaxparam = {
            'pagesize': 10,
            'name': 'HouseBlock',
            'v': '1.0',
            'api_preview': '1'
        }
    } else {
        return false;
    }
    if (!keyword) {
        that.setData({
            listitems: {}
        });
        return false;
    }
    ajaxparam.keyword = keyword;
    ajaxparam.city = that.data.city;
    ajaxparam.api_key = '365tfxcx';

    until.ajax_curl(url, ajaxparam, function (res) {
        var result = {};
        if(res.statusCode == 200){
            if(that.data.pagetype == 'newhouse') result = res.data.associateKeyword;
            else if(that.data.pagetype == 'secondhouse'){
              console.log(res);
                result = res.data;
            } 
        }
        
        that.setData({
            listitems: result
        })

    });

}

//根据类型设定结果跳转
function goResultPage(pagetype,keyword){
    if (pagetype == 'newhouse') 
      wx.redirectTo({ url: '/page/newhouse/list?keyword=' + keyword })
    else if (pagetype == 'secondhouse') 
      wx.redirectTo({ url: '/page/secondhouse/list?keyword=' + keyword })
    else
      return false;
}

module.exports = {
  until         : until,
  getSearchList : getSearchList,
  goResultPage  : goResultPage

}