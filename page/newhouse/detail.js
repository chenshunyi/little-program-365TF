var app = getApp();
var common = require('../../util/util.js');
const wxCharts = require('../../util/chart.js');

Page({
  data: {
    scrollHeight: 0,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    markers: [],
    imgsurl: [],
    hximgsurl: [],
    detail: {}
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.requestAdetail(options.id, options.p);

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 5000
    });
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
      title: this.data.detail.h_name,
      desc: this.data.detail.h_channel + '、' + this.data.detail.h_price + '、' + this.data.detail.h_project_address,
      path: '/page/newhouse/detail?id=' + this.data.detail.h_id + '&p=' + this.data.detail.h_prj_channel + "&city=" +app.globalData.city.code 
    }
  },
  dial: function (e) {   // 拨打电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel.replace("转", ",")
    })


  },
  lbLargeImg: function (e) {    // 轮播图预览大图
    wx.previewImage({
      current: e.currentTarget.dataset.picurl, // 当前显示图片的http链接
      urls: this.data.imgsurl // 需要预览的图片http链接列表
    })
  },
  hxLargeImg: function (e) {    // 户型图预览大图
    wx.previewImage({
      current: e.currentTarget.dataset.picurl, // 当前显示图片的http链接
      urls: this.data.hximgsurl  // 需要预览的图片http链接列表
    })
  },
  requestAdetail: function (id, p) {
    var that = this;

    common.ajax_curl(
      common.config.Newhouse_Detail,
      {
        city: app.globalData.city.code,
        id: id,
        p: p,
        v: '6.3.5',
        page: 1,
        pagesize: 1
      },
      function (res) {
       // console.log(res.data);


        //地图坐标
        var markers = [{
          iconPath: "/image/address.png",
          id: 10,
          latitude: parseFloat(res.data.h_lat_t),
          longitude: parseFloat(res.data.h_long_t),
          width: 30,
          height: 30

        }];


        //图片列表
        for (var i in res.data.project_picture) {
          that.data.imgsurl.push(res.data.project_picture[i].pic_address);
        }
        //价格列表列表
        var unit = "";
        var project_price = [];
        var project_price_data = [];
        var num = 0;
        for (var i in res.data.project_price.list) {
          if (i == 0) unit = res.data.project_price.list[i].price_more;//单位
          if (res.data.project_price.list[i].price_more == unit && num < 6) {
            var patt1 = /^[0-9]+$/i;
            if (patt1.test(res.data.project_price.list[i].price)) {
              project_price.unshift(res.data.project_price.list[i].price);//价格

              var d = new Date(1000 * parseInt(res.data.project_price.list[i].dateline));
              var year = d.getFullYear();
              year = year % 100;
              var month = d.getMonth() + 1;
              project_price_data.unshift(year + "-" + month);//日期
              num++;
            }
          }
        }
        //少于2条就不展示了
        if (num < 2) {
          unit = "";
        }

        //快讯时间
        for (var i in res.data.h_news) {
          var d = new Date(1000 * parseInt(res.data.h_news[i].addtime));
          var year = d.getFullYear();
          var month = d.getMonth() + 1;
          var day = d.getDate();
          res.data.h_news[i].addtime = '' + year + '年' + month + "月" + day + '日';

        }
        let windowWidth = 320;
        try {
          let res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth;
        } catch (e) {
          // do something when get system info failed
        }
        //折线
        if (unit != "") {
    
          new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            animation: true,
            categories: project_price_data,
            series: [{
              name: '价格走势',     
              color:"#ff7500",
              data: project_price
            }],
            yAxis: {
              title: unit
            },
            xAxis: {
              disableGrid: false,
              type: 'calibration'
            },
            extra: {
              column: {
                width: 15
              }
            },
            width: windowWidth,
            height: 200,
          });
        }
        //链接打开方式
        for (var i in res.data.h_recomm_houselist) {
          res.data.h_recomm_houselist[i].opentype = "redirect";
        }
        wx.hideToast();
        //重新加载 
        wx.setNavigationBarTitle({
          title: res.data.h_name
        })
        that.setData({
          detail: res.data,
          markers: markers,
          houseitems: res.data.h_recomm_houselist,
          unit: unit
        });

      });
    //户型图
    common.ajax_curl(
      common.config.Newhouse_Huxing,
      {
        city: app.globalData.city.code,
        id: id,
        p: p,
        v: '6.3.6',
        ctg: "hx"
      },
      function (res) {
        var hximgsurl = [];
        for (var i in res.data[0].a_photos) {
          hximgsurl.push(res.data[0].a_photos[i].p_url);
        }
        that.data.hximgsurl = hximgsurl;
        that.setData({
          a_photos: res.data[0].a_photos
        });
      });



  },

  show_big_map: function () {
    var that = this;
    wx.openLocation({
      latitude: parseFloat(that.data.detail.h_lat_t), // 纬度，浮点数，范围为90 ~ -90
      longitude: parseFloat(that.data.detail.h_long_t), // 经度，浮点数，范围为180 ~ -180。
      name: that.data.detail.h_name, // 位置名
      address: that.data.detail.h_project_address, // 地址详情说明
      scale: 16, // 地图缩放级别,整形值,范围从1~28。默认为最大
    });
  }
})

