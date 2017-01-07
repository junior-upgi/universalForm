const serverConfig = require('../module/serverConfig.js');

const list = [{
    id: 0,
    reference: 'broadcast',
    cReference: 'Telegram推播服務',
    functionList: [],
    frontendUrl: 'http://upgi.ddns.net:9001/broadcast',
    hide: true
}, {
    id: 1,
    reference: 'overdueMonitor',
    cReference: '逾期款監控系統',
    functionList: [],
    frontendUrl: 'http://upgi.ddns.net:9003/overdueMonitor/index.html',
    hide: true
}, {
    id: 2,
    reference: 'seedCount',
    cReference: '氣泡數監控系統',
    functionList: [],
    frontendUrl: 'http://upgi.ddns.net:9002/seedCount/index',
    hide: true
}, {
    id: 3,
    reference: 'universalForm',
    cReference: '製造課生產條件記錄表',
    functionList: [],
    frontendUrl: 'http://upgi.ddns.net:9004/productionHistory/isProdDataForm/index.html?formReference=isProdData',
    hide: true
}, {
    id: 4,
    reference: 'wasteReduction',
    cReference: '七大浪費',
    functionList: [],
    frontendUrl: 'http://upgi.ddns.net/wasteReduction',
    hide: true
}, {
    id: 6,
    reference: 'ldapValidation',
    cReference: 'LDAP驗證服務',
    functionList: [],
    frontendUrl: 'http://upgi.ddns.net:9005/ldapValidation/login.html',
    hide: true
}, {
    id: 7,
    reference: 'rawMaterial',
    cReference: '原物料採購管理系統',
    functionList: [],
    frontendUrl: `${serverConfig.publicServerUrl}/index.html`,
    hide: false
}];

module.exports = {
    list: list
};
