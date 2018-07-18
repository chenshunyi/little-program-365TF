var app = getApp();
var news = require('../../util/news.js');
Page({
  data:{
    city  : '',
    audio : {
        current : {
        poster  : '',//封面
        name    : '',//专辑名称
        author  : '',//作者
        src     : '',//播放地址
      },
      audioAction: {
        method  : 'pause'
      }
    },
    video : {
      src : "", //视频播放地址,
      pic : ""  //视频封面
    },
    n_title   : '',         //页面标题
    n_from    : '365淘房',  //来源
    datetime  : '',         //发布时间
    n_content : new Array(),//内容
    imgs      : []          //图集
  },

  onLoad:function(options){
    this.setData({
      id:options.id,
      city : app.globalData.city.code
    });
    news.getNewsInfoData(this);
  },
  onShow:function(){
  },
  onHide:function(){
  },
  onUnload:function(){
  },
  onShareAppMessage: function() {
    return {
        title: this.data.n_title,
        desc: this.data.datetime,
        path: '/page/news/detail?id='+this.data.id +"&city=" + app.globalData.city.code
    }
  },

  /* my function  */
  //view Img
  viewimg: function(e){
    news.viewImg(this.data.imgs,e.currentTarget.dataset.currenturl);
  }
})