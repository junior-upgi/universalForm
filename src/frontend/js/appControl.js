import {
    getAllUrlParams
} from './utility.js';

import {
    changeFormState, // change form state function
    formBodyHtmlSource // url to a clean copy of the form
} from './isProdData/formControl.js';

import {
    configureFormControlElement
} from './formElement.js';

function getFormBody(formReference) { // ajax for a clean copy of the form html
    return $.get(formBodyHtmlSource);
}

function resetForm(formReference) { // ajax custom form control init data
    return $.get('../../formControlData/formReference/' + formReference);
}

// prevent form being submitted through user press of the 'enter' key
function preventEnterSubmit() {
    $('input,select').keydown(function(event) {
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

export function initialize(recordIdObject) {
    changeFormState(0);
    let formReference = getAllUrlParams().formReference;
    if ((formReference !== null) && (formReference !== undefined) && (formReference !== '')) {
        getFormBody(formReference)
            .then(function(formHtml) {
                $('body').empty().append(formHtml);
                return resetForm(formReference);
            }).then(function(formControlOptionData) {
                configureFormControlElement(formControlOptionData); // setup the form controls according to data received
                if ($.isEmptyObject(recordIdObject)) {
                    changeFormState(1);
                    preventEnterSubmit();
                } else {
                    console.log('to do: reinit form with starting record data');
                    /*
                    // loadIsProdDataRecord(recordIdObject);
                    if (recordIdObject.existingIsProdDataRecord === 1) {
                        changeFormState(3);
                        preventEnterSubmit();
                    } else {
                        changeFormState(5);
                        preventEnterSubmit();
                    }
                    // initiateFormControl(formReference);
                    */
                }
            }).catch(function(error) {
                console.log(error);
                alert(error);
            });
    } else {
        alert('網址錯誤');
        document.write('<a href="http://upgi.ddns.net/">返回統義入口網站</a>');
    }
}
