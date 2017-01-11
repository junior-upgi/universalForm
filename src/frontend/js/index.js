import { serverUrl, viewUrl } from './config.js';
import { displayLoginForm } from './login.js';
import { getAllUrlParams } from './utility.js';
import { initializeBlankForm } from './appControl.js';
import { changeFormState } from './isProdDataForm/formControl.js';
import { configForm } from './formProcessing.js';
import { preventEnterSubmit } from './disableEnterSubmit.js';

$('document').ready(function() {
    let formReference = getAllUrlParams().formReference;
    // check if login token existence
    if (sessionStorage.token === undefined) {
        displayLoginForm();
    } else {
        $('body').empty().load(`${viewUrl}/${formReference}/formBody.html`, function() {
            initializeBlankForm()
                .then(function(formConfigDataset) {
                    configForm(formConfigDataset); // setup the form controls according to data received
                    changeFormState('1'); // change state must be set first (breaks either formState monitor/multiselection check)
                    preventEnterSubmit();
                }).catch(function(error) {
                    alert(`發生錯誤: ${error}\n返回系統登入頁面`);
                    sessionStorage.clear();
                    window.location.replace(`${serverUrl}/index.html`);
                });
        });
    }
});
