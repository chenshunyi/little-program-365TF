var common = require( 'util.js' );
var lineChart = require('lineChart.js');
function explode(separator,str){
	var feature = [];
	feature = str.split(separator);
	for(var i=0;i>feature.length;i++){
		if(feature[i] == ''){
			feature.splice(i,1);
		}
	}
	return feature;
}

function addHistory(key,checkprices_arr){
	var history = [];
    try {
      history = wx.getStorageSync(key);
      history.unshift(checkprices_arr);
      for(var i=1;i<history.length;i++){
        if(checkprices_arr.id == history[i].id){
          history.splice(i,1);
        }
      }
      while(history.length > 5){
        history.pop();
      }        
    } catch (e) {      
      history = [{id: checkprices_arr.id,blockname: checkprices_arr.blockname}];
    } 
	wx.setStorageSync(key, history);    
}

function getPoint(priceList){
  var x = [];var y = [];
  priceList = priceList.slice(-6);
  for(var i in priceList){
    if(priceList.hasOwnProperty(i)){
      x.push(priceList[i].month.substr(2,2)+"-"+Number(priceList[i].month.substr(4,2)));
      y.push(priceList[i].price);
    }
  }
  return {x: x,y: y};
}

function pointLength(n){
  var sp = n.toString().split(".");
  if('undefined' != typeof(sp[1])){
    return sp[1].length;
  }
  return 0;
}

module.exports = {
  common: common,
  lineChart: lineChart,
	explode: explode,
	addHistory: addHistory,
  getPoint: getPoint,
  pointLength: pointLength
}