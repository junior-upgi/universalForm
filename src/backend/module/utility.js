const fs = require('fs');
const cron = require('node-cron')
const moment = require('moment-timezone');
const httpRequest = require('request-promise');
const uuid = require('uuid/v4');
const winston = require('winston');

// const database = require('./database.js');
const serverConfig = require('./serverConfig.js');

const telegramUser = require('../model/telegramUser.js');
const telegramBot = require('../model/telegramBot.js');

// Create the log directory if it does not exist
if (!fs.existsSync(serverConfig.logDir)) {
    fs.mkdirSync(serverConfig.logDir);
}
const logger = new(winston.Logger)({
    transports: [
        // colorize the output to the console
        new(winston.transports.Console)({
            timestamp: function() {
                return moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            },
            colorize: true,
            level: 'debug'
        }),
        new(winston.transports.File)({
            filename: `${serverConfig.logDir}/results.log`,
            timestamp: function() {
                return moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
            },
            level: serverConfig.development ? 'debug' : 'info'
        })
    ]
});

let statusReport = cron.schedule('0 0,30 0,6-23 * * *', function() {
    logger.info(`${serverConfig.systemReference} reporting mechanism triggered`);
    let issuedDatetime = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    let message = `${issuedDatetime} ${serverConfig.systemReference} server reporting in from ${serverConfig.serverHostname}`;
    httpRequest({
        method: 'post',
        uri: serverConfig.botAPIUrl + telegramBot.getToken('upgiITBot') + '/sendMessage',
        body: {
            chat_id: telegramUser.getUserID('蔡佳佑'),
            text: `${message}`,
            token: telegramBot.getToken('upgiITBot')
        },
        json: true
    }).then(function(response) {
        logger.verbose(`${message}`);
        return logger.info(`${serverConfig.systemReference} reporting mechanism completed`);
    }).catch(function(error) {
        // alertSystemError('statusReport', error);
        return logger.error(`${serverConfig.systemReference} reporting mechanism failure ${error}`);
    });
}, false);

function alertSystemError(systemReference, functionReference, errorMessage) {
    let currentDatetime = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    let messageHeading = httpRequest({ // broadcast alert when error encountered
        method: 'post',
        uri: serverConfig.broadcastAPIUrl,
        form: {
            chat_id: telegramUser.getUserID('蔡佳佑'),
            text: `error encountered while executing [${systemReference}][${functionReference}] @ ${currentDatetime}`,
            token: telegramBot.getToken('upgiITBot')
        }
    });
    let messageBody = httpRequest({
        method: 'post',
        uri: serverConfig.broadcastAPIUrl,
        form: {
            chat_id: telegramUser.getUserID('蔡佳佑'),
            text: `${errorMessage}`,
            token: telegramBot.getToken('upgiITBot')
        }
    });
    messageHeading().then(function() {
        return messageBody();
    }).then(function() {
        return console.log('error message had been alerted');
    }).catch(function(error) {
        return console.log(error);
    });
}

function fileRemoval(completeFilePath, callback) {
    console.log(completeFilePath);
    fs.unlink(completeFilePath, function(error) {
        if (error !== null) {
            console.log('file removal failure (may not be critical failure): ' + error);
            return false;
        } else {
            console.log(completeFilePath + ' removed successfully');
            if (callback === undefined) {
                return true;
            } else {
                callback();
            }
        }
    });
}

module.exports = {
    alertSystemError: alertSystemError,
    fileRemoval: fileRemoval,
    statusReport: statusReport
};
