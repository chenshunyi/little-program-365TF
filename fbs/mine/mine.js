var app = getApp();
var fbs = require('../../util/fbs.js');

Page({
  data: {
    loginBarHeight: 70,
    scrollHeight: 0,
    user_name: '',
    //接口查询参数
    reqParam: {
      city: '',
      v: "6.3.5",
      channl: "tfxcx",
      pagesize: 20,
      page: 1
    },
    consultItems: [],
    // 已登录【1:有数据 2:没有更多 3:无数据】 4:未登录
    showtip: 0
  },
  //清空列表列表
  isclearlist: 0,
  onLoad: function (options) {// 生命周期函数--监听页面加载
    /*获取系统信息*/
    var scrollHeight = app.globalData.systemInfo.windowHeight - Math.round((app.globalData.systemInfo.windowWidth / 750) * this.data.loginBarHeight * 2);
    //接口查询参数（城市、页面序号）
    this.setData({
      scrollHeight: scrollHeight
    });
  },
  onReady: function () {// 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {// 生命周期函数--监听页面显示
    // 刷新页面数据
    this.isclearlist = 1;
    var reqParam = this.data.reqParam;
    reqParam.city = app.globalData.city.code;
    reqParam.page = 1;
    var userName;
    var nickName = wx.getStorageSync("fbs_login_name");
    var userPhone = wx.getStorageSync("fbs_login_phone");
    if (nickName != "") {
      userName = nickName;
    } else if (userPhone != "") {
      userName = userPhone;
    }
    this.setData({
      user_name: userName,
      reqParam: reqParam
    });
    var fbsIsLogin = wx.getStorageSync('fbs_login_state');
    if (!fbsIsLogin || fbsIsLogin != "1") {// 需要登录
      this.setData({
        showtip: 4
      });
    } else {// 请求我的提问列表数据
      fbs.getMyConsultList(this);
    }
  },
  onHide: function () {// 生命周期函数--监听页面隐藏
  },
  onUnload: function () {// 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function () {// 页面相关事件处理函数--监听用户下拉动作
    this.isclearlist = 1;
    this.data.reqParam.page = 1;
    fbs.getMyConsultList(this);
  },
  onReachBottom: function () {// 页面上拉触底事件的处理函数
    this.data.reqParam.page++;
    fbs.getMyConsultList(this);
  },
  loadMore: function () {// 上拉加载更多
    this.data.reqParam.page++;
    fbs.getMyConsultList(this);
  },
  toLogin: function (e) {// 跳转登录页
    wx.navigateTo({
      url: '/fbs/login/login'
    })
  },
  navToDetail: function (e) {// 点击我的提问列表项跳转页面（提问页Or问答详情页）
    var data = e.currentTarget.dataset.variable;
    if (data !== '' && typeof (data) != "undefined") {
      var id = data.id;
      var state = data.status;
      if (id != '' && state != '') {
        if (state == 4) {// 提问页
          wx.navigateTo({
            url: '/fbs/consult/consult?id=' + id,
          });
        } else {// 问答详情页
          wx.navigateTo({
            url: '/fbs/detail/detail?id=' + id,
          });
        }
      }
    }
  }
})