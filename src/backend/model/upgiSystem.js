const serverConfig = require('../module/serverConfig.js');

const list = [{
    id: 0,
    reference: 'isProdDataForm',
    cReference: '生產條件記錄表',
    frontendUrl: `${serverConfig.publicServerUrl}/index.html?formReference=isProdDataForm`,
    hide: false
}];

module.exports = {
    list: list
};
