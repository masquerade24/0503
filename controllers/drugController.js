const drugInfo = require('../API/drugInfo');
const sequelize = require('sequelize');
const models = require('../models/');
const Op = sequelize.Op;

exports.symptomSearch = async (req, res) => {
    try {
        const symptom = await req.body.symptom
        if (symptom) {
            drugInfo.drugBySymptom(symptom, (error, info) => {
                console.log(info);
                res.status(200).json({
                    // itemName: info["itemName"],
                    entpName: info["entpName"],
                    itemImage: info["itemImage"],
                    efficiency: info["efcyQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    useMethod: info["useMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    warning: info["atpnQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    intrcnt: info["intrcQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    sideEffect: info["seQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    depositMethod: info["depositMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                })
            })
            console.log('약 조회에 성공했습니다.');
        } else {
            res.status(401).json({
                message: 'Cannot found matching drug!',
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    };
};

exports.symptomSearch2 = async (req, res) => {
    try {
        const drug = await models.Drug.findAll({
            where: {
                efficiency: {
                    [Op.substring]: req.body.symptom,
                }
            }
        });
        console.log(drug[0]["dataValues"]["itemName"]);
        // DB에 count가 부여된 알약이 있으면 그것 먼저 보여주고
        // '더 보기'를 클릭하면 API를 조회하는 것으로.
        res.status(200).json({
            message: '데헤헷',
            data: drug,
        })
    } catch (err) {
        res.status(500).json({
            message: 'case 1: 내부 서버 오류 from symptomSearch2',
            err: err,
        })
    }
}

exports.search = async (req, res) => {
    console.log('drug/search 호출됨');
    console.log(req.body.itemName);
    try {
        const drug = await foundDrug(req, res);
        if (drug) {
            drugInfo.drugByName(drug.itemName, (error, info) => {
                res.status(200).json({
                    itemName: drug.itemName,
                    entpName: info["entpName"],
                    itemImage: info["itemImage"],
                    efficiency: info["efcyQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    useMethod: info["useMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    warning: info["atpnQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    intrcnt: info["intrcQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    sideEffect: info["seQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    depositMethod: info["depositMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                })
            })
            console.log('약 조회에 성공했습니다.');
        } else {
            res.status(401).json({
                message: 'Cannot found matching drug!',
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    };
};

exports.search2 = async (req, res) => {
    console.log('drug/search 호출됨');
    console.log(req.body.itemName);
    try {
        if (req.body.itemName) {
            drugInfo.drugByName(req.body.itemName, (error, info) => {
                res.status(200).json({
                    itemName: req.body.itemName,
                    entpName: info["entpName"],
                    itemImage: info["itemImage"],
                    efficiency: info["efcyQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    useMethod: info["useMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    warning: info["atpnQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    intrcnt: info["intrcQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    sideEffect: info["seQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                    depositMethod: info["depositMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                })
            })
            console.log('약 조회에 성공했습니다.');
        } else {
            res.status(401).json({
                message: 'Cannot found matching drug!',
            })
        }
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    };
};

exports.saveDrug = async (req, res) => {
    const drug = await foundDrug(req, res);
    models.Drug
        .findOne({ where: { itemName: drug.itemName } })
        .then(result => {
            if (result) {
                models.Drug.update({
                    count: result.count + 1,
                }, {
                    where: { itemName: result.itemName }
                })
                res.status(201).json({
                    message: '작성 완료',
                })
            } else {
                drugInfo.drugByName(drug.itemName, async (error, info) => {
                    const newDrug = {
                        entpName: info["entpName"],
                        itemName: drug.itemName,
                        efficiency: info["efcyQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                        useMethod: info["useMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                        warning: info["atpnQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                        intrcnt: info["intrcQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                        sideEffect: info["seQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                        depositMethod: info["depositMethodQesitm"].replace(/(<p>|<\/p>)+/g, '\n').trim(),
                        itemImage: info["itemImage"],
                        count: 1,
                    }
                    models.Drug.create(newDrug)
                        .then(result => {
                            res.status(201).json({
                                message: '저장 완료 !',
                            })
                        })
                        .catch(error => {
                            res.status(500).json({
                                message: 'case 1: 내부 서버 오류 발생',
                            })
                        });
                })
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'case 0: 내부 서버 오류 발생',
            })
        })
}

// 복약관리 기능 제거하면서 사용할 필요 없어짐.
// exports.deleteMyDrug = (req, res) => {
//     console.log('등록한 약 삭제 호출');

//     models.Drug
//         .destroy({
//             where: {
//                 id: req.params.id,
//             }
//         })
//         .then((result) => {
//             res.status(200).json({
//                 message: '등록한 약 삭제에 성공했습니다.',
//                 result,
//             });
//         })
//         .catch(error => {
//             res.status(500).json({
//                 message: 'Something went wrong!',
//             })
//         })
// }

let foundDrug = function (req, res) {
    return new Promise((resolve, reject) => {
        const drug = models.DB_drug
            .findOne({
                where: {
                    printFront: req.body.print,
                    drugShape: req.body.shape,
                    colorClass1: req.body.color,
                },
            });
        if (drug)
            resolve(drug);
        else {
            res.status(401).json({
                message: '약 검색에 실패했습니다. 사진을 다시 찍어주세요.',
            });
        }
    });
}
