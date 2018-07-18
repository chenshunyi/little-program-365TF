var app = getApp();
var timer;
var pagejs = require('../../util/index.js');
Page({
	data: {
		scrollHeight: 0,
		city: {
			code: '',
			cname: ''
		},
		icon_arr: {
			icon1: true,
			icon2: true,
			icon21: true,
			icon300: true,
			icon6: true,
      icon400: true
		},
		pagenum: 1,
		pagesize: 10,
		isajax: false,
		is_more: true,
		list_arr: [],
		isnodata: false
	},
	onLoad: function(options) {
		var that = this
		var scrollHeight = app.globalData.systemInfo.windowHeight - Math.round((app.globalData.systemInfo.windowWidth / 750) * 95);
		that.setData({
			scrollHeight: scrollHeight
		});
   // console.log(app.globalData.city)
		that.setData({
			"city.code": app.globalData.city.code,
			"city.cname": app.globalData.city.cname
		})
	    pagejs.get_icon(app.globalData.city.code, that);
	    pagejs.get_data_list(app.globalData.city, that);
		if(!app.globalData.city.cname){
			checkCityname(that);
		}
	   	pagejs.locate_city(that,app,pagejs);
	},
	scrolltolower: function(e) {
		pagejs.get_data_list(app.globalData.city, this);
	},
	onShow: function() {
		var that = this;
    if (app.globalData.city.code != this.data.city.code) {
			that.setData({
				city: app.globalData.city,
				pagenum: 1,
				pagesize: 10,
				isajax: false,
				is_more: true,
				list_arr: []
			})
			pagejs.get_icon(app.globalData.city.code, that);
			pagejs.get_data_list(app.globalData.city, that);
		}
	},
	onHide: function() {
	},
	onUnload: function() {
	},
	onShareAppMessage: function() {
		return app.getSharedata();
	}
})

function checkCityname(that){
  timer = setInterval(function(){
	  var cname=pagejs.common.get_cityname(app.globalData.city.code);
    if (cname){
      app.globalData.city.cname = cname;
      that.setData({
        "city.cname": cname
      })
      clearInterval(timer);
    }
  },1000)
}