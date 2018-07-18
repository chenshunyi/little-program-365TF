var app = getApp();
var fbs = require('../../util/fbs.js');
var fun_base64 = require('../../util/base64.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',//id
    fbsInfo:{},//房博士信息
    fbsqaList:[],//列表数据
    currPage:1,
    pageSize:20,

    showtip: 0,
    appParameter: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    var str = 'fbs_fbsid=' + options.id + '&city=' + app.globalData.city.code;
    var obj_base64 = new fun_base64.Base64();
    var baseStr = obj_base64.encode(str);

    var result = 'https://m.house365.com?TFRouteType=1031&TFRouteParm=' + encodeURI(baseStr);

    this.setData(
      {
        id:options.id,
        appParameter:result,
      }
    );

    wx.showToast({
      title: "加载中...",
      icon: 'none',
      duration: 1500
    });

    var that = this;
    fbs.common.userSessionCheck(
      function(){
        // 接口请求
        that.queryHouseDoctorInfo(that.data.id, app.globalData.city.code);
        that.queryQusetionList(that.data.id, app.globalData.city.code, that.data.currPage, that.data.pageSize);
      }
    );
  },

  //查询房博士信息
  queryHouseDoctorInfo:function(fbsId,city){
    
    var url = fbs.common.config.Fbs_PersonDetail;
    var data = {
      city: city,
      fbsid: fbsId
    };
    var that = this;

    fbs.common.fbs_ajax_curl(
      url,
      data,
      function (response) {
        if(response.result == 1)
        {
          that.setData({
            fbsInfo: response.data,
          })
        }
        else
        {
          var msg = response.mess;
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 1500
          });

          if (app.globalData.appFlag == true) {
            wx.redirectTo({
              url: '/fbs/home/home',
            })
          }
          else {
            wx.navigateBack({

            })
          }
        }
      }
    );
  },  

  //查询房博士问答，分页接口
  queryQusetionList:function(fbsId,city,page,pageSize)
  {
    var url = fbs.common.config.Fbs_fbsQaList;
    var data = {
      city: city,
      fbsid: fbsId,
      page:page,
      pagesize: pageSize,
    };

    var that = this;

    fbs.common.fbs_ajax_curl(
      url,
      data,
      function (response) {
        if (response.result == 1) {
          
          var tmpList = [];
          if (response.data.qalist)
          {
            tmpList = response.data.qalist;
            for (var i in tmpList) {
              var qaItem = tmpList[i];
              var rStamp = fbs.fbsTimeConver(qaItem.replydate);
              qaItem.replyDateStr = rStamp;
            }
          }

          var listType = 1;
          if (tmpList.length == 0 && that.data.currPage == 1)
          {//无数据
            listType = 3;
          }
          else
          {
            if (tmpList.length < that.data.pageSize)
            {//没有更多
              listType = 2;
            }
          }
          
          var nextPage = that.data.currPage + 1;

          var dataKey = "fbsqaList[" + that.data.currPage +"]";
          that.setData({
            [dataKey]: tmpList,
            currPage:nextPage,
            showtip:listType,
          })
        }
        else {
          if (that.data.currPage == 1)
          {
              that.setData({
                showtip: 3,
              })
          }

          var msg = response.mess;
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 1500
          });
        }
      }
    );
  },

  // 向他提问
  askQusetion:function(){
    var url = '/fbs/consult/consult?expertId=' + this.data.id + '&isAgain =0&payPrice=' + this.data.fbsInfo.total_fee;
    fbs.authLogin(url);
  },

  

  getMore: function () {
    this.queryQusetionList(this.data.id, app.globalData.city.code, this.data.currPage, this.data.pageSize);
  },


  /**
  * 打开问答详情
  */
  actionToOpenWDDetail: function (event) {
    var id = event.currentTarget.dataset['id'];
    var url = '/fbs/detail/detail?id=' + id;
    wx.navigateTo({
      url: url
    })
  },

  /**
  * 点赞
  */
  actionToDZ: function (event) {
    console.log(event);

    if (event.currentTarget.dataset['enable'] == '1') {
      
      var id = event.currentTarget.dataset['id'];
      var pageNo = event.currentTarget.dataset['page'];
      var index = event.currentTarget.dataset['index'];

      console.log('------' + id + '-----' + pageNo+'---------'+index)
      var that = this;

      fbs.fbsDZ(app.globalData.city.code, id, function () {
        var data = that.data.fbsqaList;
        var pageList = that.data.fbsqaList[pageNo];
        var oData =pageList[index];
        var num = parseInt(oData.vote);
        num++;
        oData.support = 1;
        oData.vote = num.toString();

        var dataKey = "fbsqaList["+pageNo+"]["+ index +"]";
        that.setData({
          [dataKey]: oData
        });
      });
    }
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '明星房博士-' + this.data.fbsInfo.name,
      desc: '明星房博士-' + this.data.fbsInfo.name,
      path: '/fbs/doctorList/doctorPage?city=' + app.globalData.city.code + '&id=' + this.data.id
    }
  }
})