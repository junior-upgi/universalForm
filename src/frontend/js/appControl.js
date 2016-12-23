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
                    preventEnterSubmit();
                    monitorFormUpdate();
                    changeFormState(1);
                    initiateFormControl(formReference);
                } else {
                    preventEnterSubmit();
                    monitorFormUpdate();
                    loadIsProdDataRecord(recordIdObject);
                    if (recordIdObject.existingIsProdDataRecord === 1) {
                        changeFormState(3);
                    } else {
                        changeFormState(5);
                    }
                    initiateFormControl(formReference);
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

export function changeFormState(formStateCode) {
    $('select#formState').val(formStateCode);
}

function getFormBody(formReference) { // ajax for a clean copy of the form
    return $.get('./view/isProdData/FormBody.html');
}

function resetForm(formReference) {
    let currentDate = moment(moment(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
    $('input#recordDate').val(currentDate);
    return $.get('../../formControlData/formReference/' + formReference);
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

function configureFormControlElement(formControlOptionData) {
    for (let objectIndex in formControlOptionData) {
        switch (objectIndex) {
            case 'selectOptionListArray':
                formControlOptionData[objectIndex].forEach(function(elementConfigurationData) {
                    let selectControlElement = $('select#' + elementConfigurationData.id);
                    let attribute = elementConfigurationData.attribute;
                    let optionDataArray = elementConfigurationData.optionList;
                    selectControlElement.append('<option value="" selected disabled></option>');
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
                });
                break;
            case 'checkboxOptionArray':
                formControlOptionData[objectIndex].forEach(function(elementConfigurationData) {
                    let checkboxControlContainer = $('div#' + elementConfigurationData.id);
                    let checkboxDataArray = elementConfigurationData.optionList;
                    checkboxDataArray.forEach(function(optionData) {
                        checkboxControlContainer.append(`<input name="${checkboxControlContainer.attr('id')}" type="checkbox" value="${optionData.value}" class="dataField current" tabindex="" />&nbsp;${optionData.text} &nbsp`);
                        if (optionData.default === true) {
                            $('input.current').prop('checked', true);
                        }
                        $('input.current').removeClass('current');
                    });
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
            case 'textAutocompleteOptionArray':
                formControlOptionData[objectIndex].forEach(function(elementConfigurationData) {
                    let controlHandle = $('input#' + elementConfigurationData.id);
                    let optionArray;
                    if (typeof elementConfigurationData.optionList === 'object') {
                        optionArray = elementConfigurationData.optionList;
                    } else {
                        optionArray = function(request, response) {
                            $.getJSON(elementConfigurationData.optionList, {
                                term: request.term
                            }, function(dataArray) {
                                response(dataArray);
                            });
                        };
                    }
                    let mirrorTargetHandle = $('input#' + elementConfigurationData.mirrorTarget);
                    if (elementConfigurationData.optionList === null) {
                        controlHandle.autocomplete({
                            source: optionArray,
                            minLength: elementConfigurationData.minLength
                        });
                    } else {
                        controlHandle.autocomplete({
                            source: optionArray,
                            minLength: elementConfigurationData.minLength,
                            change: function(event, ui) {
                                event.preventDefault();
                                if (ui.item === null) {
                                    controlHandle.val('');
                                    mirrorTargetHandle.val('');
                                } else {
                                    controlHandle.val(ui.item.label);
                                    mirrorTargetHandle.val(ui.item.value);
                                }
                            },
                            select: function(event, ui) {
                                event.preventDefault();
                                if (ui.item === null) {
                                    controlHandle.val('');
                                    mirrorTargetHandle.val('');
                                } else {
                                    controlHandle.val(ui.item.label);
                                    mirrorTargetHandle.val(ui.item.value);
                                }
                            },
                            focus: function(event, ui) {
                                event.preventDefault();
                                if (ui.item === null) {
                                    controlHandle.val('');
                                    mirrorTargetHandle.val('');
                                } else {
                                    controlHandle.val(ui.item.label);
                                    mirrorTargetHandle.val(ui.item.value);
                                }
                            }
                        });
                    }
                });
                break;
            default:
                alert(`[entry.js] configureFormControlElement error: \nfound control element types without valid processing method (${objectIndex})`);
                break;
        }
    }
}
