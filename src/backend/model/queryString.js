const moment = require('moment-timezone');

const erpPrdt = function(searchString) {
    return `SELECT SNM AS label,PRD_NO AS value FROM DB_U105.dbo.PRDT WHERE PRD_NO LIKE 'B[0-9][0-9][0-9][0-9][0-9]__' AND PRD_NO LIKE 'B${searchString}%';`;
};

const insertIsProdDataRecord = function(primaryKey, requestData, uploadLocationObject) {
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

const insertTbmknoRecord = function(primaryKey, requestData) {
    let currentDatetime = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    if (requestData.sampling === 'on' || requestData.sampling === '1' || requestData.sampling === 1) {
        requestData.sampling = 1;
    } else {
        requestData.sampling = 0;
    }
    let potentialFieldList = ['sampling', 'machno', 'glassProdLineID', 'schedate', 'prd_no', 'orderQty'];
    let fieldString = 'id';
    let valueString = '\'' + primaryKey + '\'';
    potentialFieldList.forEach(function(potentialField) {
        if ((requestData[potentialField] !== undefined) && (requestData[potentialField] !== '')) {
            fieldString += ',' + potentialField;
            valueString += ',\'' + requestData[potentialField] + '\'';
        }
    });
    fieldString += ',created,modified';
    valueString += ',\'' + currentDatetime + '\',\'' + currentDatetime + '\'';
    return `INSERT INTO productionHistory.dbo.tbmkno (${fieldString}) VALUES(${valueString});`;
};

const getExistingIsProdDataRecord = function(recordID) {
    return `SELECT a.*,b.orderQty,c.PRDT_SNM AS mockProdReference FROM productionHistory.dbo.isProdData a LEFT JOIN productionHistory.dbo.tbmkno b ON a.id=b.id LEFT JOIN productionHistory.dbo.isProdDataGlassRun c ON a.id=c.id WHERE a.id='${recordID}';`;
};

const getISProdDataRecord = function(recordID) {
    return 'SELECT * FROM productionHistory.dbo.isProdData WHERE id=\'' + recordID + '\';';
};

const getTbmknoRecord = function(recordID) {
    return 'SELECT * FROM productionHistory.dbo.tbmkno WHERE id=\'' + recordID + '\';';
};

const deleteIsProdDataRecord = function(recordID) {
    return `DELETE FROM productionHistory.dbo.isProdData WHERE id='${recordID}';`;
};

const deleteTbmknoRecord = function(recordID) {
    return `DELETE a FROM productionHistory.dbo.tbmkno a LEFT JOIN productionHistory.dbo.productionHistory b ON a.id=b.id WHERE a.id='${recordID}' AND b.id IS NULL;`;
};

const checkTbmknoAvailability = function(machno, prd_no, schedate) {
    return `SELECT * FROM productionHistory.dbo.isProdDataGlassRun WHERE machno='${machno}' AND prd_no='${prd_no}' AND schedate='${schedate}';`;
};

const deleteIsProdDataPhoto = function(recordID, photoType) {
    return `UPDATE productionHistory.dbo.isProdData SET ${photoType}=NULL WHERE id='${recordID}';`;
};

module.exports = {
    // deletePhoto: deletePhoto,
    checkTbmknoAvailability: checkTbmknoAvailability,
    deleteIsProdDataRecord: deleteIsProdDataRecord,
    deleteTbmknoRecord: deleteTbmknoRecord,
    deleteIsProdDataPhoto: deleteIsProdDataPhoto,
    erpPrdt: erpPrdt,
    getExistingIsProdDataRecord: getExistingIsProdDataRecord,
    getGlassRunRecordset: 'SELECT * FROM productionHistory.dbo.isProdDataGlassRun ORDER BY schedate DESC,PRDT_SNM;',
    getISProdDataRecord: getISProdDataRecord,
    getTbmknoRecord: getTbmknoRecord,
    // getISProdDataRecordset: 'SELECT * FROM productionHistory.dbo.isProdData;',
    // updateGlassRunRecord: updateGlassRunRecord,
    insertIsProdDataRecord: insertIsProdDataRecord,
    insertTbmknoRecord: insertTbmknoRecord
};

/*


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
