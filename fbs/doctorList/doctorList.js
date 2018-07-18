var app = getApp();
var fbs = require('../../util/fbs.js');
var that;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentNo: 1,  //当前页面
    dataArray: [], //数据数组
    totalPage: 0, //总页码
    isFirstGetData: 1, //是否是首次获取数据
    city: '',//城市 
    scrollHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      city: app.globalData.city.code
    });

    that = this;
    var scrollHeight = app.globalData.systemInfo.windowHeight;
    that.setData({
      scrollHeight: scrollHeight
    });
    fbs.fbsDoctorList(that, that.data.city);
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
    that.setData({
      currentNo: 1,  //当前页面
      dataArray: [], //数据数组
      totalPage: 0, //总页码
      isFirstGetData: 1, //是否是首次获取数据
    });
    fbs.fbsDoctorList(that, that.data.city);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    that.data.currentNo += 1;
    fbs.fbsDoctorList(that, that.data.city);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '专家列表',
      desc: '专家列表',
      path: '/fbs/doctorList/doctorList?city=' + this.data.city
    }
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
})