/* 
[rewrite_local]
# 京东、京东极速、京喜
# 商品id获取, 查看商品详情触发通知
https:\/\/.+\.jd\.com\/graphext\/draw\?sku=(\d+).* url script-request-header https://raw.githubusercontent.com/id77/QuantumultX/master/Script/jdapp_to_union.js
https:\/\/.+\.jd\.com\/product\/.*\/(\d+)\.html url script-request-header https://raw.githubusercontent.com/id77/QuantumultX/master/Script/jdapp_to_union.js

[mitm]
hostname = *.jd.com, *.*.jd.com
*/

// 配置类（替换 Python 中的 Config 类）
const Config = {
    AppId: "your-app-id",     // 替换为实际的 AppId
    AppKey: "your-app-key",    // 替换为实际的 AppKey
    UnionId: "your-union-id"   // 替换为实际的 UnionId
};

// RebateLink 类（替换 Python 中的 RebateLink 类）
class RebateLink {
    constructor(code = 0, content = "", images = [], official = "") {
        this.code = code;
        this.content = content;
        this.images = images;
        this.official = official;
    }
}

// 获取返利链接
function getRebateLink(contentStr, callback) {
    const url = "https://api.jingpinku.com/get_powerful_coup_link/api";
    const params = {
        appid: Config.AppId,
        appkey: Config.AppKey,
        union_id: Config.UnionId,
        content: contentStr
    };

    // 使用 Quantumult X 的 $httpClient.get 发送请求
    $httpClient.get({ url: url, params: params }, function(error, response, data) {
        if (error) {
            console.error("请求失败", error);
            callback(null);
        } else {
            try {
                const jsonData = JSON.parse(data);
                const rebateLink = new RebateLink(
                    jsonData.code || 0,
                    jsonData.content || "",
                    jsonData.images || [],
                    jsonData.official || ""
                );
                callback(rebateLink);
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
if (arr?.length) {
    sku = arr[1];
}

// 输出获取到的 SKU 信息
console.log(`👾 SKU：${sku}`);

// 拼接成商品链接
let productLink = `https://item.m.jd.com/product/${sku}.html`;

// 获取返利链接
if (sku) {
    getRebateLink(sku, function(rebateLink) {
        if (rebateLink) {
            let msg = rebateLink.content || "暂无商品信息";
            if (rebateLink.official) {
                msg = rebateLink.official;
            }
            // 发送通知
            $notify('捕获到商品 SKU', '', `商品链接：${productLink}\n返利信息：${msg}`);
        } else {
            // 如果没有返利信息，则只显示商品链接
            $notify('捕获到商品 SKU', '', `商品链接：${productLink}\n未找到返利信息`);
        }
        $done(); // 确保脚本结束
    });
} else {
    // 如果未获取到 SKU，可以提示用户
    $notify('未能获取 SKU', '', '无法解析商品 SKU');
    $done(); // 确保脚本结束
}
