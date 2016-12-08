var moment = require("moment-timezone");

const getGlassRunRecordset = "SELECT * FROM productionHistory.dbo.glassRun ORDER BY schedate DESC,PRDT_SNM;";

function insertGlassRunRecord(primaryKeyString, requestData, uploadPathObject) {
    console.log(requestData);
    let firstPart = "INSERT INTO productionHistory.dbo.isProdData (";
    let fieldList = "";
    let thirdPart = ") VALUES (";
    let valueList = "";
    let endPart = ");";
    fieldList += "id";
    valueList += "'" + primaryKeyString + "'";
    delete requestData.glassRun;
    delete requestData.mockProdReference;
    for (let key in requestData) {
        if (requestData[key] !== '') {
            fieldList += "," + key;
            valueList += ",'" + requestData[key] + "'";
        }
    }
    if (uploadPathObject !== null) {
        if (uploadPathObject.bmCoolingStack !== undefined) {
            fieldList += ",bmCoolingStack";
            valueList += ",'" + uploadPathObject.bmCoolingStack + "'";
        }
        if (uploadPathObject.fmCoolingStack !== undefined) {
            fieldList += ",fmCoolingStack";
            valueList += ",'" + uploadPathObject.fmCoolingStack + "'";
        }
        if (uploadPathObject.gobImage !== undefined) {
            fieldList += ",gobImage";
            valueList += ",'" + uploadPathObject.gobImage + "'";
        }
    }
    fieldList += ",created,modified";
    valueList += ",'" +
        moment(moment(), "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") + "','" +
        moment(moment(), "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") + "'";
    return firstPart + fieldList + thirdPart + valueList + endPart;
};

module.exports = {
    getGlassRunRecordset,
    insertGlassRunRecord
};