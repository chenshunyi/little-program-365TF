var app = getApp();
var fbs = require('../../util/fbs.js');

Page({
  data: {
    currentTime: 60,
    loginBtnLoading: false,
    smsBtnLoading: false,
    disableSmsCode: false,
    smsCodeText: '发送验证码',
    smsCodeHidden: true,
    pendingUrl: '',
    requestParam: {
      cityid: '',
      phone: '',
      yzm: '',
      auth_resource: ''
    },
  },
  onLoad: function (options) {// 生命周期函数--监听页面加载
    var pUrl = options.pendingUrl;
    if (pUrl != "") {
      pUrl = decodeURIComponent(pUrl);
      this.setData({
        pendingUrl: pUrl
      })
    }
    // 设置城市参数
    var reqParam = this.data.reqParam;
    reqParam.cityid = app.globalData.city.code;
    this.setData({
      requestParam: reqParam
    });
  },
  onReady: function () {// 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {// 生命周期函数--监听页面显示
  },
  onHide: function () {// 生命周期函数--监听页面隐藏
  },
  onUnload: function () {// 生命周期函数--监听页面卸载
  },
  onPhoneBlur: function (e) {// 设置输入手机号
    if (e.detail.value.length == 11) {
      var reqParam = this.data.requestParam;
      reqParam.phone = e.detail.value;
      this.setData({
        smsCodeHidden: false,
        requestParam: reqParam
      });
    } else {
      this.setData({
        smsCodeHidden: true
      });
    }
  },
  sendSmsCode: function () {  //发送短信验证码
    if (this.data.requestParam.phone.length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.requestParam.phone.length != 11) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1500
      })
    } else {
      this.setData({
        smsBtnLoading: true
      });
      fbs.fbsSmsCode(this);
    }

    var that = this;
    var curTime = this.data.currentTime;
    this.setData({
      smsCodeText: curTime + '秒',
      disableSmsCode: true
    })
    var interval = setInterval(function () {
      that.setData({
        smsCodeText: (curTime - 1) + '秒'
      })
      curTime--;
      if (curTime <= 0) {
        clearInterval(interval)
        that.setData({
          smsCodeText: '重新获取',
          currentTime: 60,
          disableSmsCode: false
        })
      }
    }, 1000)
  },
  formSubmit: function (e) {  //表单提交
    if (this.data.requestParam.phone.length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.requestParam.phone.length != 11) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none',
        duration: 1500
      })
    } else if (e.detail.value.password.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1500
      })
    } else {
      var reqParam = this.data.requestParam;
      reqParam.yzm = e.detail.value.password;
      this.setData({
        loginBtnLoading: true,
        requestParam: reqParam
      });
      fbs.fbsLogin(this);
    }
  },
  navBack: function (e) {// 返回上一页
    wx.navigateBack();
  },
  notice: function () {
    wx.navigateTo({
      url: '/fbs/notice/notice',
    })
  }
})