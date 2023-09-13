url = $request.url;
let obj = JSON.parse($response.body);

obj={
"msg": "succ",
  "code": 0,
  "data": {
    "member_type": "qvip",
    "qvip": {
      "privileges": [{
        "privilegeDesc": "买书享受9折优惠",
        "privilegeInfo": 9,
        "privilegeType": 2
      }, {
        "privilegeDesc": "57784本好书免费读",
        "privilegeInfo": 57784,
        "privilegeType": 1
      }],
      "subscribe_status": 0,
      "member_status": 2,
      "first_pay_time": 1691837766000,
      "expired_time": 1699534399000,
      "effect_time": 1691837766000
    }
  }
};
$done({body:JSON.stringify(obj)});