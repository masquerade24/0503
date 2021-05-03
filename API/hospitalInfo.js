const request = require('request');

const hsptInfo = (address, hsptNm, callback) => {
    const url = 'http://apis.data.go.kr/B551182/hospInfoService/getHospBasisList?';

    const ServiceKey = process.env.PORTAL_KEY;

    let queryParams = encodeURIComponent('serviceKey') + '=' + ServiceKey;
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('emdongNm') + '=' + encodeURIComponent(address);
    queryParams += '&' + encodeURIComponent('yadmNm') + '=' + encodeURIComponent(hsptNm);
    queryParams += '&' + encodeURIComponent('_type') + '=' + encodeURIComponent('json');

    const fullurl = url + queryParams;

    request(fullurl, (error, result) => { // result.body가 string으로 옴.
        const info = JSON.parse(result.body)["response"]["body"]["items"]["item"];
        callback(null, info);
    });
}

module.exports = hsptInfo;