/*
[rewrite_local]
#钱迹
^https:\/\/api\.qianjiapp\.com\/vip\/configios url script-response-body https://raw.githubusercontent.com/canonvip/Rules/main/script/qianji.js

[mitm]
hostname = api.qianjiapp.com
*/


var res = JSON.parse($response.body);
res.data.config.userinfo.vipend = 209909099999;
res.data.config.userinfo.vipstart = 2024-03-05;  
res.data.config.userinfo.viptype =100;
res.data.config.userinfo.name = "shine";

$done({body : JSON.stringify(res)});