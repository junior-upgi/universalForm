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
var router = express.Router();
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
            app.use('/' + imageDirectory.id + '/' + path, express.static('./' + path)); // serve static image files
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

app.get('/productionHistory/isProdData/recordID/:recordID', function(request, response) {
    console.log(request.params.recordID);
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
        return createRecord(primaryKey, request.body, null);
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
        return createRecord(primaryKey, request.body, uploadLocationObject);
    }

    function createRecord(primaryKeyString, requestData, uploadPathObject) {
        database.executeQuery(queryString.insertGlassRunRecord(
                primaryKeyString, requestData, uploadPathObject),
            function(error) {
                if (error) {
                    return response.status(500).send('error inserting isProdData: ' + error).end();
                }
                console.log('isProdDataFrom insert completed...');
                return response.status(200).redirect(config.serverUrl + '/productionHistory/isProdDataForm');
            });
    };
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