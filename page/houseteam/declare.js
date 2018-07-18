var app = getApp();
var houseTeam = require('../../util/houseTeam.js');
Page({
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
		// 用户点击右上角分享
		return {
			title: '365淘房-看房团',
			desc: '规模最大最正规的南京看房活动，为您精心挑选多条优质看房线路！',
			path: '/page/houseteam/declare?city='+app.globalData.city.code
		}
	},
})