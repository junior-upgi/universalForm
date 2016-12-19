import moment from 'moment-timezone';

import utility from './utility.js';

const formControl = {
    isProdData: require('./isProdData/control.js')
};

$('document').ready(function() {
    let formReference = utility.getAllUrlParams().formReference;
    // let id = utility.getAllUrlParams().id;
    initialize(formReference);
});

function initialize(formReference) {
    $('body').empty();
    changeFormState(0);
    getFormBody(formReference)
        .then(function(formHtml) {
            $('body').append(formHtml);
            resetForm(formReference);
            changeFormState(1);
            setFormControl(formReference);
        }).catch(function(error) {
            console.log(error);
            alert('[entry.js] initialize failure: ' + error);
        });
}

function setFormControl(formReference) {
    switch (formReference) {
        case ('isProdData'):
            formControl.isProdData.formController($('select#formState').val());
            break;
        default:
            alert('[entry.js] setFormControl failure: unable to find correct formControl data for ' + formReference);
            break;
    }
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

function configureFormControlElement(formConfigurationData) {
    for (let objectIndex in formConfigurationData) {
        switch (objectIndex) {
            case 'selectOptionListArray':
                formConfigurationData[objectIndex].forEach(function(elementConfigurationData) {
                    initializeSelectControl($('select#' + elementConfigurationData.id), elementConfigurationData.optionList);
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

function initializeSelectControl(selectControlElement, optionDataArray) {
    selectControlElement.append('<option value="" selected></option>');
    optionDataArray.forEach(function(optionData) {
        if (optionData.displayFlag === undefined || optionData.displayFlag === true) {
            selectControlElement.append('<option class="current" value="' + optionData.value + '">' + optionData.text + '</option>');
        }
    });
}

function initializeCheckboxControl(checkboxControlContainer, checkboxDataArray) {
    checkboxDataArray.forEach(function(optionData) {
        checkboxControlContainer.append('<input name="' + checkboxControlContainer.attr('id') + '" type="checkbox" value="' + optionData.value + '" />&nbsp;' + optionData.text + '&nbsp;');
    });
}

function changeFormState(stateCode) {
    $('select#formState').val(stateCode);
}
