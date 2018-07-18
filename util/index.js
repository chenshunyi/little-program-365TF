const common = require('util.js');


function choosecity(e, that) {
	var choosevalue = e.detail.value;
	var hiddenvalue = true;
	if(choosevalue) {
		var choose_arr = new Array();
		var all_city_arr = that.data.all_city.allcity;
		for(var i in all_city_arr) {
			for(var j in all_city_arr[i]['list']) {
				if(all_city_arr[i]['list'][j]['city_py'].indexOf(choosevalue) >= 0 || all_city_arr[i]['list'][j]['city_name'].indexOf(choosevalue) >= 0) {
					choose_arr.push(all_city_arr[i]['list'][j])
				}
			}
		}
		hiddenvalue = false;
	}
	that.setData({
		mychoose: {
			hothidden: !hiddenvalue,
			choosehidden: hiddenvalue,
			mycity: choose_arr
		}
	})
}

function get_icon(cityvalue, that) {
	var param = {
		city: cityvalue
	};
	common.ajax_curl(common.config.Index_Icon, param, function(res) {
		var old_icon_arr = {
			icon1: true,
			icon2: true,
			icon21: true,
			icon300: true,
			icon6: true,
      icon400:true
		};
		for(var i in res.data.icon) {
			old_icon_arr["icon" + res.data.icon[i]['functionId']] = false;
		}
		that.setData({
				icon_arr: old_icon_arr
			})
			//console.log('-------sss111',old_icon_arr)
	})
}

function get_data_list(city_arr, that) {
	var isajax = that.data.isajax;
	var is_more = that.data.is_more;
	if(isajax) {
		return false;
	}
	if(!is_more) {
		return false;
	}
	var param = {
		city: city_arr.cname,
		cityid: city_arr.code,
		page: that.data.pagenum,
		pageSize: that.data.pagesize,
		user_3rdsession: wx.getStorageSync('user_3rdsession')
	};
	that.setData({
		isajax: true
	});
	var currentDate = that.data.list_arr;
	common.ajax_curl(common.config.Index_Pagemore, param, function(res) {
		var new_data_list = currentDate.concat(res.data.data);
		var isnodata = false;
		if(new_data_list.length <= 0) {
			var isnodata = true;
		}
		that.setData({
			list_arr: new_data_list,
			pagenum: that.data.pagenum + 1,
			isajax: false,
			is_more: res.data.is_more,
			isnodata: isnodata
		});
		//console.log('shhyju',that.data.list_arr)
	})
}

function locate_city(that, app, pagejs) {
	//获取定位
	wx.getLocation({
		type: 'wgs84',
		success: function(res) {
			//获取当前城市
			common.ajax_curl(common.config.APP_getLocation, {
				nowLatitude: res.latitude,
				nowLongitude: res.longitude
			}, function(res1) {
				console.log(res1)
				if(res1.data.citypinyin == '') {} else {
          var code = app.globalData.city.code
          console.log("上次登录城市为：" + code)
          if (res1.data.citypinyin != code) {
						wx.showModal({
							title: '您定位的城市为: ' + res1.data.city,
							content: "是否切换",
							confirmText: "切换",
							cancelText: "取消",
							success: function(res2) {
								if(res2.confirm) {
									var new_city = {
										code: res1.data.citypinyin,
										cname: res1.data.city
									};
									if(new_city.code != that.data.city.code) {
										that.setData({
											city: new_city,
											pagenum: 1,
											pagesize: 10,
											isajax: false,
											is_more: true,
											list_arr: []
										})
										if(pagejs) {
											pagejs.get_icon(new_city.code, that);
											pagejs.get_data_list(new_city, that);
										}
									}
									set_Data(res1,app)
								}
							}
						})
					}
				}
			})
		}
	})
}

function set_Data(res1,app) {
	wx.setStorageSync('newcity', {
		code: res1.data.citypinyin,
		cname: res1.data.city
	});
	app.globalData.city = {
		code: res1.data.citypinyin,
		cname: res1.data.city
	};
}

module.exports = {

	choosecity: choosecity,
	get_icon: get_icon,
	get_data_list: get_data_list,
	locate_city: locate_city,
	common: common
}