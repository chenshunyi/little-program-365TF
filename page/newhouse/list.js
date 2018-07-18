var app = getApp();
var common = require('../../util/util.js');
var newhouse = require('../../util/newhouse.js');
Page({
  data: {
    scrollHeight: 0,
    selectNav: [{ "key": '区域', "val": 'dist' }, { "key": '价格', "val": 'price' }, { "key": '户型', "val": 'roomtag_id' }],
    isDown: true,
    downlist: [["1", "2", "3"], ["4", "5", "6"], ["7"]],
    selectNav__down: [true, true, true],
    currentNavbar: -1,
    //搜索条件
    searchconfig: {
      city: '',
      v: "6.3.5",
      pagesize: 10,
      price: 0,
      dist:0,
      roomtag_id:0,
      page: 1
    },
    houseitems: [],
    showtip: 0,
    overflowHide: true
  },

  //清空列表列表
  isclearlist: 0,
  onLoad: function (options) {
    var that = this
    // 生命周期函数--监听页面加载
    /*获取系统信息*/
    var scrollHeight = app.globalData.systemInfo.windowHeight - Math.round((app.globalData.systemInfo.windowWidth / 750) * 166);
    that.setData({
      scrollHeight: scrollHeight
    });
    //关键字搜索
    options.keyword = typeof (options.keyword) != "undefined" ? options.keyword : null;
    var searchConfig = this.data.searchconfig;
    searchConfig.city = app.globalData.city.code;
    if (options.keyword !== null) {
     // console.log(options.keyword);
      searchConfig.page = 1;
      searchConfig.dist = 0;
      searchConfig.price = 0;
      searchConfig.roomtag_id = 0;
      searchConfig.k = options.keyword;
    } 
    this.setData({
        searchconfig: searchConfig
        //  isclearlist:1
    });
    newhouse.getPagelist(this);
    newhouse.getConfig(this,app.globalData.city.code);//配置文件
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
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
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '365淘房新房，找新房，看楼盘，开盘动态实时掌握',
      desc: '365淘房为您免费提供房屋的买卖、租赁、装修及社区生活为一体的一条龙服务。',
      path: '/page/newhouse/list?city'+app.globalData.city.code
    }
  },
  swichNav: function (e) {
   // console.log(e);
    var selectNav_down_show = [true,true,true];
    //var config = this.data.downlist[e.currentTarget.dataset.idx];
    //selectNav:['区域','价格','户型'],
    if (this.data.currentNavbar != e.currentTarget.dataset.idx) {
      selectNav_down_show[e.currentTarget.dataset.idx] = false;
      this.setData({
        currentNavbar: e.currentTarget.dataset.idx,
        selectNav__down: selectNav_down_show,
        isDown: false,
        overflowHide: false
      })
    }
    else {
      this.setData({
        isDown: true,
        currentNavbar: -1,
        selectNav__down: selectNav_down_show,
        overflowHide: true
      })
    }

  },
  swichNav2: function (e) {
    //清空列表列表
    this.isclearlist = 1;
    var tag_id = e.currentTarget.dataset.tag_id;
    var tag_type = e.currentTarget.dataset.tag_type;

    if(this.data.searchconfig[tag_type] == tag_id){
    //条件未变
      this.setData({
        selectNav__down:[true,true,true],
        isDown: true,
        overflowHide: true
      });

    } else {

      this.data.searchconfig[tag_type] = tag_id;
      this.data.searchconfig.page = 1;
      this.setData({
        selectNav__down:[true,true,true],
        showtip: 0,
        isDown: true,
        searchconfig: this.data.searchconfig,
        overflowHide: true
      });
      newhouse.getPagelist(this,app.globalData.city.code);
    }

  },

  getMore: function () {
    this.data.searchconfig.page++;
    newhouse.getPagelist(this);
  },
  closeWin: function () {
    var selectNav__down = [true,true,true];
    this.setData({
      isDown: true,
      currentNavbar: -1,
      selectNav__down: selectNav__down,
      overflowHide: true
    });
  }

})