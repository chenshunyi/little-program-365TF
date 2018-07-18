var app = getApp();
var common = require('./util.js');

// 查询我的提问列表接口
function getMyConsultList(that) {
  // if (that.data.showtip == 2 || that.data.showtip == 3) {// 没有（更多）数据时直接返回
  //   return;
  // }

  common.fbs_ajax_curl(
    common.config.Fbs_MyConsult,
    that.data.reqParam,
    function (res) {
      if (that.isclearlist == 1) {// 清空列表
        that.setData({
          consultItems: []
        });
        that.isclearlist = 0;
      }

      if (res.data && res.data.length > 0) {
        if (res.data.length < that.data.reqParam.pagesize) {
          that.setData({// 没有更多数据
            showtip: 2
          });
        } else {
          that.setData({
            showtip: 1
          });
        }
        var allitems = that.data.consultItems;
        for (var i in res.data) {//链接打开方式
          res.data[i].opentype = "navigate";
          var rStamp = res.data[i].dateline;
          var eStamp = res.data[i].time_expire;
          if (rStamp != "") {
            res.data[i].replydateStr = locaTimeFormat("yyyy/MM/dd hh:mm:ss", parseInt(rStamp) * 1000);
            // res.data[i].replydateStr = new Date(parseInt(rStamp) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
          }
          if (eStamp != "") {
            res.data[i].expireStr = locaTimeFormat("yyyy/MM/dd hh:mm:ss", parseInt(eStamp) * 1000);
            // res.data[i].expireStr = new Date(parseInt(eStamp) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
          }
        }
        allitems.push.apply(allitems, res.data);
        that.setData({
          consultItems: allitems
        });
      } else {
        if (that.data.reqParam.page == 1) {
          that.setData({// 没有数据
            showtip: 3
          });
        } else {
          that.setData({// 没有更多数据
            showtip: 2
          });
        }
      }
    }
  );
}

// 获取验证码接口
function fbsSmsCode(that) {
  common.fbs_ajax_curl(
    common.config.Fbs_SmsCode,
    that.data.requestParam,
    function (res) {
      that.setData({
        smsBtnLoading: false
      });
      var msg = res.mess;
      if (msg == "") {
        if (res.result == 0) {
          msg = "发送短信验证码失败"
        } else {
          msg = "发送短信验证码成功"
        }
      }
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1500
      });
      if (res.result == 1) {
        var reqParam = that.data.requestParam;
        reqParam.auth_resource = res.auth_resource;
        that.setData({
          requestParam: reqParam
        });
      }
    }
  );
}

// 登录接口
function fbsLogin(that) {
  common.fbs_ajax_curl(
    common.config.Fbs_UserLogin,
    that.data.requestParam,
    function (res) {
      that.setData({
        loginBtnLoading: false
      });
      var msg = res.mess;
      if (msg == "") {
        if (res.result == 0) {
          msg = "登录失败"
        } else {
          msg = "登录成功"
        }
      }
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1500
      });
      if (res.result == 1) {// 登录成功
        // 持久化用户登录信息
        wx.setStorageSync("fbs_login_state", res.result);
        wx.setStorageSync("fbs_login_phone", res.data.passport_phone);
        wx.setStorageSync("fbs_login_name", res.data.passport_username);
        if (that.data.pendingUrl != "" && that.data.pendingUrl != "undefined") {
          wx.redirectTo({
            url: that.data.pendingUrl
          })
        } else {
          wx.navigateBack();
        }
      }
    }
  );
}

/**
 * 受限资源判断是否需要登录
 * param：登录后的目标页面路径
 */
function authLogin(pendingUrl) {
  var fbsIsLogin = wx.getStorageSync('fbs_login_state');
  var destUrl = pendingUrl;

  if (!fbsIsLogin || fbsIsLogin != "1") {// 需要登录
    if (pendingUrl == "") {
      destUrl = '/fbs/login/login';
    } else {
      destUrl = '/fbs/login/login?pendingUrl=' + encodeURIComponent(pendingUrl);
    }
  }
  if (destUrl != "") {
    wx.navigateTo({
      url: destUrl
    })
  }
}

//房博士首页
function fbsHomeData(that, city) {
  var url = common.config.Fbs_Home + '&city=' + city;
  common.fbs_ajax_curl(url, {}, function (res) {
    var data = res.data;
    var fbszxArray = [];
    for (var index in res.data.fbsList) {
      if (index < 4) {
        fbszxArray.push(res.data.fbsList[index]);
      }
    }
    res.data.fbsList = fbszxArray;
    that.setData({
      fbsHomeData: res.data
    });
  });
}

//房博士点赞
function fbsDZ(city, qaId, success) {
  var url = common.config.Fbs_DZ + '&city=' + city + '&qaid=' + qaId;
  common.fbs_ajax_curl(url, {}, function (res) {
    var typeStatus = 'none';


    if (res.result == 1) {
      typeStatus = 'success';
      typeof success == "function" && success();
    }

    wx.showToast({
      title: res.mess,
      icon: typeStatus,
      duration: 2000
    })
  });
}

//房博士专家列表
function fbsDoctorList(that, city) {
  if (!that.data.isFirstGetData && that.data.currentNo > that.data.totalPage) {
    return false;
  }
  var url = common.config.Fbs_DoctorList + '&city=' + city;
  var param = {
    page: that.data.currentNo,
  };

  fbsDoctorListData(url, param, function (res) {
    var oArray = that.data.dataArray;
    var tCurrentPage = that.data.currentNo;
    if (res.data.fbslist.length > 0) {
      for (var index in res.data.fbslist) {
        var obj = res.data.fbslist[index];
        if (typeof obj.answerNum == "undefined" || obj.answerNum == '') {
          obj.answerNum = '0';
        }

        if (typeof obj.total_fee == "undefined" || obj.total_fee == '0') {
          obj.total_fee = '';
        }

        var tagArray = obj.taglist;
        if (tagArray.length > 3) {
          tagArray = tagArray.slice(0, 3);
        }
        obj.taglist = tagArray;
      }
      oArray = oArray.concat(res.data.fbslist);

    } else {
      tCurrentPage--;
    }

    that.setData(
      {
        currentNo: tCurrentPage,
        dataArray: oArray,
        totalPage: res.data.totalpage,
        isFirstGetData: 0
      });
  });
}

function fbsDoctorListData(url, param = {}, success) {
  common.fbs_ajax_curl(url, param, success);
}


function fbsTimeConver(timeStr) {
  if (timeStr == '') {
    return '暂无';
  }

  var originTime = parseInt(timeStr) * 1000;
  var nDate = new Date();
  var nowTime = nDate.getTime();

  var space = (nowTime - originTime) / 1000.0;
  if (space < 60) {
    return '刚刚';
  }
  else if (space < 60 * 60) {
    return parseInt(space / 60) + '分钟前';
  }
  else if (space < 60 * 60 * 24) {
    return parseInt(space / 3600) + '小时前';
  }
  else {
    nDate.setTime(originTime);

    return nDate.getFullYear() + '-' + (nDate.getMonth() + 1) + '-' + nDate.getDate();
  }
}

/**
 * 格式化时间显示格式
 */
function locaTimeFormat(fmtCode, time) {
  var result, d, arr_d;

  var patrn_now_1 = /^y{4}-M{2}-d{2}\sh{2}:m{2}:s{2}$/;
  var patrn_now_11 = /^y{4}-M{1,2}-d{1,2}\sh{1,2}:m{1,2}:s{1,2}$/;

  var patrn_now_2 = /^y{4}\/M{2}\/d{2}\sh{2}:m{2}:s{2}$/;
  var patrn_now_22 = /^y{4}\/M{1,2}\/d{1,2}\sh{1,2}:m{1,2}:s{1,2}$/;

  var patrn_now_3 = /^y{4}年M{2}月d{2}日\sh{2}时m{2}分s{2}秒$/;
  var patrn_now_33 = /^y{4}年M{1,2}月d{1,2}日\sh{1,2}时m{1,2}分s{1,2}秒$/;

  var patrn_date_1 = /^y{4}-M{2}-d{2}$/;
  var patrn_date_11 = /^y{4}-M{1,2}-d{1,2}$/;

  var patrn_date_2 = /^y{4}\/M{2}\/d{2}$/;
  var patrn_date_22 = /^y{4}\/M{1,2}\/d{1,2}$/;

  var patrn_date_3 = /^y{4}年M{2}月d{2}日$/;
  var patrn_date_33 = /^y{4}年M{1,2}月d{1,2}日$/;

  var patrn_time_1 = /^h{2}:m{2}:s{2}$/;
  var patrn_time_11 = /^h{1,2}:m{1,2}:s{1,2}$/;
  var patrn_time_2 = /^h{2}时m{2}分s{2}秒$/;
  var patrn_time_22 = /^h{1,2}时m{1,2}分s{1,2}秒$/;

  if (!fmtCode) {
    fmtCode = "yyyy/MM/dd hh:mm:ss";
  }
  if (time) {
    d = new Date();
    d.setTime(time);
    if (isNaN(d)) {
      console.log("时间参数非法\n正确的时间示例:\nThu Nov 9 20:30:37 UTC+0800 2006\n或\n2006/10/17");
      return;
    }
  } else {
    d = new Date();
  }

  if (patrn_now_1.test(fmtCode)) {
    arr_d = splitDate(d, true);
    result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd + " " + arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
  } else if (patrn_now_11.test(fmtCode)) {
    arr_d = splitDate(d);
    result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd + " " + arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
  } else if (patrn_now_2.test(fmtCode)) {
    arr_d = splitDate(d, true);
    result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd + " " + arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
  } else if (patrn_now_22.test(fmtCode)) {
    arr_d = splitDate(d);
    result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd + " " + arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
  } else if (patrn_now_3.test(fmtCode)) {
    arr_d = splitDate(d, true);
    result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日" + " " + arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
  } else if (patrn_now_33.test(fmtCode)) {
    arr_d = splitDate(d);
    result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日" + " " + arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
  } else if (patrn_date_1.test(fmtCode)) {
    arr_d = splitDate(d, true);
    result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd;
  } else if (patrn_date_11.test(fmtCode)) {
    arr_d = splitDate(d);
    result = arr_d.yyyy + "-" + arr_d.MM + "-" + arr_d.dd;
  } else if (patrn_date_2.test(fmtCode)) {
    arr_d = splitDate(d, true);
    result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd;
  } else if (patrn_date_22.test(fmtCode)) {
    arr_d = splitDate(d);
    result = arr_d.yyyy + "/" + arr_d.MM + "/" + arr_d.dd;
  } else if (patrn_date_3.test(fmtCode)) {
    arr_d = splitDate(d, true);
    result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日";
  } else if (patrn_date_33.test(fmtCode)) {
    arr_d = splitDate(d);
    result = arr_d.yyyy + "年" + arr_d.MM + "月" + arr_d.dd + "日";
  } else if (patrn_time_1.test(fmtCode)) {
    arr_d = splitDate(d, true);
    result = arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
  } else if (patrn_time_11.test(fmtCode)) {
    arr_d = splitDate(d);
    result = arr_d.hh + ":" + arr_d.mm + ":" + arr_d.ss;
  } else if (patrn_time_2.test(fmtCode)) {
    arr_d = splitDate(d, true);
    result = arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
  } else if (patrn_time_22.test(fmtCode)) {
    arr_d = splitDate(d);
    result = arr_d.hh + "时" + arr_d.mm + "分" + arr_d.ss + "秒";
  } else {
    console.log("没有匹配的时间格式!");
    return;
  }

  return result;
}

function splitDate(d, isZero) {
  var yyyy, MM, dd, hh, mm, ss;

  if (isZero) {
    yyyy = d.getFullYear();
    MM = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1;
    dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate();
    hh = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    mm = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    ss = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
  } else {
    yyyy = d.getFullYear();
    MM = d.getMonth() + 1;
    dd = d.getDate();
    hh = d.getHours();
    mm = d.getMinutes();
    ss = d.getSeconds();
  }

  return { "yyyy": yyyy, "MM": MM, "dd": dd, "hh": hh, "mm": mm, "ss": ss };
}

// 判断房博士用户是否已登录/绑定
function checkLoginState(){
  wx.checkSession({
    success: function () {
      //登录态未过期
      console.log('登录态未过期');

      var sessionKey_value = wx.getStorageSync('user_3rdsession');
      if (!sessionKey_value) {
        common.login();
      } else {
        common.fbsLoginState();
      }
    },
    fail: function () {
      console.log('登录态过期');
      common.login();
    }
  })
}

module.exports = {
  getMyConsultList: getMyConsultList,
  fbsSmsCode: fbsSmsCode,
  fbsLogin: fbsLogin,
  fbsHomeData: fbsHomeData,
  fbsDZ: fbsDZ,
  fbsDoctorList: fbsDoctorList,
  authLogin: authLogin,
  checkLoginState: checkLoginState,
  fbsTimeConver: fbsTimeConver,
  common: common
};