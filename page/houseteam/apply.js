var app = getApp();
var common = require('../../util/util.js');
Page({
  data: {
    codeText: '获取验证码',
    codeFlag: '',
    submitFlag: true,
    phone: '',
    e_id: '',
    detailinfo: {}
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    var that = this;
    var detail_data = {
      "e_id": options.e_id
    };
    common.ajax_curl(common.config.Houseteam_Detail, detail_data, function (res) {
      that.setData({
        e_id: options.e_id,
        detailinfo: res.data
      })
    })
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '看房团报名', // 分享标题
      desc: '看房团报名', // 分享描述
      path: '/page/houseteam/apply?e_id='+ this.data.e_id+'&city='+app.globalData.city.code
    }
  },
  formSubmit: function (e) {

    var that = this;
    var error_msg = '';
    var name = e.detail.value.name;    //姓名
    var num = e.detail.value.num;    //报名人数
    var mobile = e.detail.value.mobile;    //手机号
    var e_code = e.detail.value.e_code;    //验证码


    if (name == "") {
      wx.showToast({
        title: '请填写姓名',
        icon: 'success',
        duration: 2000
      })
      return false;
    }
    if (num == "") {
      wx.showToast({
        title: '请填写报名人数',
        icon: 'success',
        duration: 2000
      })
      return false;
    } else if (isNaN(num)) {
      wx.showToast({
        title: '报名人数有误',
        icon: 'success',
        duration: 2000
      })
      return false;
    }
    if (mobile == "") {
      wx.showToast({
        title: '请填写手机号',
        icon: 'success',
        duration: 2000
      })
      return false;
    } else if (!(/^1[34578]\d{9}$/.test(mobile))) {
      wx.showToast({
        title: '手机号有误',
        icon: 'success',
        duration: 2000
      })
      return false;
    }
    if (e_code == "") {
      wx.showToast({
        title: '请填写验证码',
        icon: 'success',
        duration: 2000
      })
      return false;
    }
    // 报名表单提交
    var from_data = {
      "e_id": that.data.e_id,
      "city": app.globalData.city.code,
      "name": name,
      "num": num,
      "mobile": mobile,
      "e_code": e_code,
      "resource": 3,
      "comefrom": 9
    };

    if (that.data.submitFlag == false) {
      return false
    }

    that.setData({
      submitFlag: false
    })
    var ajaxurl = common.config.Houseteam_Apply + '&timestr=' + new Date().getTime();
    common.ajax_curl(ajaxurl, from_data, function (res) {

      if (res.data.result == 1) {
        wx.showToast({
          title: '报名成功',
          icon: 'success',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
      }
      that.setData({
        submitFlag: true
      })
      return false;
    })
  },
  btnCode: function (e) {
    var that = this;
    var s = 60;
    var phone = that.data.phone;

    if (!(/^1[34578]\d{9}$/.test(phone))) {
      wx.showToast({
        title: '请填写正确的手机号',
        icon: 'success',
        duration: 2000
      })
      return false;
    }

    var time = setInterval(
      function () {
        if (s <= 0) {
          that.setData({
            codeText: '重新获取',
            codeFlag: false
          })
          clearInterval(time);
          return
        } else {
          that.setData({
            codeText: '重新获取' + s + 's',
            codeFlag: true
          })
          s--;
        }
      }, 1000);
    // 发送验证码到后台
    var code_data = {
      "phone": that.data.phone,
      "resource": 3
    };
    common.ajax_curl(common.config.Houseteam_Code, code_data, function (res) {
      if (res.data.msg == "今天短信发送超过上限了哦！") {
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        })
        clearInterval(time);
        return
      }
    })
  },
  phoneBlur: function (e) {
    this.data.phone = e.detail.value
  }
})