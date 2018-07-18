var host1="https://mapi.house365.com/tfxcx/";
var host2="https://mtapi.house365.com/?";
var host3 ="https://mapi.house365.com/tfxcx/aes/newfbs.php?";
var host4 ="https://mapi.house365.com/tfxcx/aes/minifbs.php?";

module.exports = {
  //用户资料
  APP_api: host1 + "aes/index.php?api=get_sessionKey",
  APP_getcity: host1 + "aes/index.php?api=getcity",
  APP_city: host1 + "aes/index.php?api=choosecity",
  APP_maidian: host1 + "aes/index.php?api=maidian",
  //定位接口
  APP_getLocation: host1 + "index.php?method=getLocation",
  APP_getrealLocation: host1 + "index.php?method=getrealLocation",
  // 首页接口
  //Index_Allcity:获取所有城市,Index_Icon:获取首页数据，Index_Pagemore：获取猜你喜欢更多数据
  Index_Allcity: host1 + "index.php?method=getAllCity",
  Index_Icon: host1 + "index.php?method=indexData",
  Index_Pagemore: host1 + "index.php?method=pagemore",
  //新房接口
  //Newhouse_List:新房列表，Newhouse_Detail：新房详情，Newhouse_Config：新房配置，Newhouse_Search：新房联想 Newhouse_Huxing户型图
  Newhouse_List: host2 + "method=newhouse.getHouseList",
  Newhouse_Detail: host2 + "method=newhouse.getHouseDetailwx",
  Newhouse_Config: host2 + "method=newhouse.getHouseProfile",
  Newhouse_Search: host2 + "method=newhouse.getSearchResult",
  Newhouse_Huxing: host2 + "method=newhouse.getHousePhotoById",
  //二手房接口
  //Secondhouse_List:二手房列表，Secondhouse_Detail：二手房详情，Secondhouse_Config：二手房配置，Secondhouse_Search：二手房联想
  Secondhouse_List: host2 + "method=secondhouse.getHouseList",
  Secondhouse_Detail: host1 + "secondhouse.php?method=getHouseDetail",
  Secondhouse_Config: host1 + "secondhouse.php?method=getHouseSearchConf",
  Secondhouse_Search: host2 + "method=secondhouse.getLegendBlockNameList",
  //查房价接口
  //Chheckprices_Search:查房价小区联想，Chheckprices_Result：查房价结果
  Chheckprices_Search: host2 + "method=secondhouse.getLegendBlockNameList",
  Chheckprices_Result: host1 + "checkprice.php?method=checkResult",
  //资讯接口
  //News_List:资讯列表，News_Detail：资讯详情
  News_List: host1 + "news.php?method=newsLists",
  News_Detail: host1 + "news.php?method=newsDetails",
  //看房团接口
  Houseteam_List: host2 + "method=kanfangtuan.getKanfangLists",
  Houseteam_Detail: host2 + "method=kanfangtuan.getKanfangGet",
  Houseteam_DetailMap: host1 + "kanfangtuan.php?method=getMapimage",
  Houseteam_Apply: host2 + "method=kanfangtuan.getKanfangEnroll",
  Houseteam_Code: host2 + "method=kanfangtuan.getcode",
  //房博士接口（需要替换为真实接口地址）
  Fbs_Home: host4+"method=getqahome&channl=tfxcx", //房博士首页
  Fbs_DZ: host4 + "method=addVote&channl=tfxcx", //房博士点赞
  Fbs_DoctorList: host4 + "method=getfbslist&channl=tfxcx", //房博士专家列表
  Fbs_UserLogin: host3 + "api=tflogin",// 用户登录
  Fbs_UserLogin_State: host3 + "api=haslogin",// 用户登录/绑定状态
  Fbs_SmsCode: host3 + "api=sendcode",// 发送短信验证码
  Fbs_UploadPic: host3 + "api=uploadimg",// 图片上传
  // Fbs_MyConsult: host2 + "method=newfbs.myQaList",// 我的提问列表
  Fbs_MyConsult: host4 + "method=myQaList",// 我的提问列表
  Fbs_PersonDetail: host4 + "method=getfbsdetail&channl=tfxcx",// 房博士详情
  Fbs_ConsultDetail: host4 + "method=getfbsqadetail&channl=tfxcx",// 提问详情
  Fbs_SubmitConsult: host4 + "method=askquestions&channl=tfxcx",// 提交提问
  Fbs_SubmitAgain: host4 + "method=addQuestion&channl=tfxcx",// 追问
  Fbs_WXPay: host3 + "api=topay",//微信支付
  Fbs_fbsQaList: host4 + "method=getfbsqalist&channl=tfxcx",//房博士问答列表
  Fbs_Consult_Notice: host3 + "api=readme",//服务须知
  Fbs_User_Notice: host3 + "api=privacy",//用户隐私须知
}