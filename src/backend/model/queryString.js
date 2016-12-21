let moment = require('moment-timezone');

let insertIsProdDataRecord = function(primaryKey, requestData, uploadLocationObject) {
    let currentDatetime = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    let firstPart = 'INSERT INTO productionHistory.dbo.isProdData (';
    let fieldList = '';
    let thirdPart = ') VALUES (';
    let valueList = '';
    let endPart = ');';
    fieldList += 'id';
    valueList += '\'' + primaryKey + '\'';
    delete requestData.formState;
    delete requestData.glassRun;
    delete requestData.mockProdReference;
    delete requestData.orderQty;
    if (requestData.sampling === 'on' || requestData.sampling === '1' || requestData.sampling === 1) {
        requestData.sampling = 1;
    } else {
        requestData.sampling = 0;
    }
    for (let key in requestData) {
        if (requestData[key] !== '') {
            fieldList += ',' + key;
            valueList += ',\'' + requestData[key] + '\'';
        }
    }
    if (uploadLocationObject !== null) {
        if (uploadLocationObject.bmCoolingStack !== undefined) {
            fieldList += ',bmCoolingStack';
            valueList += ',\'' + uploadLocationObject.bmCoolingStack + '\'';
        }
        if (uploadLocationObject.fmCoolingStack !== undefined) {
            fieldList += ',fmCoolingStack';
            valueList += ',\'' + uploadLocationObject.fmCoolingStack + '\'';
        }
        if (uploadLocationObject.gobShape !== undefined) {
            fieldList += ',gobShape';
            valueList += ',\'' + uploadLocationObject.gobShape + '\'';
        }
    }
    fieldList += ',created,modified';
    valueList += ',\'' + currentDatetime + '\',\'' + currentDatetime + '\'';
    return firstPart + fieldList + thirdPart + valueList + endPart;
};

let insertTbmknoRecord = function(primaryKey, requestData) {
    let currentDatetime = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (requestData.sampling === 'on' || requestData.sampling === '1' || requestData.sampling === 1) {
        requestData.sampling = 1;
    } else {
        requestData.sampling = 0;
    }
    console.log(`INSERT INTO productionHistory.dbo.tbmkno VALUES('${primaryKey}',${requestData.sampling},'${requestData.machno}','${requestData.glassProdLineID}','${requestData.schedate}','${requestData.prodReference}',${requestData.orderQty},'${currentDatetime}','${currentDatetime}');`);
    return `INSERT INTO productionHistory.dbo.tbmkno VALUES('${primaryKey}',${requestData.sampling},'${requestData.machno}','${requestData.glassProdLineID}','${requestData.schedate}','${requestData.prodReference}',${requestData.orderQty},'${currentDatetime}','${currentDatetime}');`;
};

module.exports = {
    // deletePhoto: deletePhoto,
    getGlassRunRecordset: 'SELECT * FROM productionHistory.dbo.glassRun ORDER BY schedate DESC,PRDT_SNM;',
    // getISProdDataRecord: getISProdDataRecord,
    // getISProdDataRecordset: 'SELECT * FROM productionHistory.dbo.isProdData;',
    // updateGlassRunRecord: updateGlassRunRecord,
    insertIsProdDataRecord: insertIsProdDataRecord,
    insertTbmknoRecord: insertTbmknoRecord
};

/*
let deletePhoto = function(recordID, photoFieldName) {
    return 'UPDATE productionHistory.dbo.isProdData SET ' + photoFieldName + '=NULL WHERE id=\'' + recordID + '\';';
};

let getISProdDataRecord = function(recordID) {
    return 'SELECT * FROM productionHistory.dbo.isProdData WHERE id=\'' + recordID + '\';';
};


let updateGlassRunRecord = function(primaryKeyString, requestData, uploadPathObject) {
    let updateString = 'UPDATE productionHistory.dbo.isProdData ';
    let setString = 'SET ';
    let fieldList = [];
    let conditionString = 'WHERE id=\'' + primaryKeyString + '\';';
    delete requestData.glassRun;
    delete requestData.mockProdReference;
    for (let key in requestData) {
        if (requestData[key] !== '') {
            fieldList += key + '=\'' + requestData[key] + '\',';
        } else {
            fieldList += key + '=NULL,';
        }
    }
    if (uploadPathObject !== null) {
        if (uploadPathObject.bmCoolingStack !== undefined) {
            fieldList += 'bmCoolingStack=\'' + uploadPathObject.bmCoolingStack + '\',';
        }
        if (uploadPathObject.fmCoolingStack !== undefined) {
            fieldList += 'fmCoolingStack=\'' + uploadPathObject.fmCoolingStack + '\',';
        }
        if (uploadPathObject.gobShape !== undefined) {
            fieldList += 'gobShape=\'' + uploadPathObject.gobShape + '\',';
        }
    }
    fieldList += 'modified=\'' + moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + '\' ';
    return updateString + setString + fieldList + conditionString;
};
*/
