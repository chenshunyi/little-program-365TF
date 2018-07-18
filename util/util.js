var total_js;

const config = require('config.js'); //配置文件
/****
 * ajax_curl,同后台进行数据交互函数
 * url请求地址；data：数据；cb：回调函数；
 * posttype：get 或者post
 * nojson：0代表json格式数据，1代表key=>value格式数据
 * json数据后台需要使用file_get_contents("php://input")接收
 * key=>value格式数据，后台使用$_POST接收
 ****/
function ajax_curl(url, data, cb, posttype = 'get', nojson = 0) {
  var method_type = posttype.toUpperCase();
  if (nojson) {
    var headerset = "application/x-www-form-urlencoded";
    var value = json2Form(data);
  } else {
    var headerset = "application/json";
    var value = data;
  }
  wx.request({
    url: url,
    data: value,
    method: method_type,
    header: {
      'Content-Type': headerset
    },
    success: function (res) {
      typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      //console.log(res)
      wx.showToast({
        title: '网络异常，请稍后重试',
        icon: 'loading',
        duration: 2000
      })
    },
    complete: function (res) {
      //console.log(res)

    }
  })
}
/****
 * fbs_ajax_curl,房博士专用同后台进行数据交互函数
 * url请求地址；data：数据；cb：回调函数；
 * posttype：get 或者post
 * json数据后台需要使用file_get_contents("php://input")接收
 * key=>value格式数据，后台使用$_POST接收
 ****/
function fbs_ajax_curl(url, data = {}, cb, posttype = 'get') {
  var method_type = posttype.toUpperCase();
  if (method_type == "POST") {
    var headerset = "application/x-www-form-urlencoded";
  } else {
    var headerset = "application/json";
  }
  try {
    if (typeof (data.user_3rdsession) == "undefined") {
      data.user_3rdsession = wx.getStorageSync('user_3rdsession');
    }
  } catch (e) { }

  wx.request({
    url: url,
    data: data,
    method: method_type,
    header: {
      'Content-Type': headerset
    },
    success: function (res) {
      if (res.data.code == 1) {
        typeof cb == "function" && cb(res.data.data);
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'loading',
          duration: 2000
        })
      }
    },
    fail: function (res) {
      wx.showToast({
        title: '网络异常，请稍后重试',
        icon: 'loading',
        duration: 2000
      })
    }
  })
}


function userSessionCheck (cb)
{
  var that = this;

  wx.checkSession({
    success: function () {
      //登录态未过期
      console.log('登录态未过期');

      var sessionKey_value = wx.getStorageSync('user_3rdsession');
      if (!sessionKey_value) {
        that.loginWithCallback(cb);
      }
      else
      {
        typeof cb == "function" && cb();
      }
    },
    fail: function () {
      console.log('登录态过期');

      that.loginWithCallback(cb);
    }
  })
}

function loginWithCallback(cb){
  
  wx.login({
    success: function (res) {
      if (res.code) {
        var param = {
          code: res.code
        };
        ajax_curl(config.APP_api, param, function (result) {
          if (result.data.code == 1) {
            wx.setStorageSync('user_3rdsession', result.data.key);
            typeof cb == "function" && cb();
          }
        });
      } else {
        console.log('login获取用户登录态失败！', res)
      }
    },
    fail: function (res) {
      console.log('login执行失败！', res)
    }
  });
}

function login() {
  wx.login({
    success: function (res) {
      if (res.code) {
        var param = {
          code: res.code
        };
        ajax_curl(config.APP_api, param, function (result) {
          if (result.data.code == 1) {
            wx.setStorageSync('user_3rdsession', result.data.key);
          }
        });
      } else {
        console.log('login获取用户登录态失败！', res)
      }
    },
    fail: function (res) {
      console.log('login执行失败！', res)
    }
  });
}

function json2Form(json, lev) {
  var str = [];
  for (var p in json) {
    var c_key = lev ? lev + '[' + p + ']' : p;
    if (typeof json[p] == 'object') {
      var c_str = json2Form(json[p], String(c_key));
      str.push(c_str);
    } else {
      str.push(encodeURIComponent(c_key) + "=" + encodeURIComponent(json[p]));
    }
  }
  return str.join("&");
}

function totail(pageid, pagename) {
  var arr = {};
  arr['id'] = pageid;
  arr['pagename'] = pagename;
  arr['begintime'] = new Date().getTime();
  return function (city, contextId) {
    wx.getNetworkType({
      success: function (res) {
        arr['networkType'] = res.networkType;
      }
    });
    var res = wx.getSystemInfoSync();
    arr['system'] = res;
    arr['endtime'] = new Date().getTime();
    arr['city'] = city ? city : '';
    arr['contextId'] = contextId ? contextId : '';
    arr['user_3rdsession'] = wx.getStorageSync('user_3rdsession');
    ajax_curl(config.APP_maidian, arr, function (result) { }, 'POST');
  }
}

function get_city(that) {
  var req = function (that) {
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        ajax_curl(config.APP_getLocation, {
          nowLatitude: res.latitude,
          nowLongitude: res.longitude
        }, function (res2) {
          if (res2.data.city) {
            that.setData({
              city: {
                city: res2.data.city,
                citypinyin: res2.data.citypinyin
              }
            })
          }
          else {
            that.setData({
              city: {
                city: "对不起您所在的城市暂未开通"
              }
            })
          }
        })
      }
    })
  }
  if (!wx.getSetting) return
  wx.getSetting({
    success: function (res) {
      console.log('getSetting...', res)
      if (res.authSetting["scope.userLocation"] == true) {
        req(that);
      } else {
        wx.showModal({
          title: '位置信息授权',
          content: '位置授权暂未开启，无法完成定位',
          confirmText: '开启授权',
          cancelText: '仍然拒绝',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting["scope.userLocation"] == true) {
                    req(that);
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '无法使用定位权限',
                      confirmText: '太遗憾了',
                      showCancel: false
                    })

                  }
                },
                fail: function () {
                  console.log('openSetting.failed')
                }
              })
            }
            if (res.cancel) {
              wx.showToast({
                title: '定位失败',
                icon: 'none',
                duration: 1000
              })
            }
          }
        })
      }
    }
  })
}

function set_shareUrl(s, app) {
  console.log(app.globalData.city.code)
  return s + '?city =' + app.globalData.city.code
}

function updateThis() {
  if (wx.getUpdateManager) {
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，请重启应用.',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })

    })
  }
}

function get_allcity(that) {
  var citykey = 'All_citylist_more';
  var value = wx.getStorageSync(citykey);
  if (value !== '' && typeof (value) != "undefined") {
    if (!that) return
    that.setData({
      all_city: value
    })
  } else {
    ajax_curl(config.Index_Allcity, '', function (res) {
      wx.setStorageSync(citykey, res.data);
      if (!that) return
      value = res.data;
      that.setData({
        all_city: value
      })
    })
  }
}

function get_cityname(code) {
  var citykey = 'All_citylist_more';
  var allcity = wx.getStorageSync(citykey);
  if (allcity !== '' && typeof (allcity) != "undefined") {
    var cname = allcity.keyvalue[code];
    if (cname && typeof (cname) != "undefined" && cname != 0) {
      return cname;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

// 判断房博士用户是否已登录/绑定
function fbsLoginState() {
  var fbsIsLogin = wx.getStorageSync('fbs_login_state');
  if (!fbsIsLogin || fbsIsLogin != "1") {
    var param = {};
    fbs_ajax_curl(
      config.Fbs_UserLogin_State,
      param,
      function (res) {
        if (res.result == 1) {// 登录成功
          // 持久化用户登录信息
          wx.setStorageSync("fbs_login_state", res.result);
          wx.setStorageSync("fbs_login_phone", res.data.passport_phone);
          wx.setStorageSync("fbs_login_name", res.data.passport_username);
        }
      }
    );
  }
}

module.exports = {
  get_allcity: get_allcity,
  get_cityname: get_cityname,
  ajax_curl: ajax_curl,
  fbs_ajax_curl: fbs_ajax_curl,
  json2Form: json2Form,
  totail: totail,
  total_js: total_js,
  login: login,
  fbsLoginState: fbsLoginState,
  get_city: get_city,
  set_shareUrl: set_shareUrl,
  config: config,
  updateThis: updateThis,
  userSessionCheck: userSessionCheck
}