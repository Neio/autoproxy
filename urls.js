filters = [
    // Test IP
    'http://*.ip138.com*',

    'http://v.youku.com/player/*',
    'http://api.youku.com/player/*',
    'http://play.youku.com/play/get.json*',
    // 'http://v2.tudou.com/*',
    'http://www.tudou.com/a/*',
    'http://www.tudou.com/v/*',
    'http://www.tudou.com/outplay/goto/*',
    'http://www.tudou.com/tvp/alist.action*',
    'http://s.plcloud.music.qq.com/fcgi-bin/p.fcg*',
    'http://i.y.qq.com/s.plcloud/fcgi-bin/p.fcg*',
    'http://hot.vrs.sohu.com/*',
    'http://live.tv.sohu.com/live/player*',
    'http://pad.tv.sohu.com/playinfo*',
    'http://my.tv.sohu.com/play/m3u8version.do*',
    'http://hot.vrs.letv.com/*',
    //'http://g3.letv.cn/*',
    'http://data.video.qiyi.com/v.*',
    'http://data.video.qiyi.com/videos/*',
    'http://data.video.qiyi.com/*/videos/*',
    // 'http://nl.rcd.iqiyi.com/apis/urc/*',
    'http://cache.video.qiyi.com/vms?*',
    'http://cache.vip.qiyi.com/vms?*',
    'http://cache.video.qiyi.com/vp/*/*/?src=*',
    'http://cache.video.qiyi.com/vps?*',
    'http://cache.video.qiyi.com/liven/*',
    'http://v.api.hunantv.com/player/video*',
    'http://bangumi.bilibili.com/api/*',
    'http://app.bilibili.com/bangumi/user_season_status?*',
    'http://m*.music.126.net/*',
    'http://api.appsdk.soku.com/u/s?keyword=*',
    'http://api.appsdk.soku.com/d/s?keyword=*',

    // cause oversea servers unusable?
    // 'http://interface.bilibili.tv/player*',

    // 'http://61.135.183.45/*',
    // 'http://61.135.183.46/*',
    // 'http://61.135.183.50/*',
    // 'http://220.181.61.229/*',
    // 'http://220.181.61.212/*',
    // 'http://220.181.61.213/*',
    // 'http://220.181.19.218/*',
    // 'http://220.181.118.181/*',
    // 'http://123.126.48.47/*',
    // 'http://123.126.48.48/*',
    // 'http://123.125.123.80/*',
    // 'http://123.125.123.81/*',
    // 'http://123.125.123.82/*',
    'http://122.72.82.31/*',

    'http://vv.video.qq.com/*',
    'http://vv.video.qq.com/getvinfo*',
    'http://vv.video.qq.com/getinfo*',
    'http://vv.video.qq.com/geturl*',
    'http://tt.video.qq.com/getvinfo*',
    'http://ice.video.qq.com/getvinfo*',
    'http://tjsa.video.qq.com/getvinfo*',
    'http://a10.video.qq.com/getvinfo*',
    'http://xyy.video.qq.com/getvinfo*',
    'http://vcq.video.qq.com/getvinfo*',
    'http://vsh.video.qq.com/getvinfo*',
    'http://vbj.video.qq.com/getvinfo*',
    'http://bobo.video.qq.com/getvinfo*',
    'http://flvs.video.qq.com/getvinfo*',
    'http://bkvv.video.qq.com/getvinfo*',
    'http://info.zb.qq.com/?*',
    'http://info.zb.video.qq.com/?*',
    'http://qzs.qq.com/tencentvideo_v1/*',
    'http://ac.qq.com/Comic/comicInfo/id/*',

    'http://geo.js.kankan.xunlei.com/*',
    'http://web-play.pptv.com/*',
    'http://web-play.pplive.cn/*',
    // 'http://c1.pptv.com/*',
    'http://dyn.ugc.pps.tv/*',
    'http://v.pps.tv/ugc/ajax/aj_html5_url.php*',
    'http://inner.kandian.com/*',
    'http://ipservice.163.com/*',
    'http://so.open.163.com/open/info.htm*',
    'http://zb.s.qq.com/*',
    'http://ip.kankan.xunlei.com/*',
    'http://vxml.56.com/json/*',

    'http://music.sina.com.cn/yueku/intro/*',
    //'http://ting.baidu.com/data/music/songlink*',
    //'http://ting.baidu.com/data/music/songinfo*',
    //'http://ting.baidu.com/song/*/download*',
    'http://music.sina.com.cn/radio/port/webFeatureRadioLimitList.php*',
    'http://play.baidu.com/data/music/songlink*',

    'http://v.iask.com/v_play.php*',
    'http://v.iask.com/v_play_ipad.cx.php*',
    'http://tv.weibo.com/player/*',
    'http://wtv.v.iask.com/*.m3u8*',
    'http://wtv.v.iask.com/mcdn.php',
    'http://video.sina.com.cn/interface/l/u/getFocusStatus.php*',
    'http://wtv.v.iask.com/player/ovs1_idc_list.php*',

    //'http://kandian.com/player/getEpgInfo*',  // !!!
    //'http://cdn.kandian.com/*',
    'http://www.yinyuetai.com/insite/*',
    'http://www.yinyuetai.com/main/get-*',
    'http://www.xiami.com/play?*',

    'http://*.dpool.sina.com.cn/iplookup*',
    // 'http://*/vrs_flash.action*', //This URL hijackable!
    // 'http://*/?prot=2&type=1*',
    // 'http://*/?prot=2&file=/*',
    'http://api.letv.com/streamblock*',
    'http://api.letv.com/mms/out/video/play*',
    'http://api.letv.com/mms/out/common/geturl*',
    'http://api.letv.com/geturl*',
    'http://api.letv.com/api/geturl*',
    'http://api.www.letv.com/mms/out/video/playJson?*',
    'http://st.live.letv.com/live/*',
    'http://live.gslb.letv.com/gslb?*',
    'http://live.g3proxy.lecloud.com/gslb?*',
    'http://api.live.letv.com/crossdomain.xml',
    'http://static.itv.letv.com/api*',
    'http://ip.apps.cntv.cn/js/player.do*',
    'http://vdn.apps.cntv.cn/api/get*',
    'http://vdn.live.cntv.cn/api2/liveHtml5.do?channel=pa://cctv_p2p_hdcctv5*',
    'http://vdn.live.cntv.cn/api2/liveHtml5.do?channel=pa://cctv_p2p_hdcctv6*',
    'http://vdn.live.cntv.cn/api2/liveHtml5.do?channel=pa://cctv_p2p_hdcctv8*',
    'http://vdn.live.cntv.cn/api2/liveHtml5.do?channel=pa://cctv_p2p_hdbtv6*',
    'http://vip.sports.cntv.cn/check.do*',
    'http://vip.sports.cntv.cn/play.do*',
    'http://vip.sports.cntv.cn/servlets/encryptvideopath.do*',
    'http://211.151.157.15/*',

    // for Mobile apps    // Video apps
    'http://v.youku.com/v_show/*',
    'http://www.youku.com/show_page/*',
    'http://www.soku.com/search_video/*',
    'http://a.play.api.3g.youku.com/common/v3/play?*',
    'http://i.play.api.3g.youku.com/common/v3/play?*',
    'http://i.play.api.3g.youku.com/common/v3/hasadv/play?*',
    'http://api.3g.youku.com/layout*',
    'http://api.3g.youku.com/v3/play/address*',
    'http://api.3g.youku.com/openapi-wireless/videos/*/download*',
    'http://api.3g.youku.com/videos/*/download*',
    'http://api.3g.youku.com/common/v3/play*',
    'http://tv.api.3g.youku.com/openapi-wireless/v3/play/address*',
    'http://tv.api.3g.youku.com/common/v3/hasadv/play*',
    'http://tv.api.3g.youku.com/common/v3/play*',
    'http://play.api.3g.youku.com/common/v3/hasadv/play*',
    'http://play.api.3g.youku.com/common/v3/play*',
    'http://play.api.3g.youku.com/v3/play/address*',
    'http://play.api.3g.tudou.com/v*',
    'http://tv.api.3g.tudou.com/tv/play?*',
    'http://api.3g.tudou.com/*',
    'http://api.tv.sohu.com/mobile_user/device/clientconf.json?*',
    'http://access.tv.sohu.com/*',
    'http://iface.iqiyi.com/api/searchIface?*',
    'http://iface2.iqiyi.com/php/xyz/iface/*',
    'http://iface2.iqiyi.com/php/xyz/entry/galaxy.php?*',
    'http://iface2.iqiyi.com/php/xyz/entry/nebula.php?*',
    "http://iface.iqiyi.com/api/ip2area*",
    "http://pdata.video.qiyi.com/k*",
    'http://cache.m.iqiyi.com/jp/tmts/*',
    'http://dynamic.app.m.letv.com/*/dynamic.php?*ctl=videofile*',
    'http://dynamic.meizi.app.m.letv.com/*/dynamic.php?*ctl=videofile*',
    'http://dynamic.search.app.m.letv.com/*/dynamic.php?*ctl=videofile*',
    'http://dynamic.live.app.m.letv.com/*/dynamic.php?*act=canplay*',
    'http://listso.m.areainfo.ppstream.com/ip/q.php*',
    'http://epg.api.pptv.com/detail.api?*',
    'http://play.api.pptv.com/boxplay.api?*',
    'http://api.letv.com/getipgeo',
    'http://m.letv.com/api/geturl?*',
    'http://api.mob.app.letv.com/play*',
    'http://static.api.sports.letv.com/*vod?*',
    'http://interface.bilibili.com/playurl?*',
    'http://vdn.live.cntv.cn/api2/live.do?channel=pa://cctv_p2p_hdcctv5*',
    'http://vdn.apps.cntv.cn/api/getLiveUrlCommonApi.do?pa://cctv_p2p_hdcctv5*',
    'http://vdn.live.cntv.cn/api2/live.do?channel=pa://cctv_p2p_hdcctv6*',
    'http://vdn.apps.cntv.cn/api/getLiveUrlCommonApi.do?pa://cctv_p2p_hdcctv6*',
    'http://vdn.live.cntv.cn/api2/live.do?channel=pa://cctv_p2p_hdcctv8*',
    'http://vdn.apps.cntv.cn/api/getLiveUrlCommonApi.do?pa://cctv_p2p_hdcctv8*',
    'http://vdn.live.cntv.cn/api2/live.do?channel=pa://cctv_p2p_hdbtv6*',
    'http://vdn.apps.cntv.cn/api/getLiveUrlCommonApi.do?pa://cctv_p2p_hdbtv6*',

    // Music apps
    'http://3g.music.qq.com/*',
    'http://mqqplayer.3g.qq.com/*',
    'http://proxy.music.qq.com/*',
    'http://proxymc.qq.com/*',
    'http://*/base/fcgi-bin/getsession*',
    'http://acc.music.qq.com/base/fcgi-bin/getsession*',
    'http://ip2.kugou.com/check/isCn/*',
    'http://ip.kugou.com/check/isCn/*',
    'http://client.api.ttpod.com/global*',
    'http://mobi.kuwo.cn/*',
    'http://mobilefeedback.kugou.com/*',
    'http://tingapi.ting.baidu.com/v1/restserver/ting?*method=baidu.ting.song*',
    'http://music.baidu.com/data/music/links?*',
    'http://serviceinfo.sdk.duomi.com/api/serviceinfo/getserverlist*',
    'http://music.163.com/api/copyright/restrict/?*',
    'http://music.163.com/api/batch',
    'http://www.xiami.com/*',
    'http://www.xiami.com/web/spark*',
    'http://www.xiami.com/web/*?*xiamitoken=*',
    'http://spark.api.xiami.com/api?*method=AuthIp*',
    'http://spark.api.xiami.com/api?*method=Start.init*',
    'http://spark.api.xiami.com/api?*method=Songs.getTrackDetail*',
    'http://spark.api.xiami.com/api?*method=Songs.detail*',
    'http://spark.api.xiami.com/api?*method=mobile.start-init*',
    'http://spark.api.xiami.com/api?*',
    // for PC Clients only
    'http://iplocation.geo.qiyi.com/cityjson*',
    'http://sns.video.qq.com/tunnel/fcgi-bin/tunnel*',
    'http://v5.pc.duomi.com/single-ajaxsingle-isban*',

    // the access control for https are per domain name
    'https://openapi.youku.com/*',  // see issue #118
    'https://61.135.196.99/*', //n-openapi.youku.com
    'https://220.181.185.150/*', //zw-openapi.youku.com
    'https://111.13.127.46/*',//bj-m-openapi.youku.com
    'https://211.151.50.10/*',//b-openapi.youku.com
    'https://123.126.99.57/*',//openapi.youku.com
    'https://123.126.99.39/*',//zw-n-openapi.youku.com
    'https://220.181.154.137/*',//zw-t-openapi.youku.com

    // for MiBox iCNTV Authentication
    'http://tms.is.ysten.com:8080/yst-tms/login.action?*',
    'http://chrome.2345.com/dianhua/mobileApi/check.php',
    'http://internal.check.duokanbox.com/check.json*',
    // for 3rd party's DNS for Apple TV (see pull request #78)
    'http://180.153.225.136/*',
    'http://118.244.244.124/*',
    'http://210.129.145.150/*',
    'http://182.16.230.98/*' //Updated on Jan. 3, for new DNS of apple tv.
];

exports.filters = filters;
