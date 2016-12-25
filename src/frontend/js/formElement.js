export function configureFormControlElement(formControlOptionData) { // form control setup
    for (let objectIndex in formControlOptionData) { // loop through the data set
        switch (objectIndex) { // check index'ed data's type
            case 'selectOptionListArray': // <select> with an option list
                formControlOptionData[objectIndex].forEach(function(elementConfigurationData) {
                    let selectControlElement = $('select#' + elementConfigurationData.id);
                    let attribute = elementConfigurationData.attribute;
                    let optionDataArray = elementConfigurationData.optionList;
                    // always start with an empty option in the list
                    selectControlElement.append('<option value="" selected disabled></option>');
                    optionDataArray.forEach(function(optionData) { // loop through the attached option list
                        // check if the option should/shouldn't be displayed for use
                        if (optionData.displayFlag === undefined || optionData.displayFlag === true) {
                            selectControlElement.append('<option class="current glassRun" value="' + optionData.value + '">' + optionData.text + '</option>');
                            if (attribute === true) { // if the record has an 'attribute' true property
                                // remove properties that's not needed
                                delete optionData.value;
                                delete optionData.text;
                                for (let objectIndex in optionData) { // loop through the rest of the properties
                                    // place into <option>'s data-XXX attrib's
                                    $('option.current').data(objectIndex, optionData[objectIndex]);
                                }
                            }
                            $('option.current').removeClass('current'); // remove current class after processing
                        }
                    });
                });
                break;
            case 'checkboxOptionArray': // checkbox set within a <div> that has the same id
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
                break;
            case 'textAutocompleteOptionArray': // process jquery ui autocomplete enabled <input type="text"> elements
                formControlOptionData[objectIndex].forEach(function(elementConfigurationData) {
                    let controlHandle = $('input#' + elementConfigurationData.id);
                    let optionArray;
                    if (typeof elementConfigurationData.optionList === 'object') {
                        // if the option list is already an object (should be data)
                        optionArray = elementConfigurationData.optionList;
                    } else {
                        // else it should be an url string(used for check while typing from a server)
                        optionArray = function(request, response) {
                            $.getJSON(elementConfigurationData.optionList, {
                                term: request.term
                            }, function(dataArray) {
                                response(dataArray);
                            });
                        };
                    }
                    // check if a mirror target property is set or not
                    if (elementConfigurationData.mirrorTarget === null) {
                        controlHandle.autocomplete({
                            source: optionArray,
                            minLength: elementConfigurationData.minLength
                        });
                    } else { // set up additional event listening to sync control's displayed data
                        let mirrorTargetHandle = $('input#' + elementConfigurationData.mirrorTarget);
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
