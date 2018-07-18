var app = getApp();
var fbs = require('../../util/fbs.js');
var fun_base64 = require('../../util/base64.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qaid: '',//问题id
    detail: {},//详情数据
    picArr:[],//提问图片
    zwPicArr:[],//追问图片
    appParameter:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      qaid: options.id,
    });

    wx.showToast({
      title: "加载中...",
      icon: 'none',
      duration: 1000
    });
    
    var that = this;
    fbs.common.userSessionCheck(
      function () {
        //详情接口请求
        that.queryQuestionDetail(that.data.qaid, app.globalData.city.code);
      }
    );
    
  },

  /**
   * 问答详情接口请求
   */
  queryQuestionDetail: function (qaid, city) {
    
    var url = fbs.common.config.Fbs_ConsultDetail;
    var data = {
      city: city,
      qaid: qaid
    };
    var that = this;

    fbs.common.fbs_ajax_curl(
      url,
      data,
      function (response) {
        if (response.result == 1) {

          var in_xcx = response.data.fbsInfo.in_xcx;
          if (in_xcx == 0)
          {
            wx.showToast({
              title: '房博士不存在',
              icon: 'none',
            });

            if (app.globalData.appFlag == true)
            {
                wx.redirectTo({
                  url: '/fbs/home/home',
                })
            }
            else
            {
              wx.navigateBack({
                
              })
            }

            return;
          }

           
          var str = 'fbs_wdtype=1&fbs_wdid=' + that.data.qaid + '&city=' + app.globalData.city.code + '&fbs_zhid=' + response.data.passport_uid;
          var obj_base64 = new fun_base64.Base64();
          var baseStr = obj_base64.encode(str);

          var result = 'https://m.house365.com?TFRouteType=1030&TFRouteParm=' + encodeURI(baseStr);

          var tPicArr = [];
          if (response.data.pic)
          {
            tPicArr = response.data.pic.split(",")
          }
          var tZWPicArr = [];
          if (response.data.zwpic)
          {
            tZWPicArr = response.data.zwpic.split(",")
          }
          
         
          // console.log('数组'+tPicArr);

          var qStamp = fbs.fbsTimeConver(response.data.dateline);
          var rStamp = fbs.fbsTimeConver(response.data.replydate); 
          var zwStamp = fbs.fbsTimeConver(response.data.zwdate); 
          var zwrStamp = fbs.fbsTimeConver(response.data.zwreplydate); 

          if (qStamp != "") {
            response.data.dateStr = qStamp;
          }
          if (rStamp != "") {
            response.data.replydateStr = rStamp;
          }
          if (zwStamp != "") {
            response.data.zwdateStr = zwStamp;
          }
          if (zwrStamp != "") {
            response.data.zwreplydateStr = zwrStamp;
          }

          if(response.data.status!==2)
          {
             wx.hideShareMenu({
               
             })
          }

          //成功，数据刷新
          that.setData(
            {
              detail: response.data,
              picArr : tPicArr,
              zwPicArr : tZWPicArr,
              appParameter: result,
            }
          )

        }
        else {
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

  //提问查看大图
  picTap: function (e) {   
    wx.previewImage({
      current: e.currentTarget.dataset.picurl, // 当前显示图片的http链接
      urls: this.data.picArr // 需要预览的图片http链接列表
    })
  },

  //追问查看大图
  zwPicTap:function(e){
    wx.previewImage({
      current: e.currentTarget.dataset.picurl, // 当前显示图片的http链接
      urls: this.data.zwPicArr // 需要预览的图片http链接列表
    })
  },

    //追问
    zwTapped:function()
    {
      var url = '/fbs/consult/consult?id=' + this.data.qaid + '&isAgain=1';
      fbs.authLogin(url);
    },

    //提问
    askTapped:function(){
      var url = '/fbs/consult/consult?expertId=' + this.data.detail.fbsInfo.fbsid + '&isAgain=0';
      fbs.authLogin(url);
    },

  //房博士详情
  fbsDetailInfo:function(){
    wx.navigateTo({
      url: '/fbs/doctorList/doctorPage?id=' + this.data.detail.fbsInfo.fbsid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
  * 点赞
  */
  actionToDZ: function (event) {
    if (event.currentTarget.dataset['enable'] == '1') {
      var that = this;
      var id = event.currentTarget.dataset['id'];

      fbs.fbsDZ(app.globalData.city.code, id, function () {
        var tmpData = that.data.detail;
        var num = parseInt(tmpData.vote);
        num++;
        tmpData.support = 1;
        tmpData.vote = num.toString();

        that.setData({
          detail: tmpData
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
    var that = this;
    fbs.common.userSessionCheck(
      function () {
        //详情接口请求
        that.queryQuestionDetail(that.data.qaid, app.globalData.city.code);
      }
    );
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
        // 用户点击右上角分享
    if(this.data.detail.status==2)
    {
      return {
        title: '问答详情',
        desc: '问答详情',
        path: '/fbs/detail/detail?city=' + app.globalData.city.code + '&id=' + this.data.qaid
      }
    }
    
  }
})
