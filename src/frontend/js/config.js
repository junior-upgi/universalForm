export const systemReference = 'universalForm';
const development = false;

function serverHost() {
    if (development === true) {
        return 'http://localhost'; // development
    } else {
        return 'http://upgi.ddns.net'; // production
    }
}
const serverPort = 9004;
const browserSyncPort = 9994;

function constructServerUrl() {
    if (development === true) {
        return `${serverHost()}:${browserSyncPort}/${systemReference}`; // development
    } else {
        return `${serverHost()}:${serverPort}/${systemReference}`; // production
    }
}

export const portalUrl = 'http://upgi.ddns.net';
export const serverUrl = constructServerUrl();
export const validateUrl = `${serverUrl}/validate`;
export const viewUrl = `${serverUrl}/view`;
