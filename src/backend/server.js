let bodyParser = require('body-parser');
let cors = require('cors');
let clone = require('clone');
let express = require('express');
let fs = require('fs');
let morgan = require('morgan');
let moment = require('moment-timezone');
let multer = require('multer');
let numeral = require('numeral');
let favicon = require('serve-favicon');
// let uuid = require('uuid/v4');

let database = require('./module/database.js');
let serverConfig = require('./module/serverConfig.js');
let utility = require('./module/utility.js');

let formControlData = {
    isProdData: require('./model/isProdData/controlConfiguration.js')
};
let imageDirData = {
    isProdData: require('./model/isProdData/imageDir.js')
};
let queryString = require('./model/queryString.js');

let app = express();
app.use(cors()); // allow cross origin request
app.use(morgan('dev')); // log request and result to console
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
        console.log('directory created for: ' + imageDirData[objectIndex].configuration.id);
    }
    fileStructureValidated = true;
}

app.get('/status', function(request, response) { // serve system status information
    return response.status(200).json({
        system: serverConfig.systsem,
        status: 'online'
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

app.post('/productionHistory/isProdDataForm/insertRecord/tableReference/isProdData/id/:id', imageDirData.isProdData.configuration.upload.any(), function(request, response) {
    let primaryKey = request.params.id;
    let uploadLocationObject = {};
    let newRecordSelectValue = `${request.body.schedate} ${request.body.glassProdLineID} ${request.body.mockProdReference}`;
    if (request.files.length === 0) {
        console.log('come on!!!!');
        insertRecord(primaryKey, request.body, null);
    } else {
        request.files.forEach(function(file) {
            uploadLocationObject[file.fieldname] = file.destination + file.fieldname + '/' + primaryKey + '.JPG';
            fs.rename(file.path, uploadLocationObject[file.fieldname], function(error) {
                if (error) {
                    console.log('photo upload failure: ' + error);
                    alertSystemError('universalForm/isProdDataForm', 'createRecord/photoUpload isProdData', error);
                    return response.status(500).send('photo upload failure: ' + error);
                }
            });
        });
        insertRecord(primaryKey, request.body, uploadLocationObject);
    }

    function insertRecord(primaryKey, requestData, uploadLocationObject) {
        console.log('come on 2!!!!');
        database.executeQuery(queryString.insertIsProdDataRecord(primaryKey, requestData, uploadLocationObject), function(data, error) {
            if (error) {
                alertSystemError('universalForm/isProdDataForm', 'createRecord/insertRecord isProdData', error);
                return response.status(500).send('error inserting isProdData: ' + error);
            }
            console.log('come on 3!!!!');
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

/*
    database.executeQuery(queryString.checkTbmknoAvailability(requestData.machno, requestData.prd_no, requestData.schedate), function(data, error) {
        if (error) {
            alertSystemError('insertRecord', 'checkTbmknoAvailability', error);
            return response.status(500).send('error checking if record exists in the ERP tbmkno: ' + error);
        }
        if (data.length === 1) { // found one single record
            if (data[0].existingIsProdDataRecord !== 0) {
                if (data[0].source === 'generated') { // non-existing record with generated source

                } else { // non-existing record with original ERP tbmkno as source
                }
            } else { // error, an existing record exists
                alertSystemError('universalForm/isProdDataForm', 'createRecord/insertRecord existing record found', error);
                return response.status(500).send('trying to create record when it already exists: ' + error);
            }
        } else if (data.length === 0) { // nothing is found (brand new record)
            // insert data into both tbmkno and isProdData
            database.executeQuery(queryString.insertTbmknoRecord(primaryKey, requestData), function(data, error) {
                if (error) {
                    alertSystemError('universalForm/isProdDataForm', 'createRecord/insertRecord', error);
                    return response.status(500).send('error inserting tbmkno data: ' + error);
                }
                database.executeQuery(queryString.insertIsProdDataRecord(primaryKey, requestData, uploadLocationObject), function(data, error) {
                    if (error) {
                        alertSystemError('universalForm/isProdDataForm', 'createRecord/insertRecord', error);
                        return response.status(500).send('error inserting isProdData: ' + error);
                    }
                    return response.status(200).send({
                        value: newRecordSelectValue,
                        id: primaryKey,
                        source: 'generated',
                        existingIsProdDataRecord: 1
                    });
                });
            });
        } else { // more than one record is found
            alertSystemError('insertRecord', 'checkTbmknoAvailability', error);
            return response.status(500).send('more than one match found from ERP tbmkno: ' + error);
        }
    });
}
*/

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
        // delete the record from tbmkno where id is in the parameter and not found in 'productionHistory.dbo.productionHistory'
        database.executeQuery(queryString.deleteTbmknoRecord(request.params.recordID), function(error) {
            if (error) {
                return response.status(500).send('error deleting tbmkno record: ' + error).end();
            }
            console.log('record deleted...');
            return response.status(200).end('success');
        });
    });
});

app.listen(serverConfig.serverPort, function(error) { // start backend server
    if (error) {
        console.log('error starting universalForm server: ' + error);
    } else {
        console.log('universalForm server in operation... (' + serverConfig.serverUrl + ')');
    }
});

/*
app.get('/productionHistory/isProdDataForm/glassRun', function(request, response) {
    database.executeQuery(queryString.getGlassRunRecordset, function(glassRunRecordset, error) {
        if (error) {
            return response.status(500).json([]).end();
        }
        return response.status(200).json(glassRunRecordset);
    });
});

app.post('/productionHistory/isProdData', imageDirectoryList[0].upload.any(), function(request, response) {
    console.log(moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + ' received POST request on /glassRun');
    let primaryKey = utility.uuidGenerator();
    let uploadLocationObject = {};
    if (request.files.length === 0) {
        console.log('no file upload received...');
        return insertRecord(primaryKey, request.body, null);
    } else {
        request.files.forEach(function(file) {
            uploadLocationObject[file.fieldname] = file.destination + file.fieldname + '/' + primaryKey + '.JPG';
            fs.rename(file.path, uploadLocationObject[file.fieldname], function(error) {
                if (error) {
                    console.log('photo upload failure: ' + error);
                    return response.status(500).send('photo upload failure: ' + error);
                } else {
                    console.log('photo uploaded');
                }
            });
        });
        return insertRecord(primaryKey, request.body, uploadLocationObject);
    }

    function insertRecord(primaryKeyString, requestData, uploadPathObject) {
        database.executeQuery(queryString.insertGlassRunRecord(primaryKeyString, requestData, uploadPathObject),
            function(error) {
                if (error) {
                    return response.status(500).send('error inserting isProdData: ' + error).end();
                }
                console.log('isProdDataFrom insert completed...');
                return response.status(200).redirect(serverConfig.publicServerUrl + '/productionHistory/isProdDataForm');
            });
    }
});

app.get('/productionHistory/isProdDataForm/deletePhoto/recordID/:recordID/fieldName/:fieldName', function(request, response) {
    console.log(request.params);
    database.executeQuery(queryString.deletePhoto(request.params.recordID, request.params.fieldName), function(error) {
        if (error) {
            console.log('photo data reference removal failure: ' + error);
            return response.status(500).end();
        }
        let imageFilePath = 'image/isProdDataForm/' + request.params.fieldName + '/';
        utility.fileRemoval(imageFilePath + request.params.recordID + '.JPG', function() {
            console.log('photo deleted');
            return response.status(200).end();
        });
    });
});

app.put('/productionHistory/isProdData', imageDirectoryList[0].upload.any(), function(request, response) {
    console.log(moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + ' received PUT request on /glassRun');
    let primaryKey = request.body.glassRun;
    let uploadLocationObject = {};
    if (request.files.length === 0) {
        console.log('no file upload received...');
        return updateRecord(primaryKey, request.body, null);
    } else {
        request.files.forEach(function(file) {
            uploadLocationObject[file.fieldname] = file.destination + file.fieldname + '/' + primaryKey + '.JPG';
            fs.rename(file.path, uploadLocationObject[file.fieldname], function(error) {
                if (error) {
                    console.log('photo upload failure: ' + error);
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
        database.executeQuery(queryString.updateGlassRunRecord(primaryKeyString, requestData, uploadPathObject),
            function(data, error) {
                if (error) {
                    return response.status(500).send('error updating isProdData: ' + error).end();
                }
                console.log('isProdDataFrom update completed...');
                return response.status(200).send(serverConfig.publicServerUrl + '/productionHistory/isProdDataForm');
            });
    }
});

app.use('/productionHistory/isProdDataForm/favicon', express.static(__dirname + '/public/image')); // serve static image
app.use('/productionHistory/isProdDataForm/css', express.static(__dirname + '/public/css')); // serve static image
app.use('/productionHistory/isProdDataForm/js', express.static(__dirname + '/public/js')); // serve frontend javascript
app.get('/productionHistory/isProdDataForm', function(request, response) { // serve form
    response.status(200).sendFile(__dirname + '/view/isProdDataForm.html');
});
app.get('/productionHistory/isProdDataForm/reload', function(request, response) { // serve fresh copy of the form html code
    let formHTML = fs.readFileSync(__dirname + '/view/isProdDataFormBody.html');
    response.status(200).send(formHTML);
});
*/
