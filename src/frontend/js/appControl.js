import { getAllUrlParams } from './utility.js';
import { serverUrl, viewUrl } from './config.js';

export let initializeBlankForm = function() {
    let promise = new Promise(function(resolve, reject) {
        let formReference = getAllUrlParams().formReference;
        if ((formReference !== null) && (formReference !== undefined) && (formReference !== '')) {
            $.get(`${viewUrl}/${formReference}/formBody.html`)
                .then(function(formBody) {
                    $('body').empty().append(formBody);
                    return $.ajax({
                        method: 'get',
                        url: `${serverUrl}/${formReference}/formConfigData`,
                        headers: { 'x-access-token': sessionStorage.token }
                    });
                }).then(function(formConfigDataset) {
                    resolve(formConfigDataset);
                }).catch(function(error) {
                    reject(`${error.status}: ${error.statusText}`);
                });
        } else {
            reject('url does not have proper \'formReference\' value');
        }
    });
    return promise;
};

/*
function reinitializeWithoutData(selectedOption, selectionValue) {
    // wrap initialize with promise
    let reinitialize = function() {
        let deferred = new $.Deferred();
        initialize({
            deferred: deferred
        });
        return deferred.promise();
    };
    // call initialize using promise to get execution sequenced correctly
    reinitialize()
        .done(function() {
            $('select#glassRun').val(selectedValue);
            changeFormState('1');
        })
        .fail(function(error) {
            alert('歷史資料頁面建立失敗: ' + error);
        });
}
*/
