const serverConfig = require('../module/serverConfig.js');

const list = [{
    id: 0,
    reference: 'isProdDataForm',
    cReference: '生產條件記錄表',
    frontendUrl: `${serverConfig.publicServerUrl}/index.html?formReference=isProdDataForm`,
    hide: false
}, {
    id: 1,
    reference: 'mockForm',
    cReference: '測試記錄表',
    frontendUrl: `${serverConfig.publicServerUrl}/index.html?formReference=mockForm`,
    hide: false
}];

module.exports = {
    list: list
};
