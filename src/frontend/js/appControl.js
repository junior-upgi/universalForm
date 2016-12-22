import {
    getAllUrlParams
} from './utility.js';

import {
    isProdDataFormControl,
    loadIsProdDataRecord
} from './isProdData/formControl.js';

const formControlArray = {
    isProdData: isProdDataFormControl
};

export function initialize(recordIdObject) {
    let formReference = getAllUrlParams().formReference;
    $('body').empty();
    changeFormState(0);
    getFormBody(formReference)
        .then(function(formHtml) {
            $('body').append(formHtml);
            resetForm(formReference);
            if ($.isEmptyObject(recordIdObject)) {
                preventEnterSubmit();
                monitorFormUpdate();
                changeFormState(1);
                initiateFormControl(formReference);
            } else {
                preventEnterSubmit();
                monitorFormUpdate();
                loadIsProdDataRecord(recordIdObject);
                changeFormState(3);
                initiateFormControl(formReference);
            }
        }).catch(function(error) {
            console.log(error);
            alert('[entry.js] initialize failure: ' + error);
        });
}

export function changeFormState(formStateCode) {
    $('select#formState').val(formStateCode);
}

function getFormBody(formReference) { // ajax for a clean copy of the form
    return $.get('./view/isProdData/FormBody.html');
}

function resetForm(formReference) {
    let currentDate = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
    $('input#recordDate').val(currentDate);
    $.get('../../formControlData/formReference/' + formReference) // ajax for a copy of form element configuration data
        .then(function(formControlOptionData) {
            configureFormControlElement(formControlOptionData); // setup the form controls according to data received
        })
        .catch(function(error) {
            console.log(error);
            alert('[entry.js] resetForm failure: ' + error + '(unable to get configuration data for form elements)');
        });
}

export function initiateFormControl(formReference) {
    formControlArray[formReference]($('select#formState').val());
}

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

function monitorFormUpdate() {
    $('input.dataField,select.dataField,textarea.dataField').change(function() {
        markFormAsUpdated();
    });
    $('input.autocompleteDataField')
        .on('autocompletechange', function(event, ui) {
            event.preventDefault();
            if (ui.item !== null) {
                markFormAsUpdated();
            }
        })
        .on('autocompleteselect', function(event, ui) {
            event.preventDefault();
            if (ui.item !== null) {
                markFormAsUpdated();
            }
        });
}

function markFormAsUpdated() {
    if (($('select#formState').val() === '1') || ($('select#formState').val() === '3')) {
        changeFormState((parseInt($('select#formState').val()) + 1).toString());
        let formReference = getAllUrlParams().formReference;
        formControlArray[formReference]($('select#formState').val());
    }
}

function configureFormControlElement(formConfigurationData) {
    for (let objectIndex in formConfigurationData) {
        switch (objectIndex) {
            case 'selectOptionListArray':
                formConfigurationData[objectIndex].forEach(function(elementConfigurationData) {
                    initializeSelectControl($('select#' + elementConfigurationData.id), elementConfigurationData.attribute, elementConfigurationData.optionList);
                });
                break;
            case 'checkboxOptionArray':
                formConfigurationData[objectIndex].forEach(function(elementConfigurationData) {
                    initializeCheckboxControl($('div#' + elementConfigurationData.id), elementConfigurationData.optionList);
                });
                // monitor sets of checkbox's and make sure multiselection setting is enforced
                $('input[type="checkbox"]').change(function() { // checks on every change to checkbox's
                    let targetCheckboxSet = $(this).attr('name'); // save current checkbox's name for access
                    if ($('input[name="' + targetCheckboxSet + '"]:checked').length > 1) {
                        alert('不得複選，項目將自動重置歸零');
                        $('input[name="' + targetCheckboxSet + '"]').prop('checked', false);
                    }
                });
                break;
            default:
                alert(`[entry.js] configureFormControlElement error: \nfound control element types without valid processing method (${objectIndex})`);
                break;
        }
    }
}

function initializeSelectControl(selectControlElement, attribute, optionDataArray) {
    selectControlElement.append('<option value="" selected></option>');
    optionDataArray.forEach(function(optionData) {
        if (optionData.displayFlag === undefined || optionData.displayFlag === true) {
            selectControlElement.append('<option class="current glassRun" value="' + optionData.value + '">' + optionData.text + '</option>');
            if (attribute === true) {
                delete optionData.value;
                delete optionData.text;
                for (let objectIndex in optionData) {
                    $('option.current').data(objectIndex, optionData[objectIndex]);
                }
            }
            $('option.current').removeClass('current');
        }
    });
}

function initializeCheckboxControl(checkboxControlContainer, checkboxDataArray) {
    checkboxDataArray.forEach(function(optionData) {
        checkboxControlContainer.append('<input name="' + checkboxControlContainer.attr('id') + '" type="checkbox" value="' + optionData.value + '" class="dataField current" tabindex="" />&nbsp;' + optionData.text + '&nbsp;');
        if (optionData.default === true) {
            $('input.current').prop('checked', true);
        }
        $('input.current').removeClass('current');
    });
}
