var app = getApp();
var news = require('../../util/news.js');
Page({
  data:{
    city          : '',
    rmzx          : {page:1,pagesize:10,is_post:false,no_more:false,list_data:[],nodata:false},                  //热门资讯数据
    lpdg          : {page:1,pagesize:10,is_post:false,no_more:false,list_data:[],nodata:false},                  //楼盘导购数据
    navbar        : ['热门资讯', '楼盘导购'],
    list_type     : 0,          //0热门资讯，1楼盘导购
    winWidth      : 0,
    winHeight     : 0,
    scrollHeight  : 0
  },
  onLoad:function(options){
    this.setData({
      city : app.globalData.city.code,
      winWidth  : app.globalData.systemInfo.windowWidth,
      winHeight : app.globalData.systemInfo.windowHeight,
      scrollHeight : app.globalData.systemInfo.windowHeight - Math.round(app.globalData.systemInfo.windowWidth/750*85)
    });
    news.getNewsListData(this);//请求热门资讯第一页
  },
  onReady:function(){
    news.getNewsListData(this,1);//请求楼盘导购第一页
  },
  onShow:function(){
  },
  onHide:function(){
  },
  onUnload:function(){
  },
  onShareAppMessage: function() {
    return {
        title: '365淘房-房产资讯',
        desc: '365淘房为您免费提供房屋的买卖、租赁、装修及社区生活为一体的一条龙服务。',
        path: '/page/news/list?city='+app.globalData.city.code
    }
  },

  /* my function  */
  //tab bind
  switchNav: function(e) {
		this.setData({
			list_type : e.currentTarget.dataset.idx,
		})
	},
  
  //get more list data
  getMore: function(e){
    news.getNewsListData(this);
  }
 
})