var app = getApp();
var secondhouse = require('../../util/secondhouse.js');
Page({
  data: {
    scrollHeight: 0,
    id: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    detaildata: [],
    markers: [],
    longitude: 113.324520,
    latitude: 23.099994,
    isxiaoxue: 'false',
    iszhongxue: 'false',
    xiaoxue: '',
    zhongxue: '',
    list_arr: [],
    islong: false,
    issecond: false,
    up: true,
    islong2: false,
    issecond2: false,
    up2: true,
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      id: options.id
    })
    secondhouse.getInfoData(this, app.globalData.city);
    /*获取系统信息*/
    var that = this;
    var scrollHeight = app.globalData.systemInfo.windowHeight - Math.round((app.globalData.systemInfo.windowWidth / 750) * 110);
    that.setData({
      keyword: options.keyword,
      scrollHeight: scrollHeight
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 5000
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
      title: '365淘房二手房',
      desc: this.data.detaildata.title,
      path: '/page/secondhouse/detail?id=' + this.data.detaildata.id +"&city=" + app.globalData.city.code
    }
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  makePhoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.detaildata.brokerinfo.telno
    })
  },
  lbLargeImg: function (e) {    // 轮播图预览大图
    wx.previewImage({
      current: e.currentTarget.dataset.picurl, // 当前显示图片的http链接
      urls: this.data.detaildata.pics, // 需要预览的图片http链接列表
    })
  },
  showAll: function () {
    if (!this.data.issecond) {
      this.setData({
        islong: false,
        issecond: true
      })
    }
    else {
      this.setData({
        islong: true,
        issecond: false
      })
    }
  },
  showAll2: function () {
    if (!this.data.issecond2) {
      this.setData({
        islong2: false,
        issecond2: true
      })
    }
    else {
      this.setData({
        islong2: true,
        issecond2: false
      })
    }
  },
  show_big_map:function(){
    var that=this;
    wx.openLocation({
    latitude: that.data.latitude, // 纬度，浮点数，范围为90 ~ -90
    longitude: that.data.longitude, // 经度，浮点数，范围为180 ~ -180。
    name: that.data.detaildata.title, // 位置名
    address:that.data.detaildata.blockinfo.address, // 地址详情说明
    scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
});

  }
})