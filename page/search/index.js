var app = getApp();
var search = require('../../util/search.js');
var searchInputE;
Page({
  data: {
    city:'',
    pagetype: '',
    inputValueinputValue: '',
    listitems: []//搜索数据循环
  },
  onLoad: function (options) {
    options.type = typeof (options.type) != "undefined" ? options.type : 'newhouse';
    var pagetitle = options.type=='secondhouse' ? '搜索二手房' : '搜索新房';
    wx.setNavigationBarTitle({ title: pagetitle })
    this.setData({
      pagetype: options.type,
      city: app.globalData.city.code,
    })
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  },
  onShareAppMessage: function () {
    return app.getSharedata();
  },
  keywrodSearch: function (e) {
    var keyword = e.detail.value;
    search.getSearchList(this, keyword);//请求搜索
  },
  formSubmit: function (e) {
    var keyword = e.detail.value.searchinput;
    search.goResultPage(this.data.pagetype,keyword);
  },
  clearSearch: function () {
    wx.navigateBack({ delta: 1 });
  }

});