const until = require('util.js');

function count(o) {
	var t = typeof o;
	if(t == 'string') {
		return o.length;
	} else if(t == 'object') {
		var n = 0;
		for(var i in o) {
			n++;
		}
		return n;
	}
	return false;
};

function getListData(that, city) {
	var url = until.config.Houseteam_List;
	var data = {
		'city': city.code,
		"name": "tf",
		'api_key': 'android'
	}
	wx.showToast({
		title: '加载中',
		icon: 'loading',
		duration: 5000
	});
	until.ajax_curl(url, data, function(res) {
		wx.hideToast();
		if(count(res.data) > 0) {
			that.setData({
				'listdata': res.data
			});
		}
		else{
			that.setData({
				'isNull': true
			});
		}
	});
}

function getInfoData(that, id) {
	var url = until.config.Houseteam_Detail;
	var data = {
		'e_id': that.data.id,
	}
	wx.showToast({
		title: '加载中',
		icon: 'loading',
		duration: 5000
	});
	until.ajax_curl(url, data, function(res) {
		wx.hideToast();
		if(count(res.data) > 0) {
			wx.setNavigationBarTitle({
			  title: res.data.e_title
			})	
			var a = setTags(res.data.e_car_gifts+","+res.data.e_other_gifts);
			that.setData({
				'listdata': res.data,
				'tagArr': a
			});
		}
		setMap(that, res.data.e_houses);
	});
}

function setTags(data) {
	var a = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	if(data.indexOf("地") != -1) {
		a[0] = 1;
	}
	if(data.indexOf("矿") != -1) {
		a[1] = 1;
	}
	if(data.indexOf("新") != -1) {
		a[2] = 1;
	}
	if(data.indexOf("热") != -1) {
		a[3] = 1;
	}
	if(data.indexOf("神") != -1) {
		a[4] = 1;
	}
	if(data.indexOf("豪") != -1) {
		a[5] = 1;
	}
	if(data.indexOf("全") != -1) {
		a[6] = 1;
	}
	if(data.indexOf("对") != -1) {
		a[7] = 1;
	}
	if(data.indexOf("独") != -1) {
		a[8] = 1;
	}
	return a;
}

function setMap(that, data) {
	var url = until.config.Houseteam_DetailMap,
		a = [];
	for(var i = 0; i < data.length; i++) {
		var o = {};
		o.latitude = Number(data[i].map_x);
		o.longitude = Number(data[i].map_y);
		o.id = data[i].h_id;
		o.iconPath = '/image/address.png';
		o.width = 30;
        o.height = 30;
		a.push(o);
	}
	that.setData({
		'markers': a
	});
//	until.ajax_curl(url, data, function(res) {
//		for(var i = 0; i < res.data.length; i++) {
//			res.data[i].iconPath = res.data[i].mapurl;
//		}
//		that.setData({
//			'markers': res.data
//		});
//	}, 'post');
}
module.exports = {
	getListData: getListData,
	until: until,
	getInfoData: getInfoData,
	setMap: setMap
}