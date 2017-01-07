export const systemReference = 'universalForm';

const development = true;

function serverHost() {
    if (development === true) {
        return 'http://localhost'; // development
    } else {
        return 'http://upgi.ddns.net'; // production
    }
}
const serverPort = 9004;
const browserSyncPort = 9994;

export const viewFileSourceUrl = './view';
export function loginUrl() {
    if (development === true) {
        return `${serverHost()}:${browserSyncPort}/${systemReference}/login`;
    } else {
        return `${serverHost()}:${serverPort}/${systemReference}/login`;
    }
}

export function validateTokenUrl() {
    if (development === true) {
        return `${serverHost()}:${browserSyncPort}/${systemReference}/validateToken`;
    } else {
        return `${serverHost()}:${serverPort}/${systemReference}/validateToken`;
    }
}

export function serverUrl() {
    if (development === true) {
        return `${serverHost()}:${browserSyncPort}/${systemReference}`;
    } else {
        return `${serverHost()}:${serverPort}/${systemReference}`;
    }
}

export const isProdDataInsertUrl = serverUrl + '/productionHistory/isProdDataForm/insertRecord/tableReference/isProdData/id/';
export const tbmknoInsertUrl = serverUrl + '/productionHistory/isProdDataForm/insertRecord/tableReference/tbmkno/id/';
export function deletePhotoUrl(recordID, photoType) {
    return `${serverUrl}/productionHistory/isProdDataForm/deletePhoto/recordID/${recordID}/photoType/${photoType}`;
}
export function isProdDataUpdateUrl(recordID) {
    return `${serverUrl}/productionHistory/isProdDataForm/id/${recordID}`;
}
