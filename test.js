/*
[rewrite_local]
# 京东、京东极速、京喜
# 商品id获取, 查看商品详情触发通知
https:\/\/.+\.jd\.com\/graphext\/draw\?sku=(\d+).* url script-request-header https://raw.githubusercontent.com/id77/QuantumultX/master/Script/jdapp_to_union.js
https:\/\/.+\.jd\.com\/product\/.*\/(\d+)\.html url script-request-header https://raw.githubusercontent.com/id77/QuantumultX/master/Script/jdapp_to_union.js

[mitm]
hostname = *.jd.com, *.*.jd.com
*/

// 输出捕获的请求 URL
console.log(`🔗 捕获：\n${$request.url}`);

const url = $request.url.replace(/https?:\/\//g, '');  // 去掉 URL 中的协议部分（http:// 或 https://）
const UA = $request.headers['User-Agent'] || $request.headers['user-agent'] || '';  // 获取请求头中的 User-Agent
if (!UA) {
    $notify('错误', '', '无法获取 User-Agent');
    $done();
}

let appType = UA.match(/(.+?);/)[1];  // 获取应用类型
let sku;
let arr = [];

// 根据不同的 URL 模式匹配 SKU
if (url.includes('graphext/draw')) {
    arr = url.match(/sku=(\d+)/);
    appType = 'jdpingou';  // 设置应用类型为 'jdpingou'
} else if (url.includes('wqsitem.jd.com/detail')) {
    arr = url.match(/wqsitem\.jd\.com\/detail\/(\d+)_/);
} else {
    arr = url.match(/\/.*\/(\d+)\.html/);
}

if (arr && arr[1]) {
    sku = arr[1];
    console.log(`👾 SKU：${sku}`);
} else {
    console.log('👾 未能匹配到 SKU');
}

let productLink = sku ? `https://item.m.jd.com/product/${sku}.html` : '';

// 示例，发送通知或进一步处理
if (sku) {
    $notify('捕获到商品 SKU', '', `商品链接：${productLink}`);
} else {
    $notify('未能获取 SKU', '', '无法解析商品 SKU');
}

// 结束脚本，确保不再继续运行
$done();
