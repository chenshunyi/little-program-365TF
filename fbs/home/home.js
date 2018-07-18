var app = getApp();
var fbs = require('../../util/fbs.js');
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fbsHomeData: null,
    city: '', //城市
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city: app.globalData.city.code
    });

    // 房博士首页检查用户当前登录状态
    fbs.checkLoginState();
    that = this
    wx.showToast({
      title: "加载中...",
      icon: 'none',
      duration: 1500
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    fbs.fbsHomeData(this, this.data.city);

    var sessionKey_value = wx.getStorageSync('user_3rdsession');
    if (!sessionKey_value )
    {
      var that = this;
      fbs.common.userSessionCheck(
        function () {
          fbs.fbsHomeData(that, that.data.city);
        }
      );
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '365房博士',
      desc: '365房博士',
      path: '/fbs/home/home?city=' + this.data.city
    }
  },

  /**
   * 点击我的提问
   */
  actionToOpenMyQuestion: function () {
    that.setData(
      {
        hasOpenMyQuestion:true
      }
    ) 
    wx.navigateTo({
      url: '/fbs/mine/mine'
    })
  },

  /**
   * 点击全部-进入房博士列表
   */
  actionToOpenFBSList: function () {
    wx.navigateTo({
      url: '/fbs/doctorList/doctorList'
    })
  },

  /**
  * 进入房博士详情
  */
  actionToOpenFBSDetail: function (event) {
    var obj = event.currentTarget.dataset['obj'];
    var fbsid = obj.fbsid;
    wx.navigateTo({
      url: '/fbs/doctorList/doctorPage?id=' + fbsid,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
  * 进入提问页面
  */
  actionToOpenQuestion: function (event) {
    var obj = event.currentTarget.dataset['obj'];
    var fbsid = obj.fbsid;
    console.log('提问' + fbsid);
    var url = '/fbs/consult/consult?expertId=' + fbsid;
    fbs.authLogin(url);
  },

  /**
  * 打开问答详情
  */
  actionToOpenWDDetail: function (event) {
    var id = event.currentTarget.dataset['id'];
    var url = '/fbs/detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
    console.log('打开问答详情' + id);
  },

  /**
  * 点赞
  */
  actionToDZ: function (event) {
    if (event.currentTarget.dataset['enable'] == '1') {
      var id = event.currentTarget.dataset['id'];
      var index = event.currentTarget.dataset['index'];
      fbs.fbsDZ(that.data.city, id, function(){
        var data = that.data.fbsHomeData;
        var oData = data.qaList[index];
        var num = parseInt(oData.vote);
        num++;
        oData.support = 1;
        oData.vote = num.toString();

        that.setData({
          fbsHomeData: data
        });
      });
      console.log('点赞ID----' + id);
    }
  }
})