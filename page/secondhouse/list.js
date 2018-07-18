var app = getApp();
var secondhouse = require('../../util/secondhouse.js');
Page({
  data: {
    scrollHeight: 0,
    selectNav: ['区域', '总价', '户型'],
    currentNavbar: -1,
    currentItem: [0, 0, 0],
    isDown: true,
    downlist: [["1", "2", "3"], ["4", "5", "6"], ["7"]],
    selectNav__down: [true, true, true],
    page: 1,
    pagesize: 10,
    listdata: [],
    is_config: 'false',
    is_post: 'false',
    no_more: 'false',
    keyword: "",
    no_list:false,
    overflowHide: true
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    /*获取系统信息*/
    var that = this;
    var scrollHeight = app.globalData.systemInfo.windowHeight - Math.round((app.globalData.systemInfo.windowWidth / 750) * 166);
    that.setData({
      keyword: options.keyword,
      scrollHeight: scrollHeight
    })
    //初始配置
    secondhouse.getConfig(this, app.globalData.city.code);
    //第一页数据
    secondhouse.getListData(this, app.globalData.city);
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
      title: '365淘房-二手房，买卖二手房，快捷便利高效',
      desc: '365淘房为您免费提供房屋的买卖、租赁、装修及社区生活为一体的一条龙服务。',
      path: '/page/secondhouse/list?city='+app.globalData.city.code + '&cname=' + app.globalData.city.came
    }
  },
  swichNav: function (e) {
    if (this.data.currentNavbar != e.currentTarget.dataset.idx) {
      var selectNav__down = [true, true, true];
      selectNav__down[e.currentTarget.dataset.idx] = false;
      this.setData({
        currentNavbar: e.currentTarget.dataset.idx,
        selectNav__down: selectNav__down,
        isDown: false,
        overflowHide: false
      })
    }
    else {
      var selectNav__down = [true, true, true];
      this.setData({
        isDown: true,
        selectNav__down: selectNav__down,
        currentNavbar: -1,
        overflowHide: true
      })
    }
  },
  swichNav2: function (e) {
    var selectNav__down = [true, true, true];
    if(e.currentTarget.dataset.idx!=this.data.currentItem[this.data.currentNavbar]){
       var arr = this.data.currentItem;
       arr[this.data.currentNavbar] = e.currentTarget.dataset.idx;
      // console.log('选择不一样进来');
       this.setData({
          currentItem: arr,
          page: 1,
          no_more: 'false',
          listdata: [],
          no_list:false
       })
       secondhouse.getListData(this, app.globalData.city);
    }

    this.setData({
      selectNav__down: selectNav__down,
      isDown: true,
      currentNavbar: -1,
      overflowHide: true
    })
    
  },
  closeWin: function () {
    var selectNav__down = [true, true, true];
    this.setData({
      isDown: true,
      selectNav__down: selectNav__down,
      currentNavbar: -1,
      overflowHide: true
    })
  },
  getMore: function (e) {
    secondhouse.getListData(this, app.globalData.city);
  }
})