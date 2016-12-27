import {
    getAllUrlParams
} from './utility.js';

import {
    changeFormState,
    formBodyHtmlSource
} from './isProdData/formControl.js';

import {
    configureFormControlElement
} from './formElement.js';

function getFormBody(formReference) { // ajax for a clean copy of the form html
    return $.get(formBodyHtmlSource);
}

function getFormControlConfigData(formReference) { // ajax custom form control init data
    return $.get('../../formControlData/formReference/' + formReference);
}

export function initialize(deferred) {
    let formReference = getAllUrlParams().formReference;
    if ((formReference !== null) && (formReference !== undefined) && (formReference !== '')) {
        getFormBody(formReference)
            .then(function(formHtml) {
                $('body').empty().append(formHtml);
                return getFormControlConfigData(formReference);
            }).then(function(formControlOptionData) {
                configureFormControlElement(formControlOptionData); // setup the form controls according to data received
                if ($.isEmptyObject(deferred)) {
                    changeFormState('1');
                    // change state must be set first (breaks either formState monitor/multiselection check)
                    preventEnterSubmit();
                } else {
                    changeFormState('3');
                    // change state must be set first (breaks either formState monitor/multiselection check)
                    preventEnterSubmit();
                    deferred.deferred.resolve();
                }
            }).catch(function(error) {
                console.log(error);
                alert(error);
                deferred.deferred.reject(error);
            });
    } else {
        alert('網址錯誤');
        document.write('<a href="http://upgi.ddns.net/">返回統義入口網站</a>');
        deferred.deferred.reject(error);
    }
}

// prevent form being submitted through user press of the 'enter' key
function preventEnterSubmit() {
    // make sure that .off('keydown') isn't set, otherwise autocomplete cannot be operated by arrow keys
    $('input,select') /* .off('keydown')*/
        .keydown(function(event) {
            if (event.keyCode === 13) {
                let inputs = $(this).parents('form').eq(0).find(':input');
                if (inputs[inputs.index(this) + 1] !== null) {
                    inputs[inputs.index(this) + 1].focus();
                }
                event.preventDefault();
                return false;
            }
        });
}
