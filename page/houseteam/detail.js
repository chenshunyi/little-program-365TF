var app = getApp();
var houseTeam = require('../../util/houseTeam.js');
Page({
	data: {
		id: 0,
		scrollHeight: 316,
		longitude: 113.324520,
		latitude: 23.099994,
		markers: [],
		listdata: [],
		tagArr:[],
		isSecond: false
	},
	onLoad: function(options) {
		// 生命周期函数--监听页面加载
		var that = this,
			l =  750/app.globalData.systemInfo.windowWidth ,
			scrollHeight = (app.globalData.systemInfo.windowHeight - (app.globalData.systemInfo.windowWidth / 750) * 110 ) * l;
		that.setData({
			id: options.id,
			scrollHeightDown: scrollHeight
		});
		houseTeam.getInfoData(that, options.id);
		if(this.data.listdata.e_city != null) {
			app.globalData.city = this.data.listdata.e_city;
		}	
	},
	onShow: function() {
		// 生命周期函数--监听页面显示
	},
	onHide: function() {
		// 生命周期函数--监听页面隐藏
	},
	onUnload: function() {
		// 生命周期函数--监听页面卸载
	},
	onShareAppMessage: function() {
		return {
			title: this.data.listdata.e_title,
			desc: this.data.listdata.e_startoff_ftime,
			path: '/page/houseteam/detail?id='+this.data.id +'&city='+app.globalData.city.code
		}
	},
	show_big_map: function() {
		var that = this;
		if(!that.data.isSecond) {
			that.setData({
				isSecond: true,
				scrollHeight: that.data.scrollHeightDown
			});
		} else {
			that.setData({
				isSecond: false,
				scrollHeight: 316
			});
		}
	},
	dial: function(e) { // 拨打电话
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.tel.replace("转", ",")
		})
	}
})