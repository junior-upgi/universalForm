const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');

const serverConfig = require('./module/serverConfig.js');
const utility = require('./module/utility.js');

const upgiSystem = require('./model/upgiSystem.js');

let app = express();
let main = express.Router();
app.use(`/${serverConfig.systemReference}`, main);
main.use(cors()); // allow cross origin request
main.use(morgan('dev')); // log request and result to console
main.use(favicon(path.join(__dirname + '/../public/upgiLogo.png'))); // middleware to serve favicon
main.use('/', express.static(path.join(__dirname + '/../public'))); // serve static files
main.use('/bower_components', express.static(path.join(__dirname + '/../bower_components'))); // serve static files

main.use('/', require('./route/status.js')); // serve system status
main.use('/', require('./route/login.js')); // handles login requests
main.use('/', require('./route/validate.js')); // handles page entry jwt validation
main.use('/', require('./route/systemList.js')); // serve information on forms available on the system

upgiSystem.list.forEach(function(system) { // serve subsystem related routes
    main.use('/', require(`./route/${system.reference}/formConfigData.js`)); // serve form control configuration data
});

app.listen(serverConfig.serverPort, function(error) { // start backend server
    if (error) {
        utility.logger.error(`error starting ${serverConfig.systemReference} server: ${error}`);
    } else {
        utility.logger.info(`${serverConfig.systemReference} server in operation... (${serverConfig.serverUrl})`);
        utility.statusReport.start(); // start the server status reporting function
    }
});
