const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');

const serverConfig = require('./module/serverConfig.js');
const utility = require('./module/utility.js');

let app = express();
let router = express.Router();
app.use(`/${serverConfig.systemReference}`, router);
router.use(cors()); // allow cross origin request
router.use(morgan('dev')); // log request and result to console
router.use(favicon(path.join(__dirname + '/../public/upgiLogo.png'))); // middleware to serve favicon
router.use('/', express.static(path.join(__dirname + '/../public'))); // serve static files
router.use('/bower_components', express.static(path.join(__dirname + '/../bower_components'))); // serve static files

router.use('/', require('./route/status.js')); // serve system status
router.use('/', require('./route/login.js')); // handles login requests
router.use('/', require('./route/validate.js')); // handles page entry jwt validation

router.use('/', require('./route/systemList.js')); // serve information on forms available on the system

app.listen(serverConfig.serverPort, function(error) { // start backend server
    if (error) {
        utility.logger.error(`error starting ${serverConfig.systemReference} server: ${error}`);
    } else {
        utility.logger.info(`${serverConfig.systemReference} server in operation... (${serverConfig.serverUrl})`);
        utility.statusReport.start(); // start the server status reporting function
    }
});
