var app = getApp();
var pagejs = require('../../util/checkprices.js');
var common = pagejs.common;
Page({
  data:{
    blockname:'',
    area: '',
    hbclass: 'contrast-up',
    listitems: {}
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载 
    this.setData({
      blockname: app.globalData.checkprices_arr.blockname,
      area: app.globalData.checkprices_arr.area,
    });
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    var data = {        
      city: app.globalData.city.code,
      blockId: app.globalData.checkprices_arr.id,
      blockName: app.globalData.checkprices_arr.blockname,
      buildArea: app.globalData.checkprices_arr.area,
    };
    common.ajax_curl(common.config.Chheckprices_Result,data,function(res){
          //小区二手房
          res.data.xglist.sellList = res.data.xglist.sellList.slice(0,5);
          /*
          var feature = new Array();
          for(var i=0;i<res.data.xglist.sellList.length;i++){
            res.data.xglist.sellList[i].feature = pagejs.explode(',',res.data.xglist.sellList[i].feature);
          }
          */
          //环比
          if(res.data.xglist.currentHB < 0){
            res.data.xglist.currentHB = "↓"+Math.abs(res.data.xglist.currentHB)+'%';
            that.setData({hbclass: 'contrast'});

          }else if(res.data.xglist.currentHB >0){
            res.data.xglist.currentHB = "↑"+res.data.xglist.currentHB+"%";
            that.setData({hbclass: 'contrast-up'});
          }else{
            res.data.xglist.currentHB = res.data.xglist.currentHB+"%";
            that.setData({hbclass: 'contrast-o'});
          }
          //小区房价走势
          var point = pagejs.getPoint(res.data.xglist.priceList);
          var opts = {
            width: 320,  
            height: 200,  
            categories: point.x, 
            series: point.y
          }
          pagejs.lineChart.drawTable(opts);   

          that.setData({
            listitems: res.data
          })

          wx.hideToast();
    });  
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
  }
})