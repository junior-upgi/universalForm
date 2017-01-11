const systemReference = 'universalForm';
const development = true;
const serverHostname = 'svd13216pwb';

// broadcasting configuration
const botAPIUrl = 'https://api.telegram.org/bot';

function broadcastServerUrl() {
    let broadcastServerPort = 9001;
    if (development === true) {
        return `http://upgi.ddns.net:${broadcastServerPort}/broadcast`; // access broadcast server from internet (development)
    } else {
        return `http://192.168.168.25:${broadcastServerPort}/broadcast`; // access broadcast server from LAN (production)
    }
}
const smtpTransportAccount = 'smtps://junior.upgi@gmail.com:cHApPPZV@smtp.gmail.com';

// server configuration
const serverHost = 'http://localhost';
const serverPort = 9004;
const browserSyncPort = 9994;

function publicServerUrl() {
    if (development === true) {
        return `${serverHost}:${browserSyncPort}/${systemReference}`; // development
    } else {
        return `http://upgi.ddns.net:${serverPort}/${systemReference}`; // production
    }
}

// database access configuration
function mssqlServerHost() {
    if (development === true) {
        return 'http://127.0.0.1'; // access database through SSH (development)
    } else {
        return 'http://192.168.168.5'; // access database from LAN (production)
    }
}
const mssqlServerPort = 1433;
const connectionTimeout = 60000;
const requestTimeout = 60000;

function mssqlServerUrl() {
    if (development === true) {
        return `${mssqlServerHost()}:${mssqlServerPort}`; // access database through SSH (development)
    } else {
        return `${mssqlServerHost()}:${mssqlServerPort}`; // access database from LAN (production)
    }
}
const upgiSystemAccount = 'upgiSystem';
const upgiSystemPassword = 'upgiSystem';

// misc
const workingTimezone = 'Asia/Taipei';
const reportingFrequency = '0 0 6,10,14,18,22 * * *';

// logging
const logDir = 'log';

// ldap
const ldapServerUrl = 'ldap://upgi.ddns.net:389';

function passphrase() { // can be later changed to pull something from other locations
    return 'This is not a passphrase';
}

module.exports = {
    botAPIUrl: botAPIUrl,
    broadcastServerUrl: broadcastServerUrl(),
    browserSyncPort: browserSyncPort,
    development: development,
    ldapServerUrl: ldapServerUrl,
    logDir: logDir,
    mssqlConfig: {
        server: mssqlServerHost().slice(7),
        user: upgiSystemAccount,
        password: upgiSystemPassword,
        port: mssqlServerPort,
        connectionTimeout: connectionTimeout,
        requestTimeout: requestTimeout
    },
    mssqlServerUrl: mssqlServerUrl(),
    passphrase: passphrase(),
    publicServerUrl: publicServerUrl(),
    reportingFrequency: reportingFrequency,
    serverHost: serverHost,
    serverHostname: serverHostname,
    serverPort: serverPort,
    serverUrl: `${serverHost}:${serverPort}`,
    smtpTransportAccount: smtpTransportAccount,
    systemReference: systemReference,
    upgiSystemAccount: upgiSystemAccount,
    upgiSystemPassword: upgiSystemPassword,
    workingTimezone: workingTimezone
};
