/*微信阅读
[Script]
^https?:\/\/i\.weread\.qq\.com\/pay\/memberCardSummary
[MITM]
hostname = i.weread.qq.com
*/

var body = $response.body;
var url = $request.url;
const path = "/pay/memberCardSummary";
let obj = JSON.parse(body);
if (url.indexOf(path) != -1) {
    obj["expired"] = 0;
	obj["expiredTime"] = 2998743249;
	obj["remainTime"] = 189302400;
	obj["isPaying"] = 1;
	body = JSON.stringify(obj);
 }
$done({body});