let moment = require('moment-timezone');

let deletePhoto = function(recordID, photoFieldName) {
    return 'UPDATE productionHistory.dbo.isProdData SET ' + photoFieldName + '=NULL WHERE id=\'' + recordID + '\';';
};

let getISProdDataRecord = function(recordID) {
    return 'SELECT * FROM productionHistory.dbo.isProdData WHERE id=\'' + recordID + '\';';
};

let insertGlassRunRecord = function(primaryKeyString, requestData, uploadPathObject) {
    let firstPart = 'INSERT INTO productionHistory.dbo.isProdData (';
    let fieldList = '';
    let thirdPart = ') VALUES (';
    let valueList = '';
    let endPart = ');';
    fieldList += 'id';
    valueList += '\'' + primaryKeyString + '\'';
    delete requestData.glassRun;
    delete requestData.mockProdReference;
    for (let key in requestData) {
        if (requestData[key] !== '') {
            fieldList += ',' + key;
            valueList += ',\'' + requestData[key] + '\'';
        }
    }
    if (uploadPathObject !== null) {
        if (uploadPathObject.bmCoolingStack !== undefined) {
            fieldList += ',bmCoolingStack';
            valueList += ',\'' + uploadPathObject.bmCoolingStack + '\'';
        }
        if (uploadPathObject.fmCoolingStack !== undefined) {
            fieldList += ',fmCoolingStack';
            valueList += ',\'' + uploadPathObject.fmCoolingStack + '\'';
        }
        if (uploadPathObject.gobShape !== undefined) {
            fieldList += ',gobShape';
            valueList += ',\'' + uploadPathObject.gobShape + '\'';
        }
    }
    fieldList += ',created,modified';
    valueList += ',\'' +
        moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + '\',\'' +
        moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + '\'';
    return firstPart + fieldList + thirdPart + valueList + endPart;
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

module.exports = {
    deletePhoto: deletePhoto,
    getGlassRunRecordset: 'SELECT * FROM productionHistory.dbo.glassRun ORDER BY schedate DESC,PRDT_SNM;',
    getISProdDataRecord: getISProdDataRecord,
    getISProdDataRecordset: 'SELECT * FROM productionHistory.dbo.isProdData;',
    insertGlassRunRecord: insertGlassRunRecord,
    updateGlassRunRecord: updateGlassRunRecord
};
