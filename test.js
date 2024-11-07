/*
[rewrite_local]
# 京东、京东极速、京喜
# 商品id获取, 查看商品详情触发通知
https:\/\/.+\.jd\.com\/graphext\/draw\?sku=(\d+).* url script-request-header https://raw.githubusercontent.com/id77/QuantumultX/master/Script/jdapp_to_union.js
https:\/\/.+\.jd\.com\/product\/.*\/(\d+)\.html url script-request-header https://raw.githubusercontent.com/id77/QuantumultX/master/Script/jdapp_to_union.js

[mitm]
hostname = *.jd.com, *.*.jd.com
*/

// 获取 AppId、AppKey 和 UnionId
const AppId = getData('shine_jingPinKU_AppId');
const AppKey = getData('shine_jingPinKU_AppKey');
const UnionId = getData('shine_jingPinKU_UnionId');

// 获取返利链接的函数
function getRebateLink(contentStr, callback) {
    const url = "https://api.jingpinku.com/get_powerful_coup_link/api";
    const params = {
        appid: AppId,
        appkey: AppKey,
        union_id: UnionId,
        content: contentStr
    };

    $httpClient.get({ url: url, params: params }, function(error, response, data) {
        if (error) {
            console.error("请求失败", error);
            callback(null);
        } else {
            try {
                const jsonData = JSON.parse(data);
                callback({
                    code: jsonData.code || 0,
                    content: jsonData.content || "",
                    images: jsonData.images || [],
                    official: jsonData.official || ""
                });
            } catch (e) {
                console.error("解析返回数据失败", e);
                callback(null);
            }
        }
    });
}

// 捕获请求 URL 和 SKU
console.log(`🔗 捕获：\n${$request.url}`);

const url = $request.url.replace(/https?:\/\//g, '');  // 去掉协议部分（http:// 或 https://）
const UA = $request.headers['User-Agent'] || $request.headers['user-agent'];  // 获取请求头中的 User-Agent
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

// 如果成功匹配到 SKU，保存其值
if (arr) {
    sku = arr[1];
}

// 输出获取到的 SKU 信息
console.log(`👾 SKU：${sku}`);

let productLink = sku ? `https://item.m.jd.com/product/${sku}.html` : '未找到商品链接';

// 获取返利链接
if (sku) {
    getRebateLink(sku, function(rebateLink) {
        let msg = rebateLink ? rebateLink.content || "暂无商品信息" : "未能获取返利信息";
        if (rebateLink && rebateLink.official) {
            msg = rebateLink.official;
        }
        // 发送通知
        $notify('捕获到商品 SKU', '', `商品链接：${productLink}\n返利信息：${msg}`);
        $done();
    });
} else {
    // 如果未获取到 SKU，可以提示用户
    $notify('未能获取 SKU', '', '无法解析商品 SKU');
    $done();
}
