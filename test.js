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
const UA = $request.headers['User-Agent'] || $request.headers['user-agent'];  // 获取请求头中的 User-Agent
let appType = UA.match(/(.+?);/)[1];  // 获取应用类型
let sku;
let arr = [];


// 根据不同的 URL 模式匹配 SKU
if (url.includes('graphext/draw')) {
    // 如果 URL 包含 'graphext/draw'，则从中提取 SKU
    arr = url.match(/sku=(\d+)/);
    appType = 'jdpingou';  // 设置应用类型为 'jdpingou'
} else if (url.includes('wqsitem.jd.com/detail')) {
    // 如果 URL 包含 'wqsitem.jd.com/detail'，提取 SKU
    arr = url.match(/wqsitem\.jd\.com\/detail\/(\d+)_/);
} else {
    // 默认匹配 '/xxx/xxx/xxx/123456.html' 类型的 URL，提取 SKU
    arr = url.match(/\/.*\/(\d+)\.html/);
}

// 如果成功匹配到 SKU，保存其值
if (arr?.length) {
    sku = arr[1];
}

// 输出获取到的 SKU 信息
console.log(`👾 SKU：${sku}`);

// 示例，发送通知或进一步处理
if (sku) {
    // 如果成功获取到 SKU，可以进行后续处理
    $notify('捕获到商品 SKU', '', `商品 SKU：${sku}`);
} else {
    // 如果未获取到 SKU，可以提示用户
    $notify('未能获取 SKU', '', '无法解析商品 SKU');
}
