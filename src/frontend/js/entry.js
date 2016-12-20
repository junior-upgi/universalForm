import utility from './utility.js';

const formControl = {
    isProdData: require('./isProdData/control.js')
};

$('document').ready(function() {
    initialize();
});

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
        let formReference = utility.getAllUrlParams().formReference;
        formControl[formReference].formController($('select#formState').val());
    }
}

function changeFormState(stateCode) {
    $('select#formState').val(stateCode);
}

function initialize() {
    let formReference = utility.getAllUrlParams().formReference;
    // let id = utility.getAllUrlParams().id;
    $('body').empty();
    changeFormState(0);
    getFormBody(formReference)
        .then(function(formHtml) {
            $('body').append(formHtml);
            resetForm(formReference);
            changeFormState(1);
            setFormControl(formReference);
            preventEnterSubmit();
            monitorFormUpdate();
        }).catch(function(error) {
            console.log(error);
            alert('[entry.js] initialize failure: ' + error);
        });
}

function setFormControl(formReference) {
    formControl[formReference].formController($('select#formState').val());
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
                $('option.current')
                    .data('id', optionData.id)
                    .data('sampling', optionData.sampling)
                    .data('machno', optionData.machno)
                    .data('glassProdLineID', optionData.glassProdLineID)
                    .data('schedate', optionData.schedate)
                    .data('prd_no', optionData.prd_no)
                    .data('PRDT_SNM', optionData.PRDT_SNM)
                    .data('orderQty', optionData.orderQty);
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
