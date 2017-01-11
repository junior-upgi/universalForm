import { getAllUrlParams } from './utility.js';
// import { changeFormState } from './isProdDataForm/formControl.js';
import { configForm } from './formElement.js';
import { portalUrl, serverUrl, viewUrl } from './config.js';

export function initialize(deferred) {
    let formReference = getAllUrlParams().formReference;
    if ((formReference !== null) && (formReference !== undefined) && (formReference !== '')) {
        $.get(`${viewUrl}/${formReference}/formBody.html`)
            .then(function(formBody) {
                $('body').empty().append(formBody);
                return $.ajax({
                    method: 'get',
                    url: `${serverUrl}/controlConfig/${formReference}`,
                    headers: { 'x-access-token': sessionStorage.token }
                });
            }).then(function(controlConfigData) {
                console.log(controlConfigData);
                configForm(controlConfigData); // setup the form controls according to data received
                if ($.isEmptyObject(deferred)) {
                    // changeFormState('1');
                    // change state must be set first (breaks either formState monitor/multiselection check)
                    // preventEnterSubmit();
                } else {
                    // changeFormState('3');
                    // change state must be set first (breaks either formState monitor/multiselection check)
                    // preventEnterSubmit();
                    // deferred.deferred.resolve('test');
                }
            }).catch(function(error) {
                alert(`表單初始化發生錯誤 (${error.status}: ${error.statusText})，請重新登入系統`);
                window.location.replace(portalUrl);
            });
    } else {
        alert('網址錯誤，將返回系統頁面\n請重新登入系統');
        window.location.replace(portalUrl);
    }
}
