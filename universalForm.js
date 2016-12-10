'use strict';

var bodyParser = require('body-parser');
var cors = require('cors');
var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var moment = require('moment-timezone');
var multer = require('multer');

var config = require('./module/config.js');
var database = require('./module/database.js');
var queryString = require('./model/queryString.js');
var utility = require('./module/utility.js')

var app = express();
app.use(cors()); // allow cross origin request
app.use(morgan('dev')); // log request and result to console
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json()); // parse application/json

// at start up, make sure that the file structure to hold image exists and starts image server
var fileStructureValidated = false;
var imageDirectoryList = [{
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
        var imageFilePath = 'image/isProdDataForm/' + request.params.fieldName + '/';
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
            console.log("getISProdDataRecord()'s recordID invalid");
            return response.status(500).json({}).end();
        }
    }
});

app.post('/productionHistory/isProdData', imageDirectoryList[0].upload.any(), function(request, response) {
    console.log(moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + ' received POST request on /glassRun');
    var primaryKey = utility.uuidGenerator();
    var uploadLocationObject = {};
    if (request.files.length === 0) {
        console.log('no file upload received...');
        return insertRecord(primaryKey, request.body, null);
    } else {
        request.files.forEach(function(file, index) {
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
        console.log(queryString.insertGlassRunRecord(primaryKeyString, requestData, uploadPathObject));
        database.executeQuery(queryString.insertGlassRunRecord(primaryKeyString, requestData, uploadPathObject),
            function(error) {
                if (error) {
                    return response.status(500).send('error inserting isProdData: ' + error).end();
                }
                console.log('isProdDataFrom insert completed...');
                return response.status(200).redirect(config.publicServerUrl + '/productionHistory/isProdDataForm');
            });
    };
});

app.put('/productionHistory/isProdData', imageDirectoryList[0].upload.any(), function(request, response) {
    console.log(moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss') + ' received PUT request on /glassRun');
    var primaryKey = request.body.glassRun;
    var uploadLocationObject = {};
    if (request.files.length === 0) {
        console.log('no file upload received...');
        return updateRecord(primaryKey, request.body, null);
    } else {
        request.files.forEach(function(file, index) {
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
                return response.status(200).send(config.publicServerUrl + '/productionHistory/isProdDataForm');
            });
    };
});

app.delete('/productionHistory/isProdData', function(request, response) {
    database.executeQuery("DELETE FROM productionHistory.dbo.isProdData WHERE id='" + request.body.recordID + "';", function(error) {
        if (error) {
            return response.status(500).send('error deleting isProdData record: ' + error).end();
        }
        imageDirectoryList[0].pathList.forEach(function(path) {
            if (!utility.fileRemoval(path + '/' + request.body.recordID + '.JPG')) {
                console.log('error removing photos...');
            }
        });
        console.log('record deleted...');
        response.status(200).send(config.publicServerUrl + '/productionHistory/isProdDataForm');
    });
});

app.use('/productionHistory/isProdDataForm/favicon', express.static(__dirname + '/public/image')); // serve static image
app.use('/productionHistory/isProdDataForm/css', express.static(__dirname + '/public/css')); // serve static image
app.use('/productionHistory/isProdDataForm/js', express.static(__dirname + '/public/js')); // serve frontend javascript
app.get('/productionHistory/isProdDataForm', function(request, response) { // serve form
    response.status(200).sendFile(__dirname + '/view/isProdDataForm.html');
});
app.get('/productionHistory/isProdDataForm/reload', function(request, response) { // serve fresh copy of the form html code
    var formHTML = fs.readFileSync(__dirname + '/view/isProdDataFormBody.html');
    response.status(200).send(formHTML);
});

app.listen(config.serverPort, function(error) { // start backend server
    if (error) {
        console.log('error starting universalForm server: ' + error);
    } else {
        console.log('universalForm server in operation... (' + config.serverUrl + ')');
    }
});