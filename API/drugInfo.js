const request = require('request');

exports.drugBySymptom = (symptom, callback) => {
    const url = 'http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?';

    const ServiceKey = process.env.PORTAL_KEY;

    let queryParams = encodeURIComponent('serviceKey') + '=' + ServiceKey;
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('2');
    queryParams += '&' + encodeURIComponent('efcyQesitm') + '=' + encodeURIComponent(symptom);
    queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');

    const fullurl = url + queryParams;

    request(fullurl, (error, result) => {
        const info = JSON.parse(result.body)["body"]["items"][0];
        callback(null, info);
    });
}

exports.drugByName = (itemName, callback) => {
    const url = 'http://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?';

    const ServiceKey = process.env.PORTAL_KEY;

    let queryParams = encodeURIComponent('serviceKey') + '=' + ServiceKey;
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('itemName') + '=' + encodeURIComponent(itemName);
    queryParams += '&' + encodeURIComponent('type') + '=' + encodeURIComponent('json');

    const fullurl = url + queryParams;

    request(fullurl, (error, result) => {
        const info = JSON.parse(result.body)["body"]["items"][0];
        callback(null, info);
    });
}
