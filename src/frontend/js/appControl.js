import { getAllUrlParams } from './utility.js';
import { serverUrl, viewUrl } from './config.js';

export let initializeNewForm = function() {
    let promise = new Promise(function(resolve, reject) {
        let formReference = getAllUrlParams().formReference;
        if ((formReference !== null) && (formReference !== undefined) && (formReference !== '')) {
            $.get(`${viewUrl}/${formReference}/formBody.html`)
                .then(function(formBody) {
                    $('body').empty().append(formBody);
                    return $.ajax({
                        method: 'get',
                        url: `${serverUrl}/formConfigData/${formReference}`,
                        headers: { 'x-access-token': sessionStorage.token }
                    });
                }).then(function(formConfigDataset) {
                    resolve(formConfigDataset);
                }).catch(function(error) {
                    reject({ error: `${error.status}: ${error.statusText}` });
                });
        } else {
            reject({ error: 'url does not have proper \'formReference\' value' });
        }
    });
    return promise;
};

/*
export let initializeFormWithData=function(){

}
*/
