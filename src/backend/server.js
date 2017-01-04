let bodyParser = require('body-parser');
const cors = require('cors');
const clone = require('clone');
const express = require('express');
const fs = require('fs');
// const morgan = require('morgan');
const moment = require('moment-timezone');
const multer = require('multer');
const numeral = require('numeral');
const httpRequest = require('request-promise');
const favicon = require('serve-favicon');
const uuid = require('uuid/v4');

const database = require('./module/database.js');
const serverConfig = require('./module/serverConfig.js');
const utility = require('./module/utility.js');

let formControlData = {
    isProdData: require('./model/isProdData/controlConfiguration.js')
};
let imageDirData = {
    isProdData: require('./model/isProdData/imageDir.js')
};
let queryString = require('./model/queryString.js');

let app = express();
app.use(cors()); // allow cross origin request
// app.use(morgan('dev')); // log request and result to console
app.use(bodyParser.urlencoded({
    extended: true
})); // parse application/x-www-form-urlencoded
// var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json()); // parse application/json
app.use(favicon(__dirname + '/../public/upgiLogo.png')); // middleware to serve favicon
// at start up, make sure that the file structure to hold image exists and starts image server
let fileStructureValidated = false;

imageDirData.isProdData.configuration.upload = multer({
    dest: imageDirData.isProdData.configuration.multerUploadDest
});
if (fileStructureValidated !== true) {
    for (let objectIndex in imageDirData) {
        imageDirData[objectIndex].configuration.pathList.forEach(function(path) {
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            app.use(imageDirData[objectIndex].configuration.publicUrl + path, express.static('./' + path)); // serve static image files
        });
        console.log('directory processed for: ' + imageDirData[objectIndex].configuration.id);
    }
    fileStructureValidated = true;
}

app.get('/status', function(request, response) { // serve system status information
    return response.status(200).json({
        system: serverConfig.systemReference,
        status: 'online',
        timestamp: moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
    });
});

app.use('/productionHistory/isProdDataForm', express.static('./public')); // serve static files
app.use('/productionHistory/isProdDataForm/bower_components', express.static('./bower_components')); // serve static files

app.get('/erp/prdt', function(request, response) { // serve erp DB_U105.dbo.PRDT data
    database.executeQuery(queryString.erpPrdt(request.query.term), function(prdtData, error) {
        if (error) {
            utility.alertSystemError('universalForm', 'route /erp/prdt', error);
            return response.status(500).json([{}]);
        }
        return response.status(200).json(prdtData);
    });
});

app.get('/formControlData/formReference/:formReference', function(request, response) { // serve form control configuration data
    // load and create form control option data for <select> id: glassRun
    database.executeQuery(queryString.getGlassRunRecordset, function(glassRunRecordset, error) {
        if (error) {
            utility.alertSystemError('univeralForm/isProdDataForm', 'controlConfiguration/getGlassRun', error);
            console.log('getGlassRun failure: ' + error);
            return response.status(500).json(formControlData[request.params.formReference]);
        }
        let glassRunOptionList = {
            id: 'glassRun',
            attribute: true,
            optionList: []
        };
        glassRunRecordset.forEach(function(glassRunRecord) {
            let value = `${moment(glassRunRecord.schedate, 'YYYY/MM/DD').format('YYYY-MM-DD')} ${glassRunRecord.glassProdLineID} ${glassRunRecord.PRDT_SNM}`;
            let text = `${moment(glassRunRecord.schedate, 'YYYY/MM/DD').format('YYYY-MM-DD')} - ${glassRunRecord.glassProdLineID}[${glassRunRecord.PRDT_SNM}]`;
            if (glassRunRecord.orderQty === null) {
                text += ' 不詳';
            } else {
                text += ` ${numeral(glassRunRecord.orderQty).format('0,0')}`;
            }
            if (glassRunRecord.existingIsProdDataRecord === 1) {
                text += ' *';
            }
            if (glassRunRecord.sampling === 1) {
                text += ' (試)';
            }
            glassRunOptionList.optionList.push({
                value: value,
                text: text,
                id: glassRunRecord.id,
                sampling: glassRunRecord.sampling,
                machno: glassRunRecord.machno,
                glassProdLineID: glassRunRecord.glassProdLineID,
                schedate: moment(glassRunRecord.schedate, 'YYYY/MM/DD').format('YYYY-MM-DD'),
                prd_no: glassRunRecord.prd_no,
                PRDT_SNM: glassRunRecord.PRDT_SNM,
                orderQty: glassRunRecord.orderQty,
                source: glassRunRecord.source,
                existingIsProdDataRecord: glassRunRecord.existingIsProdDataRecord
            });
        });
        let formControlDataCopy = clone(formControlData[request.params.formReference]);
        formControlDataCopy.selectOptionListArray.push(glassRunOptionList);
        return response.status(200).json(formControlDataCopy);
    });
});

app.put('/productionHistory/isProdDataForm/id/:id', imageDirData.isProdData.configuration.upload.any(), function(request, response) {
    let primaryKey = request.params.id;
    let uploadLocationObject = {};
    let recordSelectValue = `${request.body.schedate} ${request.body.glassProdLineID} ${request.body.mockProdReference}`;
    if (request.files.length === 0) {
        console.log('no file upload received...');
        return updateRecord(primaryKey, request.body, null);
    } else {
        request.files.forEach(function(file) {
            uploadLocationObject[file.fieldname] = file.destination + file.fieldname + '/' + primaryKey + '.JPG';
            fs.rename(file.path, uploadLocationObject[file.fieldname], function(error) {
                if (error) {
                    console.log('photo upload failure: ' + error);
                    alertSystemError('universalForm/isProdDataForm', 'updateRecord/photoUpload isProdData', error);
                    return response.status(500).send('photo upload failure: ' + error);
                } else {
                    console.log('photo uploaded');
                }
            });
        });
        return updateRecord(primaryKey, request.body, uploadLocationObject);
    }

    function updateRecord(primaryKeyString, requestData, uploadPathObject) {
        // problem with javascript 'formData' object not sending unchecked boxes any value
        // causing problems with update, manually insert a blank value for the checkbox controls
        if (requestData.conveyorHeating === undefined) {
            requestData['conveyorHeating'] = '';
        }
        if (requestData.crossBridgeHeating === undefined) {
            requestData['crossBridgeHeating'] = '';
        }
        database.executeQuery(queryString.updateIsProdDataRecord(primaryKeyString, requestData, uploadPathObject), function(data, error) {
            if (error) {
                return response.status(500).send('error updating isProdData: ' + error).end();
            }
            console.log('isProdDataFrom update completed...');
            return response.status(200).send({
                value: recordSelectValue,
                id: primaryKey
            });
        });
    }
});

app.post('/productionHistory/isProdDataForm/insertRecord/tableReference/isProdData/id/:id', imageDirData.isProdData.configuration.upload.any(), function(request, response) {
    let primaryKey = request.params.id;
    let uploadLocationObject = {};
    let newRecordSelectValue = `${request.body.schedate} ${request.body.glassProdLineID} ${request.body.mockProdReference}`;
    if (request.files.length === 0) {
        insertRecord(primaryKey, request.body, null);
    } else {
        request.files.forEach(function(file) {
            uploadLocationObject[file.fieldname] = file.destination + file.fieldname + '/' + primaryKey + '.JPG';
            fs.rename(file.path, uploadLocationObject[file.fieldname], function(error) {
                if (error) {
                    console.log('photo upload failure: ' + error);
                    alertSystemError('universalForm/isProdDataForm', 'createRecord/photoUpload isProdData', error);
                    return response.status(500).send('photo upload failure: ' + error);
                } else {
                    console.log('photo uploaded');
                }
            });
        });
        insertRecord(primaryKey, request.body, uploadLocationObject);
    }

    function insertRecord(primaryKey, requestData, uploadLocationObject) {
        database.executeQuery(queryString.insertIsProdDataRecord(primaryKey, requestData, uploadLocationObject), function(data, error) {
            if (error) {
                alertSystemError('universalForm/isProdDataForm', 'createRecord/insertRecord isProdData', error);
                return response.status(500).send('error inserting isProdData: ' + error);
            }
            console.log('isProdDataFrom insert completed...');
            return response.status(200).send({
                value: newRecordSelectValue,
                id: primaryKey
            });
        });
    }
});

app.post('/productionHistory/isProdDataForm/insertRecord/tableReference/tbmkno/id/:id', function(request, response) {
    console.log(request.body);
    database.executeQuery(queryString.insertTbmknoRecord(request.params.id, request.body), function(data, error) {
        if (error) {
            alertSystemError('universalForm/isProdDataForm', 'createRecord/insertRecord tbmkno', error);
            return response.status(500).send('error inserting tbmkno: ' + error);
        }
        return response.status(200).send('tbmkno insert success');
    });
});

app.get('/productionHistory/isProdDataForm/recordID/:recordID', function(request, response) {
    if ((request.params.recordID === null) || (request.params.recordID === undefined) || (request.params.recordID === '')) {
        console.log('recordID not specified');
        return response.status(500).json({});
    }
    let recordID = request.params.recordID;
    database.executeQuery(queryString.getExistingIsProdDataRecord(recordID), function(existingIsProdDataRecord, error) {
        if (error) {
            console.log('database operation failure on isProdData/tbmkno lookup: ' + error);
            return response.status(500).json([{}]);
        }
        for (let objectIndex in existingIsProdDataRecord[0]) {
            if (existingIsProdDataRecord[0][objectIndex] === null) {
                delete existingIsProdDataRecord[0][objectIndex];
            }
            delete existingIsProdDataRecord[0]['created'];
            delete existingIsProdDataRecord[0]['modified'];
            if (existingIsProdDataRecord[0]['recordDate'] !== null) {
                existingIsProdDataRecord[0]['recordDate'] = moment(existingIsProdDataRecord[0]['recordDate'], 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD');
            }
            if (existingIsProdDataRecord[0]['schedate'] !== null) {
                existingIsProdDataRecord[0]['schedate'] = moment(existingIsProdDataRecord[0]['schedate'], 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('YYYY-MM-DD');
            }
        }
        return response.status(200).json(existingIsProdDataRecord);
    });
});

app.delete('/productionHistory/isProdDataForm/recordID/:recordID', function(request, response) {
    // delete from isProdData table
    database.executeQuery(queryString.deleteIsProdDataRecord(request.params.recordID), function(error) {
        if (error) {
            return response.status(500).send('error deleting isProdData record: ' + error).end();
        }
        imageDirData.isProdData.configuration.pathList.forEach(function(path) {
            if (!utility.fileRemoval(path + '/' + request.params.recordID + '.JPG')) {
                console.log('error removing photos...');
            }
        });
        // delete the record from tbmkno where id is in the parameter is not found in 'productionHistory.dbo.productionHistory'
        database.executeQuery(queryString.deleteTbmknoRecord(request.params.recordID), function(error) {
            if (error) {
                return response.status(500).send('error deleting tbmkno record: ' + error).end();
            }
            console.log('record deleted...');
            return response.status(200).end('success');
        });
    });
});

app.get('/productionHistory/isProdDataForm/deletePhoto/recordID/:recordID/photoType/:photoType', function(request, response) {
    database.executeQuery(queryString.deleteIsProdDataPhoto(request.params.recordID, request.params.photoType), function(error) {
        if (error) {
            console.log('photo data reference removal failure: ' + error);
            return response.status(500).json({
                photoType: request.params.photoType,
                success: false,
                error: error
            });
        }
        let imageFilePath = 'image/isProdDataForm/' + request.params.photoType + '/';
        utility.fileRemoval(imageFilePath + request.params.recordID + '.JPG', function() {
            console.log('photo deleted');
            return response.status(200).json({
                photoType: request.params.photoType,
                success: true
            });
        });
    });
});

app.get('/productionHistory/isProdDataForm/document/recordID/:recordID', function(request, response) {
    database.executeQuery(queryString.getExistingIsProdDataRecord(request.params.recordID), function(data, error) {
        if (error) {
            return response.status(500).send(`<p>資料編號 ${request.params.recordID} 讀取發生錯誤:</p><p>${error}</p>`);
        }
        console.log(data);
        return response.status(200).sendFile(__dirname + '/view/isProdDataForm.html');
    });
});

app.listen(serverConfig.serverPort, function(error) { // start backend server
    if (error) {
        console.log('error starting universalForm server: ' + error);
    } else {
        console.log('universalForm server in operation... (' + serverConfig.serverUrl + ')');
    }
});

utility.statusReport.start(); // start the server status reporting function
