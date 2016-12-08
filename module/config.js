var serverHost = "http://localhost"; //development
var serverPort = process.env.PORT || 9004;
var serverUrl = serverHost + ":" + serverPort;
//var mssqlServerHost = "http://localhost"; // access database from the internet (development)
var mssqlServerHost = "http://192.168.168.5"; // access database from LAN (production)
var mssqlServerPort = process.env.PORT || 1433;
var mssqlServerUrl = mssqlServerHost + ":" + mssqlServerHost;
var upgiSystemAccount = "upgiSystem";
var upgiSystemPassword = "upgiSystem";

var mssqlConfig = {
    server: mssqlServerHost.slice(7),
    user: upgiSystemAccount,
    password: upgiSystemPassword,
    port: mssqlServerPort
};

const workingTimezone = "Asia/Taipei";

module.exports = {
    serverHost,
    serverPort,
    serverUrl,
    mssqlConfig,
    mssqlServerUrl,
    upgiSystemAccount,
    upgiSystemPassword,
    workingTimezone
};