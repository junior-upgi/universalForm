const cors = require('cors');
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const favicon = require('serve-favicon');

const serverConfig = require('./module/serverConfig.js');
const utility = require('./module/utility.js');

let app = express();
let main = express.Router();
app.use(`/${serverConfig.systemReference}`, main);
main.use(cors()); // allow cross origin request
main.use(morgan('dev')); // log request and result to console
main.use(favicon(path.join(__dirname + '/../public/upgiLogo.png'))); // middleware to serve favicon
main.use('/', express.static(path.join(__dirname + '/../public'))); // serve static files
main.use('/bower_components', express.static(path.join(__dirname + '/../bower_components'))); // serve static files

// initialize image directory
const imageDirData = { isProdDataForm: require('./model/isProdDataForm/imageDir.js') };
let fileStructureValidated = false;
if (fileStructureValidated !== true) {
    for (let objectIndex in imageDirData) {
        imageDirData[objectIndex].configuration.upload = multer({
            dest: imageDirData[objectIndex].configuration.multerUploadDest
        });
        imageDirData[objectIndex].configuration.pathList.forEach(function(indexedPath) {
            if (!fs.existsSync(indexedPath)) {
                fs.mkdirSync(indexedPath);
            }
            // serve static image files
            main.use(`/${indexedPath}`, express.static(path.join(__dirname + `/../${indexedPath}`)));
        });
        utility.logger.info('directory processed for: ' + imageDirData[objectIndex].configuration.id);
    }
    fileStructureValidated = true;
}

main.use('/', require('./route/status.js')); // serve system status
main.use('/', require('./route/login.js')); // handles login requests
main.use('/', require('./route/validate.js')); // handles page entry jwt validation
main.use('/', require('./route/systemList.js')); // serve information on forms available on the system

main.use('/', require('./route/isProdDataForm/formConfigData.js')); // serve form control configuration data
main.use('/', require('./route/isProdDataForm/getRecordData.js')); // specific record query
main.use('/', require('./route/isProdDataForm/isProdDataInsert.js')); // insert new record into productionHistory.dbo.isProdData
main.use('/', require('./route/isProdDataForm/deleteRecord.js')); // delete record
main.use('/', require('./route/isProdDataForm/deletePhoto.js')); // delete photo

app.listen(serverConfig.serverPort, function(error) { // start backend server
    if (error) {
        utility.logger.error(`error starting ${serverConfig.systemReference} server: ${error}`);
    } else {
        utility.logger.info(`${serverConfig.systemReference} server in operation... (${serverConfig.serverUrl})`);
        utility.statusReport.start(); // start the server status reporting function
    }
});
