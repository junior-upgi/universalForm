var moment = require('moment-timezone');

var insertGlassRunRecord = function(primaryKeyString, requestData, uploadPathObject) {
    console.log(requestData);
    var firstPart = 'INSERT INTO productionHistory.dbo.isProdData (';
    var fieldList = '';
    var thirdPart = ') VALUES (';
    var valueList = '';
    var endPart = ');';
    fieldList += 'id';
    valueList += "'" + primaryKeyString + "'";
    delete requestData.glassRun;
    delete requestData.mockProdReference;
    for (var key in requestData) {
        if (requestData[key] !== '') {
            fieldList += ',' + key;
            valueList += ",'" + requestData[key] + "'";
        }
    }
    if (uploadPathObject !== null) {
        if (uploadPathObject.bmCoolingStack !== undefined) {
            fieldList += ',bmCoolingStack';
            valueList += ",'" + uploadPathObject.bmCoolingStack + "'";
        }
        if (uploadPathObject.fmCoolingStack !== undefined) {
            fieldList += ',fmCoolingStack';
            valueList += ",'" + uploadPathObject.fmCoolingStack + "'";
        }
        if (uploadPathObject.gobImage !== undefined) {
            fieldList += ',gobImage';
            valueList += ",'" + uploadPathObject.gobImage + "'";
        }
    }
    fieldList += ',created,modified';
    valueList += ",'" +
        moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + "','" +
        moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + "'";
    return firstPart + fieldList + thirdPart + valueList + endPart;
};

module.exports = {
    getGlassRunRecordset: 'SELECT * FROM productionHistory.dbo.glassRun ORDER BY schedate DESC,PRDT_SNM;',
    insertGlassRunRecord: insertGlassRunRecord
};