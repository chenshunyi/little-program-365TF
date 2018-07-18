var app = getApp();
var pagejs = require('../../util/checkprices.js');
var common = pagejs.common;
Page({
  data:{
    blockname:'请选择小区'
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载  
    app.globalData.checkprices_arr = {};  
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成 
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    this.setData({
      blockname: app.globalData.checkprices_arr.blockname
    })      
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
        title: '365淘房-查房价',
        desc: '快速查询您的房屋价格和小区价格走势',
        path: '/page/checkprices/index?city ='+app.globalData.city.code
    }
  },
  formSubmit: function(e){
    if('undefined'==typeof(app.globalData.checkprices_arr.id) || 'undefined'==typeof(app.globalData.checkprices_arr.blockname)){
      wx.showToast({
        title: '请输入小区',
        icon: 'success',
        duration: 2000
      }) 
      return false;      
    }
    if('' == e.detail.value.area){
      wx.showToast({
        title: '请输入面积',
        icon: 'success',
        duration: 2000
      })
      return false;    
    }
    if(e.detail.value.area > 2000){
      wx.showToast({
        title: '请输入正确的面积',
        icon: 'success',
        duration: 2000
      })
      return false;    
    }
    if(e.detail.value.area < 1){
      wx.showToast({
        title: '请输入正确的面积',
        icon: 'success',
        duration: 2000
      })
      return false;    
    }
    if(pagejs.pointLength(e.detail.value.area) > 2){
      wx.showToast({
        title: '请输入正确的面积',
        icon: 'success',
        duration: 2000
      })
      return false;    
    }
    app.globalData.checkprices_arr.area = e.detail.value.area;
    wx.navigateTo({
      url: 'result'
    })  
  }
})