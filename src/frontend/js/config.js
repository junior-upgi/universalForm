const serverHost = 'http://upgi.ddns.net'; // production
// const serverHost = 'http://127.0.0.1'; // development
const serverPort = '9004';

export const serverUrl = serverHost + ':' + serverPort;
export const isProdDataInsertUrl = serverUrl + '/productionHistory/isProdDataForm/insertRecord/tableReference/isProdData/id/';
export const tbmknoInsertUrl = serverUrl + '/productionHistory/isProdDataForm/insertRecord/tableReference/tbmkno/id/';
export function deletePhotoUrl(recordID, photoType) {
    return `${serverUrl}/productionHistory/isProdDataForm/deletePhoto/recordID/${recordID}/photoType/${photoType}`;
}
export function isProdDataUpdateUrl(recordID) {
    return `${serverUrl}/productionHistory/isProdDataForm/id/${recordID}`;
}
