var app = getApp();
var pagejs = require('../../util/checkprices.js');
var common = pagejs.common;
Page({
  data:{
      keywords: '',
      clearInput : false , //输入框内容取消按钮隐藏
      className : 'searchprice_list',  //输入框背景白的长度
      is_history: false,
      //搜索数据循环
      listitems : []
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    var that = this;
    wx.getStorage({
      key: 'checkprices_arr_'+app.globalData.city.code,
      success: function(res) { 
          that.setData({
            is_history: true,
            listitems: res.data
          })
      } 
    })   
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
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
        path: '/page/checkprices/index?city='+app.globalData.city.code
    }
    
  },
  textinput: function(e){
    var that = this;
    var data = {        
        keyword: e.detail.value,
        pagesize: '20',
        name: 'HouseBlock',
        city: app.globalData.city.code,
        v: '1.0',
        api_key: 'touch',
        deviceid: '',
        api_preview: '1'
    }
    common.ajax_curl(common.config.Chheckprices_Search,data,function(res){
        that.setData({
          is_history: false,
          listitems: res.data
        })
    })   
    this.setData({
      clearInput : true ,//输入框内容取消按钮显示
      className : 'searchprice_list resetWidth'  //输入框背景白的长度
    })
  },
  selectblock: function(res){
    app.globalData.checkprices_arr = {
      id: res.currentTarget.dataset.id,
      blockname: res.currentTarget.dataset.blockname
    }
    pagejs.addHistory('checkprices_arr_'+app.globalData.city.code,app.globalData.checkprices_arr);
    wx.navigateBack({
      delta: 1
    })
  },
  clearup: function(){   
    var that = this;
    wx.removeStorage({
      key: 'checkprices_arr_'+app.globalData.city.code,
      success: function(res) {  
        that.setData({
          is_history: false,
          listitems: []
        })
      } 
    }) 
  },
  clearinput: function(){
    this.setData({
      keywords: '',
      clearInput: false, 
      className: 'searchprice_list'
    });
    var that = this;
    wx.getStorage({
      key: 'checkprices_arr_'+app.globalData.city.code,
      success: function(res) {        
          that.setData({
            is_history: true,
            listitems: res.data
          })
      },
      fail: function(){
          that.setData({
            listitems: []
          })        
      }
    }) 
  }
})