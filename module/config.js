var serverHost = 'http://localhost';
var serverPort = process.env.PORT || 9004;
//var mssqlServerHost = 'http://192.168.168.5'; // access database from LAN (production)
var mssqlServerHost = 'http://127.0.0.1'; // access database through SSH (development)
var mssqlServerPort = process.env.PORT || 1433;
var upgiSystemAccount = 'upgiSystem';
var upgiSystemPassword = 'upgiSystem';

module.exports = {
    serverHost: serverHost,
    serverPort: serverPort,
    serverUrl: serverHost + ':' + serverPort,
    mssqlServerHost: mssqlServerHost,
    mssqlServerPort: mssqlServerPort,
    mssqlServerUrl: mssqlServerHost + ':' + mssqlServerHost,
    upgiSystemAccount: upgiSystemAccount,
    upgiSystemPassword: upgiSystemPassword,

    mssqlConfig: {
        server: mssqlServerHost.slice(7),
        user: upgiSystemAccount,
        password: upgiSystemPassword,
        port: mssqlServerPort
    },

    workingTimezone: 'Asia/Taipei'
};