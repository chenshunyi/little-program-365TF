// fbs/notice/notice.js
var that;
var mod = require('../../util/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isConsult:0,
    notice:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      isConsult : options.isConsult=="1"?1:0
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var param = {};
    if(that.data.isConsult){
      wx.setNavigationBarTitle({
        title: '咨询服务使用须知',
      })
      //提问页 须知
      mod.fbs_ajax_curl(
        mod.config.Fbs_Consult_Notice,
        param,
        function (data) {
          if (data.result) {
            that.setData({
              notice: data.data.readme,
            });
          } else {
            wx.showToast({
              title: data.mess,
              icon: 'none',
              duration: 1500
            })
          }
        })
    }else{
      //登录页 须知
      wx.setNavigationBarTitle({
        title: '用户服务协议',
      })
      mod.fbs_ajax_curl(
        mod.config.Fbs_User_Notice,
        param,
        function (data) {
          if (data.result) {
            that.setData({
              notice: data.data.privacy,
            });
          } else {
            wx.showToast({
              title: data.mess,
              icon: 'none',
              duration: 1500
            })
          }
        })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})