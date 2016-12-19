let bodyParser = require('body-parser');
let cors = require('cors');
let express = require('express');
// let fs = require('fs');
let morgan = require('morgan');
// let moment = require('moment-timezone');
// let multer = require('multer');
let favicon = require('serve-favicon');
let uuid = require('uuid');

let database = require('./module/database.js');
let serverConfig = require('./module/serverConfig.js');
let utility = require('./module/utility.js');

let formControlData = {
    isProdData: require('./model/isProdData/controlConfiguration.js')
};
let glassProdLine = require('./model/glassProdLine.js');
// let queryString = require('./model/queryString.js');

let app = express();
app.use(cors()); // allow cross origin request
app.use(morgan('dev')); // log request and result to console
app.use(bodyParser.urlencoded({
    extended: true
})); // parse application/x-www-form-urlencoded
// var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json()); // parse application/json
app.use(favicon(__dirname + '/../public/upgiLogo.png')); // middleware to serve favicon

app.get('/status', function(request, response) { // serve system status information
    return response.status(200).json({
        system: serverConfig.systsem,
        status: 'online'
    });
});

app.use('/productionHistory/isProdDataForm', express.static('./public')); // serve static files

app.get('/erp/prdt', function(request, response) { // serve erp DB_U105.dbo.PRDT data
    database.executeQuery('SELECT PRD_NO,SNM FROM DB_U105.dbo.PRDT WHERE PRD_NO LIKE \'B[0-9][0-9][0-9][0-9][0-9]__\';', function(prdtData, error) {
        if (error) {
            utility.alertSystemError('universalForm', 'route /erp/prdt', error);
            return response.status(500).json([{}]);
        }
        return response.status(200).json(prdtData);
    });
});

app.get('/data/glassProdLine', function(request, response) {
    return response.status(200).json(glassProdLine.list);
});

app.get('/formControlData/formReference/:formReference', function(request, response) { // serve form control configuration data
    return response.status(200).json(formControlData[request.params.formReference]);
});

app.post('/productionHistory/isProdDataForm/createRecord', function(request, response) {
    let newUuid = uuid.v4();
    return response.status(200).redirect(serverConfig.publicServerUrl + '/productionHistory/isProdDataForm?formReference=isProdData&id=' + newUuid);
});

app.listen(serverConfig.serverPort, function(error) { // start backend server
    if (error) {
        console.log('error starting universalForm server: ' + error);
    } else {
        console.log('universalForm server in operation... (' + serverConfig.serverUrl + ')');
    }
});

/*
// at start up, make sure that the file structure to hold image exists and starts image server
let fileStructureValidated = false;
let imageDirectoryList = [{
    id: 'isProdDataForm',
    pathList: [
        'image/isProdDataForm/bmCoolingStack',
        'image/isProdDataForm/fmCoolingStack',
        'image/isProdDataForm/gobShape'
    ],
    upload: multer({ dest: 'image/isProdDataForm' + '/' })
}];
if (fileStructureValidated !== true) {
    imageDirectoryList.forEach(function(imageDirectory) {
        imageDirectory.pathList.forEach(function(path) {
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            app.use('/productionHistory/' + path, express.static('./' + path)); // serve static image files
        });
        console.log('directory created for: ' + imageDirectory.id);
    });
    fileStructureValidated = true;
}

app.get('/productionHistory/glassRun', function(request, response) {
    database.executeQuery(queryString.getGlassRunRecordset, function(glassRunRecordset, error) {
        if (error) {
            return response.status(500).json([]).end();
        }
        return response.status(200).json(glassRunRecordset);
    });
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

app.get('/productionHistory/isProdData/recordID/:recordID', function(request, response) {
    if (request.params.recordID === 'all') {
        database.executeQuery(queryString.getISProdDataRecordset, function(isProdDataRecordset, error) {
            if (error) {
                return response.status(500).json([]).end();
            }
            return response.status(200).json(isProdDataRecordset);
        });
    } else {
        if (request.params.recordID) {
            database.executeQuery(queryString.getISProdDataRecord(request.params.recordID), function(isProdDataRecord, error) {
                if (error) {
                    console.log('getISProdDataRecord() failed: ' + error);
                    return response.status(500).json({}).end();
                }
                return response.status(200).json(isProdDataRecord[0]);
            });
        } else {
            console.log('getISProdDataRecord()\'s recordID invalid');
            return response.status(500).json({}).end();
        }
    }
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

app.delete('/productionHistory/isProdData', function(request, response) {
    database.executeQuery('DELETE FROM productionHistory.dbo.isProdData WHERE id=\'' + request.body.recordID + '\';', function(error) {
        if (error) {
            return response.status(500).send('error deleting isProdData record: ' + error).end();
        }
        imageDirectoryList[0].pathList.forEach(function(path) {
            if (!utility.fileRemoval(path + '/' + request.body.recordID + '.JPG')) {
                console.log('error removing photos...');
            }
        });
        console.log('record deleted...');
        response.status(200).send(serverConfig.publicServerUrl + '/productionHistory/isProdDataForm');
    });
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
