var app = getApp();
var pagejs = require('../../util/index.js');
Page({
	data: {
		inputvalue: '',
		mychoose: {
			hothidden: false,
			choosehidden: true,
			mycity: ''
		},
		pageinfo: {},
		all_city: '',
		city: {},
		scrollHeight: 0
	},
	onLoad: function(options) {
		var that = this;
		// this.setData({pageinfo: app.globalData.systemInfo});
		/*获取系统信息*/
		var scrollHeight = app.globalData.systemInfo.windowHeight - Math.round((app.globalData.systemInfo.windowWidth / 750) * 134);
		that.setData({
			scrollHeight: scrollHeight,
			city: app.globalData.city
		});
		pagejs.common.get_allcity(that);
	},
	onShow: function() {
	},
  onReady:function(){
    pagejs.common.get_city(this)
  },
	onHide: function() {
	},
	onUnload: function() {
	},
	onShareAppMessage: function() {
		return app.getSharedata();
	},
	choosecity: function(e) {
		pagejs.choosecity(e, this);
	},
	sure_city: function(event) {
		var city_name = event.currentTarget.dataset.citycname;
		var city_code = event.currentTarget.dataset.citycode;
		if(event.currentTarget.dataset.citycode) {
			var param = {
				user_3rdsession: wx.getStorageSync('user_3rdsession'),
				newcity: city_code,
				newcityname: city_name,
			}
//			var param2 = {
//				user_3rdsession: wx.getStorageSync('user_3rdsession'),
//				newcity: '',
//				newcityname: '',
//			}
			wx.setStorageSync('newcity', {
				code: city_code,
				cname: city_name
			});
			pagejs.common.ajax_curl(pagejs.common.config.APP_city, param, function(result) {})
			app.globalData.city = {
				code: city_code,
				cname: city_name
			};
			wx.navigateBack();
		}
	},
  get_city: function() {
		pagejs.common.get_city(this)
	}
})